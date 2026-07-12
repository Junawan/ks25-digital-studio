"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product } from "../product.types";
import { useSaveProduct } from "../hooks/useSaveProduct";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";

const schema = z.object({
  title: z.string().min(3, "Nama produk minimal 3 karakter"),

  image: z.string(),

  productInfo: z.string(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  product?: Product;

  onSuccess?: () => void;
}

export default function ProductDialog({
  open,
  onOpenChange,
  product,
  onSuccess,
}: Props) {
  const {
  save,
  loading,
} = useSaveProduct();

  const form = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: {
  title: "",
  image: "",
  productInfo: "",
},
});

const {
  register,
  handleSubmit,
  reset,
  formState: { errors },
} = form;

  useEffect(() => {
    if (!product) {
      reset();
      return;
    }

    reset({
  title: product.title,
  image: product.image,
  productInfo: product.productInfo,
});
  }, [product, reset]);

  async function onSubmit(values: FormData) {

  const success =
    await save(values, product);

  if (!success) return;

  onOpenChange(false);

  reset();

  onSuccess?.();
}

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">

        <DialogHeader>

          <DialogTitle>
            {product
              ? "Edit Produk"
              : "Tambah Produk"}
          </DialogTitle>

          <DialogDescription>
            Lengkapi informasi produk.
          </DialogDescription>

        </DialogHeader>

        <form
  onSubmit={handleSubmit(
    onSubmit,
    (errors) => {
      console.log("FORM ERROR");
      console.log(errors);
    }
  )}
  className="space-y-4"
>

          <Input
            placeholder="Nama Produk"
            {...register("title")}
          />

          <Input
            placeholder="URL Gambar"
            {...register("image")}
          />

          <Textarea
  rows={6}
  placeholder="Informasi produk dari marketplace..."
  {...register("productInfo")}
/>

          <DialogFooter>

            <Button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Menyimpan..."
                : "Simpan"}
            </Button>

          </DialogFooter>

        </form>

      </DialogContent>
    </Dialog>
  );
}