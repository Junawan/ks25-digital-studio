"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useWorkspace } from "@/core/workspace/WorkspaceProvider";

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
  getPosSettingsUseCase
} from "../di";

import QrisUploader from "./QrisUploader";
import { storageService } from "@/shared/services/StorageService";
import { saveSettings } from "../utils/saveSettings";
import { Button } from "@/shared/components/ui/button";

interface Props {
  hideSaveButton?: boolean;
}

export interface PaymentInformationCardRef {
    validate(): Promise<boolean>;
  getValues(): PaymentInformationInput & Pick<PosSettings, "bankName" | "accountNumber" | "accountHolder">;
  getSettings(): PosSettings | null;
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
        bankAccounts: DEFAULT_POS_SETTINGS.bankAccounts,
      },
    });
  const bankAccounts = useFieldArray({ control: form.control, name: "bankAccounts" });

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

        const current = data ? {
    ...DEFAULT_POS_SETTINGS,
    ...data,
    bankAccounts: data.bankAccounts?.length ? data.bankAccounts : (data.bankName || data.accountNumber || data.accountHolder ? [{ bankName: data.bankName ?? "", accountNumber: data.accountNumber ?? "", accountHolder: data.accountHolder ?? "" }] : []),
  } : {
    companyId,

    ...DEFAULT_POS_SETTINGS,

    createdAt: new Date(),
    updatedAt: new Date(),
  };

setSettings(current);

form.reset({ bankAccounts: current.bankAccounts });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [companyId, form]);

  useImperativeHandle(ref, () => ({
  async validate() {
    return form.trigger();
  },

  getValues() {
    const values = form.getValues();
    const first = values.bankAccounts[0];
    return { ...values, bankName: first?.bankName ?? "", accountNumber: first?.accountNumber ?? "", accountHolder: first?.accountHolder ?? "" };
  },

  getSettings() {
    return settings;
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

    await saveSettings(
  settings,
  setSettings,
  (current) => ({
    ...current,
    qrisImageUrl,
  })
);
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

    await saveSettings(

    settings,

    setSettings,

    current=>({

        ...current,

        qrisImageUrl:null,

    })

);
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
          <form className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium">Rekening Bank</p>
                <Button type="button" variant="outline" disabled={saving} onClick={() => bankAccounts.append({ bankName: "", accountNumber: "", accountHolder: "" })}>Tambah Rekening</Button>
              </div>
              {bankAccounts.fields.map((field, index) => (
                <div key={field.id} className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Rekening {index + 1}</p>
                    <Button type="button" variant="ghost" disabled={saving} onClick={() => bankAccounts.remove(index)}>Hapus</Button>
                  </div>
                  <div className="space-y-2"><label htmlFor={`bank-${index}`}>Nama Bank</label><Input id={`bank-${index}`} disabled={saving} placeholder="Contoh: BCA" {...form.register(`bankAccounts.${index}.bankName`)} />{form.formState.errors.bankAccounts?.[index]?.bankName && <p className="text-sm text-destructive">{form.formState.errors.bankAccounts[index]?.bankName?.message}</p>}</div>
                  <div className="space-y-2"><label htmlFor={`account-number-${index}`}>Nomor Rekening</label><Input id={`account-number-${index}`} disabled={saving} {...form.register(`bankAccounts.${index}.accountNumber`)} />{form.formState.errors.bankAccounts?.[index]?.accountNumber && <p className="text-sm text-destructive">{form.formState.errors.bankAccounts[index]?.accountNumber?.message}</p>}</div>
                  <div className="space-y-2"><label htmlFor={`account-holder-${index}`}>Nama Pemilik</label><Input id={`account-holder-${index}`} disabled={saving} {...form.register(`bankAccounts.${index}.accountHolder`)} />{form.formState.errors.bankAccounts?.[index]?.accountHolder && <p className="text-sm text-destructive">{form.formState.errors.bankAccounts[index]?.accountHolder?.message}</p>}</div>
                </div>
              ))}
              {!bankAccounts.fields.length && <p className="text-sm text-muted-foreground">Belum ada rekening bank. Tambahkan rekening jika diperlukan.</p>}
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

          </form>
        )}
      </CardContent>
    </Card>
  );
});
export default PaymentInformationCard;
