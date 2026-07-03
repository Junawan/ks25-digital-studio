"use client";

import {
  Clock3,
  PlayCircle,
} from "lucide-react";

import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";

const histories = [
  {
    id: "1",
    playlist: "Promo Shopee Pagi",
    time: "Hari ini • 09:20",
    total: 18,
  },
  {
    id: "2",
    playlist: "Flash Sale Siang",
    time: "Hari ini • 13:15",
    total: 12,
  },
  {
    id: "3",
    playlist: "Live Malam",
    time: "Kemarin • 20:05",
    total: 25,
  },
];

export default function HistoryPage() {
  return (
    <div className="space-y-6">

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
            key={item.id}
            className="rounded-2xl p-5"
          >

            <div className="flex items-center justify-between">

              <div>

                <div className="text-lg font-semibold">
                  {item.playlist}
                </div>

                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">

                  <Clock3 className="h-4 w-4"/>

                  {item.time}

                </div>

                <div className="mt-1 text-sm text-muted-foreground">

                  {item.total} Produk

                </div>

              </div>

              <Button>

                <PlayCircle className="mr-2 h-4 w-4"/>

                Buka Lagi

              </Button>

            </div>

          </Card>

        ))}

      </div>

    </div>
  );
}