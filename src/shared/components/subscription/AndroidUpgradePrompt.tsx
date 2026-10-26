"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  isProPlanActive,
} from "@/modules/subscription/subscription-policy";

export default function AndroidUpgradePrompt() {
  const router = useRouter();
  const { user } = useAuth();
  const { workspace, loading } = useWorkspace();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (
      !user ||
      !workspace ||
      loading ||
      workspace.company.plan !== "starter" ||
      isProPlanActive(workspace.company)
    ) {
      return;
    }

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
