"use client";

import Image from "next/image";
import { Pencil, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Product } from "../types/product";
import Currency from "@/modules/pos/shared/components/Currency";
import StockBadge from "@/modules/pos/shared/components/StockBadge";
import EmptyState from "@/modules/pos/shared/components/EmptyState";

interface Props {
  products: Product[];
  onAdd: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  showVariantDetails?: boolean;
  showStock?: boolean;
}

export default function ProductCatalogGrid({ products, onAdd, onEdit, onDelete, showVariantDetails = true, showStock = true }: Props) {
  if (!products.length) {
    return <EmptyState title="Belum ada produk" description="Silakan tambahkan produk atau ubah kata kunci pencarian." />;
  }

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {products.map((product) => {
        const totalStock = product.variants.reduce((sum, variant) => sum + variant.stock, 0);
        const prices = product.variants.map((variant) => variant.price);
        const minPrice = prices.length ? Math.min(...prices) : 0;
        const maxPrice = prices.length ? Math.max(...prices) : 0;
        return (
          <Card key={product.productId} className="overflow-hidden">
            <div className="relative aspect-[4/3] bg-muted">
              {product.imageUrl ? (
                <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw" className="object-cover" unoptimized />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Tidak ada gambar</div>
              )}
            </div>
            <div className="space-y-3 p-4">
              <div className="min-h-16">
                <h2 className="line-clamp-2 font-semibold leading-snug" title={product.name}>{product.name}</h2>
                {showVariantDetails && <p className="mt-1 text-sm text-muted-foreground">{product.variants.length} varian{product.active ? "" : " · Nonaktif"}</p>}
              </div>
              <div className="space-y-2">
                <div className="font-semibold">
                  {prices.length ? (minPrice === maxPrice ? <Currency value={minPrice} /> : <><Currency value={minPrice} /> – <Currency value={maxPrice} /></>) : "Harga belum diatur"}
                </div>
                {showStock && <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-muted-foreground">Stok total</span>
                  <StockBadge stock={totalStock} />
                </div>}
                {showVariantDetails && <div className="space-y-1 border-t pt-2">
                  {product.variants.map((variant) => (
                    <div key={variant.variantId} className="flex items-start justify-between gap-2 text-xs">
                      <span className="min-w-0 truncate">{variant.name}</span>
                      <span className="shrink-0 font-medium"><Currency value={variant.price} /> · Stok {variant.stock}</span>
                    </div>
                  ))}
                </div>}
              </div>
              <div className={`grid gap-2 border-t pt-3 ${onEdit || onDelete ? "grid-cols-[1fr_auto_auto]" : "grid-cols-1"}`}>
                <Button className="w-full" onClick={() => onAdd(product)} disabled={!product.active || !product.variants.some((variant) => variant.active)}>
                  <ShoppingCart className="mr-2 h-4 w-4" />{showVariantDetails ? "Tambah" : "Pilih varian"}
                </Button>
                {onEdit && <Button variant="outline" size="icon" aria-label={`Edit ${product.name}`} onClick={() => onEdit(product)}><Pencil className="h-4 w-4" /></Button>}
                {onDelete && <Button variant="outline" size="icon" aria-label={`Hapus ${product.name}`} onClick={() => onDelete(product)}><Trash2 className="h-4 w-4" /></Button>}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
