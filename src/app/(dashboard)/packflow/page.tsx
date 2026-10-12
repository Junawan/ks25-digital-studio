"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Archive, Check, ClipboardList, Clock3, Package, Plus, Search, Trash2, Truck } from "lucide-react";
import { useWorkspace } from "@/core/workspace/WorkspaceProvider";
import { Capacitor } from "@capacitor/core";
import { useCurrentUser } from "@/modules/user/use-current-user";
import { packflowRepository } from "@/modules/packflow/packflow.repository";
import type { PackflowHistoryRecord, PackflowRecord, SupplyRequest } from "@/modules/packflow/packflow.types";
import { BarcodeService } from "@/modules/pos/shared/barcode/services/BarcodeService";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";

type Section = "overview" | "items" | "pending" | "history" | "supplies";
type ScanMode = "add" | "delete" | "search";
const menu: { id: Section; label: string; icon: typeof Package }[] = [
  { id: "overview", label: "Ringkasan", icon: Truck }, { id: "items", label: "Resi aktif", icon: Package },
  { id: "pending", label: "Pending", icon: Clock3 }, { id: "history", label: "Riwayat", icon: Archive },
  { id: "supplies", label: "Permintaan barang", icon: ClipboardList },
];

function Panel({ children }: { children: React.ReactNode }) { return <section className="rounded-2xl border bg-card p-5 shadow-sm">{children}</section>; }
function StatusPill({ children }: { children: string }) {
  const color = children === "ready" ? "bg-emerald-100 text-emerald-800" : children === "diproses" ? "bg-amber-100 text-amber-800" : "bg-muted text-muted-foreground";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${color}`}>{children}</span>;
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
  const [barcode, setBarcode] = useState("");
  const [scanMode, setScanMode] = useState<ScanMode>("add");
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [requestName, setRequestName] = useState("");
  const [notice, setNotice] = useState("");

  const refresh = useCallback(async () => {
    if (!company?.id) return;
    setLoading(true);
    try {
      const [nextItems, nextPending, nextHistory, nextRequests] = await Promise.all([
        packflowRepository.items(company.id), packflowRepository.pending(company.id), packflowRepository.history(company.id),
        packflowRepository.requests(company.id),
      ]);
      setItems(nextItems); setPending(nextPending); setHistory(nextHistory); setRequests(nextRequests);
    } catch (error) { console.error(error); setNotice("Data belum dapat dimuat. Periksa koneksi dan akses akun Anda."); }
    finally { setLoading(false); }
  }, [company?.id]);

  useEffect(() => { void refresh(); }, [refresh]);
  const filteredItems = useMemo(() => items.filter((item) => item.barcode.toLowerCase().includes(query.trim().toLowerCase())), [items, query]);
  const filteredPending = useMemo(() => pending.filter((item) => item.barcode.toLowerCase().includes(query.trim().toLowerCase())), [pending, query]);

  async function perform(action: () => Promise<unknown>, message: string) {
    setBusy(true); setNotice("");
    try { await action(); await refresh(); setNotice(message); }
    catch (error) { console.error(error); setNotice("Perubahan gagal disimpan. Silakan coba lagi."); }
    finally { setBusy(false); }
  }
  async function addBarcode(event: FormEvent<HTMLFormElement>, target: "items" | "pending") {
    event.preventDefault(); const value = barcode.trim();
    if (!value || !company?.id) return;
    const list = target === "items" ? items : pending;
    if (scanMode === "search") { setQuery(value); setNotice(list.some((item) => item.barcode.toLowerCase() === value.toLowerCase()) ? "Resi ditemukan." : "Resi tidak ditemukan."); setBarcode(""); return; }
    const match = list.find((item) => item.barcode.toLowerCase() === value.toLowerCase());
    if (scanMode === "delete") {
      if (!match) { setNotice("Resi tidak ditemukan."); return; }
      if (target === "items") await perform(() => packflowRepository.removeItem(match.id), "Resi dihapus.");
      else await perform(() => packflowRepository.processPending(company.id, match), "Resi selesai diproses dan masuk riwayat.");
      setBarcode(""); return;
    }
    if (list.some((item) => item.barcode.toLowerCase() === value.toLowerCase())) { setNotice("Nomor resi sudah ada di daftar ini."); return; }
    await perform(() => target === "items" ? packflowRepository.addItem(company.id, value) : packflowRepository.addPending(company.id, value), "Resi berhasil ditambahkan.");
    setBarcode("");
  }
  async function scanBarcode(target: "items" | "pending") {
    if (!Capacitor.isNativePlatform()) { setNotice("Gunakan scanner barcode USB/Bluetooth atau masukkan nomor resi di kolom."); return; }
    try {
      const result = await new BarcodeService().scan({ mode: "single", vibrate: true });
      if (!result) return;
      const list = target === "items" ? items : pending;
      const match = list.find((item) => item.barcode.toLowerCase() === result.text.toLowerCase());
      if (scanMode === "search") { setQuery(result.text); setNotice(match ? "Resi ditemukan." : "Resi tidak ditemukan."); return; }
      if (scanMode === "delete") {
        if (!match) { setNotice("Resi tidak ditemukan."); return; }
        if (target === "items") await perform(() => packflowRepository.removeItem(match.id), "Resi dihapus.");
        else if (company?.id) await perform(() => packflowRepository.processPending(company.id, match), "Resi selesai diproses dan masuk riwayat.");
        return;
      }
      const duplicate = Boolean(match);
      if (duplicate) { setNotice("Nomor resi sudah ada di daftar ini."); return; }
      if (!company?.id) return;
      await perform(() => target === "items" ? packflowRepository.addItem(company.id, result.text) : packflowRepository.addPending(company.id, result.text), "Resi berhasil dipindai dan ditambahkan.");
    } catch (error) { console.error(error); setNotice(error instanceof Error ? error.message : "Pemindaian gagal."); }
  }
  async function submitSupply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!company?.id || !requestName.trim()) return;
    await perform(() => packflowRepository.addRequest({ companyId: company.id, itemName: requestName.trim(), requester: user?.fullName ?? "Pengguna", date: new Date().toLocaleDateString("sv-SE"), status: "menunggu" }), "Permintaan barang terkirim."); setRequestName("");
  }
  if (workspaceLoading || loading) return <div className="space-y-5"><div className="h-8 w-52 animate-pulse rounded bg-muted"/><div className="h-14 animate-pulse rounded-xl bg-muted"/><div className="h-64 animate-pulse rounded-2xl bg-muted"/></div>;
  if (!company) return <p>Workspace tidak ditemukan.</p>;
  const openItems = pending.length + items.length;

  return <div className="mx-auto max-w-[1500px] space-y-6">
    <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-sm font-medium text-primary">{company.name}</p><h1 className="mt-1 text-3xl font-bold tracking-tight">KS25 PackFlow</h1><p className="mt-1 text-muted-foreground">Kelola pemindaian resi, alur packing, dan kebutuhan operasional.</p></div><Button variant="outline" onClick={() => void refresh()}>Muat ulang</Button></header>
    <nav aria-label="Menu PackFlow" className="-mx-1 overflow-x-auto px-1 pb-1"><div className="flex min-w-max gap-2 rounded-xl border bg-card p-2">{menu.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => { setSection(id); window.dispatchEvent(new CustomEvent("packflow:navigate", { detail: id })); setNotice(""); }} className={`inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium ${section === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}><Icon className="h-4 w-4"/>{label}</button>)}</div></nav>
    {notice && <div role="status" className="rounded-lg border bg-muted/60 px-4 py-3 text-sm">{notice}</div>}
    {section === "overview" && (
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[
            { label: "Resi aktif", value: items.length, Icon: Package },
            { label: "Menunggu diproses", value: pending.length, Icon: Clock3 },
            { label: "Permintaan berjalan", value: requests.filter((request) => request.status !== "ready").length, Icon: ClipboardList },
          ].map(({ label, value, Icon }) => (
            <Panel key={label}>
              <div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">{label}</p><Icon className="h-4 w-4 text-primary"/></div>
              <p className="mt-3 text-3xl font-bold">{value}</p>
            </Panel>
          ))}
        </div>
        <div className="grid gap-5 xl:grid-cols-2">
          <Panel>
            <h2 className="font-semibold">Alur resi</h2>
            <p className="mt-1 text-sm text-muted-foreground">Pindai atau masukkan kode resi untuk mencatat paket baru.</p>
            <form onSubmit={(event) => addBarcode(event, "items")} className="mt-4 flex gap-2"><Input value={barcode} onChange={(event) => setBarcode(event.target.value)} placeholder="Pindai atau masukkan nomor resi"/><Button disabled={busy || !barcode.trim()}><Plus className="mr-2 h-4 w-4"/>Tambah</Button></form>
            <div className="mt-4 flex flex-wrap gap-2"><Button variant="outline" onClick={() => setSection("items")}>Lihat resi aktif</Button><Button variant="outline" onClick={() => setSection("pending")}>Lihat pending</Button></div>
          </Panel>
          <Panel>
            <h2 className="font-semibold">Aktivitas terbaru</h2>
            <div className="mt-3 space-y-3">{history.slice(0, 4).map((entry) => <div key={entry.id} className="flex justify-between border-b pb-2 text-sm"><span className="font-medium">{entry.barcode}</span><span className="text-muted-foreground">{entry.date} · {entry.time}</span></div>)}{history.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Belum ada resi yang selesai diproses.</p>}</div>
          </Panel>
        </div>
        <p className="text-xs text-muted-foreground">Total resi aktif dan pending: {openItems}</p>
      </div>
    )}
    {(section === "items" || section === "pending") && <Panel><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="text-lg font-semibold">{section === "items" ? "Resi aktif" : "Resi pending"}</h2><p className="text-sm text-muted-foreground">{section === "items" ? "Simpan dan cari resi yang sedang ditangani." : "Resi yang menunggu proses packing."}</p></div><div className="relative sm:w-64"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nomor resi" className="pl-9"/></div></div><div className="mt-4 flex flex-wrap gap-2">{([{ id: "add", label: "Tambah" }, { id: "delete", label: section === "items" ? "Hapus" : "Selesaikan" }, { id: "search", label: "Cari" }] as const).map((mode) => <Button key={mode.id} type="button" size="sm" variant={scanMode === mode.id ? "default" : "outline"} onClick={() => setScanMode(mode.id)}>{mode.label}</Button>)}</div><div className="mt-3 flex gap-2"><form onSubmit={(event) => addBarcode(event, section)} className="flex min-w-0 flex-1 gap-2"><Input value={barcode} onChange={(event) => setBarcode(event.target.value)} placeholder="Scanner USB/Bluetooth atau ketik nomor resi"/><Button disabled={busy || !barcode.trim()}>{scanMode === "add" && <Plus className="mr-2 h-4 w-4"/>}{scanMode === "delete" && <Trash2 className="mr-2 h-4 w-4"/>}{scanMode === "search" && <Search className="mr-2 h-4 w-4"/>}{scanMode === "add" ? "Tambah" : scanMode === "delete" ? (section === "items" ? "Hapus" : "Selesaikan") : "Cari"}</Button></form><Button type="button" variant="outline" onClick={() => scanBarcode(section)}>Scan kamera</Button></div><div className="mt-5 divide-y">{(section === "items" ? filteredItems : filteredPending).map((item, index) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><div><p className="font-medium">{item.barcode}</p><p className="text-xs text-muted-foreground">#{index + 1} · {item.timestamp}</p></div>{section === "items" ? <Button variant="ghost" size="sm" onClick={() => perform(() => packflowRepository.removeItem(item.id), "Resi dihapus.")}><Trash2 className="mr-2 h-4 w-4"/>Hapus</Button> : <Button size="sm" disabled={busy} onClick={() => company.id && perform(() => packflowRepository.processPending(company.id, item), "Resi selesai diproses dan masuk riwayat.")}><Check className="mr-2 h-4 w-4"/>Selesai diproses</Button>}</div>)}{(section === "items" ? filteredItems : filteredPending).length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">Daftar masih kosong.</p>}</div></Panel>}
    {section === "history" && <Panel><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="text-lg font-semibold">Riwayat resi</h2><p className="text-sm text-muted-foreground">Resi yang telah selesai, dikelompokkan menurut tanggal.</p></div><div className="relative sm:w-64"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><Input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Cari riwayat" className="pl-9"/></div></div><div className="mt-4 divide-y">{history.filter((item) => item.barcode.toLowerCase().includes(searchTerm.toLowerCase()) || item.date.includes(searchTerm)).map((entry) => <div key={entry.id} className="flex justify-between py-3"><span className="font-medium">{entry.barcode}</span><span className="text-sm text-muted-foreground">{entry.date} · {entry.time}</span></div>)}{history.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">Belum ada riwayat.</p>}</div></Panel>}
    {section === "supplies" && <div className="space-y-5"><Panel><h2 className="font-semibold">Buat permintaan barang</h2><form onSubmit={submitSupply} className="mt-3 flex gap-2"><Input value={requestName} onChange={(event) => setRequestName(event.target.value)} placeholder="Nama barang yang dibutuhkan"/><Button disabled={busy || !requestName.trim()}>Kirim permintaan</Button></form></Panel><Panel><h2 className="font-semibold">Daftar permintaan</h2><div className="mt-3 divide-y">{requests.map((entry) => <div key={entry.id} className="flex flex-wrap items-center justify-between gap-3 py-3"><div><p className="font-medium">{entry.itemName}</p><p className="text-xs text-muted-foreground">{entry.requester} · {entry.date}</p></div><div className="flex items-center gap-2"><StatusPill>{entry.status}</StatusPill>{entry.status === "menunggu" && <Button size="sm" variant="outline" onClick={() => perform(() => packflowRepository.updateRequestStatus(entry.id, "diproses"), "Status diperbarui.")}>Proses</Button>}{entry.status === "diproses" && <Button size="sm" onClick={() => perform(() => packflowRepository.updateRequestStatus(entry.id, "ready"), "Barang ditandai siap.")}>Tandai siap</Button>}{entry.status === "ready" && <Button size="icon-sm" variant="ghost" aria-label="Hapus permintaan" onClick={() => perform(() => packflowRepository.removeRequest(entry.id), "Permintaan dihapus.")}><Trash2 className="h-4 w-4"/></Button>}</div></div>)}{requests.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">Belum ada permintaan barang.</p>}</div></Panel></div>}
  </div>;
}

