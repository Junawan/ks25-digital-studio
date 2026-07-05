"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  Search,
  Sparkles,
} from "lucide-react";

import { Plus } from "lucide-react";
import { useGeneratePlaylistAI } from "@/modules/live-assistant/playlist/hooks/useGeneratePlaylistAI";
import { Playlist } from "@/modules/live-assistant/playlist/playlist.types";
import { Product } from "@/modules/live-assistant/product/product.types";
import { getPlaylistUseCase, getProductsByIdsUseCase } from "@/modules/live-assistant/di";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { useAndroidBack } from "@/hooks/useAndroidBack";


export default function PlaylistDetailPage() {

  const router = useRouter();
  const ai = useGeneratePlaylistAI();

  const { playlistId } = useParams<{
    playlistId: string;
  }>();

  const [loading, setLoading] =
    useState(true);

  const [playlist, setPlaylist] =
    useState<Playlist | null>(null);

  const [products, setProducts] =
    useState<Product[]>([]);

    const [search, setSearch] = useState("");

    const numberedProducts = products.map((product, index) => ({
  ...product,
  displayNumber: index + 1,
}));

  useEffect(() => {

    load();

  }, [playlistId]);

  const filteredProducts = numberedProducts.filter((product) => {
  const keyword = search.trim().toLowerCase();

  if (!keyword) return true;

  const isNumber = /^\d+$/.test(keyword);

  if (isNumber) {
    return product.displayNumber === Number(keyword);
  }

  return product.title
    .toLowerCase()
    .includes(keyword);
});

  async function load() {

    setLoading(true);

    const playlist =
      await getPlaylistUseCase.execute(
        playlistId
      );

    if (!playlist) {

      setLoading(false);

      return;

    }

    setPlaylist(playlist);

    const loadedProducts =
  await getProductsByIdsUseCase.execute(
    playlist.productIds
  );

const orderedProducts = playlist.productIds
  .map((id) =>
    loadedProducts.find(
      (p) => p.productId === id
    )
  )
  .filter(
    (p): p is Product => p !== undefined
  );

setProducts(orderedProducts);

    setLoading(false);

  }

  if (loading) {

    return (
      <div className="flex h-64 items-center justify-center">
        Memuat playlist...
      </div>
    );

  }

  if (!playlist) {

    return (
      <div className="flex h-64 items-center justify-center">
        Playlist tidak ditemukan.
      </div>
    );

  }

  useAndroidBack(() => {
  router.back();
  return true;
});

  return (

    <div className="space-y-6">

      <Button
        variant="outline"
        onClick={() =>
          router.back()
        }
      >
        <ArrowLeft className="mr-2 h-4 w-4" />

        Kembali
      </Button>

      <div>

        <h1 className="text-3xl font-bold">
          {playlist.name}
        </h1>

        <p className="text-muted-foreground">

          {playlist.description}

        </p>

      </div>

      <div className="flex gap-3">

        <Badge>

          {products.length} Produk

        </Badge>

        <Badge>

          {
            products.filter(
              p => p.teleprompterText?.trim()
            ).length
          } AI Siap

        </Badge>

      </div>

      <div className="flex gap-3">

<Button
    variant="outline"
    onClick={() =>
        router.push(
            `/live-assistant/playlists/${playlist.playlistId}/products`
        )
    }
>

<Plus className="mr-2 h-4 w-4"/>

Tambah Produk

</Button>

      {!ai.running ? (

<Button
    onClick={() =>
        ai.generate(
            products,
            load
        )
    }
>

<Sparkles className="mr-2 h-4 w-4"/>

Generate AI Playlist

</Button>

) : (

<Button
    variant="destructive"
    onClick={ai.stop}
>

Stop Generate

</Button>

)}

</div>

<div className="relative max-w-md">

    <Search
        className="
        absolute
        left-3
        top-1/2
        -translate-y-1/2
        h-4
        w-4
        text-muted-foreground
        "
    />

    <Input

        className="pl-9"

        placeholder="Cari nama atau nomor..."

        value={search}

        onChange={(e)=>
            setSearch(
                e.target.value
            )
        }

    />

</div>
{ai.running && (

<Card>

<CardContent className="space-y-5 p-6">

<div>

<h3 className="font-semibold">
Sedang Generate AI...
</h3>

<p className="text-sm text-muted-foreground">

Produk yang sedang diproses

</p>

</div>

<Progress
value={
(ai.progress / Math.max(ai.total, 1))
* 100
}
/>

<div className="flex justify-between text-sm">

<span>

{ai.progress} / {ai.total}

</span>

<span>

{Math.round(
(ai.progress /
Math.max(ai.total,1))
*100
)}%

</span>

</div>

<div className="rounded-lg border p-4">

<div className="text-xs text-muted-foreground">

Produk Saat Ini

</div>

<div className="font-medium mt-1">

{ai.currentProduct}

</div>

</div>

<div className="grid grid-cols-2 gap-4">

<div className="rounded-lg border p-4">

<div className="text-xs text-muted-foreground">

Berhasil

</div>

<div className="text-2xl font-bold text-green-600">

{ai.success}

</div>

</div>

<div className="rounded-lg border p-4">

<div className="text-xs text-muted-foreground">

Gagal

</div>

<div className="text-2xl font-bold text-red-600">

{ai.failed}

</div>

</div>

</div>

</CardContent>

</Card>

)}

      <div className="space-y-2">

  {filteredProducts.map((product) => {

    const number =
      products.findIndex(
        p => p.productId === product.productId
      ) + 1;

    return (

      <button
        key={product.productId}
        onClick={() =>
          router.push(
            `/live-assistant/playlists/${playlistId}/teleprompter/${product.productId}`
          )
        }
        className="
        flex
        w-full
        items-center
        gap-3
        rounded-xl
        border
        bg-card
        p-3
        transition
        hover:bg-muted
        "
      >

        <div
          className="
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-red-600
          text-lg
          font-bold
          text-white
          "
        >
          {number}
        </div>

        <img
          src={product.image}
          alt={product.title}
          className="
          h-16
          w-16
          rounded-lg
          object-cover
          "
        />

        <div
          className="
          flex-1
          min-w-0
          text-left
          "
        >

          <div
            className="
            truncate
            font-semibold
            "
          >
            {product.title}
          </div>

          <div
            className="
            text-sm
            text-muted-foreground
            "
          >

            {product.teleprompterText?.trim()
              ? "✅ AI Siap"
              : "⚪ Belum Generate"}

          </div>

        </div>

      </button>

    );

  })}

</div>

    </div>

  );

}