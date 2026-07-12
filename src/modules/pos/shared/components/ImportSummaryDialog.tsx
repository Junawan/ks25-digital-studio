"use client";

import {
  AlertCircle,
  CheckCircle2,
  SkipForward,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  total: number;

  success: number;

  skipped: number;

  failed: number;

  errors?: string[];
}

export default function ImportSummaryDialog({
  open,
  onOpenChange,
  total,
  success,
  skipped,
  failed,
  errors = [],
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md">

        <DialogHeader>

          <DialogTitle>
            Import Produk Selesai
          </DialogTitle>

        </DialogHeader>

        <div className="space-y-4">

          <div className="grid grid-cols-2 gap-3">

            <SummaryItem
              icon={
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              }
              label="Berhasil"
              value={success}
            />

            <SummaryItem
              icon={
                <SkipForward className="h-5 w-5 text-amber-600" />
              }
              label="Dilewati"
              value={skipped}
            />

            <SummaryItem
              icon={
                <AlertCircle className="h-5 w-5 text-red-600" />
              }
              label="Gagal"
              value={failed}
            />

            <SummaryItem
              label="Total"
              value={total}
            />

          </div>

          {errors.length > 0 && (
            <div className="max-h-40 overflow-auto rounded-lg border bg-muted p-3 text-sm">

              {errors.map(
                (error, index) => (
                  <div key={index}>
                    • {error}
                  </div>
                )
              )}

            </div>
          )}

          <Button
            className="w-full"
            onClick={() =>
              onOpenChange(false)
            }
          >
            Selesai
          </Button>

        </div>

      </DialogContent>
    </Dialog>
  );
}

interface SummaryItemProps {
  icon?: React.ReactNode;

  label: string;

  value: number;
}

function SummaryItem({
  icon,
  label,
  value,
}: SummaryItemProps) {
  return (
    <div className="rounded-lg border p-3">

      <div className="mb-2 flex items-center gap-2">
        {icon}

        <span className="text-sm text-muted-foreground">
          {label}
        </span>
      </div>

      <div className="text-2xl font-bold">
        {value}
      </div>

    </div>
  );
}