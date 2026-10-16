"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Capacitor } from "@capacitor/core";
import { useAuth } from "@/core/providers/AuthProvider";
import { useWorkspace } from "@/core/workspace/WorkspaceProvider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  ANDROID_UPGRADE_PROMPT_KEY,
  isProPlanActive,
} from "@/modules/subscription/subscription-policy";

function localDayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export default function AndroidUpgradePrompt() {
  const router = useRouter();
  const { user } = useAuth();
  const { workspace, loading } = useWorkspace();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (
      Capacitor.getPlatform() !== "android" ||
      !user ||
      !workspace ||
      loading ||
      isProPlanActive(workspace.company)
    ) {
      return;
    }

    const key = `${ANDROID_UPGRADE_PROMPT_KEY}:${user.uid}`;
    const today = localDayKey();
    if (window.localStorage.getItem(key) === today) return;

    window.localStorage.setItem(key, today);
    setOpen(true);
  }, [loading, user, workspace]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Upgrade ke PRO</DialogTitle>
          <DialogDescription>
            Upgrade ke pro untuk menikmati tanpa iklan hanya Rp20.000/bulan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col-reverse sm:flex-row">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Tutup
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              router.push("/dashboard/subscription");
            }}
          >
            Upgrade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
