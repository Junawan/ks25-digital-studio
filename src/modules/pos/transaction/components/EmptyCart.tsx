import { ShoppingCart } from "lucide-react";

export default function EmptyCart() {
  return (
    <div
      className="
      flex
      flex-col
      items-center
      justify-center
      gap-4
      rounded-xl
      border
      border-dashed
      py-20
      "
    >
      <ShoppingCart
        className="
        h-12
        w-12
        text-muted-foreground
        "
      />

      <div className="text-center">

        <h3 className="font-medium">

          Keranjang kosong

        </h3>

        <p
          className="
          mt-1
          text-sm
          text-muted-foreground
          "
        >
          Cari produk atau scan barcode.
        </p>

      </div>

    </div>
  );
}