"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useParams, useRouter } from "next/navigation";

import { ArrowLeft } from "lucide-react";
import { Product } from "@/modules/live-assistant/product/product.types";
import { Playlist } from "@/modules/live-assistant/playlist/playlist.types";
import { getPlaylistByIdUseCase, productRepository } from "@/modules/live-assistant/di";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import TeleprompterControls from "@/modules/live-assistant/teleprompter/components/TeleprompterControls";
import PresenterScript from "@/modules/live-assistant/teleprompter/components/PresenterScript";
import PresenterHeader from "@/modules/live-assistant/teleprompter/components/PresenterHeader";
import {
  useTeleprompterKeyboard,
} from "@/modules/live-assistant/teleprompter/hooks/useTeleprompterKeyboard";

export default function TeleprompterPage() {

  const router = useRouter();

  const params = useParams();

const playlistId =
    params.playlistId as string;

  const productId =
    params.productId as string;

  const [loading, setLoading] =
    useState(true);

  const [product, setProduct] =
    useState<Product | null>(null);

    const [fontSize, setFontSize] =
    useState(42);

    const [displayFontSize, setDisplayFontSize] =
  useState(42);

const [speed, setSpeed] =
    useState(1.0);

const [playing, setPlaying] =
    useState(false);

    const [fullscreen, setFullscreen] =
  useState(false);

    const contentRef =
  useRef<HTMLDivElement>(null);

const animationRef =
  useRef<number | null>(null);

const lastTimeRef =
  useRef<number>(0);

  const [playlist, setPlaylist] =
    useState<Playlist | null>(null);

    const [playlistProducts, setPlaylistProducts] =
  useState<Product[]>([]);

const [keyword, setKeyword] =
  useState("");

const [searchOpen, setSearchOpen] =
  useState(false);

  const [showControls, setShowControls] =
  useState(true);

  const hideTimer =
  useRef<NodeJS.Timeout | null>(null);

function showUI() {

  setShowControls(true);

  if (hideTimer.current) {

    clearTimeout(
      hideTimer.current
    );

  }

  hideTimer.current =
    setTimeout(() => {

      setShowControls(false);

    },3000);

}

  useEffect(() => {

    load();

  }, []);

  async function load() {

    const p =
        await productRepository.findById(
            productId
        );

    const list =
  await getPlaylistByIdUseCase.execute(
    playlistId
  );

setPlaylist(list);

if (list) {
  const products =
    await productRepository.findByIds(
      list.productIds
    );

  const orderedProducts =
    list.productIds
      .map((id) =>
        products.find(
          (p) => p.productId === id
        )
      )
      .filter(
        (p): p is Product => p !== undefined
      );

  setPlaylistProducts(
    orderedProducts
  );
}

    setProduct(p);

    setLoading(false);

}

const filteredProducts = playlistProducts.filter((product) => {
  const q = keyword.trim().toLowerCase();

  if (!q) return false;

  const productNumber =
    playlistProducts.findIndex(
      (p) => p.productId === product.productId
    ) + 1;

  // jika keyword angka
  if (/^\d+$/.test(q)) {
    return productNumber === Number(q);
  }

  // jika keyword teks
  return product.title
    .toLowerCase()
    .includes(q);
});

  useEffect(() => {

    if (!playing) {

        if (animationRef.current) {

            cancelAnimationFrame(
                animationRef.current
            );

            animationRef.current = null;

        }

        return;

    }

    function animate(time: number) {

        if (!contentRef.current) return;

        if (lastTimeRef.current === 0) {

            lastTimeRef.current = time;

        }

        const delta =
            time - lastTimeRef.current;

        lastTimeRef.current = time;

        contentRef.current.scrollTop +=
            speed * delta * 0.06;

        animationRef.current =
            requestAnimationFrame(
                animate
            );

    }

    animationRef.current =
        requestAnimationFrame(
            animate
        );

    return () => {

        if (animationRef.current) {

            cancelAnimationFrame(
                animationRef.current
            );

        }

        lastTimeRef.current = 0;

    };

}, [playing, speed]);

async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      await document.exitFullscreen();
      setFullscreen(false);
    }
  } catch (err) {
    console.error(err);
  }
}

useEffect(() => {
  function onFullscreenChange() {
    setFullscreen(!!document.fullscreenElement);
  }

  document.addEventListener(
    "fullscreenchange",
    onFullscreenChange
  );

  return () => {
    document.removeEventListener(
      "fullscreenchange",
      onFullscreenChange
    );
  };
}, []);

