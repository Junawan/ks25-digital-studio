"use client";

import { useRef } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  title: string;

  value: string | null;

  uploadLabel?: string;

  removeLabel?: string;

  loading?: boolean;

  disabled?: boolean;

  onUpload: (file: File) => Promise<void>;

  onRemove: () => Promise<void>;
}

export default function ImageUploader({
  title,
  value,
  uploadLabel = "Upload",
  removeLabel = "Hapus",
  loading = false,
  disabled = false,
  onUpload,
  onRemove,
}: Props) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  async function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      await onUpload(file);
    } finally {
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">
        {title}
      </label>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex items-start gap-4">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border bg-muted">
          {value ? (
            <Image
              src={value}
              alt={title}
              width={96}
              height={96}
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="px-2 text-center text-xs text-muted-foreground">
              Belum ada gambar
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={disabled || loading}
            onClick={() =>
              inputRef.current?.click()
            }
          >
            <Upload className="mr-2 h-4 w-4" />
            {uploadLabel}
          </Button>

          {value && (
            <Button
              type="button"
              variant="destructive"
              disabled={disabled || loading}
              onClick={onRemove}
            >
              <X className="mr-2 h-4 w-4" />
              {removeLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}