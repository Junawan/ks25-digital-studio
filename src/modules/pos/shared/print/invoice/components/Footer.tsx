import type { PosSettings } from "@/modules/pos/settings/types/PosSettings";

interface Props {
  settings: PosSettings;
}

export default function Footer({
  settings,
}: Props) {
  return (
    <div className="mt-12 border-t pt-6 text-center">

      <div className="text-lg font-semibold">
        *** Terima Kasih ***
      </div>

      {settings.receiptFooter && (
        <p className="mt-3 whitespace-pre-line text-sm text-slate-600">
          {settings.receiptFooter}
        </p>
      )}

    </div>
  );
}