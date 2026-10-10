"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Product, ProductVariant } from "../types/product";
import Currency from "@/modules/pos/shared/components/Currency";

interface Props {
  product?: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (product: Product, variant: ProductVariant, quantity: number) => void;
}

export default function AddProductToCartDialog({ product, open, onOpenChange, onAdd }: Props) {
  const [variantId, setVariantId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const availableVariants = product?.variants.filter((item) => item.active) ?? [];

  useEffect(() => {
    setVariantId(product?.variants.find((item) => item.active)?.variantId ?? "");
    setQuantity(1);
  }, [product, open]);

  const variant = product?.variants.find((item) => item.variantId === variantId);

  function submit() {
    if (!product || !variant || !Number.isInteger(quantity) || quantity < 1) return;
    onAdd(product, variant, quantity);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah ke keranjang</DialogTitle>
          <DialogDescription>{product?.name}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {product && availableVariants.length > 1 && (
            <label className="block space-y-1 text-sm font-medium">Varian
              <select className="h-9 w-full rounded-md border bg-background px-3 font-normal" value={variantId} onChange={(event) => setVariantId(event.target.value)}>
                {availableVariants.map((item) => <option key={item.variantId} value={item.variantId}>{item.name} — Rp {item.price.toLocaleString("id-ID")} (stok {item.stock})</option>)}
              </select>
            </label>
          )}
          {variant && <div className="flex items-center justify-between rounded-lg bg-muted p-3 text-sm"><span>{variant.name}</span><Currency value={variant.price} /></div>}
          <label className="block space-y-1 text-sm font-medium">Quantity
            <Input type="number" min="1" step="1" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} />
          </label>
          {variant && <div className="flex justify-between border-t pt-3 text-sm"><span>Total</span><strong><Currency value={variant.price * quantity} /></strong></div>}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button type="button" disabled={!variant || quantity < 1 || !Number.isInteger(quantity)} onClick={submit}>Tambah ke keranjang</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
