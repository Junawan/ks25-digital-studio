"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Search, UsersRound } from "lucide-react";
import { db } from "@/core/firebase";
import { useWorkspace } from "@/core/workspace/WorkspaceProvider";
import { Input } from "@/shared/components/ui/input";
import LoadingSkeleton from "@/modules/pos/shared/components/skeletons/LoadingSkeleton";

interface CustomerRecord { customerId: string; name: string; phone: string; }

export default function CustomerPage() {
  const { workspace, loading: workspaceLoading } = useWorkspace();
  const companyId = workspace?.company.id;
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!companyId) return;
    let active = true;
    getDocs(query(collection(db, "pos_customers"), where("companyId", "==", companyId)))
      .then((snapshot) => { if (active) setCustomers(snapshot.docs.map((item) => item.data() as CustomerRecord).sort((a, b) => a.name.localeCompare(b.name, "id"))); })
      .catch(() => { if (active) setError("Gagal memuat data pelanggan."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [companyId, workspaceLoading]);

  const filtered = useMemo(() => {
    const q = search.trim().toLocaleLowerCase("id-ID");
    return customers.filter((item) => !q || item.name.toLocaleLowerCase("id-ID").includes(q) || item.phone.includes(q));
  }, [customers, search]);

  if (workspaceLoading || (companyId && loading)) return <LoadingSkeleton />;
  return <div className="mx-auto max-w-[1200px] space-y-5">
    <header><p className="text-sm font-medium text-primary">POS Kasir</p><h1 className="mt-1 text-3xl font-bold">Pelanggan</h1><p className="mt-1 text-muted-foreground">Pelanggan tersimpan dari transaksi yang sudah dibayar.</p></header>
    <section className="space-y-4 rounded-xl border bg-card p-4 shadow-sm md:p-6">
      <div className="relative max-w-lg"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari nama atau no. HP..." className="pl-9" /></div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      {!filtered.length ? <div className="rounded-lg border border-dashed py-12 text-center"><UsersRound className="mx-auto h-8 w-8 text-muted-foreground" /><p className="mt-3 font-medium">Belum ada pelanggan</p><p className="mt-1 text-sm text-muted-foreground">Nama dan nomor HP akan muncul setelah transaksi pelanggan dibayar.</p></div> : <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b text-left text-muted-foreground"><th className="px-3 py-3">Nama</th><th className="px-3 py-3">No. HP</th></tr></thead><tbody>{filtered.map((customer) => <tr key={customer.customerId} className="border-b last:border-0"><td className="px-3 py-4 font-medium">{customer.name}</td><td className="px-3 py-4">{customer.phone}</td></tr>)}</tbody></table></div>}
    </section>
  </div>;
}
