"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Capacitor } from "@capacitor/core";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/core/workspace/WorkspaceProvider";
import {
  getWebStarterExpiresAt,
  isProPlanActive,
  isWebStarterExpired,
  toSubscriptionDate,
} from "@/modules/subscription/subscription-policy";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.ks25.mitraumkm&pcampaignid=web_share";

export default function WebFreePlanGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { workspace, loading } = useWorkspace();
  const [reachedDeadline, setReachedDeadline] = useState<number | null>(null);
  const company = workspace?.company;
  const proActive = isProPlanActive(company);
  const accessExpiresAt = proActive
    ? toSubscriptionDate(company?.planExpiresAt)
    : getWebStarterExpiresAt(company);

  useEffect(() => {
    if (Capacitor.getPlatform() === "android" || !accessExpiresAt) return;

    const deadline = accessExpiresAt.getTime();
    const timeout = window.setTimeout(
      () => setReachedDeadline(deadline),
      Math.max(0, deadline - Date.now()),
    );
    return () => window.clearTimeout(timeout);
  }, [accessExpiresAt?.getTime(), company?.id]);

  const isSubscriptionPage =
    pathname === "/dashboard/subscription" ||
    pathname.startsWith("/dashboard/subscription/");
  const shouldBlock =
    !loading &&
    Capacitor.getPlatform() !== "android" &&
    !isSubscriptionPage &&
    !proActive &&
    (reachedDeadline === accessExpiresAt?.getTime() ||
      isWebStarterExpired(company));

  if (!shouldBlock) return <>{children}</>;

  return (
    <main className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-background px-4 py-8">
      <section className="w-full max-w-xl rounded-3xl border bg-card p-6 shadow-xl sm:p-9">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Masa gratis web berakhir
        </p>
        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
          Paket gratis di web hanya 1 bulan
        </h1>
        <p className="mt-4 text-muted-foreground">
          Paket gratis di web hanya 1 bulan, jika ingin tetap menggunakan paket
          gratis maka gunakan aplikasi android atau upgrade paket anda ke pro
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button asChild className="flex-1">
            <a href={PLAY_STORE_URL} target="_blank" rel="noreferrer">
              Instal aplikasi Android
            </a>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link href="/dashboard/subscription">Upgrade ke PRO</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
