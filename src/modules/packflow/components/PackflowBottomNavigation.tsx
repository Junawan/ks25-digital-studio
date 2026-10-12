"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Archive, Clock3, ClipboardList, LayoutDashboard, Package } from "lucide-react";

const menus = [
  { title: "Ringkasan", section: "overview", icon: LayoutDashboard },
  { title: "Resi aktif", section: "items", icon: Package },
  { title: "Pending", section: "pending", icon: Clock3 },
  { title: "Riwayat", section: "history", icon: Archive },
  { title: "Barang", section: "supplies", icon: ClipboardList },
];

export default function PackflowBottomNavigation() {
  const pathname = usePathname();
  const [current, setCurrent] = useState("overview");
  useEffect(() => {
    const sync = (event: Event) => setCurrent((event as CustomEvent<string>).detail);
    window.addEventListener("packflow:navigate", sync);
    return () => window.removeEventListener("packflow:navigate", sync);
  }, []);
  if (!pathname.startsWith("/packflow")) return null;

  return <nav aria-label="Navigasi PackFlow" className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
    <div className="mx-auto grid max-w-screen-lg grid-cols-5">
      {menus.map(({ title, section, icon: Icon }, index) => {
        const active = current === section;
        return <Link key={`${section}-${index}`} href="/packflow" onClick={() => { setCurrent(section); window.dispatchEvent(new CustomEvent("packflow:navigate", { detail: section })); }} aria-current={active ? "page" : undefined} className="flex flex-col items-center justify-center py-2">
          <span className={`flex h-10 w-10 items-center justify-center rounded-full ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}><Icon className="h-5 w-5"/></span>
          <span className={`mt-1 text-[10px] ${active ? "font-semibold text-primary" : "text-muted-foreground"}`}>{title}</span>
        </Link>;
      })}
    </div>
  </nav>;
}
