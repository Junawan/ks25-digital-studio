"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Plus, Search } from "lucide-react";

interface ProductToolbarProps {
  search: string;

  onSearchChange: (value: string) => void;

  onCreate: () => void;

  onImport: () => void;

  onExport: () => void;

  onGenerateAI: () => void;
}

export default function ProductToolbar({
  search,
  onSearchChange,
  onCreate,
  onImport,
  onExport,
  onGenerateAI,
}: ProductToolbarProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

      <div className="relative w-full md:max-w-sm">

        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(e) =>
            onSearchChange(e.target.value)
          }
          placeholder="Cari produk..."
          className="pl-10"
        />

      </div>

      <Button
  onClick={() => {
    console.log("CLICK");
    onCreate();
  }}
>
        <Plus className="mr-2 h-4 w-4" />
        Tambah Produk
      </Button>
      <Button
  variant="outline"
  onClick={() => {
    console.log("IMPORT CLICK");
    onImport();
  }}
>
  Import Excel
</Button>

<Button
  variant="outline"
  onClick={() => {
    console.log("IMPORT CLICK");
    onExport();
  }}
>
  Export Excel
</Button>

<Button
  onClick={onGenerateAI}
>
  ✨ Generate AI
</Button>

    </div>
  );
}