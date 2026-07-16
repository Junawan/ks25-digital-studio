"use client";

import { useState } from "react";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

import { useCashiers } from "../hooks/useCashiers";

interface Props {
    open: boolean;

    onOpenChange: (
        open: boolean
    ) => void;

    companyId: string;

    onCreated?: (
        cashierId: string
    ) => void;
}

export function CashierDialog({
  open,
  onOpenChange,
  companyId,
  onCreated,
}: Props) {
  const {
    create,
  } = useCashiers({
    companyId,
  });

  const [loading, setLoading] =
    useState(false);

  const [name, setName] =
    useState("");

  async function handleSave() {
  const value = name.trim();

  if (!value) {
    return;
  }

  setLoading(true);

  try {
    const cashier =
      await create(value);

    onCreated?.(
      cashier.cashierId
    );

    setName("");

    onOpenChange(false);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}

  return (
    <Dialog
    open={open}
    onOpenChange={
        onOpenChange
    }
>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Tambah Kasir
          </DialogTitle>

          <DialogDescription>
            Masukkan nama kasir
            yang akan digunakan
            pada transaksi.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="name">
            Nama Kasir
          </Label>

          <Input
            id="name"
            autoFocus
            value={name}
            placeholder="Contoh: Jujun"
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            onKeyDown={(
              e
            ) => {
              if (
                e.key ===
                "Enter"
              ) {
                void handleSave();
              }
            }}
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
  setName("");
  onOpenChange(false);
}}
          >
            Batal
          </Button>

          <Button
            type="button"
            disabled={
              loading ||
              !name.trim()
            }
            onClick={
              handleSave
            }
          >
            {loading
              ? "Menyimpan..."
              : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}