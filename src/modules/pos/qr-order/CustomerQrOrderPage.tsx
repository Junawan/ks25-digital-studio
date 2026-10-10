"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ShoppingCart, Plus, Minus, Trash2, Store } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card } from "@/shared/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";

interface MenuVariant { variantId: string; name: string; price: number }
interface MenuProduct { productId: string; name: string; imageUrl: string; variants: MenuVariant[] }
interface MenuData { companyName: string; products: MenuProduct[] }
interface CartEntry extends MenuVariant { productId: string; productName: string; quantity: number }

async function readApiJson(response: Response, endpointName: string) {
  const contentType = response.headers.get("content-type") ?? "";
  const responseText = await response.text();
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(responseText) as Record<string, unknown>;
  } catch {
    const title = responseText.match(/<title[^>]*>(.*?)<\/title>/i)?.[1]?.trim();
    const detail = response.redirected
      ? "Permintaan dialihkan. Periksa Vercel Deployment Protection atau middleware autentikasi."
      : response.status === 404
        ? "Route API belum tersedia pada deployment ini. Deploy commit yang menyertakan route API Order by QR."
        : response.status === 401 || response.status === 403
          ? "Akses API ditolak. Periksa proteksi deployment atau middleware."
          : "Periksa log Function API pada Vercel untuk penyebab respons HTML ini.";
    throw new Error(`${endpointName}: HTTP ${response.status}; ${detail}${title ? ` Judul respons: ${title}.` : ""} URL: ${response.url}`);
  }
  if (!contentType.includes("application/json")) {
    throw new Error(`${endpointName}: server mengirim tipe konten ${contentType || "tidak diketahui"}. URL: ${response.url}`);
  }
  return data;
}

function getApiError(data: Record<string, unknown>, fallback: string) {
  return typeof data.error === "string" ? data.error : fallback;
}

