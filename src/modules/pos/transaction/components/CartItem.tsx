import {
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

import { Button }
from "@/shared/components/ui/button";

import { CartItem as Item }
from "../types/transaction";

interface Props {
  item: Item;

  onDelete: (
    id: string
  ) => void;

  onIncreaseQty: (
    id: string
  ) => void;

  onDecreaseQty: (
    id: string
  ) => void;

  onUpdateQty: (
    id: string,
    qty: number
  ) => void;
}

export default function CartItem({
  item,
  onDelete,
  onIncreaseQty,
  onDecreaseQty,
  onUpdateQty,
}: Props) {

  return (
  <div className="border-b py-4 last:border-b-0">
    <div className="flex items-start justify-between">
      <div>
        <p className="font-medium">
          {item.productName}
        </p>

        <p className="text-sm text-muted-foreground">
          {item.variantName}
        </p>
      </div>

      <Button
        size="icon"
        variant="ghost"
        onClick={() =>
          onDelete(
            item.variantId
          )
        }
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
    </div>

    <div className="mt-3 flex items-center justify-between">
      <div className="flex items-center gap-2">

        <Button
          size="icon"
          variant="outline"
          onClick={() =>
            onDecreaseQty(
              item.variantId
            )
          }
        >
          <Minus className="h-4 w-4" />
        </Button>

        <input
          type="number"
          min={1}
          value={item.qty}
          onChange={(e) =>
            onUpdateQty(
              item.variantId,
              Number(
                e.target.value
              )
            )
          }
          className="
          h-9
          w-16
          rounded-md
          border
          text-center
          "
        />

        <Button
          size="icon"
          variant="outline"
          onClick={() =>
            onIncreaseQty(
              item.variantId
            )
          }
        >
          <Plus className="h-4 w-4" />
        </Button>

      </div>

      <div className="text-right">
        <p className="text-sm text-muted-foreground">
          Rp{" "}
          {item.price.toLocaleString(
            "id-ID"
          )}
        </p>

        <p className="text-lg font-bold">
          Rp{" "}
          {item.subtotal.toLocaleString(
            "id-ID"
          )}
        </p>
      </div>
    </div>
  </div>
);

}