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
    <Image
      src={settings.stampUrl}
      alt="Stamp"
      width={130}
      height={130}
      className="absolute object-contain opacity-25"
    />
  )}

  {settings.signatureUrl && (
    <Image
      src={settings.signatureUrl}
      alt="Signature"
      width={160}
      height={80}
      className="absolute object-contain"
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