"use client";

import { authService } from "@/core/auth";

import { Button } from "@/shared/components/ui/button";

export default function DashboardHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div>
        <h1 className="text-lg font-semibold">
          Dashboard
        </h1>
      </div>

      <Button
        variant="outline"
        onClick={async () => {
          await authService.logout();
        }}
      >
        Logout
      </Button>
    </header>
  );
}