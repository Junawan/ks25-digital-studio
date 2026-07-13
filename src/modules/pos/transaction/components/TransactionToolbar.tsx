"use client";

import { Search, ScanLine } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

interface Props {
  keyword: string;

  onKeywordChange: (
    value: string
  ) => void;

  onScan: () => void;
}

export default function TransactionToolbar({
  keyword,
  onKeywordChange,
  onScan,
}: Props) {
  return (
    <div
      className="
      flex
      flex-col
      gap-3

      lg:flex-row
      "
    >
      <div className="relative flex-1">

        <Search
          className="
          absolute
          left-3
          top-3
          h-4
          w-4
          text-muted-foreground
          "
        />

        <Input
          value={keyword}
          placeholder="Cari produk..."
          className="pl-10"
          onChange={(e) =>
            onKeywordChange(
              e.target.value
            )
          }
        />

      </div>

      <Button
        variant="outline"
        onClick={onScan}
      >
        <ScanLine className="mr-2 h-4 w-4" />

        Scan
      </Button>

    </div>
  );
}