import { randomUUID } from "node:crypto";
import { adminDb } from "@/core/firebase/admin";

export const dynamic = "force-dynamic";

interface RequestedItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export async function POST(request: Request, context: { params: Promise<{ companyId: string }> }) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ error: "Permintaan tidak diizinkan." }, { status: 403 });
  }

  try {
    const { companyId } = await context.params;
    const body = await request.json() as { items?: RequestedItem[]; customerName?: string; phone?: string };
    if (!Array.isArray(body.items) || body.items.length < 1 || body.items.length > 50) {
      return Response.json({ error: "Keranjang kosong atau jumlah produk melebihi batas." }, { status: 400 });
    }

    const customerName = typeof body.customerName === "string" ? body.customerName.trim().slice(0, 80) : "";
    const phone = typeof body.phone === "string" ? body.phone.trim().slice(0, 30) : "";
    const quantities = new Map<string, RequestedItem>();
    for (const item of body.items) {
      if (!item || typeof item.productId !== "string" || typeof item.variantId !== "string" || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) {
        return Response.json({ error: "Jumlah produk tidak valid." }, { status: 400 });
      }
      const key = `${item.productId}:${item.variantId}`;
      const existing = quantities.get(key);
      const quantity = (existing?.quantity ?? 0) + item.quantity;
      if (quantity > 99) return Response.json({ error: "Maksimal 99 unit per varian." }, { status: 400 });
      quantities.set(key, { productId: item.productId, variantId: item.variantId, quantity });
    }

    const company = await adminDb.collection("companies").doc(companyId).get();
    if (!company.exists) return Response.json({ error: "Toko tidak ditemukan." }, { status: 404 });
    const productSnapshots = await adminDb.collection("pos_products").where("companyId", "==", companyId).get();
    const productMap = new Map(productSnapshots.docs.map((snapshot) => [snapshot.id, snapshot.data()]));

    const items = [...quantities.values()].map((requested) => {
      const product = productMap.get(requested.productId);
      const variant = product?.variants?.find((entry: { variantId?: string }) => entry.variantId === requested.variantId);
      if (!product?.active || !variant?.active) throw new Error("Salah satu produk sudah tidak tersedia. Muat ulang menu.");
      const price = Number(variant.price);
      if (!Number.isFinite(price) || price < 0) throw new Error("Harga produk tidak valid.");
      return {
        productId: requested.productId,
        variantId: requested.variantId,
        productName: String(product.name ?? "Produk"),
        variantName: String(variant.name ?? "Default"),
        barcode: String(variant.barcode ?? ""),
        price,
        qty: requested.quantity,
        subtotal: price * requested.quantity,
      };
    });

    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    const now = new Date();
    const orderNumber = `QR-${now.toISOString().slice(0, 10).replaceAll("-", "")}-${randomUUID().slice(0, 6).toUpperCase()}`;
    const orderRef = adminDb.collection("pos_qr_orders").doc();
    await orderRef.set({
      orderId: orderRef.id,
      orderNumber,
      companyId,
      customerName,
      phone,
      items,
      total,
      status: "pending",
      source: "qr",
      createdAt: now,
      updatedAt: now,
    });

    return Response.json({ orderId: orderRef.id, orderNumber, total }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Pesanan gagal dikirim.";
    console.error("Gagal membuat pesanan QR:", error);
    if (message.includes("sudah tidak tersedia")) {
      return Response.json({ error: message }, { status: 409 });
    }
    return Response.json({ error: "Pesanan gagal dikirim. Silakan coba lagi atau hubungi kasir." }, { status: 500 });
  }
}
