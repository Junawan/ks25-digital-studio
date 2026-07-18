"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useWorkspace } from "@/core/workspace/WorkspaceProvider";

import {
  DEFAULT_POS_SETTINGS,
  PosSettings,
} from "../types/PosSettings";

import {
  getPosSettingsUseCase,
  savePosSettingsUseCase,
} from "../di";

interface PosSettingsContextValue {
  settings: PosSettings | null;

  loading: boolean;

  saving: boolean;

  dirty: boolean;

  update(
    updater: (
      current: PosSettings
    ) => PosSettings
  ): void;

  save(): Promise<void>;
}

const PosSettingsContext =
  createContext<PosSettingsContextValue | null>(
    null
  );

export function PosSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { workspace } = useWorkspace();

  const companyId = workspace?.company.id;

  const [settings, setSettings] =
    useState<PosSettings | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [dirty, setDirty] =
    useState(false);

  useEffect(() => {
    async function load() {
      if (!companyId) return;

      setLoading(true);

      try {
        const data =
          await getPosSettingsUseCase.execute(
            companyId
          );

        setSettings(
          data ?? {
            ...DEFAULT_POS_SETTINGS,
            companyId,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [companyId]);

  function update(
    updater: (
      current: PosSettings
    ) => PosSettings
  ) {
    setSettings((prev) => {
      if (!prev) return prev;

      return updater(prev);
    });

    setDirty(true);
  }

  async function save() {
    if (!settings) return;

    setSaving(true);

    try {
      await savePosSettingsUseCase.execute({
        ...settings,
        updatedAt: new Date(),
      });

      setDirty(false);
    } finally {
      setSaving(false);
    }
  }

  const value = useMemo(
    () => ({
      settings,
      loading,
      saving,
      dirty,
      update,
      save,
    }),
    [
      settings,
      loading,
      saving,
      dirty,
    ]
  );

  return (
    <PosSettingsContext.Provider
      value={value}
    >
      {children}
    </PosSettingsContext.Provider>
  );
}

export function usePosSettings() {
  const context =
    useContext(PosSettingsContext);

  if (!context) {
    throw new Error(
      "usePosSettings must be used inside PosSettingsProvider"
    );
  }

  return context;
}