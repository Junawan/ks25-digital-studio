"use client";

import { useState } from "react";
import { Product } from "../product.types";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { useGenerateProductAI } from "../hooks/useGenerateProductAI";
import { Badge } from "@/shared/components/ui/badge";
import { Loader2, Pencil, Trash2 } from "lucide-react";

interface ProductGridProps {
  products: Product[];

  onEdit?: (product: Product) => void;

  onDelete?: (product: Product) => void;

  onRefresh?:()=>void
}

export default function ProductGrid({
  products,
  onEdit,
  onDelete,
  onRefresh,
}: ProductGridProps) {

  const {
    generate,
    loading,
} = useGenerateProductAI();

const [loadingId, setLoadingId] =
  useState<string | null>(null);

  if (!products.length) {
    return (
      <div className="flex h-60 items-center justify-center rounded-xl border border-dashed">
        <div className="text-center">

          <h3 className="text-lg font-semibold">
            Belum ada produk
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Tambahkan produk pertama Anda.
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">

      {products.map((product) => (
        <Card
          key={product.productId}
          className="overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="relative aspect-square">

            <img
  src={product.image}
  alt={product.title}
  className="h-full w-full object-cover"
/>

          </div>

          <CardContent className="space-y-4 p-5">

            <div>

              <h3 className="text-lg font-semibold line-clamp-2">
                {product.title}
              </h3>

            </div>

            <p className="text-sm text-muted-foreground line-clamp-3">
              {product.productInfo}
            </p>

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-2">

  <Badge
    variant={
      product.active
        ? "default"
        : "secondary"
    }
  >
    {product.active
      ? "Aktif"
      : "Nonaktif"}
  </Badge>

  {product.teleprompterText?.trim() ? (
    <Badge
      className="bg-green-600"
    >
      AI Siap
    </Badge>
  ) : (
    <Badge
      variant="outline"
    >
      Belum AI
    </Badge>
  )}

</div>

            </div>

            <div className="flex gap-2">

              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onEdit?.(product)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>

              <Button
  disabled={loadingId === product.productId}
  onClick={async () => {
    setLoadingId(product.productId);

    const ok = await generate(product);

    if (ok) {
      onRefresh?.();
    }

    setLoadingId(null);
  }}
>
  {loadingId === product.productId ? (
  <>
    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    Generating...
  </>
) : product.teleprompterText?.trim() ? (
  <>
    🔄 Generate Ulang
  </>
) : (
  <>
    ✨ Generate AI
  </>
)}
</Button>

              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => onDelete?.(product)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus
              </Button>

            </div>

          </CardContent>
        </Card>
      ))}

    </div>
  );
}