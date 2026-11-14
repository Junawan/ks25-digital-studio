import { createHash } from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb, getAdminProjectId } from "@/core/firebase/admin";
import { verifyFirebaseIdToken } from "@/core/firebase/verifyIdToken";

export const runtime = "nodejs";

async function authenticate(request: Request) {
  const authorization = request.headers.get("authorization") || "";
  const idToken = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!idToken) throw new Error("unauthorized");
  const tokenAudience = readTokenAudience(idToken);
  const expectedProjectId = getAdminProjectId();
  if (expectedProjectId && tokenAudience && tokenAudience !== expectedProjectId) {
    console.error("FCM device auth project mismatch:", { expectedProjectId, tokenAudience });
    throw new Error("firebase-project-mismatch");
  }
  try {
    return await verifyFirebaseIdToken(idToken);
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error
      ? String(error.code)
      : error instanceof Error ? error.name : "unknown";
    const message = error instanceof Error ? error.message : String(error);
    console.error("Firebase ID token verification failed:", { code, message, expectedProjectId, tokenAudience });
    if (code.startsWith("auth/")) throw new Error(`invalid-id-token:${code}`);
    const unavailable = new Error(`admin-auth-unavailable:${code}`);
    (unavailable as Error & { cause?: unknown }).cause = error;
    throw unavailable;
  }
}

function readTokenAudience(idToken: string): string | null {
  try {
    const encodedPayload = idToken.split(".")[1];
    if (!encodedPayload) return null;
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as { aud?: unknown };
    return typeof payload.aud === "string" ? payload.aud : null;
  } catch {
    return null;
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
      const adminNotification = notification.receiverType === "system-admin" && user.isSystemAdmin === true;
      const sameCompany = notification.companyId === user.companyId;
      return adminNotification || (sameCompany && (companyBroadcast || userNotification)) ? job.id : null;
    }))).filter((notificationId): notificationId is string => Boolean(notificationId));
    return Response.json({ registered: true, pendingNotificationIds });
  } catch (error) {
    if (error instanceof Error && ["unauthorized", "invalid-token", "firebase-project-mismatch"].includes(error.message)) {
      const status = error.message === "invalid-token" ? 400 : 401;
      return Response.json({ error: error.message }, { status });
    }
    if (error instanceof Error && error.message.startsWith("invalid-id-token:")) {
      return Response.json({ error: "invalid-id-token", code: error.message.slice("invalid-id-token:".length) }, { status: 401 });
    }
    if (error instanceof Error && error.message.startsWith("admin-auth-unavailable:")) {
      const cause = (error as Error & { cause?: unknown }).cause;
      const diagnostic = cause instanceof Error ? cause.message.slice(0, 240) : undefined;
      return Response.json({
        error: "firebase_admin_auth_unavailable",
        code: error.message.split(":").at(-1),
        ...(diagnostic ? { diagnostic } : {}),
      }, { status: 503 });
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
    if (error instanceof Error && ["unauthorized", "invalid-token", "firebase-project-mismatch"].includes(error.message)) {
      const status = error.message === "invalid-token" ? 400 : 401;
      return Response.json({ error: error.message }, { status });
    }
    if (error instanceof Error && error.message.startsWith("invalid-id-token:")) {
      return Response.json({ error: "invalid-id-token", code: error.message.slice("invalid-id-token:".length) }, { status: 401 });
    }
    if (error instanceof Error && error.message.startsWith("admin-auth-unavailable:")) {
      return Response.json({ error: "firebase_admin_auth_unavailable", code: error.message.split(":").at(-1) }, { status: 503 });
    }
    console.error("FCM device removal failed:", error);
    return Response.json({ error: "Device removal failed" }, { status: 503 });
  }
}
