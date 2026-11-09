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
    const detail = await response.json().catch(() => null) as { error?: unknown } | null;
    const reason = typeof detail?.error === "string" ? detail.error : "server_error";
    throw new Error(`Pendaftaran perangkat notifikasi gagal (${response.status}: ${reason}).`);
  }
}

export async function savePushDevice(token: string) {
  await sendDeviceRequest("POST", token);
}

export async function removePushDevice(token: string) {
  await sendDeviceRequest("DELETE", token);
}
