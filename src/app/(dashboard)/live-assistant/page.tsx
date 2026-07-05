"use client";

import Link from "next/link";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useRouter } from "next/navigation";
import { useAndroidBack } from "@/hooks/useAndroidBack";

export default function LiveAssistantPage() {
  const router = useRouter();

  useAndroidBack(() => {
    router.back();
    return true;
  });
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold">
          Live Assistant
        </h1>

        <p className="text-muted-foreground">
          Kelola live shopping lebih cepat dengan bantuan AI.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <Card>
          <CardHeader>
            <CardTitle>
              Products
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-4xl font-bold">
              -
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Playlists
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-4xl font-bold">
              -
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              AI Generated
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-4xl font-bold">
              -
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Presenter
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-4xl font-bold">
              0
            </p>
          </CardContent>
        </Card>

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