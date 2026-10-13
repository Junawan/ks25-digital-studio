"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Archive, ClipboardList, Clock3, LayoutDashboard, Package, Search, ScanLine } from "lucide-react";

const menus = [
  { title: "Dashboard", section: "overview", icon: LayoutDashboard },
  { title: "Input", section: "input", icon: ScanLine },
  { title: "Ready", section: "ready", icon: Package },
  { title: "Cari", section: "search", icon: Search },
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
    window.addEventListener("packflow:section-changed", sync);
    return () => {
      window.removeEventListener("packflow:navigate", sync);
      window.removeEventListener("packflow:section-changed", sync);
    };
  }, []);
  if (!pathname.startsWith("/packflow")) return null;

  return <nav aria-label="Navigasi PackFlow" className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
    <div className="mx-auto grid max-w-screen-lg grid-cols-7">
      {menus.map(({ title, section, icon: Icon }) => {
        const active = current === section;
        return <button key={section} type="button" onClick={() => { setCurrent(section); window.dispatchEvent(new CustomEvent("packflow:navigate", { detail: section })); }} aria-current={active ? "page" : undefined} className="flex flex-col items-center justify-center py-1.5">
          <span className={`flex h-9 w-9 items-center justify-center rounded-full ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}><Icon className="h-4 w-4"/></span>
          <span className={`mt-0.5 text-[10px] ${active ? "font-semibold text-primary" : "text-muted-foreground"}`}>{title}</span>
        </button>;
      })}
    </div>
  </nav>;
}
