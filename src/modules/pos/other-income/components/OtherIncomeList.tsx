"use client";

import {
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";

import { Card } from "@/shared/components/ui/card";

import { formatCurrency } from "@/shared/utils/currency";

import { OtherIncome } from "../types/otherIncome";

interface Props {
  incomes: OtherIncome[];

  onEdit: (
    income: OtherIncome
  ) => void;

  onDelete: (
    income: OtherIncome
  ) => void;

  deletingId?: string | null;
}

export default function OtherIncomeList({
  incomes,
  onEdit,
  onDelete,
  deletingId,
}: Props) {
  if (incomes.length === 0) {
    return (
      <Card>
        <div className="flex min-h-32 items-center justify-center p-6">
          <p className="text-sm text-muted-foreground">
            Belum ada pemasukan pada bulan ini.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">

      {incomes.map(
        (income) => (
          <Card
            key={income.incomeId}
          >
            <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">

              <div className="min-w-0">

                <div className="font-semibold">
                  {income.source}
                </div>

                <div className="mt-1 text-sm text-muted-foreground">
                  {formatDate(
                    income.date
                  )}
                </div>

                {income.description && (
                  <div className="mt-1 text-sm text-muted-foreground">
                    {income.description}
                  </div>
                )}

              </div>

              <div className="flex flex-col items-start gap-3 md:items-end">

                <div className="text-lg font-bold">
                  {formatCurrency(
                    income.amount
                  )}
                </div>

                <div className="flex gap-2">

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      onEdit(
                        income
                      )
                    }
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>

                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={
                      deletingId ===
                      income.incomeId
                    }
                    onClick={() =>
                      onDelete(
                        income
                      )
                    }
                  >
                    <Trash2 className="mr-2 h-4 w-4" />

                    {deletingId ===
                    income.incomeId
                      ? "Menghapus..."
                      : "Hapus"}
                  </Button>

                </div>

              </div>

            </div>
          </Card>
        )
      )}

    </div>
  );
}

function formatDate(
  value: Date
) {
  return new Intl.DateTimeFormat(
    "id-ID",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  ).format(value);
}