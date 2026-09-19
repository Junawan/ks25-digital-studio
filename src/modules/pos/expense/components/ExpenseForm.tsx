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

  onSubmit: (input: {
    source: string;
    amount: number;
    description: string;
    date: Date;
  }) => Promise<void>;

  onCancelEdit?: () => void;
}

function getDateInputValue(date: Date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function ExpenseForm({
  expense,
  loading = false,
  onSubmit,
  onCancelEdit,
}: Props) {
  const [
    source,
    setSource,
  ] = useState("");

  const [
    amount,
    setAmount,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    date,
    setDate,
  ] = useState(
    getDateInputValue(
      new Date()
    )
  );

  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!expense) {
      setSource("");
      setAmount("");
      setDescription("");

      setDate(
        getDateInputValue(
          new Date()
        )
      );

      setError(null);

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

    setDate(
      getDateInputValue(
        new Date(expense.date)
      )
    );

    setError(null);
  }, [expense]);

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    setError(null);

    if (!source.trim()) {
      setError(
        "Sumber pengeluaran wajib diisi."
      );

      return;
    }

    const numericAmount =
      Number(amount);

    if (
      !Number.isFinite(
        numericAmount
      ) ||
      numericAmount <= 0
    ) {
      setError(
        "Nominal pengeluaran harus lebih dari 0."
      );

      return;
    }

    if (!date) {
      setError(
        "Tanggal wajib diisi."
      );

      return;
    }

    const [
      year,
      month,
      day,
    ] = date.split("-");

    const selectedDate =
      new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
      );

    await onSubmit({
      source:
        source.trim(),

      amount:
        numericAmount,

      description:
        description.trim(),

      date:
        selectedDate,
    });

    if (!expense) {
      setSource("");
      setAmount("");
      setDescription("");

      setDate(
        getDateInputValue(
          new Date()
        )
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div className="grid gap-4 md:grid-cols-3">

        {/* SUMBER */}

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Sumber Pengeluaran
          </label>

          <Input
            value={source}
            onChange={(event) =>
              setSource(
                event.target.value
              )
            }
            placeholder="Contoh: Belanja stok, listrik, transportasi"
            disabled={loading}
          />
        </div>

        {/* NOMINAL */}

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Nominal
          </label>

          <Input
            type="number"
            min="0"
            value={amount}
            onChange={(event) =>
              setAmount(
                event.target.value
              )
            }
            placeholder="0"
            disabled={loading}
          />
        </div>

        {/* TANGGAL */}

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Tanggal
          </label>

          <Input
            type="date"
            value={date}
            onChange={(event) =>
              setDate(
                event.target.value
              )
            }
            disabled={loading}
          />
        </div>

      </div>

      {/* KETERANGAN */}

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Keterangan
          <span className="ml-1 text-muted-foreground">
            (Opsional)
          </span>
        </label>

        <Textarea
          value={description}
          onChange={(event) =>
            setDescription(
              event.target.value
            )
          }
          placeholder="Tambahkan keterangan jika diperlukan"
          disabled={loading}
        />
      </div>

      {/* ERROR */}

      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}

      {/* BUTTON */}

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