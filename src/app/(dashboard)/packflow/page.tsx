"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Archive, Check, ClipboardList, Clock3, LayoutDashboard, Package, Plus, Search, ScanLine, Trash2 } from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { useWorkspace } from "@/core/workspace/WorkspaceProvider";
import { useCurrentUser } from "@/modules/user/use-current-user";
import { packflowRepository } from "@/modules/packflow/packflow.repository";
import type { PackflowHistoryRecord, PackflowRecord, SupplyRequest } from "@/modules/packflow/packflow.types";
import { BarcodeService } from "@/modules/pos/shared/barcode/services/BarcodeService";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";

type Section = "overview" | "input" | "ready" | "search" | "pending" | "history" | "supplies";
type ScanSection = Extract<Section, "input" | "ready" | "search" | "pending">;
type SearchResult =
  | { kind: "active"; barcode: string; timestamp: string; id: string }
  | { kind: "history"; barcode: string; date: string; time: string; id: string }
  | { kind: "not-found"; barcode: string };
type DuplicateWarning =
  | { kind: "active"; barcode: string; id: string; timestamp: string }
  | { kind: "history"; barcode: string; id: string; date: string; time: string };

const webMenu: { id: Section; title: string; icon: typeof Package }[] = [
  { id: "overview", title: "Ringkasan", icon: LayoutDashboard },
  { id: "input", title: "Input", icon: ScanLine },
  { id: "ready", title: "Ready", icon: Check },
  { id: "search", title: "Cari", icon: Search },
  { id: "pending", title: "Pending", icon: Clock3 },
  { id: "supplies", title: "Permintaan barang", icon: ClipboardList },
];

function Panel({ children }: { children: React.ReactNode }) {
  return <section className="rounded-2xl border bg-card p-5 shadow-sm">{children}</section>;
}

