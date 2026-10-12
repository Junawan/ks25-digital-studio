"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { useWorkspace } from "@/core/workspace/WorkspaceProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { verifyEmployeePin, registerEmployeeProfile } from "./employee-profile.repository";
import type { EmployeeProfile } from "./employee-profile.types";

interface EmployeeIdentityContextValue {
  employee: EmployeeProfile | null;
  isReady: boolean;
  switchEmployee: () => void;
}

const EmployeeIdentityContext = createContext<EmployeeIdentityContextValue>({
  employee: null,
  isReady: false,
  switchEmployee: () => {},
});

function EmployeeIdentityGate({
  companyId,
  companyName,
  activate,
}: {
  companyId: string;
  companyName: string;
  activate: (profile: EmployeeProfile) => void;
}) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [nik, setNik] = useState("");
  const [fullName, setFullName] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      if (mode === "login") {
        const employee = await verifyEmployeePin(companyId, nik, pin);
        if (!employee) {
          setMessage("NIK atau PIN tidak sesuai. Periksa kembali atau daftarkan karyawan baru.");
          return;
        }
        activate(employee);
        return;
      }

      if (pin !== confirmPin) {
        setMessage("Konfirmasi PIN belum sama.");
        return;
      }
      const employee = await registerEmployeeProfile(companyId, { fullName, nik, pin });
      activate(employee);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Identitas karyawan gagal diproses.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <section className="w-full max-w-md space-y-5 rounded-2xl border bg-card p-6 shadow-lg">
        <header>
          <p className="text-sm font-medium text-primary">{companyName}</p>
          <h1 className="mt-1 text-2xl font-bold">{mode === "login" ? "Identitas karyawan" : "Daftarkan karyawan"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "login"
              ? "Masukkan NIK dan PIN untuk menggunakan akun perusahaan sebagai karyawan."
              : "Nama dan NIK disimpan untuk perusahaan ini. Gunakan PIN 6 angka."}
          </p>
        </header>

        <form onSubmit={submit} className="space-y-4">
          {mode === "register" && (
            <label className="block space-y-1.5 text-sm font-medium">
              <span>Nama karyawan</span>
              <Input autoComplete="name" autoCapitalize="characters" value={fullName} onChange={(event) => setFullName(event.target.value.toLocaleUpperCase("id-ID"))} placeholder="NAMA LENGKAP" required />
            </label>
          )}
          <label className="block space-y-1.5 text-sm font-medium">
            <span>NIK karyawan</span>
            <Input autoComplete="off" autoCapitalize="characters" value={nik} onChange={(event) => setNik(event.target.value.toLocaleUpperCase("id-ID"))} placeholder="MASUKKAN NIK" required />
          </label>
          <label className="block space-y-1.5 text-sm font-medium">
            <span>PIN karyawan</span>
            <Input type="password" inputMode="numeric" autoComplete="off" pattern="[0-9]{6}" maxLength={6} value={pin} onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="6 angka" required />
          </label>
          {mode === "register" && (
            <label className="block space-y-1.5 text-sm font-medium">
              <span>Ulangi PIN</span>
              <Input type="password" inputMode="numeric" autoComplete="off" pattern="[0-9]{6}" maxLength={6} value={confirmPin} onChange={(event) => setConfirmPin(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="Ulangi 6 angka PIN" required />
            </label>
          )}
          {message && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{message}</p>}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Memproses..." : mode === "login" ? "Lanjutkan" : "Daftarkan dan lanjutkan"}
          </Button>
        </form>

        <div className="border-t pt-4 text-center text-sm">
          {mode === "login" ? (
            <button type="button" className="font-medium text-primary hover:underline" onClick={() => { setMode("register"); setMessage(""); }}>
              Karyawan baru atau belum memiliki PIN?
            </button>
          ) : (
            <button type="button" className="font-medium text-primary hover:underline" onClick={() => { setMode("login"); setMessage(""); }}>
              Kembali ke masuk karyawan
            </button>
          )}
        </div>
      </section>
    </main>
  );
}

export function EmployeeIdentityProvider({ children }: { children: ReactNode }) {
  const { workspace, loading: workspaceLoading } = useWorkspace();
  const [employee, setEmployee] = useState<EmployeeProfile | null>(null);
  const [isReady, setIsReady] = useState(false);
  const companyId = workspace?.company.id;
  const userId = workspace?.user.userId;
  const sessionKey = companyId && userId ? `ks25:active-employee:${companyId}:${userId}` : null;

  useEffect(() => {
    if (workspaceLoading) return;
    if (!sessionKey) {
      setEmployee(null);
      setIsReady(true);
      return;
    }
    try {
      const value = window.sessionStorage.getItem(sessionKey);
      setEmployee(value ? JSON.parse(value) as EmployeeProfile : null);
    } catch (error) {
      console.error("Employee session could not be loaded:", error);
      setEmployee(null);
    }
    setIsReady(true);
  }, [sessionKey, workspaceLoading]);

  const activate = useCallback((profile: EmployeeProfile) => {
    if (!sessionKey) return;
    window.sessionStorage.setItem(sessionKey, JSON.stringify(profile));
    setEmployee(profile);
  }, [sessionKey]);

  const switchEmployee = useCallback(() => {
    if (sessionKey) window.sessionStorage.removeItem(sessionKey);
    setEmployee(null);
  }, [sessionKey]);

  const value = useMemo(() => ({ employee, isReady, switchEmployee }), [employee, isReady, switchEmployee]);

  if (!isReady || workspaceLoading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Memeriksa sesi karyawan...</div>;
  }

  if (!workspace || workspace.user.isSystemAdmin) {
    return <EmployeeIdentityContext.Provider value={value}>{children}</EmployeeIdentityContext.Provider>;
  }

  return (
    <EmployeeIdentityContext.Provider value={value}>
      {employee
        ? children
        : <EmployeeIdentityGate companyId={workspace.company.id} companyName={workspace.company.name} activate={activate} />}
    </EmployeeIdentityContext.Provider>
  );
}

export function useActiveEmployee() {
  return useContext(EmployeeIdentityContext);
}
