import { auth } from "@/core/firebase";

async function sendDeviceRequest(method: "POST" | "DELETE", token: string) {
  const user = auth.currentUser;
  if (!user) throw new Error("Sesi Firebase tidak tersedia untuk mendaftarkan notifikasi.");
  const idToken = await user.getIdToken();
  const response = await fetch("/api/notifications/devices", {
    method,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
    body: JSON.stringify({ token }),
  });
  if (!response.ok) throw new Error("Pendaftaran perangkat notifikasi gagal.");
}

export async function savePushDevice(token: string) {
  await sendDeviceRequest("POST", token);
}

export async function removePushDevice(token: string) {
  await sendDeviceRequest("DELETE", token);
}