function StatusPill({ children }: { children: string }) {
  const color = children === "ready"
    ? "bg-emerald-100 text-emerald-800"
    : children === "diproses"
      ? "bg-amber-100 text-amber-800"
      : "bg-muted text-muted-foreground";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${color}`}>{children}</span>;
}

function isScanSection(section: Section): section is ScanSection {
  return section === "input" || section === "ready" || section === "search" || section === "pending";
}

export default function PackflowPage() {
  const { workspace, loading: workspaceLoading } = useWorkspace();
  const user = useCurrentUser();
  const company = workspace?.company;
  const [section, setSection] = useState<Section>("overview");
  const [items, setItems] = useState<PackflowRecord[]>([]);
  const [pending, setPending] = useState<PackflowRecord[]>([]);
  const [history, setHistory] = useState<PackflowHistoryRecord[]>([]);
  const [requests, setRequests] = useState<SupplyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [scannerValue, setScannerValue] = useState("");
  const [scannerMessage, setScannerMessage] = useState("");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<DuplicateWarning | null>(null);
  const [highlightActiveId, setHighlightActiveId] = useState<string | null>(null);
  const [highlightHistoryId, setHighlightHistoryId] = useState<string | null>(null);
  const [historyDate, setHistoryDate] = useState("");
  const [supplyName, setSupplyName] = useState("");
  const [notice, setNotice] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionHandlerRef = useRef<(section: Section) => void>(() => {});

  const refresh = useCallback(async () => {
    if (!company?.id) return;
    setLoading(true);
    try {
      const [nextItems, nextPending, nextHistory, nextRequests] = await Promise.all([
        packflowRepository.items(company.id),
        packflowRepository.pending(company.id),
        packflowRepository.history(company.id),
        packflowRepository.requests(company.id),
      ]);
      setItems(nextItems);
      setPending(nextPending);
      setHistory(nextHistory);
      setRequests(nextRequests);
    } catch (error) {
      console.error(error);
      setNotice("Data belum dapat dimuat. Periksa koneksi dan akses akun Anda.");
    } finally {
      setLoading(false);
    }
  }, [company?.id]);

  useEffect(() => { void refresh(); }, [refresh]);

  const filteredHistory = useMemo(
    () => history.filter((record) => !historyDate || record.date === historyDate),
    [history, historyDate],
  );

  async function perform(action: () => Promise<unknown>, message: string) {
    setBusy(true);
    setNotice("");
    try {
      await action();
      await refresh();
      setNotice(message);
    } catch (error) {
      console.error(error);
      setNotice("Perubahan gagal disimpan. Silakan coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  async function processBarcode(rawValue: string, target: ScanSection) {
    const barcode = rawValue.trim();
    if (!barcode || !company?.id) return;
    setScannerValue(barcode);
    setScannerMessage("");
    setNotice("");

    if (target === "input") {
      const activeDuplicate = items.find((item) => item.barcode.toLowerCase() === barcode.toLowerCase());
      if (activeDuplicate) {
        setHighlightActiveId(activeDuplicate.id);
        setDuplicateWarning({ kind: "active", barcode: activeDuplicate.barcode, id: activeDuplicate.id, timestamp: activeDuplicate.timestamp });
        setScannerMessage("");
        return;
      }
      const packedDuplicate = history.find((item) => item.barcode.toLowerCase() === barcode.toLowerCase());
      if (packedDuplicate) {
        setDuplicateWarning({ kind: "history", barcode: packedDuplicate.barcode, id: packedDuplicate.id, date: packedDuplicate.date, time: packedDuplicate.time });
        setScannerMessage("");
        return;
      }
      await perform(() => packflowRepository.addItem(company.id, barcode), "Resi masuk ke daftar aktif.");
      setScannerMessage("Resi berhasil disimpan ke resi aktif.");
      return;
    }

    if (target === "pending") {
      if (pending.some((item) => item.barcode.toLowerCase() === barcode.toLowerCase())) {
        setScannerMessage("Resi ini sudah ada di daftar pending.");
        return;
      }
      await perform(() => packflowRepository.addPending(company.id, barcode), "Resi ditambahkan ke daftar pending.");
      setScannerMessage("Resi belum terkemas dan sudah dicatat di pending.");
      return;
    }

    if (target === "ready") {
      const activeItem = items.find((item) => item.barcode.toLowerCase() === barcode.toLowerCase());
      if (!activeItem) {
        setScannerMessage("Resi tidak ditemukan di daftar aktif. Paket tidak dipindahkan.");
        return;
      }
      await perform(() => packflowRepository.processItem(company.id, activeItem), "Resi dipindahkan ke riwayat.");
      setScannerMessage("Paket selesai dikemas dan dipindahkan ke riwayat.");
      return;
    }

    const activeItem = items.find((item) => item.barcode.toLowerCase() === barcode.toLowerCase());
    if (activeItem) {
      setSearchResult({ kind: "active", barcode: activeItem.barcode, timestamp: activeItem.timestamp, id: activeItem.id });
      setSection("search");
      return;
    }
    const historyItem = history.find((item) => item.barcode.toLowerCase() === barcode.toLowerCase());
    if (historyItem) {
      setSearchResult({ kind: "history", barcode: historyItem.barcode, date: historyItem.date, time: historyItem.time, id: historyItem.id });
      setSection("search");
      return;
    }
    setSearchResult({ kind: "not-found", barcode });
  }

  async function scanWithNativeCamera(target: ScanSection) {
    setCameraError("");
    setCameraOpen(false);
    try {
      const result = await new BarcodeService().scan({ mode: "single", vibrate: true });
      if (result) await processBarcode(result.text, target);
      else setScannerMessage("Pemindaian dibatalkan.");
    } catch (error) {
      console.error(error);
      setCameraError(error instanceof Error ? error.message : "Kamera tidak dapat dibuka.");
    }
  }

  function openScanner(target: ScanSection) {
    setScannerMessage("");
    setCameraError("");
    if (Capacitor.isNativePlatform()) void scanWithNativeCamera(target);
    else setCameraOpen(true);
  }

  function selectSection(next: Section) {
    setSection(next);
    setNotice("");
    setScannerMessage("");
    setCameraError("");
    if (next !== "search") setSearchResult(null);
    if (isScanSection(next)) {
      openScanner(next);
    } else {
      setCameraOpen(false);
    }
  }

  sectionHandlerRef.current = selectSection;
  useEffect(() => {
    const handleNavigation = (event: Event) => {
      const requested = (event as CustomEvent<Section>).detail;
      if (webMenu.some((item) => item.id === requested) || requested === "history") {
        sectionHandlerRef.current(requested);
      }
    };
    window.addEventListener("packflow:navigate", handleNavigation);
    return () => window.removeEventListener("packflow:navigate", handleNavigation);
  }, []);

  useEffect(() => {
    const scanSection = isScanSection(section) ? section : null;
    if (!cameraOpen || Capacitor.isNativePlatform() || !scanSection) return;
    let cancelled = false;
    let stopScanner: (() => void) | undefined;

    async function startBrowserCamera() {
      try {
        const { BrowserMultiFormatReader } = await import("@zxing/browser");
        if (cancelled || !videoRef.current) return;
        const reader = new BrowserMultiFormatReader();
        const controls = await reader.decodeFromVideoDevice(undefined, videoRef.current, (result) => {
          if (!result || cancelled) return;
          cancelled = true;
          controlsStop();
          setCameraOpen(false);
          void processBarcode(result.getText(), scanSection!);
        });
        stopScanner = () => controls.stop();
        if (cancelled) controls.stop();
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setCameraError(error instanceof Error ? error.message : "Kamera tidak dapat dibuka.");
          setCameraOpen(false);
        }
      }
    }

    function controlsStop() { stopScanner?.(); }
    void startBrowserCamera();
    return () => {
      cancelled = true;
      stopScanner?.();
    };
  }, [cameraOpen, section]);

  useEffect(() => {
    if (!searchResult || searchResult.kind === "not-found") return;
    requestAnimationFrame(() => document.getElementById("packflow-search-hit")?.scrollIntoView({ behavior: "smooth", block: "center" }));
  }, [searchResult]);

  useEffect(() => {
    if (!highlightHistoryId) return;
    requestAnimationFrame(() => document.getElementById(`packflow-history-${highlightHistoryId}`)?.scrollIntoView({ behavior: "smooth", block: "center" }));
  }, [highlightHistoryId, section]);

  function submitScanner(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isScanSection(section)) void processBarcode(scannerValue, section);
  }

  async function submitSupply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!company?.id || !supplyName.trim()) return;
    await perform(() => packflowRepository.addRequest({
      companyId: company.id,
      itemName: supplyName.trim(),
      requester: user?.fullName ?? "Pengguna",
      date: new Date().toLocaleDateString("sv-SE"),
      status: "menunggu",
    }), "Permintaan barang terkirim.");
    setSupplyName("");
  }

  if (workspaceLoading || loading) {
    return <div className="space-y-5"><div className="h-8 w-52 animate-pulse rounded bg-muted"/><div className="h-14 animate-pulse rounded-xl bg-muted"/><div className="h-64 animate-pulse rounded-2xl bg-muted"/></div>;
  }
  if (!company) return <p>Workspace tidak ditemukan.</p>;

  const openItems = pending.length + items.length;
  const scanTitles: Record<ScanSection, string> = {
    input: "Input resi aktif",
    ready: "Paket siap / selesai dikemas",
    search: "Cari nomor resi",
    pending: "Resi pending",
  };

  return <div className="mx-auto max-w-[1500px] space-y-5 pb-3">
    <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div><p className="text-sm font-medium text-primary">{company.name}</p><h1 className="mt-1 text-3xl font-bold tracking-tight">KS25 PackFlow</h1><p className="mt-1 text-muted-foreground">Kelola resi masuk, paket siap, pencarian, dan kebutuhan operasional.</p></div>
      <Button variant="outline" onClick={() => void refresh()}>Muat ulang</Button>
    </header>

    <nav aria-label="Menu PackFlow" className="hidden overflow-x-auto pb-1 md:block">
      <div className="flex min-w-max gap-2 rounded-xl border bg-card p-2">
        {webMenu.map(({ id, title, icon: Icon }) => <button key={id} type="button" onClick={() => selectSection(id)} className={`inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors ${section === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}><Icon className="h-4 w-4"/>{title}</button>)}
      </div>
    </nav>

    {notice && <div role="status" className="rounded-lg border bg-muted/60 px-4 py-3 text-sm">{notice}</div>}

    {section === "overview" && <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          { label: "Resi aktif", value: items.length, Icon: Package },
          { label: "Menunggu diproses", value: pending.length, Icon: Clock3 },
          { label: "Permintaan berjalan", value: requests.filter((request) => request.status !== "ready").length, Icon: ClipboardList },
        ].map(({ label, value, Icon }) => <Panel key={label}><div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">{label}</p><Icon className="h-4 w-4 text-primary"/></div><p className="mt-3 text-3xl font-bold">{value}</p></Panel>)}
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <Panel>
          <h2 className="font-semibold">Alur cepat</h2>
          <p className="mt-1 text-sm text-muted-foreground">Pilih Input untuk mencatat resi atau Pending untuk paket yang belum berhasil dikemas.</p>
          <div className="mt-4 flex flex-wrap gap-2"><Button onClick={() => selectSection("input")}><ScanLine className="mr-2 h-4 w-4"/>Input resi</Button><Button variant="outline" onClick={() => selectSection("pending")}>Pending ({pending.length})</Button><Button variant="outline" onClick={() => selectSection("ready")}>Pindahkan ke riwayat</Button></div>
        </Panel>
        <Panel>
          <div className="flex items-start justify-between gap-3"><div><h2 className="font-semibold">Resi sedang diproses</h2><p className="mt-1 text-sm text-muted-foreground">Resi yang diinput akan tampil di sini sampai discan di Ready.</p></div><Button size="sm" onClick={() => selectSection("input")}><ScanLine className="mr-2 h-4 w-4"/>Input resi</Button></div>
          <div className="mt-3 max-h-96 divide-y overflow-y-auto">{items.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 py-3"><span className="font-medium">{item.barcode}</span><span className="text-xs text-muted-foreground">Diinput {item.timestamp}</span></div>)}{items.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">Belum ada resi aktif. Tekan Input resi untuk mulai scan.</p>}</div>
        </Panel>
      </div>
      <p className="text-xs text-muted-foreground">Total resi aktif dan pending: {openItems}</p>
    </div>}

    {isScanSection(section) && <div className="space-y-5">
      <Panel>
        <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-semibold">{scanTitles[section]}</h2><p className="mt-1 text-sm text-muted-foreground">{section === "input" ? "Scan resi untuk langsung menyimpannya ke daftar aktif." : section === "ready" ? "Scan paket yang selesai dikemas untuk memindahkannya ke riwayat." : section === "search" ? "Scan resi untuk mengetahui apakah masih aktif atau sudah masuk riwayat." : "Scan resi yang belum berhasil dikemas untuk menambahkannya ke daftar pending."}</p></div><div className="flex flex-wrap gap-2">{(section === "input" || section === "ready") && <Button variant="outline" onClick={() => openScanner(section)}><ScanLine className="mr-2 h-4 w-4"/>Buka pemindai</Button>}{section === "input" && <Button variant="outline" onClick={() => selectSection("pending")}>Lihat pending ({pending.length})</Button>}</div></div>
        <form onSubmit={submitScanner} className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Input autoFocus value={scannerValue} onChange={(event) => setScannerValue(event.target.value)} placeholder="Arahkan scanner USB/Bluetooth atau ketik nomor resi" aria-label="Nomor resi"/>
          <Button type="submit" disabled={busy || !scannerValue.trim()}>{section === "input" ? <><Plus className="mr-2 h-4 w-4"/>Simpan</> : section === "ready" ? <><Check className="mr-2 h-4 w-4"/>Tandai ready</> : section === "search" ? <><Search className="mr-2 h-4 w-4"/>Cari</> : <><Clock3 className="mr-2 h-4 w-4"/>Masukkan pending</>}</Button>
          {section !== "input" && section !== "ready" && <Button type="button" variant="outline" onClick={() => openScanner(section)}><ScanLine className="mr-2 h-4 w-4"/>Buka pemindai</Button>}
        </form>
        {scannerMessage && <p role="status" className="mt-3 text-sm font-medium text-primary">{scannerMessage}</p>}
        {cameraError && <p role="alert" className="mt-3 text-sm text-destructive">{cameraError}</p>}
        {cameraOpen && !Capacitor.isNativePlatform() && <div className="mt-4 overflow-hidden rounded-xl border bg-black"><video ref={videoRef} autoPlay muted playsInline className="max-h-[55vh] w-full object-contain"/><p className="p-3 text-center text-sm text-white">Arahkan kamera ke barcode resi.</p><Button className="m-3 mt-0" variant="secondary" onClick={() => setCameraOpen(false)}>Tutup kamera</Button></div>}
      </Panel>

      {section === "input" && <Panel><div className="flex items-center justify-between gap-3"><div><h3 className="font-semibold">Resi aktif</h3><p className="text-sm text-muted-foreground">{items.length} paket menunggu proses.</p></div><Button variant="outline" size="sm" onClick={() => selectSection("ready")}>Scan paket ready</Button></div><div className="mt-4 divide-y">{items.map((item) => <div id={`packflow-active-${item.id}`} key={item.id} className={`flex items-center justify-between gap-3 py-3 ${highlightActiveId === item.id ? "rounded-lg bg-yellow-100 px-3 ring-2 ring-yellow-400" : ""}`}><div><p className="font-medium">{item.barcode}</p><p className="text-xs text-muted-foreground">Masuk {item.timestamp}</p></div><Button size="sm" variant="ghost" onClick={() => perform(() => packflowRepository.removeItem(item.id), "Resi dihapus dari daftar aktif.")}><Trash2 className="mr-2 h-4 w-4"/>Hapus</Button></div>)}{items.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">Belum ada resi aktif.</p>}</div></Panel>}

      {section === "ready" && <Panel><h3 className="font-semibold">Paket yang dapat diselesaikan</h3><p className="mt-1 text-sm text-muted-foreground">Scan salah satu resi aktif untuk memindahkannya ke riwayat.</p><div className="mt-4 divide-y">{items.slice(0, 8).map((item) => <div key={item.id} className="flex items-center justify-between gap-3 py-3"><div><p className="font-medium">{item.barcode}</p><p className="text-xs text-muted-foreground">Masuk {item.timestamp}</p></div><Button size="sm" disabled={busy} onClick={() => company.id && perform(() => packflowRepository.processItem(company.id, item), "Resi dipindahkan ke riwayat.")}><Check className="mr-2 h-4 w-4"/>Selesai</Button></div>)}{items.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">Tidak ada resi aktif untuk diproses.</p>}</div></Panel>}

      {section === "search" && <Panel><h3 className="font-semibold">Hasil pencarian</h3>{!searchResult && <p className="mt-2 text-sm text-muted-foreground">Hasil scan akan menunjukkan lokasi resi di sini.</p>}{searchResult?.kind === "not-found" && <p className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">Resi <strong>{searchResult.barcode}</strong> tidak ditemukan di resi aktif maupun riwayat.</p>}{searchResult?.kind === "active" && <div id="packflow-search-hit" className="mt-3 rounded-xl border-2 border-yellow-400 bg-yellow-100 p-4 text-yellow-950 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wide">Posisi: Resi aktif</p><p className="mt-1 text-xl font-bold">{searchResult.barcode}</p><p className="mt-1 text-sm">Masuk {searchResult.timestamp}</p></div>}{searchResult?.kind === "history" && <div id="packflow-search-hit" className="mt-3 rounded-xl border-2 border-yellow-400 bg-yellow-100 p-4 text-yellow-950 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wide">Posisi: Riwayat</p><p className="mt-1 text-xl font-bold">{searchResult.barcode}</p><p className="mt-1 text-sm">Selesai {searchResult.date} · {searchResult.time}</p></div>}</Panel>}

      {section === "pending" && <Panel><div><h3 className="font-semibold">Daftar pending</h3><p className="text-sm text-muted-foreground">{pending.length} resi belum berhasil dikemas.</p></div><div className="mt-4 divide-y">{pending.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 py-3"><div><p className="font-medium">{item.barcode}</p><p className="text-xs text-muted-foreground">Dicatat {item.timestamp}</p></div><Button size="sm" variant="outline" onClick={() => perform(() => packflowRepository.removePending(item.id), "Resi dihapus dari pending.")}><Trash2 className="mr-2 h-4 w-4"/>Hapus</Button></div>)}{pending.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">Belum ada resi pending.</p>}</div></Panel>}
    </div>}

    {section === "history" && <Panel>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="text-lg font-semibold">Riwayat resi</h2><p className="text-sm text-muted-foreground">Filter tanggal untuk melihat paket yang selesai diproses.</p></div><div className="flex items-center gap-2"><Input aria-label="Filter tanggal riwayat" type="date" value={historyDate} onChange={(event) => setHistoryDate(event.target.value)} className="w-auto"/>{historyDate && <Button variant="ghost" size="sm" onClick={() => setHistoryDate("")}>Hapus filter</Button>}</div></div>
      <div className="mt-4 divide-y">{filteredHistory.map((entry) => <div id={`packflow-history-${entry.id}`} key={entry.id} className={`flex justify-between gap-3 py-3 ${highlightHistoryId === entry.id ? "rounded-lg bg-yellow-100 px-3 ring-2 ring-yellow-400" : ""}`}><div><p className="font-medium">{entry.barcode}</p><p className="text-xs text-muted-foreground">{entry.date}</p></div><span className="text-sm text-muted-foreground">{entry.time}</span></div>)}{filteredHistory.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">{historyDate ? "Tidak ada resi pada tanggal tersebut." : "Belum ada riwayat."}</p>}</div>
    </Panel>}

    {section === "supplies" && <div className="space-y-5"><Panel><h2 className="font-semibold">Buat permintaan barang</h2><form onSubmit={submitSupply} className="mt-3 flex flex-col gap-2 sm:flex-row"><Input value={supplyName} onChange={(event) => setSupplyName(event.target.value)} placeholder="Nama barang yang dibutuhkan"/><Button disabled={busy || !supplyName.trim()}>Kirim permintaan</Button></form></Panel><Panel><h2 className="font-semibold">Daftar permintaan</h2><div className="mt-3 divide-y">{requests.map((entry) => <div key={entry.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><div><p className="font-medium">{entry.itemName}</p><p className="text-xs text-muted-foreground">{entry.requester} · {entry.date}</p></div><div className="flex items-center gap-2"><StatusPill>{entry.status}</StatusPill>{entry.status === "menunggu" && <Button size="sm" variant="outline" onClick={() => perform(() => packflowRepository.updateRequestStatus(entry.id, "diproses"), "Status diperbarui.")}>Proses</Button>}{entry.status === "diproses" && <Button size="sm" onClick={() => perform(() => packflowRepository.updateRequestStatus(entry.id, "ready"), "Barang ditandai siap.")}>Tandai siap</Button>}{entry.status === "ready" && <Button size="icon-sm" variant="ghost" aria-label="Hapus permintaan" onClick={() => perform(() => packflowRepository.removeRequest(entry.id), "Permintaan dihapus.")}><Trash2 className="h-4 w-4"/></Button>}</div></div>)}{requests.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">Belum ada permintaan barang.</p>}</div></Panel></div>}
    {duplicateWarning && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" role="presentation"><section role="alertdialog" aria-modal="true" aria-labelledby="packflow-duplicate-title" className="w-full max-w-md rounded-2xl border bg-card p-5 shadow-xl"><h2 id="packflow-duplicate-title" className="text-lg font-semibold">{duplicateWarning.kind === "active" ? "Resi sudah ada, sedang diproses kemas" : "Resi sudah dikemas"}</h2><p className="mt-2 text-sm text-muted-foreground">Nomor resi <strong className="text-foreground">{duplicateWarning.barcode}</strong> tidak ditambahkan lagi.</p><div className="mt-3 rounded-lg border-2 border-yellow-400 bg-yellow-100 p-3 text-sm text-yellow-950"><p className="font-semibold">Posisi: {duplicateWarning.kind === "active" ? "Resi aktif" : "Riwayat"}</p><p className="mt-1">{duplicateWarning.kind === "active" ? `Diinput ${duplicateWarning.timestamp}` : `Selesai ${duplicateWarning.date} · ${duplicateWarning.time}`}</p></div><div className="mt-5 flex justify-end gap-2"><Button variant="outline" onClick={() => setDuplicateWarning(null)}>Tutup</Button><Button onClick={() => { if (duplicateWarning.kind === "history") { setHistoryDate(""); setHighlightHistoryId(duplicateWarning.id); selectSection("history"); } else { selectSection("input"); requestAnimationFrame(() => document.getElementById(`packflow-active-${duplicateWarning.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" })); } setDuplicateWarning(null); }}>Tampilkan posisi</Button></div></section></div>}
  </div>;
}
