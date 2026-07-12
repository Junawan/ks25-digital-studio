"use client";


import {
  Control,
  UseFormRegister,
  UseFormSetValue,
  useFieldArray,
} from "react-hook-form";

import { Trash2, Plus } from "lucide-react";

import { ProductFormValues } from "../validation/productSchema";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import BarcodeInputDialog from "../../shared/components/BarcodeInputDialog";


interface Props {
 control: Control<ProductFormValues>;

  register: UseFormRegister<ProductFormValues>;

  setValue: UseFormSetValue<ProductFormValues>;
}

export default function VariantEditor({
  control,
  register,
  setValue,
}: Props) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const [scannerOpen, setScannerOpen] =
  useState(false);

const [scannerIndex, setScannerIndex] =
  useState<number>();

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="rounded-lg border bg-background p-4"
        >
          <div className="grid gap-4">
            <Input
              placeholder="Nama Varian"
              {...register(`variants.${index}.name`)}
            />

            <div className="flex gap-2">

  <Input
    placeholder="Barcode"
    {...register(
      `variants.${index}.barcode`
    )}
  />

  <Button
    type="button"
    variant="outline"
    onClick={() => {
      setScannerIndex(index);

      setScannerOpen(true);
    }}
  >
    Scan
  </Button>

</div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

              <Input
  type="number"
  placeholder="Harga Jual"
  {...register(`variants.${index}.price`, {
    valueAsNumber: true,
  })}
/>

<Input
  type="number"
  placeholder="Stok"
  {...register(`variants.${index}.stock`, {
    valueAsNumber: true,
  })}
/>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={fields.length === 1}
                onClick={() => remove(index)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus Varian
              </Button>
            </div>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() =>
          append({
  variantId: crypto.randomUUID(),
  name: "",
  barcode: "",
  price: undefined as unknown as number,
  stock: undefined as unknown as number,
  active: true,
})
        }
      >
        <Plus className="mr-2 h-4 w-4" />
        Tambah Varian
      </Button>

      <BarcodeInputDialog
  open={scannerOpen}
  onOpenChange={setScannerOpen}
  options={{
    mode: "single",
    vibrate: true,
  }}
  onDetected={(result) => {
    if (
      scannerIndex === undefined
    ) {
      return;
    }

    setValue(
      `variants.${scannerIndex}.barcode`,
      result.text,
      {
        shouldDirty: true,
      }
    );
  }}
/>
    </div>
  );
}