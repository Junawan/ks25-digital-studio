"use client";

import { useState } from "react";

import PlaylistGrid from "@/modules/live-assistant/playlist/components/PlaylistGrid";
import PlaylistToolbar from "@/modules/live-assistant/playlist/components/PlaylistToolbar";
import PlaylistDialog from "@/modules/live-assistant/playlist/components/PlaylistDialog";

import { usePlaylists } from "@/modules/live-assistant/playlist/hooks/usePlaylists";
import type { Playlist } from "@/modules/live-assistant/playlist/playlist.types";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { useAndroidBack } from "@/hooks/useAndroidBack";
import { useRouter } from "next/navigation";

export default function PlaylistsPage() {
  const router = useRouter();
  const { playlists, loading, refresh } = usePlaylists();

  const [search, setSearch] = useState("");

  const [openDialog, setOpenDialog] = useState(false);

  const [selectedPlaylist, setSelectedPlaylist] =
    useState<Playlist | undefined>();

    useAndroidBack(() => {
  router.back();
  return true;
});

  if (loading) {
    return (
      <div className="p-6">
        Loading playlists...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Playlists
        </h1>

        <p className="text-muted-foreground">
          Kelola playlist Live Assistant.
        </p>
      </div>

      <PlaylistToolbar
        search={search}
        onSearchChange={setSearch}
        onCreate={() => {
          setSelectedPlaylist(undefined);
          setOpenDialog(true);
        }}
      />

      <PlaylistGrid
        playlists={playlists.filter((playlist) =>
          playlist.name
            .toLowerCase()
            .includes(search.toLowerCase())
        )}
        onEdit={(playlist) => {
          setSelectedPlaylist(playlist);
          setOpenDialog(true);
        }}
        onRefresh={refresh}
      />

      <PlaylistDialog
        open={openDialog}
        onOpenChange={(open) => {
          setOpenDialog(open);

          if (!open) {
            setSelectedPlaylist(undefined);
          }
        }}
        playlist={selectedPlaylist}
        onSuccess={refresh}
      />

      <Button
    size="icon"
    onClick={()=>{
        setSelectedPlaylist(undefined);
        setOpenDialog(true);
    }}
    className="
    fixed
    bottom-24
    right-5
    z-50
    h-16
    w-16
    rounded-full
    shadow-2xl
    md:hidden
    "
>

    <Plus className="h-7 w-7"/>

</Button>

    </div>
  );
}