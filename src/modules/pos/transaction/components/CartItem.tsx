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

  onUpdatePrice: (
    id: string,
    price: number
  ) => void;
}

export default function CartItem({
  item,
  onDelete,
  onIncreaseQty,
  onDecreaseQty,
  onUpdateQty,
  onUpdatePrice,
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

      <div className="mt-3 flex items-end justify-between gap-4">

        <div className="space-y-2">

          {/* HARGA */}
          <div>

            <p className="text-xs text-muted-foreground mb-1">
              Harga
            </p>

            <div className="flex items-center">

              <span className="
                h-9
                flex
                items-center
                px-2
                rounded-l-md
                border
                border-r-0
                bg-muted
                text-sm
              ">
                Rp
              </span>

              <input
                type="number"
                min={0}
                value={item.price}
                onChange={(e) =>
                  onUpdatePrice(
                    item.variantId,
                    Number(
                      e.target.value
                    )
                  )
                }
                className="
                  h-9
                  w-32
                  rounded-r-md
                  border
                  px-2
                  text-right
                  text-sm
                  outline-none
                  focus:ring-2
                  focus:ring-ring
                "
              />

            </div>

          </div>

          {/* QTY */}

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

        </div>

        {/* SUBTOTAL */}

        <div className="text-right">

          <p className="text-sm text-muted-foreground">
            Subtotal
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