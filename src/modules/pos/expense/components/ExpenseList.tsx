"use client";

import { Expense } from "../types/expense";

import ExpenseItem
from "./ExpenseItem";

interface Props {

  expenses: Expense[];

  loading: boolean;

  onEdit: (
    expense: Expense
  ) => void;

  onDelete: (
    expense: Expense
  ) => void;
}

export default function ExpenseList({
  expenses,
  loading,
  onEdit,
  onDelete,
}: Props) {

  if (loading) {

    return (

      <p className="py-8 text-center text-sm text-muted-foreground">
        Memuat data pengeluaran...
      </p>

    );
  }

  if (
    expenses.length === 0
  ) {

    return (

      <p className="py-8 text-center text-sm text-muted-foreground">
        Belum ada data pengeluaran pada bulan ini.
      </p>

    );
  }

  return (

    <div>

      {expenses.map(
        (expense) => (

          <ExpenseItem
            key={
              expense.expenseId
            }
            expense={
              expense
            }
            onEdit={
              onEdit
            }
            onDelete={
              onDelete
            }
          />

        )
      )}

    </div>
  );
}