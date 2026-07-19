"use client";

import { useCallback, useEffect, useState } from "react";

import {
  DEFAULT_POS_SETTINGS,
  PosSettings,
} from "../types/PosSettings";

import {
  getPosSettingsUseCase,
  savePosSettingsUseCase,
} from "../di";

export interface UsePosSettingsResult {
  settings: PosSettings | null;

  loading: boolean;

  saving: boolean;

  setSettings: React.Dispatch<
    React.SetStateAction<PosSettings | null>
  >;

  reload(): Promise<void>;

  save(): Promise<void>;
}

export function usePosSettings(
  companyId?: string
): UsePosSettingsResult {
  const [settings, setSettings] =
    useState<PosSettings | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const reload =
    useCallback(async () => {
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

        if (data) {
          setSettings(data);
          return;
        }

        setSettings({
          companyId,

          ...DEFAULT_POS_SETTINGS,

          createdAt: new Date(),

          updatedAt: new Date(),
        });
      } finally {
        setLoading(false);
      }
    }, [companyId]);

  useEffect(() => {
    reload();
  }, [reload]);

  async function save() {
    if (!settings) return;

    setSaving(true);

    try {
      await savePosSettingsUseCase.execute({
        ...settings,
      });

      setSettings((current) =>
        current
          ? {
              ...current,
              updatedAt: new Date(),
            }
          : current
      );
          } finally {
      setSaving(false);
    }
  }

  return {
    settings,

    loading,

    saving,

    setSettings,

    reload,

    save,
  };
}