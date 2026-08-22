"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

import {
  DebtFormInput,
  debtSchema,
} from "../validation/debtSchema";

interface Props {
  loading?: boolean;

  onSubmit: (
    data: DebtFormInput
  ) => Promise<void>;
}

export default function DebtForm({
  loading = false,
  onSubmit,
}: Props) {
  const [submitting, setSubmitting] =
    useState(false);

  const form =
    useForm<DebtFormInput>({
      resolver:
        zodResolver(debtSchema),

      defaultValues: {
        name: "",
        amount: undefined,
        type: "kasbon",
        note: "",
        date: new Date(),
      },
    });

  async function handleSubmit(
    data: DebtFormInput
  ) {
    try {
      setSubmitting(true);

      await onSubmit({
        ...data,
        note:
          data.note?.trim() || undefined,
      });

      form.reset({
        name: "",
        amount: undefined,
        type: "kasbon",
        note: "",
        date: new Date(),
      });
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    form.reset({
      name: "",
      amount: undefined,
      type: "kasbon",
      note: "",
      date: new Date(),
    });
  }

  const disabled =
    loading || submitting;

  return (
    <form
      onSubmit={form.handleSubmit(
        handleSubmit
      )}
      className="space-y-4"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">
            Tambah Hutang Baru
          </h2>

          <p className="text-sm text-muted-foreground">
            Isi data lalu klik Simpan
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Nama
        </label>

        <Input
          placeholder="Nama pelanggan / karyawan"
          disabled={disabled}
          {...form.register("name")}
        />

        {form.formState.errors.name && (
          <p className="text-sm text-destructive">
            {
              form.formState.errors
                .name.message
            }
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Nominal Hutang (Rp)
        </label>

        <Input
          type="number"
          placeholder="Contoh: 150000"
          disabled={disabled}
          {...form.register(
            "amount",
            {
              valueAsNumber: true,
            }
          )}
        />

        {form.formState.errors.amount && (
          <p className="text-sm text-destructive">
            {
              form.formState.errors
                .amount.message
            }
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Jenis
        </label>

        <select
          disabled={disabled}
          {...form.register("type")}
          className="
            flex
            h-10
            w-full
            rounded-md
            border
            border-input
            bg-background
            px-3
            py-2
            text-sm
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <option value="kasbon">
            Kasbon
          </option>

          <option value="payment_shortage">
            Kekurangan Pembayaran
          </option>

          <option value="other">
            Lainnya
          </option>
        </select>

        {form.formState.errors.type && (
          <p className="text-sm text-destructive">
            {
              form.formState.errors
                .type.message
            }
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Catatan
          <span className="ml-1 text-muted-foreground">
            (opsional)
          </span>
        </label>

        <textarea
          placeholder="Contoh: kasbon barang, cicilan, dll"
          disabled={disabled}
          {...form.register("note")}
          className="
            min-h-28
            w-full
            rounded-md
            border
            border-input
            bg-background
            px-3
            py-2
            text-sm
            outline-none
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Tanggal
        </label>

        <Input
          type="date"
          disabled={disabled}
          value={
            form.watch("date")
              ?.toISOString()
              .slice(0, 10) ?? ""
          }
          onChange={(event) => {
            form.setValue(
              "date",
              new Date(
                `${event.target.value}T00:00:00`
              )
            );
          }}
        />

        {form.formState.errors.date && (
          <p className="text-sm text-destructive">
            {
              form.formState.errors
                .date.message
            }
          </p>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          type="submit"
          disabled={disabled}
        >
          {submitting
            ? "Menyimpan..."
            : "Simpan"}
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={handleReset}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}