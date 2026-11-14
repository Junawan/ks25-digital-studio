import { auth } from "@/core/firebase";

async function sendDeviceRequest(method: "POST" | "DELETE", token: string) {
  const user = auth.currentUser;
  if (!user) throw new Error("Sesi Firebase tidak tersedia untuk mendaftarkan notifikasi.");
  const idToken = await user.getIdToken(true);
  const response = await fetch("/api/notifications/devices", {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
    body: JSON.stringify({ token }),
  });
  if (!response.ok) {
    const detail = await response.json().catch(() => null) as { error?: unknown; code?: unknown; diagnostic?: unknown } | null;
    const errorName = typeof detail?.error === "string" ? detail.error : "server_error";
    const reason = typeof detail?.code === "string" ? `${errorName}:${detail.code}` : errorName;
    const diagnostic = typeof detail?.diagnostic === "string" ? ` ${detail.diagnostic}` : "";
    throw new Error(`Pendaftaran perangkat notifikasi gagal (${response.status}: ${reason}).${diagnostic}`);
  }
  return await response.json().catch(() => ({})) as { pendingNotificationIds?: string[] };
}

export async function savePushDevice(token: string) {
  const result = await sendDeviceRequest("POST", token);
  const user = auth.currentUser;
  if (!user) return;
  const idToken = await user.getIdToken();
  for (const notificationId of result.pendingNotificationIds || []) {
    const response = await fetch("/api/notifications/push", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
      body: JSON.stringify({ notificationId }),
    });
    if (!response.ok) console.warn("A notification waiting for a device could not be retried:", notificationId, response.status);
  }
}

export async function removePushDevice(token: string) {
  await sendDeviceRequest("DELETE", token);
}
