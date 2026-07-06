"use client";

import Link from "next/link";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import AndroidBackHandler from "@/shared/components/native/AndroidBackHandler";

export default function LiveAssistantPage() {

  return (
    <div className="space-y-8">

      <AndroidBackHandler
        href={`/dashboard/`}
      />

      <div>
        <h1 className="text-3xl font-bold">
          Live Assistant
        </h1>

        <p className="text-muted-foreground">
          Kelola live shopping lebih cepat dengan bantuan AI.
        </p>
      </div>

      <Card>

        <CardHeader>
          <CardTitle>
            Quick Action
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">

          <Link href="/live-assistant/products">
            <Button className="w-full">
              Kelola Produk
            </Button>
          </Link>

          <Link href="/live-assistant/playlists">
            <Button
              className="w-full"
              variant="outline"
            >
              Kelola Playlist
            </Button>
          </Link>

        </CardContent>

      </Card>

    </div>
  );
}