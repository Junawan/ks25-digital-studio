"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useWorkspace } from "@/core/workspace/WorkspaceProvider";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

import { Textarea } from "@/shared/components/ui/textarea";

import {
  DEFAULT_POS_SETTINGS,
  PosSettings,
} from "../types/PosSettings";

import {
  getPosSettingsUseCase,
  savePosSettingsUseCase,
} from "../di";

import {
  receiptSettingsSchema,
  ReceiptSettingsInput,
} from "../validation/receiptSettingsSchema";

interface Props {
  hideSaveButton?: boolean;
}

export interface ReceiptSettingsCardRef {
    validate(): Promise<boolean>;

    save(): Promise<void>;
}

const ReceiptSettingsCard = forwardRef<
  ReceiptSettingsCardRef,
  Props
>(function ReceiptSettingsCard(
  {
    hideSaveButton = false,
  },
  ref
) {

const { workspace } = useWorkspace();

const companyId = workspace?.company.id;

const [loading, setLoading] =
  useState(true);

const [saving, setSaving] =
  useState(false);

const [settings, setSettings] =
  useState<PosSettings | null>(null);

  const form =
  useForm<ReceiptSettingsInput>({
    resolver: zodResolver(
      receiptSettingsSchema
    ),

    defaultValues: {
      receiptFooter:
        DEFAULT_POS_SETTINGS.receiptFooter,

      paperSize:
        DEFAULT_POS_SETTINGS.paperSize,

      autoPrint:
        DEFAULT_POS_SETTINGS.autoPrint,
    },
  });

  useEffect(() => {
  async function load() {
    if (!companyId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data =
        await getPosSettingsUseCase.execute(
          companyId
        );

      if (!data) return;

      setSettings(data);

      form.reset({
        receiptFooter:
          data.receiptFooter,

        paperSize:
          data.paperSize,

        autoPrint:
          data.autoPrint,
      });
    } finally {
      setLoading(false);
    }
  }

  load();
}, [companyId, form]);

async function saveSettings(
  updater: (
    current: PosSettings
  ) => PosSettings
) {
  if (!settings) return;

  const updated = updater(settings);

  await savePosSettingsUseCase.execute(
    updated
  );

  setSettings(updated);
}

async function onSubmit(
  values: ReceiptSettingsInput
) {
  setSaving(true);

  try {
    await saveSettings((current) => ({
      ...current,

      receiptFooter:
        values.receiptFooter,

      paperSize:
        values.paperSize,

      autoPrint:
        values.autoPrint,
    }));
  } finally {
    setSaving(false);
  }
}

useImperativeHandle(ref, () => ({

    async validate() {

        return await form.trigger();

    },

    async save() {

        await onSubmit(
            form.getValues()
        );

    },

}));

return (
  <Card>
    <CardHeader>
      <CardTitle>
        Pengaturan Struk
      </CardTitle>
    </CardHeader>

    <CardContent>
      {loading ? (
        <p>Memuat...</p>
      ) : (
        <form
          onSubmit={form.handleSubmit(
            onSubmit
          )}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Footer Struk
            </label>

            <Textarea
              rows={4}
              disabled={saving}
              {...form.register(
                "receiptFooter"
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Ukuran Kertas
            </label>

            <div className="space-y-2">
  <label className="text-sm font-medium">
    Ukuran Kertas
  </label>

  <div className="flex gap-6">
    <label className="flex items-center gap-2">
      <input
        type="radio"
        value="58mm"
        {...form.register("paperSize")}
      />

      <span>58 mm</span>
    </label>

    <label className="flex items-center gap-2">
      <input
        type="radio"
        value="80mm"
        {...form.register("paperSize")}
      />

      <span>80 mm</span>
    </label>
  </div>

  {form.formState.errors.paperSize && (
    <p className="text-sm text-destructive">
      {form.formState.errors.paperSize.message}
    </p>
  )}
</div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">
                Cetak Otomatis
              </p>

              <p className="text-sm text-muted-foreground">
                Cetak struk setelah transaksi berhasil.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-4">
  <input
    id="autoPrint"
    type="checkbox"
    {...form.register("autoPrint")}
  />

  <div>
    <label
      htmlFor="autoPrint"
      className="font-medium"
    >
      Cetak Otomatis
    </label>

    <p className="text-sm text-muted-foreground">
      Cetak struk setelah transaksi berhasil.
    </p>
  </div>
</div>
          </div>

          {!hideSaveButton && (
  <Button
    type="submit"
    disabled={saving}
  >
    {saving ? "Menyimpan..." : "Simpan"}
  </Button>
)}
        </form>
      )}
    </CardContent>
  </Card>
);
});
export default ReceiptSettingsCard;