"use client";

import { useWorkspace } from "@/core/workspace/WorkspaceProvider";
import { useCallback, useEffect, useState } from "react";
import { Playlist } from "../playlist.types";
import { createPlaylistUseCase, deletePlaylistUseCase, getPlaylistsUseCase, updatePlaylistUseCase } from "../../di";



export function usePlaylists() {

  const { workspace } = useWorkspace();

const company = workspace?.company;

  const [loading, setLoading] =
    useState(true);

  const [playlists, setPlaylists] =
    useState<Playlist[]>([]);

  const refresh = useCallback(async () => {

    if (!company) return;

    setLoading(true);

    try {

      const data =
        await getPlaylistsUseCase.execute(
          company.id
        );

      setPlaylists(data);

    } finally {

      setLoading(false);

    }

  }, [company]);

  useEffect(() => {

    refresh();

  }, [refresh]);

  async function create(
    playlist: Playlist
  ) {

    await createPlaylistUseCase.execute(
      playlist
    );

    await refresh();

  }

  async function update(
    playlistId: string,
    data: Partial<Playlist>
  ) {

    await updatePlaylistUseCase.execute(
      playlistId,
      data
    );

    await refresh();

  }

  async function remove(
    playlistId: string
  ) {

    await deletePlaylistUseCase.execute(
      playlistId
    );

    await refresh();

  }

  return {

    playlists,

    loading,

    refresh,

    create,

    update,

    remove,

  };

}