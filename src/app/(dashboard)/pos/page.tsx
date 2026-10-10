"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Boxes,
  ChartColumn,
  ClipboardList,
  History,
  QrCode,
  Search,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";
import { useWorkspace } from "@/core/workspace/WorkspaceProvider";
import { useProducts } from "@/modules/pos/product/hooks/useProducts";
import type { Product, ProductVariant } from "@/modules/pos/product/types/product";
import type { CartItem } from "@/modules/pos/transaction/types/transaction";
import ProductCatalogGrid from "@/modules/pos/product/components/ProductCatalogGrid";
import AddProductToCartDialog from "@/modules/pos/product/components/AddProductToCartDialog";
import ProductCartDialog from "@/modules/pos/product/components/ProductCartDialog";
import LoadingSkeleton from "@/modules/pos/shared/components/skeletons/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";

const navigation = [
  { title: "Kelola produk", href: "/pos/products", icon: Boxes },
  { title: "Transaksi", href: "/pos/transactions", icon: ShoppingCart },
  { title: "Order QR", href: "/pos/order-by-qr", icon: QrCode },
  { title: "Riwayat", href: "/pos/history", icon: History },
  { title: "Pemasukan", href: "/pos/income", icon: ArrowDownCircle },
  { title: "Pengeluaran", href: "/pos/expenses", icon: ArrowUpCircle },
  { title: "Kasbon", href: "/pos/debt", icon: Users },
  { title: "Laporan", href: "/pos/reports", icon: ChartColumn },
  { title: "Pengaturan", href: "/pos/settings", icon: Settings },
];

export default function PosPage() {
  const { workspace, loading: workspaceLoading } = useWorkspace();
  const company = workspace?.company;
  const router = useRouter();
  const pathname = usePathname();
  const { products, loading } = useProducts({ companyId: company?.id ?? "" });
  const [keyword, setKeyword] = useState("");
  const [cartProduct, setCartProduct] = useState<Product>();
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const visibleProducts = useMemo(() => {
    const query = keyword.trim().toLocaleLowerCase("id-ID");
    return products
      .filter((product) => product.active)
      .map((product) => ({ ...product, variants: product.variants.filter((variant) => variant.active) }))
      .filter((product) => product.variants.length > 0)
      .filter((product) => !query || product.name.toLocaleLowerCase("id-ID").includes(query) || product.variants.some((variant) => variant.name.toLocaleLowerCase("id-ID").includes(query) || variant.barcode.toLocaleLowerCase("id-ID").includes(query)));
  }, [keyword, products]);

  function addToCart(product: Product, variant: ProductVariant, quantity: number) {
    setCartItems((current) => {
      const existing = current.find((item) => item.variantId === variant.variantId);
      if (existing) {
        return current.map((item) => item.variantId === variant.variantId
          ? { ...item, qty: item.qty + quantity, subtotal: (item.qty + quantity) * item.price }
          : item);
      }
      return [...current, {
        productId: product.productId,
        variantId: variant.variantId,
        productName: product.name,
        hsCode: product.hsCode ?? "",
        variantName: variant.name,
        barcode: variant.barcode,
        price: variant.price,
        qty: quantity,
        subtotal: variant.price * quantity,
      }];
    });
  }

  function continueToTransaction() {
    if (!cartItems.length) return;
    sessionStorage.setItem("pos-product-catalog-cart", JSON.stringify(cartItems));
    setCartOpen(false);
    router.push("/pos/transactions");
  }

  if (workspaceLoading || loading) return <LoadingSkeleton />;
  if (!company) return null;

  const cartQuantity = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return <div className="mx-auto max-w-[1600px] space-y-6">
    <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <p className="text-sm font-medium text-primary">{company.name}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Kasir</h1>
        <p className="mt-1 text-muted-foreground">Pilih produk, tentukan varian dan jumlah, lalu lanjutkan transaksi.</p>
      </div>
      <div className="flex gap-2 xl:w-[min(100%,32rem)]">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Cari produk, varian, atau barcode..." className="h-11 pl-9" />
        </div>
        <Button className="h-11 shrink-0" variant="outline" onClick={() => setCartOpen(true)}>
          <ShoppingCart className="mr-2 h-4 w-4" />Keranjang ({cartQuantity})
        </Button>
      </div>
    </header>

    <nav aria-label="Menu POS" className="-mx-2 overflow-x-auto px-2 pb-1">
      <div className="flex min-w-max gap-2 rounded-xl border bg-card p-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return <Link key={item.href} href={item.href} className={`inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
            <Icon className="h-4 w-4" />{item.title}
          </Link>;
        })}
      </div>
    </nav>

    <section className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div><h2 className="text-xl font-semibold">Produk</h2><p className="text-sm text-muted-foreground">{visibleProducts.length} produk tersedia · Pilih varian dari tombol keranjang.</p></div>
        <Link href="/pos/products" className="hidden items-center gap-2 text-sm font-medium text-primary hover:underline sm:flex"><ClipboardList className="h-4 w-4" />Kelola katalog</Link>
      </div>
      <ProductCatalogGrid products={visibleProducts} onAdd={setCartProduct} showVariantDetails={false} showStock={false} />
    </section>

    <AddProductToCartDialog
      open={Boolean(cartProduct)}
      product={cartProduct}
      onOpenChange={(open) => { if (!open) setCartProduct(undefined); }}
      onAdd={addToCart}
    />
    <ProductCartDialog
      open={cartOpen}
      onOpenChange={setCartOpen}
      items={cartItems}
      onQuantityChange={(variantId, quantity) => setCartItems((current) => current.map((item) => item.variantId === variantId ? { ...item, qty: Math.max(0, Math.floor(quantity)), subtotal: Math.max(0, Math.floor(quantity)) * item.price } : item).filter((item) => item.qty > 0))}
      onRemove={(variantId) => setCartItems((current) => current.filter((item) => item.variantId !== variantId))}
      onContinue={continueToTransaction}
    />
  </div>;
}
