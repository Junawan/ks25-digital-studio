import Image from "next/image";

import type { PosSettings } from "@/modules/pos/settings/types/PosSettings";

interface Props {
  settings: PosSettings;
}

export default function Signature({
  settings,
}: Props) {
  return (
    <div className="mt-12 flex justify-end">

      <div className="w-[260px] text-center">

        <div className="text-sm font-medium">
          Hormat Kami,
        </div>

        <div className="relative flex h-36 items-center justify-center">

  {settings.stampUrl && (
    <img
    src={settings.stampUrl}
    alt="Logo"
    width={80}
    height={80}
    style={{
        objectFit: "contain",
    }}
/>
  )}

  {settings.signatureUrl && (
    <img
    src={settings.signatureUrl}
    alt="Logo"
    width={80}
    height={80}
    style={{
        objectFit: "contain",
    }}
/>
  )}

</div>

        <div className="mt-2 border-t border-black pt-1 font-semibold">
          {settings.accountHolder || "-"}
        </div>

      </div>

    </div>
  );
}