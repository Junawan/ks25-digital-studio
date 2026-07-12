"use client";

import { Plus, Search, Upload, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";

interface Props {
  keyword: string;

  onKeywordChange: (value: string) => void;

  onCreate: () => void;

  onImport: () => void;

  onExport: () => void;
}

export default function ProductToolbar({
  keyword,
  onKeywordChange,
  onCreate,
  onImport,
  onExport,
}: Props) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={keyword}
          onChange={(e) =>
            onKeywordChange(e.target.value)
          }
          placeholder="Cari nama produk, varian atau barcode..."
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={onImport}
        >
          <Upload className="mr-2 h-4 w-4" />
          Import
        </Button>

        <Button
          variant="outline"
          onClick={onExport}
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>

        <Button onClick={onCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Produk
        </Button>
      </div>
    </div>
  );
}