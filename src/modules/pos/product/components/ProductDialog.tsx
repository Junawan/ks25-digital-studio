"use client";

import VariantEditor from "./VariantEditor";
import { useState } from "react";
import { ImagePlus, LoaderCircle, X } from "lucide-react";

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
import { storageService } from "@/shared/services/StorageService";
import { toast } from "sonner";

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
  const [imageUploading, setImageUploading] = useState(false);
  const { form, save } = useProductForm({
    companyId,
    product,
    onSuccess: () => {
      onSuccess?.();
      onOpenChange(false);
    },
  });
  const imageUrl = form.watch("imageUrl") ?? "";

  async function handleImageSelect(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran gambar maksimal 5 MB.");
      return;
    }

    setImageUploading(true);
    try {
      const imagePath = form.getValues("imagePath") || `companies/${companyId}/products/${product?.productId ?? crypto.randomUUID()}/image`;
      const url = await storageService.upload(imagePath, file);
      form.setValue("imageUrl", url, { shouldDirty: true });
      form.setValue("imagePath", imagePath, { shouldDirty: true });
    } catch (error) {
      console.error("Gagal mengunggah gambar produk:", error);
      toast.error("Gambar produk gagal diunggah.");
    } finally {
      setImageUploading(false);
    }
  }

  async function removeImage() {
    const imagePath = form.getValues("imagePath");
    if (imagePath) {
      try {
        await storageService.delete(imagePath);
      } catch (error) {
        console.error("Gagal menghapus gambar produk:", error);
      }
    }
    form.setValue("imageUrl", "", { shouldDirty: true });
    form.setValue("imagePath", "", { shouldDirty: true });
  }

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
            <label className="text-sm font-medium">Gambar produk <span className="font-normal text-muted-foreground">(opsional)</span></label>
            <div className="flex items-center gap-4">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                {imageUrl ? <div role="img" aria-label={`Gambar ${form.getValues("name") || "produk"}`} className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url("${imageUrl}")` }} /> : <ImagePlus className="h-8 w-8 text-muted-foreground" />}
              </div>
              <div className="flex gap-2">
                <label className="inline-flex h-9 cursor-pointer items-center rounded-md border px-3 text-sm hover:bg-accent">
                  {imageUploading ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <ImagePlus className="mr-2 h-4 w-4" />}
                  {imageUrl ? "Ganti gambar" : "Pilih gambar"}
                  <input type="file" accept="image/*" className="sr-only" disabled={imageUploading} onChange={(event) => { void handleImageSelect(event.target.files?.[0]); event.currentTarget.value = ""; }} />
                </label>
                {imageUrl && <Button type="button" variant="outline" size="icon" aria-label="Hapus gambar" disabled={imageUploading} onClick={() => { void removeImage(); }}><X className="h-4 w-4" /></Button>}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Format gambar apa pun, maksimal 5 MB.</p>
          </div>
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

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="product-hs-code">
              HS Code <span className="font-normal text-muted-foreground">(opsional)</span>
            </label>
            <Input
              id="product-hs-code"
              placeholder="Masukkan HS code produk jika tersedia"
              {...form.register("hsCode")}
            />
            {form.formState.errors.hsCode && (
              <p className="text-sm text-destructive">
                {form.formState.errors.hsCode.message}
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
