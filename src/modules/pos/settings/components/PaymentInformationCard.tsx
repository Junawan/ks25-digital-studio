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

import { Input } from "@/shared/components/ui/input";

import {
  DEFAULT_POS_SETTINGS,
  PosSettings,
} from "../types/PosSettings";

import {
  paymentInformationSchema,
  PaymentInformationInput,
} from "../validation/paymentInformationSchema";

import {
  getPosSettingsUseCase,
  savePosSettingsUseCase,
} from "../di";

import QrisUploader from "./QrisUploader";
import { storageService } from "@/shared/services/StorageService";

interface Props {
  hideSaveButton?: boolean;
}

export interface PaymentInformationCardRef {
    validate(): Promise<boolean>;

    save(): Promise<void>;
}

const PaymentInformationCard = forwardRef<
  PaymentInformationCardRef,
  Props
>(function PaymentInformationCard(
  {
    hideSaveButton = false,
  },
  ref
) {
  const { workspace } = useWorkspace();

  const companyId = workspace?.company.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] =
    useState<PosSettings | null>(null);

  const form =
    useForm<PaymentInformationInput>({
      resolver: zodResolver(
        paymentInformationSchema
      ),

      defaultValues: {
        bankName:
          DEFAULT_POS_SETTINGS.bankName,

        accountNumber:
          DEFAULT_POS_SETTINGS.accountNumber,

        accountHolder:
          DEFAULT_POS_SETTINGS.accountHolder,
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
          bankName: data.bankName,
          accountNumber:
            data.accountNumber,
          accountHolder:
            data.accountHolder,
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

  await savePosSettingsUseCase.execute(updated);

  setSettings(updated);

  return updated;
}

  async function onSubmit(
    values: PaymentInformationInput
  ) {
    setSaving(true);

    try {
      await saveSettings((current) => ({
        ...current,

        bankName: values.bankName,
        accountNumber:
          values.accountNumber,
        accountHolder:
          values.accountHolder,
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
    await form.handleSubmit(onSubmit)();
  },
}));

  async function handleQrisUpload(
  file: File
) {
  if (!companyId) return;

  setSaving(true);

  try {
    const qrisImageUrl =
      await storageService.upload(
        `companies/${companyId}/qris`,
        file
      );

    await saveSettings((current) => ({
      ...current,
      qrisImageUrl,
    }));
  } finally {
    setSaving(false);
  }
}

  async function handleQrisRemove() {
  if (!companyId) return;

  setSaving(true);

  try {
    await storageService.delete(
      `companies/${companyId}/qris`
    );

    await saveSettings((current) => ({
      ...current,
      qrisImageUrl: null,
    }));
  } finally {
    setSaving(false);
  }
}

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Informasi Pembayaran
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
              <label>
                Nama Bank
              </label>

              <Input
                disabled={saving}
                {...form.register(
                  "bankName"
                )}
              />

              {form.formState.errors
                .bankName && (
                <p className="text-sm text-destructive">
                  {
                    form.formState
                      .errors.bankName
                      .message
                  }
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label>
                Nomor Rekening
              </label>

              <Input
                disabled={saving}
                {...form.register(
                  "accountNumber"
                )}
              />
            </div>

            <div className="space-y-2">
              <label>
                Nama Pemilik
              </label>

              <Input
                disabled={saving}
                {...form.register(
                  "accountHolder"
                )}
              />
            </div>

            <QrisUploader
              value={
                settings?.qrisImageUrl ??
                null
              }
              loading={saving}
              disabled={saving}
              onUpload={
                handleQrisUpload
              }
              onRemove={
                handleQrisRemove
              }
            />

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
export default PaymentInformationCard;