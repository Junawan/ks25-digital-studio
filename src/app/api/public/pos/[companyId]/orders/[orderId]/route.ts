import { getAdminDb } from "@/core/firebase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const publicStatuses = new Set(["pending", "preparing", "accepted", "completed", "cancelled"]);

export async function GET(_request: Request, context: { params: Promise<{ companyId: string; orderId: string }> }) {
  try {
    const { companyId, orderId } = await context.params;
    const snapshot = await getAdminDb().collection("pos_qr_orders").doc(orderId).get();
    if (!snapshot.exists || snapshot.data()?.companyId !== companyId) {
      return Response.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });
    }

    const data = snapshot.data();
    const status = typeof data?.status === "string" && publicStatuses.has(data.status) ? data.status : "pending";
    return Response.json({
      orderId: snapshot.id,
      orderNumber: String(data?.orderNumber ?? ""),
      status: status === "accepted" ? "preparing" : status,
      updatedAt: data?.updatedAt?.toDate?.()?.toISOString?.() ?? null,
    });
  } catch (error) {
    console.error("Gagal memuat tracking pesanan QR:", error);
    return Response.json({ error: "Status pesanan belum dapat dimuat." }, { status: 500 });
  }
}
