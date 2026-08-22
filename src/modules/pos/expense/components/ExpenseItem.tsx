"use client";

import {
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";

import { Expense } from "../types/expense";

import { formatCurrency }
from "@/shared/utils/currency";

interface Props {

  expense: Expense;

  onEdit: (
    expense: Expense
  ) => void;

  onDelete: (
    expense: Expense
  ) => void;
}

export default function ExpenseItem({
  expense,
  onEdit,
  onDelete,
}: Props) {

  return (

    <div className="flex items-start justify-between gap-4 border-b py-4 last:border-b-0">

      <div className="min-w-0 space-y-1">

        <p className="font-medium">
          {expense.source}
        </p>

        {expense.description && (
          <p className="text-sm text-muted-foreground">
            {expense.description}
          </p>
        )}

        <p className="text-xs text-muted-foreground">

          {expense.createdAt
            .toLocaleDateString(
              "id-ID",
              {
                day: "2-digit",
                month: "long",
                year: "numeric",
              }
            )}

        </p>

      </div>

      <div className="flex shrink-0 items-center gap-2">

        <p className="font-semibold">
          {formatCurrency(
            expense.amount
          )}
        </p>

        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={() =>
            onEdit(expense)
          }
        >
          <Pencil className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          size="icon"
          variant="destructive"
          onClick={() =>
            onDelete(expense)
          }
        >
          <Trash2 className="h-4 w-4" />
        </Button>

      </div>

    </div>
  );
}