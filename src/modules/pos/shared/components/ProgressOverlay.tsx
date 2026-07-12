"use client";

import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

import { Progress } from "@/shared/components/ui/progress";

interface Props {
  open: boolean;

  title?: string;

  current: number;

  total: number;

  description?: string;
}

export default function ProgressOverlay({
  open,
  title = "Memproses...",
  current,
  total,
  description,
}: Props) {
  const progress =
    total === 0
      ? 0
      : Math.round((current / total) * 100);

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) =>
          e.preventDefault()
        }
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">

          <div className="flex justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>

          <Progress value={progress} />

          <div className="text-center text-sm text-muted-foreground">

            {current} / {total}

          </div>

          {description && (
            <div className="text-center text-sm font-medium">
              {description}
            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}