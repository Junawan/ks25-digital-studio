"use client";

import { GripVertical, Trash2 } from "lucide-react";

import { Product } from "@/modules/live-assistant/product/product.types";

import { Button } from "@/shared/components/ui/button";

import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

interface PlaylistProductItemProps {
  number: number;

  product: Product;

  onClick: () => void;

  onDelete: () => void;

  dragListeners?: SyntheticListenerMap;

  dragAttributes?: DraggableAttributes;
}

export default function PlaylistProductItem({
  number,
  product,
  onClick,
  onDelete,
  dragListeners,
  dragAttributes,
}: PlaylistProductItemProps) {
  return (
    <div
      className="
      flex
      items-center
      gap-3
      rounded-xl
      border
      bg-card
      p-3
      transition
      hover:bg-muted
      "
    >
      {/* Drag Handle */}
      <Button
    size="icon"
    variant="ghost"

    {...dragListeners}
    {...dragAttributes}

    className="
    cursor-grab
    active:cursor-grabbing
    touch-none
    "
>
    <GripVertical className="h-5 w-5"/>
</Button>

      {/* Nomor */}
      <div
        className="
        flex
        h-11
        w-11
        shrink-0
        items-center
        justify-center
        rounded-full
        bg-red-600
        text-lg
        font-bold
        text-white
        "
      >
        {number}
      </div>

      {/* Gambar */}
      <img
        src={product.image}
        alt={product.title}
        className="
        h-16
        w-16
        rounded-lg
        object-cover
        "
      />

      {/* Info */}
      <button
        onClick={onClick}
        className="
        flex-1
        min-w-0
        text-left
        "
      >
        <div className="truncate font-semibold">
          {product.title}
        </div>

        <div className="text-sm text-muted-foreground">
          {product.teleprompterText?.trim()
            ? "✅ AI Siap"
            : "⚪ Belum Generate"}
        </div>
      </button>

      {/* Delete */}
      <Button
        size="icon"
        variant="destructive"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}