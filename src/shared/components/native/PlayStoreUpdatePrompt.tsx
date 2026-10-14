"use client";

import { useEffect, useState } from "react";
import { Capacitor, registerPlugin } from "@capacitor/core";
import { ArrowDownToLine, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const PlayStoreUpdate = registerPlugin<{
  check: () => Promise<{ available: boolean; versionCode: number }>;
  startImmediateUpdate: () => Promise<{ started: boolean }>;
}>("PlayStoreUpdate");

export default function PlayStoreUpdatePrompt() {
  const [versionCode, setVersionCode] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (Capacitor.getPlatform() !== "android") return;
    let active = true;
    void PlayStoreUpdate.check().then((result) => {
      if (active && result.available) setVersionCode(result.versionCode);
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (Capacitor.getPlatform() !== "android" || versionCode === null) return;
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      setBusy(false);
      void PlayStoreUpdate.check().then((result) => {
        if (!result.available) setVersionCode(null);
        else setVersionCode(result.versionCode);
      }).catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [versionCode]);

  if (versionCode === null) return null;

  return <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" role="presentation">
    <section role="dialog" aria-modal="true" aria-labelledby="app-update-title" className="w-full max-w-sm rounded-3xl border bg-card p-6 shadow-2xl">
      <button type="button" aria-label="Tutup" className="float-right rounded-full p-2 text-muted-foreground hover:bg-muted" onClick={() => setVersionCode(null)}><X className="h-4 w-4"/></button>
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><ArrowDownToLine className="h-6 w-6"/></span>
      <h2 id="app-update-title" className="mt-4 text-xl font-bold">Pembaruan KS25 tersedia</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">Versi baru sudah tersedia di Google Play. Perbarui aplikasi untuk mendapatkan fitur dan perbaikan terbaru.</p>
      <Button className="mt-5 w-full" disabled={busy} onClick={() => { setBusy(true); void PlayStoreUpdate.startImmediateUpdate().then((result) => { if (!result.started) setBusy(false); }).catch(() => setBusy(false)); }}>{busy ? "Membuka Google Play…" : "Perbarui sekarang"}</Button>
      <button type="button" className="mt-3 w-full py-2 text-sm text-muted-foreground" onClick={() => setVersionCode(null)}>Nanti</button>
    </section>
  </div>;
}
