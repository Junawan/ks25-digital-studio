import { createHash } from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminAuth, getAdminDb } from "@/core/firebase/admin";

export const runtime = "nodejs";

async function authenticate(request: Request) {
  const authorization = request.headers.get("authorization") || "";
  const idToken = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!idToken) throw new Error("unauthorized");
  try {
    return await (await getAdminAuth()).verifyIdToken(idToken);
  } catch {
    throw new Error("invalid-id-token");
  }
}

async function readPayload(request: Request) {
  const payload = await request.json().catch(() => null) as { token?: unknown } | null;
  const token = typeof payload?.token === "string" ? payload.token.trim() : "";
  if (token.length < 40 || token.length > 4096) throw new Error("invalid-token");
  return token;
}

export async function POST(request: Request) {
  try {
    const [identity, token] = await Promise.all([authenticate(request), readPayload(request)]);
    const adminDb = getAdminDb();
    const userSnapshot = await adminDb.collection("users").doc(identity.uid).get();
    const user = userSnapshot.data();
    if (!userSnapshot.exists) return Response.json({ error: "user_profile_not_found" }, { status: 403 });
    if (user?.status !== "active") return Response.json({ error: "user_profile_inactive" }, { status: 403 });
    if (typeof user.companyId !== "string" || !user.companyId) return Response.json({ error: "company_not_found" }, { status: 403 });
    const id = createHash("sha256").update(token).digest("hex");
    await adminDb.collection("company_push_devices").doc(id).set({
      companyId: user.companyId,
      userId: identity.uid,
      token,
      platform: "android",
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
    const waitingJobs = await adminDb.collection("notification_push_jobs").where("status", "==", "waiting_for_device").limit(50).get();
    const pendingNotificationIds = (await Promise.all(waitingJobs.docs.map(async (job) => {
      const notificationSnapshot = await adminDb.collection("notifications").doc(job.id).get();
      const notification = notificationSnapshot.data();
      if (!notification) return null;
      const companyBroadcast = notification.receiverType === "company";
      const userNotification = notification.receiverType === "user" && notification.receiverId === identity.uid;
      const sameCompany = notification.companyId === user.companyId;
      return sameCompany && (companyBroadcast || userNotification) ? job.id : null;
    }))).filter((notificationId): notificationId is string => Boolean(notificationId));
    return Response.json({ registered: true, pendingNotificationIds });
  } catch (error) {
    if (error instanceof Error && ["unauthorized", "invalid-id-token", "invalid-token"].includes(error.message)) {
      const status = error.message === "invalid-token" ? 400 : 401;
      return Response.json({ error: error.message }, { status });
    }
    console.error("FCM device registration failed:", error);
    return Response.json({ error: "registration_service_unavailable" }, { status: 503 });
  }
}

export async function DELETE(request: Request) {
  try {
    const [identity, token] = await Promise.all([authenticate(request), readPayload(request)]);
    const id = createHash("sha256").update(token).digest("hex");
    const adminDb = getAdminDb();
    const deviceRef = adminDb.collection("company_push_devices").doc(id);
    const deviceSnapshot = await deviceRef.get();
    if (deviceSnapshot.exists && deviceSnapshot.data()?.userId === identity.uid) await deviceRef.delete();
    return Response.json({ removed: true });
  } catch (error) {
    if (error instanceof Error && ["unauthorized", "invalid-id-token", "invalid-token"].includes(error.message)) {
      const status = error.message === "invalid-token" ? 400 : 401;
      return Response.json({ error: error.message }, { status });
    }
    console.error("FCM device removal failed:", error);
    return Response.json({ error: "Device removal failed" }, { status: 503 });
  }
}
