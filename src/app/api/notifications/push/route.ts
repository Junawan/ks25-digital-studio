import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getAdminDb, getAdminMessaging } from "@/core/firebase/admin";
import {
  InvalidFirebaseIdTokenError,
  verifyFirebaseIdToken,
  type VerifiedFirebaseIdentity,
} from "@/core/firebase/verifyIdToken";

export const runtime = "nodejs";

interface NotificationDocument {
  notificationId: string;
  companyId: string;
  receiverId: string | null;
  receiverType: "user" | "company" | "system-admin";
  module: string;
  type: string;
  priority: string;
  title: string;
  message: string;
  actionUrl: string;
  sourceId: string | null;
}

export async function POST(request: Request) {
  const authorization = request.headers.get("authorization") || "";
  const idToken = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!idToken) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null) as { notificationId?: unknown } | null;
  const notificationId = typeof body?.notificationId === "string" ? body.notificationId.trim() : "";
  if (!notificationId || notificationId.length > 200) return Response.json({ error: "Invalid notification" }, { status: 400 });

  try {
    let decoded: VerifiedFirebaseIdentity;
    try {
      decoded = await verifyFirebaseIdToken(idToken);
    } catch (error) {
      if (error instanceof InvalidFirebaseIdTokenError) return Response.json({ error: "Unauthorized" }, { status: 401 });
      throw error;
    }
    const adminDb = getAdminDb();
    const [userSnapshot, notificationSnapshot] = await Promise.all([
      adminDb.collection("users").doc(decoded.uid).get(),
      adminDb.collection("notifications").doc(notificationId).get(),
    ]);
    if (!userSnapshot.exists || !notificationSnapshot.exists) return Response.json({ error: "Not found" }, { status: 404 });

    const user = userSnapshot.data()!;
    const notification = notificationSnapshot.data() as NotificationDocument;
    if (user.status !== "active") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    let systemAdminUserIds: Set<string> | null = null;
    if (notification.receiverType === "system-admin") {
      if (notification.module !== "subscription" || notification.type !== "payment" || !notification.sourceId) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }
      const paymentSnapshot = await adminDb.collection("subscription-payments").doc(notification.sourceId).get();
      const payment = paymentSnapshot.data();
      const isSystemAdmin = user.isSystemAdmin === true;
      const isPaymentOwner = paymentSnapshot.exists
        && payment?.status === "pending"
        && payment.companyId === user.companyId
        && payment.ownerId === decoded.uid;
      if (!paymentSnapshot.exists || payment?.companyId !== notification.companyId || (!isSystemAdmin && !isPaymentOwner)) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }
      const adminProfiles = await adminDb.collection("users")
        .where("isSystemAdmin", "==", true)
        .get();
      systemAdminUserIds = new Set(adminProfiles.docs
        .filter((profile) => profile.data().status === "active")
        .map((profile) => profile.id));
      if (!systemAdminUserIds.size) return Response.json({ sent: false, reason: "recipient-unavailable" });
    } else if (user.companyId !== notification.companyId) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const jobRef = adminDb.collection("notification_push_jobs").doc(notificationId);
    const maySend = await adminDb.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(jobRef);
      const current = snapshot.data();
      const createdAt = current?.updatedAt instanceof Timestamp ? current.updatedAt.toMillis() : 0;
      if (current?.status === "sent" || (current?.status === "processing" && Date.now() - createdAt < 120_000)) return false;
      transaction.set(jobRef, { notificationId, status: "processing", updatedAt: FieldValue.serverTimestamp() });
      return true;
    });
    if (!maySend) return Response.json({ sent: false, duplicate: true });

    try {
      const tokenSnapshots = systemAdminUserIds
        ? await Promise.all([...systemAdminUserIds].map((userId) => adminDb.collection("company_push_devices").where("userId", "==", userId).get()))
        : [await adminDb.collection("company_push_devices").where("companyId", "==", notification.companyId).get()];
      const targets = tokenSnapshots.flatMap((snapshot) => snapshot.docs).filter((entry) => {
        const target = entry.data();
        return systemAdminUserIds
          ? systemAdminUserIds.has(String(target.userId || ""))
          : target.companyId === notification.companyId && (notification.receiverType === "company" || target.userId === notification.receiverId);
      }).map((entry) => ({ id: entry.id, token: String(entry.data().token || "") })).filter((entry) => entry.token.length > 0);

      if (!targets.length) {
        await jobRef.set({ status: "waiting_for_device", successCount: 0, failureCount: 0, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
        return Response.json({ sent: false, reason: "no_registered_devices", deviceCount: 0 });
      }

      let successCount = 0;
      let failureCount = 0;
      const messaging = await getAdminMessaging();
      for (let offset = 0; offset < targets.length; offset += 500) {
        const batch = targets.slice(offset, offset + 500);
        if (!batch.length) continue;
        const result = await messaging.sendEachForMulticast({
          tokens: batch.map((entry) => entry.token),
          notification: { title: notification.title, body: notification.message },
          data: {
            notificationId: notification.notificationId || notificationId,
            module: notification.module,
            type: notification.type,
            actionUrl: notification.actionUrl || "/dashboard",
          },
          android: {
            priority: notification.priority === "high" || notification.priority === "urgent" ? "high" : "normal",
            notification: { channelId: "ks25_general", sound: "default" },
          },
        });
        successCount += result.successCount;
        failureCount += result.failureCount;
        const invalidTokenDocs = result.responses.flatMap((response, index) => {
          const code = response.error?.code;
          return code === "messaging/registration-token-not-registered" || code === "messaging/invalid-registration-token"
            ? [batch[index]!.id]
            : [];
        });
        await Promise.all(invalidTokenDocs.map((id) => adminDb.collection("company_push_devices").doc(id).delete()));
      }

      await jobRef.set({ status: successCount > 0 ? "sent" : "failed", successCount, failureCount, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      return Response.json({ sent: successCount > 0, successCount, failureCount, deviceCount: targets.length });
    } catch (error) {
      await jobRef.set({ status: "failed", updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      throw error;
    }
  } catch (error) {
    console.error("FCM notification delivery failed:", error);
    return Response.json({ error: "Push delivery failed" }, { status: 503 });
  }
}
