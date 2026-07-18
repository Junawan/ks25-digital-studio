"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

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
import { getPosSettingsUseCase, savePosSettingsUseCase } from "../di";
import { StoreInformationInput, storeInformationSchema } from "../validation/storeInformationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import StoreLogoUploader from "./StoreLogoUploader";
import { storageService } from "@/shared/services/StorageService";

// import { getPosSettingsUseCase } from "../di";
// import { savePosSettingsUseCase } from "../di";

type FormValues = Pick<
  PosSettings,
  "address" | "phone" | "email" | "website"
>;

export default function StoreInformationCard() {
  const { workspace } = useWorkspace();

  const company = workspace?.company;
  const companyId = company?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] =
    useState<PosSettings | null>(null);

  const form = useForm<StoreInformationInput>({
  resolver: zodResolver(storeInformationSchema),
  defaultValues: {
    address: DEFAULT_POS_SETTINGS.address,
    phone: DEFAULT_POS_SETTINGS.phone,
    email: DEFAULT_POS_SETTINGS.email ?? "",
    website: DEFAULT_POS_SETTINGS.website ?? "",
  },
});

  useEffect(() => {

    async function load() {
      setLoading(true);
      if (!companyId) {
      setLoading(false);
      return;
    }

      try {
        const data =
    await getPosSettingsUseCase.execute(companyId);

const current =
    data ?? {
        companyId,

        ...DEFAULT_POS_SETTINGS,

        createdAt: new Date(),
        updatedAt: new Date(),
    };

setSettings(current);

form.reset({
    address: current.address,
    phone: current.phone,
    email: current.email ?? "",
    website: current.website ?? "",
});
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [companyId]);

  async function saveSettings(
  updater: (
    current: PosSettings
  ) => PosSettings
) {
  if (!settings) return;

  const updated = updater(settings);

  await savePosSettingsUseCase.execute(updated);

  if (!companyId) return null;

  const latest =
    await getPosSettingsUseCase.execute(companyId);

if (latest) {

    setSettings(latest);

}
}

  async function onSubmit(
  values: StoreInformationInput
) {
  setSaving(true);

  try {
    await saveSettings((current) => ({
      ...current,

      address: values.address,
      phone: values.phone,
      email: values.email || null,
      website: values.website || null,
    }));
  } finally {
    setSaving(false);
  }
}

  async function handleLogoUpload(
  file: File
) {
  if (!companyId) return;

  const logoUrl =
    await storageService.upload(
      `companies/${companyId}/logo`,
      file
    );

  await saveSettings((current) => ({
    ...current,
    logoUrl,
  }));
}

async function handleLogoRemove() {
  if (!companyId) return;

  await storageService.delete(
    `companies/${companyId}/logo`
  );

  await saveSettings((current) => ({
    ...current,
    logoUrl: null,
  }));
}

  if (!companyId) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informasi Toko</CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">
            Memuat...
          </p>
        ) : (
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Nama Toko
              </label>

              <Input
                value={company?.name ?? ""}
                disabled
              />
            </div>

            <StoreLogoUploader
  value={settings?.logoUrl ?? null}
  loading={saving}
  disabled={saving}
  onUpload={handleLogoUpload}
  onRemove={handleLogoRemove}
/>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Alamat
              </label>

              <Input
                placeholder="Alamat toko"
                disabled={saving}
                {...form.register("address")}
              />
              {form.formState.errors.address && (
  <p className="text-sm text-destructive">
    {form.formState.errors.address.message}
  </p>
)}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Nomor Telepon
              </label>

              <Input
                placeholder="08123456789"
                disabled={saving}
                {...form.register("phone")}
              />
              {form.formState.errors.phone && (
  <p className="text-sm text-destructive">
    {form.formState.errors.phone.message}
  </p>
)}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Email
              </label>

              <Input
                type="email"
                placeholder="email@toko.com"
                disabled={saving}
                {...form.register("email")}
              />
              {form.formState.errors.email && (
  <p className="text-sm text-destructive">
    {form.formState.errors.email.message}
  </p>
)}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Website
              </label>

              <Input
                placeholder="https://toko.com"
                disabled={saving}
                {...form.register("website")}
              />
              {form.formState.errors.website && (
  <p className="text-sm text-destructive">
    {form.formState.errors.website.message}
  </p>
)}
            </div>

            <Button
              type="submit"
              disabled={saving}
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}