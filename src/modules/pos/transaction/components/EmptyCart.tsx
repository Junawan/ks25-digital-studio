import { ShoppingCart } from "lucide-react";

export default function EmptyCart() {
  return (
    <div
      className="
rounded-2xl
border
border-zinc-200
bg-white
shadow-sm
"
    >
      <ShoppingCart
  className="
    h-14
    w-14
    text-zinc-400
  "
/>

<h3 className="font-semibold text-zinc-900">
  Keranjang kosong
</h3>

<p className="text-sm text-zinc-500">
  Cari produk atau scan barcode.
</p>

    </div>
  );
}