export default function CustomerQrOrderPage({ companyId }: { companyId: string }) {
  const [menu, setMenu] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuError, setMenuError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<{ orderNumber: string; total: number } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setMenuError("");
    fetch(`/api/public/pos/${encodeURIComponent(companyId)}/menu`, { signal: controller.signal })
      .then(async (response) => {
        const data = await readApiJson(response, "menu QR");
        if (!response.ok) throw new Error(getApiError(data, `Menu gagal dimuat (HTTP ${response.status}).`));
        setMenu(data as MenuData);
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name !== "AbortError") setMenuError(error.message);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [companyId, reloadKey]);

  const cartQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  function addProduct(product: MenuProduct) {
    const variant = product.variants.find((item) => item.variantId === selectedVariants[product.productId]) ?? product.variants[0];
    const requestedQuantity = selectedQuantities[product.productId] ?? 1;
    const quantity = Number.isFinite(requestedQuantity) ? Math.max(1, Math.min(99, Math.floor(requestedQuantity))) : 1;
    if (!variant) return;
    setCart((current) => {
      const key = `${product.productId}:${variant.variantId}`;
      const existing = current.find((item) => `${item.productId}:${item.variantId}` === key);
      return existing
        ? current.map((item) => `${item.productId}:${item.variantId}` === key ? { ...item, quantity: item.quantity + quantity } : item)
        : [...current, { ...variant, productId: product.productId, productName: product.name, quantity }];
    });
    toast.success(`${product.name} masuk ke keranjang.`);
  }

  function changeQuantity(productId: string, variantId: string, quantity: number) {
    const safeQuantity = Math.max(0, Math.min(99, Math.floor(quantity) || 0));
    setCart((current) => current.map((item) => item.productId === productId && item.variantId === variantId ? { ...item, quantity: safeQuantity } : item).filter((item) => item.quantity > 0));
  }

  async function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cart.length || submitting) return;
    setSubmitting(true);
    try {
      const response = await fetch(`/api/public/pos/${encodeURIComponent(companyId)}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName, phone, items: cart.map((item) => ({ productId: item.productId, variantId: item.variantId, quantity: item.quantity })) }),
      });
      const data = await readApiJson(response, "pesanan QR");
      if (!response.ok) throw new Error(getApiError(data, `Pesanan gagal dikirim (HTTP ${response.status}).`));
      setOrderResult({ orderNumber: data.orderNumber, total: data.total });
      setCart([]);
      setCartOpen(false);
      toast.success("Pesanan telah dikirim ke kasir.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Pesanan gagal dikirim.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl space-y-6 px-4 py-6 pb-28 sm:px-6">
      <header className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Store className="h-5 w-5" /></div>
          <div className="min-w-0"><h1 className="truncate text-xl font-bold">{menu?.companyName ?? "Menu"}</h1><p className="text-sm text-muted-foreground">Pilih produk untuk dipesan</p></div>
        </div>
        <Button variant="outline" onClick={() => setCartOpen(true)}><ShoppingCart className="mr-2 h-4 w-4" />Keranjang ({cartQuantity})</Button>
      </header>

      {orderResult && <Card className="border-green-300 bg-green-50 p-4 dark:bg-green-950"><h2 className="font-semibold text-green-800 dark:text-green-200">Pesanan terkirim</h2><p className="mt-1 text-sm">Nomor pesanan: <strong>{orderResult.orderNumber}</strong></p><p className="text-sm">Total: Rp {orderResult.total.toLocaleString("id-ID")}</p><p className="mt-1 text-xs text-muted-foreground">Tunjukkan nomor ini kepada kasir untuk membantu pencocokan pesanan.</p></Card>}

      {loading ? <div className="py-20 text-center text-sm text-muted-foreground">Memuat menu...</div> : menuError ? <Card className="border-destructive/40 p-5">
        <h2 className="font-semibold text-destructive">Menu belum dapat dimuat</h2>
        <p className="mt-2 break-words text-sm">{menuError}</p>
        <Button className="mt-4" variant="outline" onClick={() => setReloadKey((value) => value + 1)}>Coba lagi</Button>
      </Card> : !menu?.products.length ? <Card className="p-10 text-center text-sm text-muted-foreground">Belum ada produk yang tersedia.</Card> : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {menu.products.map((product) => {
            const selected = product.variants.find((variant) => variant.variantId === selectedVariants[product.productId]) ?? product.variants[0];
            return <Card key={product.productId} className="overflow-hidden">
              <div className="relative aspect-square bg-muted">
                {product.imageUrl ? <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover" unoptimized /> : <div className="flex h-full items-center justify-center text-xs text-muted-foreground">Tanpa gambar</div>}
              </div>
              <div className="space-y-2 p-3">
                <h2 className="line-clamp-2 min-h-10 text-sm font-semibold">{product.name}</h2>
                {product.variants.length > 1 && <select className="h-8 w-full rounded-md border bg-background px-2 text-xs" value={selected?.variantId ?? ""} onChange={(event) => setSelectedVariants((current) => ({ ...current, [product.productId]: event.target.value }))}>{product.variants.map((variant) => <option key={variant.variantId} value={variant.variantId}>{variant.name} · Rp {variant.price.toLocaleString("id-ID")}</option>)}</select>}
                <p className="text-sm font-semibold">Rp {(selected?.price ?? 0).toLocaleString("id-ID")}</p>
                <div className="flex gap-2">
                  <Input aria-label={`Jumlah ${product.name}`} className="w-16" type="number" min="1" max="99" value={selectedQuantities[product.productId] ?? 1} onChange={(event) => setSelectedQuantities((current) => ({ ...current, [product.productId]: event.target.value === "" ? 1 : Number(event.target.value) }))} />
                  <Button className="min-w-0 flex-1 px-2" onClick={() => addProduct(product)}><Plus className="mr-1 h-4 w-4" />Pesan</Button>
                </div>
              </div>
            </Card>;
          })}
        </div>
      )}

      {cart.length > 0 && <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 p-3 shadow-lg backdrop-blur"><div className="mx-auto flex max-w-6xl items-center justify-between gap-3"><div><p className="text-sm font-medium">{cartQuantity} item · Rp {cartTotal.toLocaleString("id-ID")}</p><p className="text-xs text-muted-foreground">Pesanan belum dikirim</p></div><Button onClick={() => setCartOpen(true)}>Lihat keranjang</Button></div></div>}

      <Dialog open={cartOpen} onOpenChange={setCartOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader><DialogTitle>Keranjang pesanan</DialogTitle><DialogDescription>Periksa pesanan sebelum dikirim ke kasir.</DialogDescription></DialogHeader>
          {cart.length ? <form onSubmit={submitOrder} className="space-y-4">
            <div className="max-h-60 space-y-2 overflow-y-auto">{cart.map((item) => <div key={`${item.productId}:${item.variantId}`} className="grid grid-cols-[minmax(0,1fr)_auto_5rem_auto] items-center gap-2 rounded-lg border p-3">
              <div className="min-w-0"><p className="truncate text-sm font-medium">{item.productName}</p><p className="truncate text-xs text-muted-foreground">{item.name}</p><p className="text-xs">Rp {item.price.toLocaleString("id-ID")} / unit</p></div>
              <div className="flex items-center gap-1"><Button type="button" size="icon-sm" variant="outline" aria-label="Kurangi" onClick={() => changeQuantity(item.productId, item.variantId, item.quantity - 1)}><Minus className="h-3 w-3" /></Button><span className="w-6 text-center text-sm">{item.quantity}</span><Button type="button" size="icon-sm" variant="outline" aria-label="Tambah" onClick={() => changeQuantity(item.productId, item.variantId, item.quantity + 1)}><Plus className="h-3 w-3" /></Button></div>
              <strong className="text-right text-sm">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</strong><Button type="button" size="icon-sm" variant="ghost" aria-label="Hapus item" onClick={() => changeQuantity(item.productId, item.variantId, 0)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>)}</div>
            <div className="flex items-center justify-between border-t pt-3 font-semibold"><span>Total pesanan</span><span>Rp {cartTotal.toLocaleString("id-ID")}</span></div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm">Nama <span className="text-muted-foreground">(opsional)</span><Input maxLength={80} value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Nama pemesan" /></label>
              <label className="space-y-1 text-sm">No. HP <span className="text-muted-foreground">(opsional)</span><Input type="tel" maxLength={30} value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="08xxxxxxxxxx" /></label>
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setCartOpen(false)}>Kembali ke menu</Button><Button type="submit" disabled={submitting}>{submitting ? "Mengirim..." : "Kirim pesanan ke kasir"}</Button></DialogFooter>
          </form> : <div className="py-8 text-center text-sm text-muted-foreground">Keranjang masih kosong.</div>}
        </DialogContent>
      </Dialog>
    </main>
  );
}
