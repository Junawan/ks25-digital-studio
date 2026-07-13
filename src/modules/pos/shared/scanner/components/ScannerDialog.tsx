"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

import { Button } from "@/shared/components/ui/button";

import {
  Smartphone,
  Loader2,
  X,
} from "lucide-react";

interface Props {
  open: boolean;

  waiting: boolean;

  onOpenChange: (
    open: boolean
  ) => void;

  onAndroid: () => void;

  onCancel: () => void;
}

export default function ScannerDialog({
  open,
  waiting,
  onOpenChange,
  onAndroid,
  onCancel,
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md">

        <DialogHeader>

          <DialogTitle>
            Scanner Barcode
          </DialogTitle>

        </DialogHeader>

        {!waiting && (

          <div className="space-y-3">

            <Button
              className="w-full h-14"
              onClick={onAndroid}
            >
              <Smartphone className="mr-2 h-5 w-5" />

              Android Scanner
            </Button>

          </div>

        )}

        {waiting && (

          <div className="space-y-6 py-6">

            <div className="flex justify-center">

              <Loader2
                className="
                  h-10
                  w-10
                  animate-spin
                "
              />

            </div>

            <div className="text-center">

              <p className="font-medium">

                Menunggu barcode...

              </p>

              <p
                className="
                  mt-2
                  text-sm
                  text-muted-foreground
                "
              >
                Silakan scan barcode
                menggunakan aplikasi
                Android KS25.
              </p>

            </div>

            <Button
              variant="outline"
              onClick={onCancel}
            >
              <X className="mr-2 h-4 w-4" />

              Batal

            </Button>

          </div>

        )}

      </DialogContent>

    </Dialog>
  );
}