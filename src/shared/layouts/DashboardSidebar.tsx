"use client";

import Link from "next/link";

import { useWorkspace } from "@/core/workspace/WorkspaceProvider";
import { sidebarItems } from "@/core/navigation/sidebar.config";

export default function DashboardSidebar() {
  const { workspace, hasModule } = useWorkspace();
  const role = workspace?.user.role;
  const isCompanyAdmin = role === "owner" || role === "admin";

  const menus = sidebarItems.filter((item) => {
    if (!item.moduleId) {
      return true;
    }

    return hasModule(item.moduleId);
  });

  return (
    <aside className="w-64 border-r bg-background">
      <div className="border-b p-6">
        <h2 className="text-xl font-bold">
          {workspace?.company.name ?? "KS25 Digital Studio"}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Web gratis 14 hari · Android gratis
        </p>
      </div>

      <nav className="space-y-1 p-3">
        {menus.map((menu) => (
          <Link
            key={menu.href}
            href={menu.href}
            className="block rounded-md px-3 py-2 transition-colors hover:bg-muted"
          >
            {menu.title}
          </Link>
        ))}
        <div className="my-3 border-t" />
        {isCompanyAdmin && <Link href="/dashboard/subscription" className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted">Admin pengguna · Langganan</Link>}
        {workspace?.user.isSystemAdmin && <Link href="/dashboard/admin/subscriptions" className="block rounded-md px-3 py-2 text-sm font-medium text-violet-700 transition-colors hover:bg-violet-50">Admin developer</Link>}
      </nav>
    </aside>
  );
}
