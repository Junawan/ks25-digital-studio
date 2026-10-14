import { createHash } from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminAuth, getAdminDb } from "@/core/firebase/admin";

export const runtime = "nodejs";

async function authenticate(request: Request) {
  const authorization = request.headers.get("authorization") || "";
  const idToken = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!idToken) throw new Error("unauthorized");
  return (await getAdminAuth()).verifyIdToken(idToken);
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
    if (!userSnapshot.exists || user?.status !== "active" || typeof user.companyId !== "string") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
    const id = createHash("sha256").update(token).digest("hex");
    await adminDb.collection("company_push_devices").doc(id).set({
      companyId: user.companyId,
      userId: identity.uid,
      token,
      platform: "android",
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
    return Response.json({ registered: true });
  } catch (error) {
    if (error instanceof Error && (error.message === "unauthorized" || error.message === "invalid-token")) {
      return Response.json({ error: "Invalid request" }, { status: error.message === "unauthorized" ? 401 : 400 });
    }
    console.error("FCM device registration failed:", error);
    return Response.json({ error: "Device registration failed" }, { status: 503 });
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
    if (error instanceof Error && (error.message === "unauthorized" || error.message === "invalid-token")) {
      return Response.json({ error: "Invalid request" }, { status: error.message === "unauthorized" ? 401 : 400 });
    }
    console.error("FCM device removal failed:", error);
    return Response.json({ error: "Device removal failed" }, { status: 503 });
  }
}
