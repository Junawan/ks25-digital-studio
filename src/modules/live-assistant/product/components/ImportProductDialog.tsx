"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { useState } from "react";




import { toast } from "sonner";
import { useImportProducts } from "../hooks/useImportProducts";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function ImportProductDialog({
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [file, setFile] =
    useState<File | null>(null);

    const {

    importExcel,

    progress,

    total,

} =
useImportProducts();

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>

        <DialogHeader>

          <DialogTitle>
            Import Produk
          </DialogTitle>

        </DialogHeader>

        <div className="space-y-4">

          <Button
  asChild
  variant="outline"
  className="w-full"
>
  <a
    href="/templates/products-template.xlsx"
    download
  >
    Download Template Excel
  </a>
</Button>

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) =>
              setFile(
                e.target.files?.[0] ?? null
              )
            }
          />

        </div>

        {total > 0 && (
  <div className="space-y-2">

    <div className="flex justify-between text-sm">

      <span>
        Mengimpor...
      </span>

      <span>
        {progress}/{total}
      </span>

    </div>

    <progress
      className="w-full"
      value={progress}
      max={total}
    />

  </div>
)}

        <DialogFooter>

          <Button
    disabled={!file}
    onClick={async () => {

        if (!file)
            return;

        try {

            await importExcel(file);

            toast.success(
                "Import berhasil"
            );

            onSuccess?.();


            onOpenChange(false);

        } catch (err) {

            console.error(err);

            toast.error(
                "Import gagal"
            );

        }

    }}
>
    Import
</Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}