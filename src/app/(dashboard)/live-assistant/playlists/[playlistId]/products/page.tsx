"use client";

import { useEffect, useState } from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
  Check,
  Plus,
  Search,
} from "lucide-react";
import { useProducts } from "@/modules/live-assistant/product/hooks/useProducts";
import { addProductToPlaylistUseCase, getPlaylistUseCase } from "@/modules/live-assistant/di";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { useAndroidBack } from "@/hooks/useAndroidBack";


export default function PlaylistProductsPage() {

  const router = useRouter();

  const params = useParams();

  const playlistId =
    params.playlistId as string;

  const {
    products,
    refresh,
  } = useProducts();

  const [keyword, setKeyword] =
    useState("");

  const [selectedIds, setSelectedIds] =
    useState<string[]>([]);

  const [loadingId, setLoadingId] =
    useState<string | null>(null);

    useAndroidBack(() => {
  router.back();
  return true;
});

  useEffect(() => {

    loadPlaylist();

  }, []);

  async function loadPlaylist() {

    const playlist =
      await getPlaylistUseCase.execute(
        playlistId
      );

    if (!playlist) return;

    setSelectedIds(
      playlist.productIds
    );

  }

  const filtered = products.filter(
    (p) =>
      p.title
        .toLowerCase()
        .includes(
          keyword.toLowerCase()
        )
  );

  async function handleAdd(
    productId: string
  ) {

    setLoadingId(productId);

    await addProductToPlaylistUseCase.execute(
      playlistId,
      productId
    );

    setSelectedIds((prev) => [
      ...prev,
      productId,
    ]);

    setLoadingId(null);

  }

  return (

    <div className="space-y-6">

      <Button
        variant="outline"
        onClick={() =>
          router.back()
        }
      >

        <ArrowLeft className="mr-2 h-4 w-4"/>

        Kembali

      </Button>

      <div>

        <h1 className="text-3xl font-bold">

          Tambah Produk

        </h1>

        <p className="text-muted-foreground">

          Klik tombol tambah untuk memasukkan produk ke playlist.

        </p>

      </div>

      <div className="relative">

        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>

        <Input
          className="pl-10"
          placeholder="Cari produk..."
          value={keyword}
          onChange={(e)=>
            setKeyword(
              e.target.value
            )
          }
        />

      </div>

      <div className="space-y-3">

        {filtered.map((product)=>{

          const added =
            selectedIds.includes(
              product.productId
            );

          return (

            <Card
              key={product.productId}
              className="overflow-hidden"
            >

              <CardContent className="flex items-center gap-4 p-4">

  <img
    src={product.image}
    alt={product.title}
    className="h-20 w-20 rounded-lg object-cover flex-shrink-0"
  />

  <div className="flex-1 min-w-0">

    <h3 className="font-semibold line-clamp-2">
      {product.title}
    </h3>

    <div className="mt-3 flex items-center gap-2">

      {product.teleprompterText?.trim() ? (
        <Badge>
          AI Siap
        </Badge>
      ) : (
        <Badge variant="outline">
          Belum AI
        </Badge>
      )}

    </div>

  </div>

  {added ? (

    <Button
      disabled
      variant="secondary"
    >
      <Check className="mr-2 h-4 w-4" />
      Ditambahkan
    </Button>

  ) : (

    <Button
      disabled={
        loadingId === product.productId
      }
      onClick={() =>
        handleAdd(product.productId)
      }
    >
      <Plus className="mr-2 h-4 w-4" />
      Tambah
    </Button>

  )}

</CardContent>

            </Card>

          );

        })}

      </div>

    </div>

  );

}