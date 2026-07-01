"use client";

import Link from "next/link";

import { useWorkspace } from "@/core/workspace/WorkspaceProvider";
import { sidebarItems } from "@/core/navigation/sidebar.config";

export default function DashboardSidebar() {
  const { workspace, hasModule } = useWorkspace();

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
          {workspace?.subscription?.plan ?? "Free"}
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
      </nav>
    </aside>
  );
}