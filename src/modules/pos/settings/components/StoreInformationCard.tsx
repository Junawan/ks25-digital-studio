"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useForm } from "react-hook-form";

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
import { getPosSettingsUseCase } from "../di";
import { StoreInformationInput, storeInformationSchema } from "../validation/storeInformationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import StoreLogoUploader from "./StoreLogoUploader";
import { storageService } from "@/shared/services/StorageService";
import { saveSettings } from "../utils/saveSettings";

interface Props {
  hideSaveButton?: boolean;
}

export interface StoreInformationCardRef {
  validate(): Promise<boolean>;
  getValues(): StoreInformationInput;
  getSettings(): PosSettings | null;
}

const StoreInformationCard = forwardRef<
  StoreInformationCardRef,
  Props
>(function StoreInformationCard(
  {
    hideSaveButton = false,
  },
  ref
) {
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


useImperativeHandle(ref, () => ({
  async validate() {
    return await form.trigger();
  },

  getValues() {
    return form.getValues();
  },

  getSettings() {
    return settings;
  },
}));

  async function handleLogoUpload(file: File) {
  if (!companyId) return;

  const logoUrl = await storageService.upload(
    `companies/${companyId}/logo`,
    file
  );

  setSettings((current) =>
    current
      ? {
          ...current,
          logoUrl,
        }
      : current
  );
}

async function handleLogoRemove() {
  if (!companyId) return;

  await storageService.delete(
    `companies/${companyId}/logo`
  );

  setSettings((current) =>
    current
      ? {
          ...current,
          logoUrl: null,
        }
      : current
  );
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
          <form className="space-y-4">
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

          </form>
        )}
      </CardContent>
    </Card>
  );
});
export default StoreInformationCard;