useEffect(()=>{

    showUI();

    return ()=>{

        if(hideTimer.current){

            clearTimeout(
                hideTimer.current
            );

        }

    }

},[]);

useTeleprompterKeyboard({

  onPlayPause: () =>
    setPlaying((v) => !v),

  onPrev: goPrev,

  onNext: goNext,

  onFontUp: () =>
    setFontSize((v) =>
        Math.min(
            72,
            v + 2
        )
    ),

  onFontDown: () =>
    setFontSize((v) =>
        Math.max(
            20,
            v - 2
        )
    ),

});

useEffect(() => {

  function updateFont() {

    const width =
      window.innerWidth;

    const scale =
      Math.min(width, 430) / 390;

    setDisplayFontSize(

      Math.round(
        fontSize * scale
      )

    );

  }

  updateFont();

  window.addEventListener(
    "resize",
    updateFont
  );

  return () =>

    window.removeEventListener(
      "resize",
      updateFont
    );

}, [fontSize]);

  if (loading) {

    return (

      <div className="flex h-screen items-center justify-center">

        Memuat...

      </div>

    );

  }

  if (!product) {

    return (

      <div className="flex h-screen items-center justify-center">

        Produk tidak ditemukan

      </div>

    );

  }

  const currentIndex =
    playlist?.productIds.indexOf(
        productId
    ) ?? -1;

    function goPrev() {

    if (
        !playlist ||
        currentIndex <= 0
    ) {
        return;
    }

    router.push(

`/live-assistant/playlists/${playlistId}/teleprompter/${
playlist.productIds[currentIndex-1]
}`

    );

}

function goNext() {

    if (
        !playlist ||
        currentIndex >=
        playlist.productIds.length - 1
    ) {
        return;
    }

    router.push(

`/live-assistant/playlists/${playlistId}/teleprompter/${
playlist.productIds[currentIndex+1]
}`

    );

}

  return (

<div
className="
fixed
inset-0
overflow-hidden
bg-black
"
onClick={showUI}
>

      <PresenterHeader
  current={currentIndex + 1}
  total={playlist?.productIds.length ?? 0}

  image={product.image}
  title={product.title}

  onBack={() =>
    router.push(
      `/live-assistant/playlists/${playlistId}`
    )
  }
  onSearch={() => setSearchOpen(true)}
  onFullscreen={toggleFullscreen}
/>

      <PresenterScript

text={
product.teleprompterText ??
""
}

fontSize={displayFontSize}

contentRef={contentRef}

onPlayPause={()=>
setPlaying(v=>!v)
}

/>

{showControls && (
<TeleprompterControls

playing={playing}

speed={speed}

onPrev={goPrev}

onNext={goNext}

onPlayPause={()=>
setPlaying(v=>!v)
}

onFontDown={()=>

setFontSize(v=>

Math.max(
20,
v-2
)

)

}

onFontUp={()=>

setFontSize(v=>

Math.min(
72,
v+2
)

)

}

onSpeedDown={()=>
setSpeed(v=>
Math.max(
0.5,
v-0.5
))
}

onSpeedUp={()=>
setSpeed(v=>
Math.min(
10,
v+0.5
))
}

/>
)}

{searchOpen && (

<div
className="
fixed
inset-0
z-[100]
bg-black/70
backdrop-blur-sm
flex
items-start
justify-center
p-4
"
>

<div
className="
mt-10
w-full
max-w-md
rounded-2xl
bg-background
shadow-2xl
"
>

<div className="p-4">

<Input

autoFocus

placeholder="Cari nomor atau nama..."

value={keyword}

onChange={(e)=>
setKeyword(
e.target.value
)
}

/>

</div>

<div
className="
max-h-[60vh]
overflow-y-auto
"
>

{filteredProducts.map((p)=>{

const number=
playlistProducts.findIndex(
x=>x.productId===p.productId
)+1;

return(

<button

key={p.productId}

className="
flex
w-full
items-center
gap-3
border-b
p-4
hover:bg-muted
"

onClick={()=>{

setSearchOpen(false);

setKeyword("");

router.push(

`/live-assistant/playlists/${playlistId}/teleprompter/${p.productId}`

);

}}

>

<div
className="
w-8
font-bold
text-red-500
"
>

{number}

</div>

<img

src={p.image}

className="
h-12
w-12
rounded
object-cover
"

/>

<div
className="
flex-1
text-left
"
>

{p.title}

</div>

</button>

);

})}

</div>

<div className="p-3">

<Button

variant="outline"

className="w-full"

onClick={()=>{

setSearchOpen(false);

}}

>

Tutup

</Button>

</div>

</div>

</div>

)}
    </div>

  );

}