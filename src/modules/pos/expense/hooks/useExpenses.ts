"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { Expense } from "../types/expense";

import { expenseDI } from "../di/expense";

interface UseExpensesParams {
  companyId: string;

  year: number;

  month: number;
}

export function useExpenses({
  companyId,
  year,
  month,
}: UseExpensesParams) {

  const [expenses, setExpenses] =
    useState<Expense[]>([]);

  const [loading, setLoading] =
    useState(true);

  const loadExpenses =
    useCallback(async () => {

      if (!companyId) {
        setExpenses([]);
        setLoading(false);
        return;
      }

      try {

        setLoading(true);

        const data =
          await expenseDI
            .getExpensesUseCase
            .execute(
              companyId,
              year,
              month
            );

        setExpenses(data);

      } finally {

        setLoading(false);

      }

    }, [
      companyId,
      year,
      month,
    ]);

  useEffect(() => {

    loadExpenses();

  }, [
    loadExpenses,
  ]);

  async function createExpense(
    source: string,
    amount: number,
    description?: string
  ) {

    if (!companyId) {
      return;
    }

    const expense =
      await expenseDI
        .createExpenseUseCase
        .execute({
          companyId,
          source,
          amount,
          description,
        });

    setExpenses((current) => [
      expense,
      ...current,
    ]);

    return expense;
  }

  async function updateExpense(
    expenseId: string,
    source: string,
    amount: number,
    description?: string
  ) {

    await expenseDI
      .updateExpenseUseCase
      .execute(
        expenseId,
        {
          source,
          amount,
          description,
        }
      );

    setExpenses((current) =>
      current.map(
        (expense) =>
          expense.expenseId === expenseId
            ? {
                ...expense,
                source,
                amount,
                description:
                  description ?? "",
                updatedAt:
                  new Date(),
              }
            : expense
      )
    );
  }

  async function deleteExpense(
    expenseId: string
  ) {

    await expenseDI
      .deleteExpenseUseCase
      .execute(
        expenseId
      );

    setExpenses((current) =>
      current.filter(
        (expense) =>
          expense.expenseId !==
          expenseId
      )
    );
  }

  const total =
    expenses.reduce(
      (
        result,
        expense
      ) =>
        result +
        expense.amount,
      0
    );

  return {

    expenses,

    loading,

    total,

    createExpense,

    updateExpense,

    deleteExpense,

    reload:
      loadExpenses,

  };
}