"use client";

import {
  useEffect,
  useState,
} from "react";

import { Button } from "@/shared/components/ui/button";

import { Input } from "@/shared/components/ui/input";

import { Textarea } from "@/shared/components/ui/textarea";

import { Expense } from "../types/expense";

interface Props {

  expense?: Expense | null;

  loading?: boolean;

  onSubmit: (
    source: string,
    amount: number,
    description: string
  ) => Promise<void>;

  onCancelEdit?: () => void;
}

export default function ExpenseForm({
  expense,
  loading = false,
  onSubmit,
  onCancelEdit,
}: Props) {

  const [source, setSource] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [description, setDescription] =
    useState("");

  useEffect(() => {

    if (!expense) {

      setSource("");
      setAmount("");
      setDescription("");

      return;
    }

    setSource(
      expense.source
    );

    setAmount(
      String(expense.amount)
    );

    setDescription(
      expense.description ?? ""
    );

  }, [
    expense,
  ]);

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    const numericAmount =
      Number(amount);

    if (
      !source.trim()
    ) {
      return;
    }

    if (
      numericAmount <= 0
    ) {
      return;
    }

    await onSubmit(
      source.trim(),
      numericAmount,
      description.trim()
    );

    if (!expense) {

      setSource("");
      setAmount("");
      setDescription("");

    }
  }

  return (

    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >

      <div className="space-y-2">

        <label className="text-sm font-medium">
          Sumber Pengeluaran
        </label>

        <Input
          value={source}
          onChange={(e) =>
            setSource(
              e.target.value
            )
          }
          placeholder="Contoh: Belanja stok, listrik, transportasi"
          disabled={loading}
        />

      </div>

      <div className="space-y-2">

        <label className="text-sm font-medium">
          Nominal
        </label>

        <Input
          type="number"
          min="0"
          value={amount}
          onChange={(e) =>
            setAmount(
              e.target.value
            )
          }
          placeholder="Masukkan nominal"
          disabled={loading}
        />

      </div>

      <div className="space-y-2">

        <label className="text-sm font-medium">
          Keterangan
          <span className="ml-1 text-muted-foreground">
            (Opsional)
          </span>
        </label>

        <Textarea
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
          placeholder="Tambahkan keterangan jika diperlukan"
          disabled={loading}
        />

      </div>

      <div className="flex gap-2">

        <Button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Menyimpan..."
            : expense
              ? "Simpan Perubahan"
              : "Tambah Pengeluaran"}
        </Button>

        {expense && (
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={
              onCancelEdit
            }
          >
            Batal
          </Button>
        )}

      </div>

    </form>
  );
}