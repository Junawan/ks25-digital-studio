"use client";

import { useRouter } from "next/navigation";

import {
  ChevronRight,
  ListMusic,
  Pencil,
  Trash2,
} from "lucide-react";

import { Playlist } from "../playlist.types";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

interface Props {
  playlists: Playlist[];

  onEdit?: (
    playlist: Playlist
  ) => void;

  onDelete?: (
    playlist: Playlist
  ) => void;

  onRefresh?: () => void;
}

export default function PlaylistGrid({
  playlists,
  onEdit,
  onDelete,
}: Props) {

  const router = useRouter();

  if (!playlists.length) {
    return (
      <div className="flex h-60 items-center justify-center rounded-xl border border-dashed">
        Belum ada Playlist
      </div>
    );
  }

  return (
    <div className="space-y-3">

      {playlists.map((playlist) => (

        <div
          key={playlist.playlistId}
          onClick={() =>
            router.push(
              `/live-assistant/playlists/${playlist.playlistId}`
            )
          }
          className="
          rounded-2xl
          border
          bg-card
          p-4
          transition-all
          hover:shadow-lg
          cursor-pointer
          "
        >

          <div className="flex items-center gap-4">

            <div
              className="
              flex
              h-14
              w-14
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-violet-600
              text-white
              "
            >
              <ListMusic className="h-7 w-7"/>
            </div>

            <div className="flex-1 min-w-0">

              <h3
                className="
                truncate
                text-lg
                font-semibold
                "
              >
                {playlist.name}
              </h3>

              <p
                className="
                truncate
                text-sm
                text-muted-foreground
                "
              >
                {playlist.description ||
                  "Tidak ada deskripsi"}
              </p>

              <div className="mt-2 flex gap-2">

                <Badge>

                  {playlist.productIds.length} Produk

                </Badge>

                {playlist.isDefault && (

                  <Badge variant="secondary">

                    Default

                  </Badge>

                )}

              </div>

            </div>

            <ChevronRight
              className="
              h-5
              w-5
              text-muted-foreground
              "
            />

          </div>

          <div
            className="
            mt-4
            flex
            gap-2
            "
          >

            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(playlist);
              }}
            >

              <Pencil className="mr-2 h-4 w-4"/>

              Edit

            </Button>

            <Button
              variant="destructive"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(playlist);
              }}
            >

              <Trash2 className="mr-2 h-4 w-4"/>

              Hapus

            </Button>

          </div>

        </div>

      ))}

    </div>
  );
}