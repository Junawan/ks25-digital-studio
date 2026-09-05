"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

import { Product } from "@/modules/pos/product/types/product";
import { ProductVariant } from "@/modules/pos/product/types/product";

interface Props {
  open: boolean;

  product?: Product;

  onOpenChange: (
    open: boolean
  ) => void;

  onSelect: (
    variant: ProductVariant
  ) => void;
}

export default function VariantPickerDialog({
  open,
  product,
  onOpenChange,
  onSelect,
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
  className="
    max-w-lg
    max-h-[85vh]
    overflow-hidden
    flex
    flex-col
  "
>

        <DialogHeader>

          <DialogTitle>

            Pilih Varian

          </DialogTitle>

        </DialogHeader>

        <div
    className="
      flex-1
      overflow-y-auto
      min-h-0
      space-y-2
      pr-2
    "
  >

          {product?.variants.map(
            (variant) => (
              <button
                key={
                  variant.variantId
                }
                type="button"
                className="
                flex
                w-full
                items-center
                justify-between
                rounded-lg
                border
                p-3
                text-left
                transition
                hover:bg-muted
                "
                onClick={() => {
                  onSelect(
                    variant
                  );

                  onOpenChange(
                    false
                  );
                }}
              >
                <div>

                  <p className="font-medium">

                    {variant.name}

                  </p>

                  <p
                    className="
                    text-sm
                    text-muted-foreground
                    "
                  >
                    Barcode :

                    {" "}

                    {variant.barcode}
                  </p>

                </div>

                <div className="font-semibold">

                  Rp{" "}

                  {variant.price.toLocaleString(
                    "id-ID"
                  )}

                </div>

              </button>
            )
          )}

        </div>

      </DialogContent>
    </Dialog>
  );
}