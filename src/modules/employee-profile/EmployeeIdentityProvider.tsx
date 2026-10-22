"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useWorkspace } from "@/core/workspace/WorkspaceProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { listEmployeeProfiles, verifyEmployeePin, registerEmployeeProfile, updateEmployeeProfile } from "./employee-profile.repository";
import type { EmployeeProfile } from "./employee-profile.types";

interface EmployeeIdentityContextValue {
  employee: EmployeeProfile | null;
  isReady: boolean;
  switchEmployee: () => void;
  openEmployeeManager: () => void;
}
const EmployeeIdentityContext = createContext<EmployeeIdentityContextValue>({ employee: null, isReady: false, switchEmployee: () => {}, openEmployeeManager: () => {} });

function EmployeeManager({ companyId, companyName, current, activate, close }: { companyId: string; companyName: string; current: EmployeeProfile | null; activate: (profile: EmployeeProfile) => void; close: () => void }) {
  const [mode, setMode] = useState<"select" | "add" | "edit">("select");
  const [people, setPeople] = useState<EmployeeProfile[]>([]);
  const [editing, setEditing] = useState<EmployeeProfile | null>(null);
  const [type, setType] = useState<"owner" | "employee">("employee");
  const [nik, setNik] = useState(""); const [fullName, setFullName] = useState(""); const [hireDate, setHireDate] = useState("");
  const [pin, setPin] = useState(""); const [confirmPin, setConfirmPin] = useState(""); const [busy, setBusy] = useState(false); const [message, setMessage] = useState("");
  const refresh = useCallback(() => listEmployeeProfiles(companyId).then(setPeople).catch(() => setMessage("Data profil belum dapat dimuat.")), [companyId]);
  useEffect(() => { void refresh(); }, [refresh]);
  const existingOwnerDate = people.find((person) => person.type === "owner" && person.hireDate)?.hireDate ?? "";
  function edit(person: EmployeeProfile) { setEditing(person); setType(person.type ?? "employee"); setNik(person.nik); setFullName(person.fullName); setHireDate((person.type ?? "employee") === "owner" ? person.hireDate || existingOwnerDate : person.hireDate ?? ""); setPin(""); setConfirmPin(""); setMode("edit"); }
  function add() { setEditing(null); setType("employee"); setNik(""); setFullName(""); setHireDate(""); setPin(""); setConfirmPin(""); setMode("add"); }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      if (mode === "select") { const profile = await verifyEmployeePin(companyId, nik, pin); if (!profile) { setMessage("NIK atau PIN tidak sesuai."); return; } activate(profile); close(); return; }
      if (!editing && pin !== confirmPin) { setMessage("Konfirmasi PIN belum sama."); return; }
      if (editing && editing.nik.toLocaleUpperCase("id-ID") !== nik.trim().toLocaleUpperCase("id-ID")) throw new Error("NIK tidak dapat diubah karena terhubung dengan riwayat absensi.");
      const profileHireDate = type === "owner" && (editing?.type !== "owner" || !editing)
        ? existingOwnerDate || hireDate
        : type === "owner" && existingOwnerDate
          ? existingOwnerDate
          : hireDate;
      const profile = editing
        ? await updateEmployeeProfile(companyId, { fullName, nik, hireDate: profileHireDate, type, ...(pin ? { pin } : {}) })
        : await registerEmployeeProfile(companyId, { fullName, nik, hireDate: profileHireDate, type, pin });
      await refresh(); setMessage(mode === "edit" ? "Profil diperbarui." : "Profil ditambahkan.");
      if (!editing) { activate(profile); close(); }
      else { if (current?.nik === profile.nik) activate(profile); setMode("select"); }
    } catch (error) { setMessage(error instanceof Error ? error.message : "Profil gagal disimpan."); }
    finally { setBusy(false); }
  }
  const title = mode === "select" ? "Pilih pekerja" : mode === "edit" ? "Edit pekerja" : "Tambah pekerja";
  return <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-4" role="dialog" aria-modal="true" aria-label={title}><section className="my-auto w-full max-w-lg space-y-4 rounded-2xl border bg-card p-5 shadow-xl"><header><p className="text-sm text-primary">{companyName}</p><h2 className="text-xl font-bold">{title}</h2></header>
    <div className="grid grid-cols-2 gap-2"><Button type="button" variant={mode === "select" ? "default" : "outline"} onClick={() => { setMode("select"); setMessage(""); }}>Pilih pekerja</Button><Button type="button" variant={mode !== "select" ? "default" : "outline"} onClick={add}>Tambah pekerja</Button></div>
    {mode === "select" && <><div className="space-y-2">{people.map((person) => <div key={person.nik} className="flex items-center gap-2 rounded-lg border p-3"><button type="button" className="min-w-0 flex-1 text-left" onClick={() => edit(person)}><span className="block truncate font-medium">{person.fullName}</span><span className="text-xs text-muted-foreground">NIK {person.nik} · {person.type === "owner" ? "Pemilik" : "Karyawan"}</span></button><Button size="sm" variant="outline" onClick={() => edit(person)}>Edit</Button></div>)}{!people.length && <p className="text-sm text-muted-foreground">Belum ada profil pekerja.</p>}</div><form onSubmit={(e) => void submit(e)} className="space-y-3"><label className="block text-sm">NIK<Input value={nik} onChange={(e) => setNik(e.target.value.toLocaleUpperCase("id-ID"))} required/></label><label className="block text-sm">PIN<Input type="password" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))} required/></label><Button className="w-full" disabled={busy}>Pilih pekerja</Button></form></>}
    {(mode === "add" || mode === "edit") && <form onSubmit={(e) => void submit(e)} className="space-y-3"><div className="grid grid-cols-2 gap-2"><Button type="button" variant={type === "owner" ? "default" : "outline"} onClick={() => { setType("owner"); if (existingOwnerDate && editing?.type !== "owner") setHireDate(existingOwnerDate); }}>Pemilik</Button><Button type="button" variant={type === "employee" ? "default" : "outline"} onClick={() => setType("employee")}>Karyawan</Button></div><label className="block text-sm">Nama {type === "owner" ? "pemilik" : "karyawan"}<Input value={fullName} onChange={(e) => setFullName(e.target.value.toLocaleUpperCase("id-ID"))} required/></label><label className="block text-sm">NIK<Input value={nik} onChange={(e) => setNik(e.target.value.toLocaleUpperCase("id-ID"))} required readOnly={Boolean(editing)}/></label><label className="block text-sm">{type === "owner" ? "Tanggal berdiri usaha" : "Tanggal mulai bekerja"}<Input type="date" value={hireDate} onChange={(e) => setHireDate(e.target.value)} required disabled={type === "owner" && Boolean(existingOwnerDate) && editing?.type !== "owner"}/>{type === "owner" && existingOwnerDate && editing?.type !== "owner" && <span className="mt-1 block text-xs font-normal text-muted-foreground">Mengikuti tanggal berdiri dari profil pemilik yang sudah terdaftar.</span>}</label><label className="block text-sm">{editing ? "Ubah PIN (opsional)" : "Buat PIN"}<Input type="password" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="6 angka" required={!editing}/></label>{(!editing || pin) && <label className="block text-sm">Ulangi PIN<Input type="password" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={confirmPin} onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 6))} required/></label>}<Button className="w-full" disabled={busy}>{busy ? "Menyimpan…" : editing ? "Simpan perubahan" : "Tambah pekerja"}</Button></form>}
    {message && <p role="status" className="rounded-lg bg-muted p-3 text-sm">{message}</p>}<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => { if (mode !== "select") setMode("select"); else close(); }}>Tutup</Button>{current && mode === "select" && <span className="self-center text-xs text-muted-foreground">Aktif: {current.fullName}</span>}</div>
  </section></div>;
}

