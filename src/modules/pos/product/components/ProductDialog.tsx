"use client";

import VariantEditor from "./VariantEditor";

import { Product } from "../types/product";
import { useProductForm } from "../hooks/useProductForm";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

import { Input } from "@/shared/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  companyId: string;

  product?: Product;

  onSuccess?: () => void;
}

export default function ProductDialog({
  open,
  onOpenChange,
  companyId,
  product,
  onSuccess,
}: Props) {
  const { form, save } = useProductForm({
    companyId,
    product,
    onSuccess: () => {
      onSuccess?.();
      onOpenChange(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Produk" : "Tambah Produk"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={save}
          className="space-y-6"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Nama Produk
            </label>

            <Input
              placeholder="Nama Produk"
              {...form.register("name")}
            />

            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <VariantEditor
            control={form.control}
            register={form.register}
            setValue={form.setValue}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>

            <Button type="submit">
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}