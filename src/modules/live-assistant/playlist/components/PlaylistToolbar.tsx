"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Plus, Search } from "lucide-react";


interface Props {

  search: string;

  onSearchChange: (
    value: string
  ) => void;

  onCreate: () => void;

}

export default function PlaylistToolbar({

  search,

  onSearchChange,

  onCreate,

}: Props) {

  return (

    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

      <div className="relative w-full md:max-w-sm">

        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input

          value={search}

          onChange={(e) =>
            onSearchChange(
              e.target.value
            )
          }

          placeholder="Cari Playlist..."

          className="pl-10"

        />

      </div>

      <Button
    onClick={onCreate}
    className="hidden md:flex"
>

        <Plus className="mr-2 h-4 w-4"/>

        Playlist Baru

      </Button>

    </div>

  );

}