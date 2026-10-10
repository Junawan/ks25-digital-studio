import { getAdminDb } from "@/core/firebase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request: Request, context: { params: Promise<{ companyId: string }> }) {
  try {
    const adminDb = getAdminDb();
    const { companyId } = await context.params;
    const company = await adminDb.collection("companies").doc(companyId).get();
    if (!company.exists) return Response.json({ error: "Toko tidak ditemukan." }, { status: 404 });

    const products = await adminDb.collection("pos_products").where("companyId", "==", companyId).get();
    const menu = products.docs.flatMap((snapshot) => {
      const data = snapshot.data();
      if (!data.active) return [];
      const variants = (data.variants ?? []).filter((variant: { active?: boolean }) => variant.active).map((variant: Record<string, unknown>) => ({
        variantId: String(variant.variantId ?? ""),
        name: String(variant.name ?? "Default"),
        price: Number(variant.price ?? 0),
      }));
      if (!variants.length) return [];
      return [{ productId: snapshot.id, name: String(data.name ?? "Produk"), imageUrl: String(data.imageUrl ?? ""), variants }];
    });

    return Response.json({ companyName: String(company.data()?.name ?? "Toko"), products: menu });
  } catch (error) {
    console.error("Gagal memuat menu QR:", error);
    return Response.json({ error: "Menu tidak dapat dimuat." }, { status: 500 });
  }
}
