import {
  ShoppingCart,
} from "lucide-react";

export default function EmptyCart() {
  return (
    <div
      className="
      flex
      flex-col
      items-center
      justify-center
      gap-3
      py-20
      "
    >
      <ShoppingCart
        className="
        h-14
        w-14
        text-zinc-400
        "
      />

      <h3
        className="
        text-lg
        font-semibold
        "
      >
        Keranjang kosong
      </h3>

      <p
        className="
        text-sm
        text-muted-foreground
        "
      >
        Cari produk atau scan barcode.
      </p>

    </div>
  );
}