"use client";

import { Inbox } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  title?: string;

  description?: string;

  actionLabel?: string;

  onAction?: () => void;
}

export default function EmptyState({
  title = "Belum ada data",
  description = "Data akan muncul di sini setelah ditambahkan.",
  actionLabel,
  onAction,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 py-14 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <Inbox className="h-10 w-10 text-muted-foreground" />
      </div>

      <h3 className="text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button
          className="mt-6"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}