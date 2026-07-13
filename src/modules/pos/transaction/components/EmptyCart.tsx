import { ShoppingCart } from "lucide-react";

export default function EmptyCart() {
  return (
    <div
      className="
rounded-2xl
border
bg-zinc-900
border-zinc-800
"
    >
      <ShoppingCart
  className="
  h-14
  w-14
  text-zinc-500
  "
/>

      <div className="text-center">

        <h3 className="font-semibold text-white">

          Keranjang kosong

        </h3>

        <p className="text-zinc-400">
          Cari produk atau scan barcode.
        </p>

      </div>

    </div>
  );
}