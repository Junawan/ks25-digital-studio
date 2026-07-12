"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Check,
  CheckCircle2,
  Clock3,
  Download,
  Loader2,
  Pin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useModules } from "@/modules/module/use-modules";
import { useRouter } from "next/navigation";

import {
  DashboardProduct,
} from "../dashboard.data";

import { useWorkspace } from "@/core/workspace/WorkspaceProvider";
import { useShortcut } from "@/hooks/useShortcut";
import { Capacitor } from "@capacitor/core";
import { toast } from "sonner";

interface Props {

  product: DashboardProduct;

}

export default function ProductModuleCard({

  product,

}: Props) {

    const { hasModule } =
  useWorkspace();

  const installed =
  hasModule(
    product.moduleId
  );

const available =
  product.ready &&
  !installed;

const comingSoon =
  !product.ready;

  const {
  install,
} = useModules();

const router = useRouter();

const categoryLabel = {

    sales: "🚀 Sales",

    business: "💼 Business",

    fulfillment: "📦 Fulfillment",

    creative: "🎉 Creative",

};

function getModuleRoute(
  moduleId: string
) {
  switch (moduleId) {
    case "live-assistant":
      return "/live-assistant";

      case "pos":
  return "/pos";

    default:
      return "/";
  }
}

function getModuleIcon(
  moduleId: string
) {

  switch (moduleId) {

    case "live-assistant":
      return "live_assistant";

      case "pos":
  return "pos";

    default:
      return "live_assistant";

  }

}

const shortcut =
  useShortcut(
    product.moduleId
  );

async function pinShortcut() {

  if (!Capacitor.isNativePlatform()) {

    toast.info(
      "Shortcut hanya tersedia di Android."
    );

    return;

  }

  try {

    const success =
      await shortcut.pin(

        product.name,

        getModuleRoute(
          product.moduleId
        ),

        getModuleIcon(
          product.moduleId
        )

      );

    if (success) {

      toast.success(
        "Shortcut berhasil ditambahkan."
      );

      return;

    }

    toast.error(
      "Gagal menambahkan shortcut."
    );

  } catch (error) {

    console.error(error);

    toast.error(
      "Terjadi kesalahan."
    );

  }

}

  return (

    <div
  role="button"
  tabIndex={0}
  onClick={()=>
    router.push(
      `/dashboard/apps/${product.moduleId}`
    )
  }
  onKeyDown={(e)=>{

    if(
      e.key==="Enter"||
      e.key===" "
    ){

      router.push(
        `/dashboard/apps/${product.moduleId}`
      );

    }

  }}
  className="
  group
  cursor-pointer
  overflow-hidden
  rounded-3xl
  border
  bg-background
  transition-all
  duration-300
  hover:-translate-y-2
  hover:border-violet-500
  hover:shadow-2xl
  "
>

      {/* Cover */}

      <div
  className={`
    relative
    h-52
    overflow-hidden
    bg-gradient-to-br
    ${product.color}
  `}
>

  <Image
  src={product.image}
  alt={product.name}
  fill
  priority={product.moduleId === "live-assistant"}
  className="object-cover"
/>

</div>

      {/* Content */}

      <div className="space-y-4 p-5">

        <div className="flex items-start justify-between">

          <div>

            <h3 className="font-semibold text-lg">

              {product.name}

            </h3>

            <p
              className="
              mt-1
              text-sm
              text-muted-foreground
              "
            >

              {product.description}

            </p>

          </div>

        </div>

        <div className="flex flex-wrap gap-2">

  <Badge variant="secondary">
    {categoryLabel[product.category]}
  </Badge>

  {product.status === "stable" && (
    <Badge
      variant="outline"
      className="
        border-emerald-300
        bg-emerald-50
        text-emerald-700
      "
    >
      Stable
    </Badge>
  )}

  {product.status === "beta" && (
    <Badge
      variant="outline"
      className="
        border-amber-300
        bg-amber-50
        text-amber-700
      "
    >
      🧪 Beta
    </Badge>
  )}

</div>

{product.status === "beta" && (

  <div
    className="
      rounded-xl
      border
      border-amber-200
      bg-amber-50
      p-3
      text-xs
      leading-relaxed
      text-amber-700
    "
  >
    <strong>Dalam Pengujian</strong>

    <br />

    Modul ini masih dalam tahap pengembangan.
    Anda dapat mencobanya, namun beberapa fitur
    mungkin belum lengkap atau masih berubah.
  </div>

)}

<div
  className="
  flex
  items-center
  justify-between
  text-sm
  "
>

  <span className="text-muted-foreground">

    Versi 1.0.0

  </span>

  {installed && (

    <span className="text-emerald-600 font-medium">

      ✓ Terinstal

    </span>

  )}

</div>

        {installed && (

          <div
  onClick={(e) =>
    e.stopPropagation()
  }
>

  <Button
    asChild
    className="
    w-full
    bg-emerald-600
    hover:bg-emerald-700
    "
  >

    <Link
  href={
    getModuleRoute(
      product.moduleId
    )
  }
>

      <CheckCircle2
        className="mr-2 h-4 w-4"
      />

      Buka Aplikasi

    </Link>

  </Button>

  <Button
  variant="outline"
  disabled={
    shortcut.loading ||
    shortcut.pinning ||
    shortcut.pinned
  }
  onClick={(e) => {

    e.stopPropagation();

    pinShortcut();

  }}
>

  {shortcut.pinning ? (

    <>

      <Loader2
        className="
        mr-2
        h-4
        w-4
        animate-spin
        "
      />

      Menambahkan...

    </>

  ) : shortcut.pinned ? (

    <>

      <Check
        className="
        mr-2
        h-4
        w-4
        "
      />

      Sudah di Layar Utama

    </>

  ) : (

    <>

      <Pin
        className="
        mr-2
        h-4
        w-4
        "
      />

      Pasang ke Layar Utama

    </>

  )}

</Button>

</div>

        )}

        {available && (

          <div
  onClick={(e) =>
    e.stopPropagation()
  }
>

  <Button
    className="w-full"
    onClick={() =>
      install(product.moduleId)
    }
  >

    <Download className="mr-2 h-4 w-4"/>

    Install

  </Button>

</div>

        )}

        {comingSoon && (

  <>

    <Button
      disabled
      variant="secondary"
      className="w-full"
    >

      <Clock3 className="mr-2 h-4 w-4" />

      Segera Hadir

    </Button>

    <p
      className="
      text-center
      text-xs
      text-muted-foreground
      "
    >
      Aplikasi sedang dipersiapkan. Nantikan segera.
    </p>

  </>

)}

      </div>

    </div>

  );

}