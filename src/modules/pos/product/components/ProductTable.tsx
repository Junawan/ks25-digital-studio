"use client";

import { Pencil, Trash2 } from "lucide-react";

import { Card } from "@/shared/components/ui/card";
import { Button } from "@/components/ui/button";

import Currency from "@/modules/pos/shared/components/Currency";
import StockBadge from "@/modules/pos/shared/components/StockBadge";

import { Product } from "../types/product";
import EmptyState from "../../shared/components/EmptyState";

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
    <EmptyState
      title="Belum ada produk"
      description="Silakan tambahkan produk pertama untuk mulai bertransaksi."
    />
  );
}

  return (
    <>
      {/* Desktop */}
      <Card className="hidden overflow-hidden lg:block">
        <table className="w-full">
          <thead className="border-b bg-muted/40">
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

              <th className="px-4 py-3 text-center">
                Stok
              </th>

              <th className="w-32 px-4 py-3 text-center">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => {
              const firstVariant =
                product.variants[0];

              const stock =
                product.variants.reduce(
                  (total, item) =>
                    total + item.stock,
                  0
                );

              return (
                <tr
                  key={product.productId}
                  className="border-b last:border-0"
                >
                  
                  <td className="px-4 py-4">
                    <div className="font-medium">
                      {product.name}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {firstVariant?.name}
                    </div>
                  </td>

                  <td className="text-center">
                    {product.variants.length}
                  </td>

                  <td className="px-4 text-right">
                    <Currency
                      value={
                        firstVariant?.price ?? 0
                      }
                    />
                  </td>

                  <td className="text-center">
                    <StockBadge stock={stock} />
                  </td>

                  <td>
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
      </Card>

      {/* Mobile */}
      <div className="space-y-3 lg:hidden">
        {products.map((product) => {
          const firstVariant =
            product.variants[0];

          const stock =
            product.variants.reduce(
              (total, item) =>
                total + item.stock,
              0
            );

          return (
            <Card
              key={product.productId}
              className="p-4"
            >
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold">
                    {product.name}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {product.variants.length} Varian
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <Currency
                    value={
                      firstVariant?.price ?? 0
                    }
                  />

                  <StockBadge stock={stock} />
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    variant="outline"
                    onClick={() =>
                      onEdit(product)
                    }
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>

                  <Button
                    className="flex-1"
                    variant="destructive"
                    onClick={() =>
                      onDelete(product)
                    }
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}