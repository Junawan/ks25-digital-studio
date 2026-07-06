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
import { getPlaylistUseCase, getProductsByIdsUseCase, removeProductFromPlaylistUseCase, updatePlaylistOrderUseCase } from "@/modules/live-assistant/di";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import AndroidBackHandler from "@/shared/components/native/AndroidBackHandler";
import PlaylistProductItem from "@/modules/live-assistant/playlist/components/PlaylistProductItem";
import DeleteConfirmDialog from "@/shared/components/DeleteConfirmDialog";
import {

DndContext,

PointerSensor,

useSensor,

useSensors,

closestCenter,

} from "@dnd-kit/core";

import {

SortableContext,

verticalListSortingStrategy,

arrayMove,

} from "@dnd-kit/sortable";
import SortablePlaylistItem from "@/modules/live-assistant/playlist/components/SortablePlaylistItem";


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

    const [deleteProduct, setDeleteProduct] =
  useState<Product | null>(null);

const [deleting, setDeleting] =
  useState(false);

    const [search, setSearch] = useState("");

    const sensors = useSensors(

useSensor(

PointerSensor,

{

activationConstraint:{

distance:8,

},

}

)

);

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

  async function handleDragEnd(
event:any
){

const{

active,

over,

}=event;

if(
!over ||
active.id===over.id
){

return;

}

const oldIndex=
products.findIndex(
p=>
p.productId===active.id
);

const newIndex=
products.findIndex(
p=>
p.productId===over.id
);

const newProducts=
arrayMove(
products,
oldIndex,
newIndex
);

setProducts(
newProducts
);

await updatePlaylistOrderUseCase.execute(

playlistId,

newProducts.map(
p=>p.productId
)

);

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

  return (

    <div className="space-y-6">
      <AndroidBackHandler
  href={`/live-assistant/playlists/`}
/>

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

      <DndContext

sensors={sensors}

collisionDetection={closestCenter}

onDragEnd={handleDragEnd}

>

<SortableContext

items={products.map(
p=>p.productId
)}

strategy={
verticalListSortingStrategy
}

>

  <div className="space-y-2">

{

filteredProducts.map(

(product,index)=>(

<SortablePlaylistItem
  key={product.productId}
  number={index + 1}
  product={product}
  onClick={() =>
    router.push(
      `/live-assistant/playlists/${playlistId}/teleprompter/${product.productId}`
    )
  }
  onDelete={() => {
    setDeleteProduct(product);
  }}
/>

)

)

}

</div>

</SortableContext>

</DndContext>

<DeleteConfirmDialog
  open={!!deleteProduct}
  onOpenChange={(open) => {
    if (!open) {
      setDeleteProduct(null);
    }
  }}
  title="Hapus Produk"
  description={
    deleteProduct
      ? `Hapus "${deleteProduct.title}" dari playlist?`
      : ""
  }
  loading={deleting}
  onConfirm={async () => {
    if (!deleteProduct) return;

    try {
      setDeleting(true);

      await removeProductFromPlaylistUseCase.execute(
        playlistId,
        deleteProduct.productId
      );

      await load();

      setDeleteProduct(null);

    } finally {
      setDeleting(false);
    }
  }}
/>

    </div>

  );

}