"use client";

import { useState } from "react";

import { Button } from "@/shared/components/ui/button";

import { useModules } from "@/modules/module/use-modules";
import { useWorkspace } from "@/core/workspace/WorkspaceProvider";
import { useRouter } from "next/navigation";
import { useAndroidBack } from "@/hooks/useAndroidBack";

export default function MarketplacePage() {
  const {
    modules,
    loading,
    install,
  } = useModules();

  const {
    hasModule,
    refresh,
  } = useWorkspace();

  const [installing, setInstalling] =
    useState<string | null>(null);

  const handleInstall = async (
    moduleId: string
  ) => {
    try {
      setInstalling(moduleId);

      await install(moduleId);

      // Reload workspace supaya Sidebar,
      // Marketplace dan My Apps ikut berubah.
      await refresh();
    } finally {
      setInstalling(null);
    }
  };

  const router = useRouter();

  useAndroidBack(() => {
      router.back();
      return true;
    });

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Marketplace
        </h1>

        <p className="text-muted-foreground">
          Pilih modul yang ingin digunakan.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => {
          const installed =
            hasModule(module.moduleId);

          const isInstalling =
            installing === module.moduleId;

          return (
            <div
              key={module.moduleId}
              className="rounded-lg border bg-background p-6"
            >
              <h2 className="font-semibold">
                {module.name}
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                {module.description}
              </p>

              <Button
                className="mt-6 w-full"
                disabled={
                  installed ||
                  isInstalling
                }
                onClick={() =>
                  handleInstall(module.moduleId)
                }
              >
                {installed
                  ? "Sudah Terpasang"
                  : isInstalling
                  ? "Menginstall..."
                  : "Install"}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}