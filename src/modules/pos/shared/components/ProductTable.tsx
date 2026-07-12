"use client";

import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Product } from "../../product/types/product";

interface Props {
  products: Product[];

  onEdit: (product: Product) => void;

  onDelete: (product: Product) => void;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}: Props) {
  if (!products.length) {
    return (
      <div className="rounded-lg border p-10 text-center text-muted-foreground">
        Belum ada produk.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left">
              Produk
            </th>

            <th className="px-4 py-3 text-center">
              Varian
            </th>

            <th className="px-4 py-3 text-right">
              Harga
            </th>

            <th className="px-4 py-3 text-right">
              Stok
            </th>

            <th className="w-36 px-4 py-3 text-center">
              Aksi
            </th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => {
            const firstVariant =
              product.variants[0];

            const totalStock =
              product.variants.reduce(
                (total, variant) =>
                  total + variant.stock,
                0
              );

            return (
              <tr
                key={product.productId}
                className="border-b last:border-b-0"
              >
                <td className="px-4 py-3">
                  <div className="font-medium">
                    {product.name}
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {firstVariant?.name}
                  </div>
                </td>

                <td className="px-4 py-3 text-center">
                  {product.variants.length}
                </td>

                <td className="px-4 py-3 text-right">
                  {new Intl.NumberFormat(
                    "id-ID",
                    {
                      style: "currency",
                      currency: "IDR",
                      maximumFractionDigits: 0,
                    }
                  ).format(
                    firstVariant?.price ?? 0
                  )}
                </td>

                <td className="px-4 py-3 text-right">
                  {totalStock}
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        onEdit(product)
                      }
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() =>
                        onDelete(product)
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}