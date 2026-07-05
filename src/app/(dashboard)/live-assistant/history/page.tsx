"use client";

import {
  Clock3,
  PlayCircle,
} from "lucide-react";

import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { useAndroidBack } from "@/hooks/useAndroidBack";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

import {
  getLiveSessionHistoryUseCase,
} from "@/modules/live-assistant/di";

import { LiveSession } from "@/modules/live-assistant/live-session/live-session.types";
import { useWorkspace } from "@/core/workspace/WorkspaceProvider";

export default function HistoryPage() {
  const router = useRouter();
  const { workspace } = useWorkspace();

const [histories, setHistories] =
  useState<LiveSession[]>([]);

const [loading, setLoading] =
  useState(true);
  useAndroidBack(() => {
  router.back();
  return true;
});

useEffect(() => {

  loadHistory();

}, [workspace]);

async function loadHistory() {

  if (!workspace) {
    return;
  }

  setLoading(true);

  const result =
    await getLiveSessionHistoryUseCase.execute(
      workspace.company.id
    );

  setHistories(result);

  setLoading(false);

}

if (loading) {
  return (
    <div className="flex h-64 items-center justify-center">
      Memuat riwayat...
    </div>
  );
}
  return (
    <div className="space-y-6">

      {histories.length === 0 && (

<Card className="rounded-2xl p-10">

<div className="text-center">

Belum ada riwayat live.

</div>

</Card>

)}

      <div>

        <h1 className="text-4xl font-bold">
          Riwayat
        </h1>

        <p className="text-muted-foreground">
          Playlist yang pernah digunakan untuk live.
        </p>

      </div>

      <div className="space-y-4">

        {histories.map((item) => (

          <Card
            key={item.sessionId}
            className="rounded-2xl p-5"
          >

            <div className="flex items-center justify-between">

              <div>

                <div className="text-lg font-semibold">
                  {item.playlistName}
                </div>

                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">

                  <Clock3 className="h-4 w-4"/>

                  new Date(item.startedAt).toLocaleString("id-ID")

                </div>

                <div className="mt-1 text-sm text-muted-foreground">

                  {item.totalProducts} Produk

                </div>

              </div>

              <Button
  onClick={() =>
    router.push(
  `/live-assistant/playlists/${item.playlistId}/teleprompter/${
    item.currentProductId || item.firstProductId
  }`
)
  }
>
  <PlayCircle className="mr-2 h-4 w-4" />

  Buka Lagi
</Button>

            </div>

          </Card>

        ))}

      </div>

    </div>
  );
}