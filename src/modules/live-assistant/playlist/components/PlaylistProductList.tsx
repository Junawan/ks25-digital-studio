"use client";

import { useMemo } from "react";
import { Product } from "../../product/product.types";
import { Input } from "@/shared/components/ui/input";
import { ScrollArea } from "@/shared/components/ui/scroll-area";


interface Props {
  products: Product[];

  keyword: string;

  onKeywordChange: (value: string) => void;

  selectedIds: string[];

  onToggle: (productId: string) => void;
}

export default function PlaylistProductList({
  products,
  keyword,
  onKeywordChange,
  selectedIds,
  onToggle,
}: Props) {
  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.title
        .toLowerCase()
        .includes(keyword.toLowerCase())
    );
  }, [products, keyword]);

  return (
    <div className="space-y-3">

      <Input
        placeholder="Cari produk..."
        value={keyword}
        onChange={(e) =>
          onKeywordChange(e.target.value)
        }
      />

      <ScrollArea className="h-72 rounded-md border">

        <div className="space-y-1 p-3">

          {filteredProducts.map((product) => {

            const checked =
              selectedIds.includes(
                product.productId
              );

            return (
              <label
                key={product.productId}
                className="flex cursor-pointer items-start gap-3 rounded-md p-2 hover:bg-muted"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    onToggle(
                      product.productId
                    )
                  }
                />

                <div className="flex gap-3">

                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-14 w-14 rounded object-cover border"
                  />

                  <div>

                    <p className="font-medium">

                      {product.title}

                    </p>

                    <p className="line-clamp-2 text-xs text-muted-foreground">

                      {product.productInfo}

                    </p>

                  </div>

                </div>

              </label>
            );
          })}

        </div>

      </ScrollArea>

      <div className="text-sm text-muted-foreground">

        {selectedIds.length} Produk dipilih

      </div>

    </div>
  );
}