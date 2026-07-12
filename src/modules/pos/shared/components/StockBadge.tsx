"use client";

import { Badge } from "@/shared/components/ui/badge";

interface Props {
  stock: number;
}

export default function StockBadge({
  stock,
}: Props) {
  if (stock <= 0) {
    return (
      <Badge variant="destructive">
        Habis
      </Badge>
    );
  }

  if (stock <= 5) {
    return (
      <Badge variant="secondary">
        {stock}
      </Badge>
    );
  }

  return <Badge>{stock}</Badge>;
}