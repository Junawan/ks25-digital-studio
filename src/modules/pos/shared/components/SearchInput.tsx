"use client";

import { Search } from "lucide-react";

import { Input } from "@/shared/components/ui/input";

interface SearchInputProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export default function SearchInput({
  value,
  placeholder = "Cari...",
  onChange,
}: SearchInputProps) {
  return (
    <div className="relative w-full md:max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        value={value}
        placeholder={placeholder}
        className="pl-9"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}