export function EmployeeIdentityProvider({ children }: { children: ReactNode }) {
  const { workspace, loading } = useWorkspace(); const pathname = usePathname();
  const [employee, setEmployee] = useState<EmployeeProfile | null>(null); const [isReady, setReady] = useState(false); const [managerOpen, setManagerOpen] = useState(false);
  const companyId = workspace?.company.id; const userId = workspace?.user.userId; const sessionKey = companyId && userId ? `ks25:active-employee:${companyId}:${userId}` : null;
  useEffect(() => { if (loading) return; if (!sessionKey) { setEmployee(null); setReady(true); return; } try { const value = localStorage.getItem(sessionKey) ?? sessionStorage.getItem(sessionKey); setEmployee(value ? JSON.parse(value) as EmployeeProfile : null); } catch { setEmployee(null); } setReady(true); }, [sessionKey, loading]);
  useEffect(() => { if (isReady && pathname === "/attendance" && !employee) setManagerOpen(true); }, [isReady, pathname, employee]);
  const activate = useCallback((profile: EmployeeProfile) => { if (sessionKey) localStorage.setItem(sessionKey, JSON.stringify(profile)); setEmployee(profile); }, [sessionKey]);
  const switchEmployee = useCallback(() => { setEmployee(null); setManagerOpen(true); }, []);
  const value = useMemo(() => ({ employee, isReady, switchEmployee, openEmployeeManager: () => setManagerOpen(true) }), [employee, isReady, switchEmployee]);
  return <EmployeeIdentityContext.Provider value={value}>{children}{managerOpen && workspace && <EmployeeManager companyId={workspace.company.id} companyName={workspace.company.name} current={employee} activate={activate} close={() => setManagerOpen(false)}/>}</EmployeeIdentityContext.Provider>;
}
export function useActiveEmployee() { return useContext(EmployeeIdentityContext); }
