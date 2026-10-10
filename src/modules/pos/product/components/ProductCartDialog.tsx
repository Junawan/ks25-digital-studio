"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { CartItem } from "@/modules/pos/transaction/types/transaction";
import Currency from "@/modules/pos/shared/components/Currency";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  onQuantityChange: (variantId: string, quantity: number) => void;
  onRemove: (variantId: string) => void;
  onContinue: () => void;
}

export default function ProductCartDialog({ open, onOpenChange, items, onQuantityChange, onRemove, onContinue }: Props) {
  const quantity = items.reduce((sum, item) => sum + item.qty, 0);
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Keranjang belanja</DialogTitle>
          <DialogDescription>{quantity} produk dipilih</DialogDescription>
        </DialogHeader>
        {items.length ? <div className="space-y-3">
          {items.map((item) => <div key={item.variantId} className="grid grid-cols-[1fr_5rem_auto] items-center gap-3 rounded-lg border p-3">
            <div className="min-w-0"><p className="truncate font-medium">{item.productName}</p><p className="truncate text-sm text-muted-foreground">{item.variantName}</p><p className="mt-1 text-sm"><Currency value={item.price} /> / unit</p></div>
            <Input aria-label={`Jumlah ${item.productName}`} type="number" min="0" step="1" value={item.qty} onChange={(event) => onQuantityChange(item.variantId, Number(event.target.value))} />
            <div className="text-right"><p className="font-semibold"><Currency value={item.subtotal} /></p><button type="button" className="mt-1 text-xs text-destructive underline" onClick={() => onRemove(item.variantId)}>Hapus</button></div>
          </div>)}
          <div className="flex items-center justify-between border-t pt-3"><span className="font-medium">Total sementara</span><strong className="text-lg"><Currency value={total} /></strong></div>
        </div> : <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">Keranjang masih kosong.</div>}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Lanjut pilih produk</Button>
          <Button type="button" disabled={!items.length} onClick={onContinue}>Lanjut transaksi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
