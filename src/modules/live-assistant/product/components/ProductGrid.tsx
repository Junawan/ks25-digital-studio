"use client";

import { useState } from "react";
import { Product } from "../product.types";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/components/ui/button";
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
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4">

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

          <CardContent className="space-y-2 p-3">

            <div>

              <h3 className="line-clamp-2 text-sm font-semibold md:text-base">
                {product.title}
              </h3>

            </div>

            <p className="line-clamp-2 text-xs text-muted-foreground md:text-sm">
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
    size="icon"
    variant="outline"
    onClick={() => onEdit?.(product)}
  >
    <Pencil className="h-4 w-4"/>
  </Button>

              <Button
              size="icon"
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
    🔄
  </>
) : (
  <>
    ✨
  </>
)}
</Button>

              <Button
              size="icon"
                variant="destructive"
                className="flex-1"
                onClick={() => onDelete?.(product)}
              >
                <Trash2 className="h-4 w-4"/>
              </Button>

            </div>

          </CardContent>
        </Card>
      ))}

    </div>
  );
}