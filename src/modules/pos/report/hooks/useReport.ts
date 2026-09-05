"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { debtDI } from "@/modules/pos/debt/di";

import type { Transaction } from "@/modules/pos/transaction/types/transaction";
import type { OtherIncome } from "@/modules/pos/other-income/types/otherIncome";
import type { Expense } from "@/modules/pos/expense/types/expense";
import type { Debt } from "@/modules/pos/debt/types/debt";

import type { ReportSummary } from "../types/report";
import { transactionDI } from "../../transaction/di/transaction";
import { otherIncomeDI } from "../../other-income/di/otherIncome";
import { expenseDI } from "../../expense/di/expense";
import { useWorkspace } from "@/core/workspace/WorkspaceProvider";

function toDate(value: unknown): Date | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? null
      : value;
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    const date = value.toDate();

    return date instanceof Date &&
      !Number.isNaN(date.getTime())
      ? date
      : null;
  }

  if (
    typeof value === "string" ||
    typeof value === "number"
  ) {
    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? null
      : date;
  }

  return null;
}

function getAmount(value: unknown): number {
  const amount = Number(value);

  return Number.isFinite(amount)
    ? amount
    : 0;
}

function isSameMonth(
  value: unknown,
  year: number,
  month: number
): boolean {
  const date = toDate(value);

  if (!date) {
    return false;
  }

  return (
    date.getFullYear() === year &&
    date.getMonth() === month
  );
}

function getTransactionDate(
  transaction: Transaction
): unknown {
  return transaction.createdAt;
}

function getIncomeDate(
  income: OtherIncome
): unknown {
  return (
    income as OtherIncome & {
      date?: unknown;
      createdAt?: unknown;
    }
  ).date ??
    (
      income as OtherIncome & {
        createdAt?: unknown;
      }
    ).createdAt;
}

function getExpenseDate(
  expense: Expense
): unknown {
  return (
    expense as Expense & {
      date?: unknown;
      createdAt?: unknown;
    }
  ).date ??
    (
      expense as Expense & {
        createdAt?: unknown;
      }
    ).createdAt;
}

function getDebtDate(
  debt: Debt
): unknown {
  return debt.date;
}

function getDebtAmount(
  debt: Debt
): number {
  return getAmount(
    debt.amount
  );
}

function getDebtPaidAmount(
  debt: Debt
): number {
  return getAmount(
    debt.totalPaid
  );
}

function getDebtRemainingAmount(
  debt: Debt
): number {
  return getAmount(
    debt.remainingAmount
  );
}

function getMonthlyDebtPaymentAmount(
  debt: Debt,
  year: number,
  month: number
): number {
  if (!Array.isArray(debt.payments)) {
    return 0;
  }

  return debt.payments.reduce(
    (total, payment) => {
      if (
        !isSameMonth(
          payment.paidAt,
          year,
          month
        )
      ) {
        return total;
      }

      return (
        total +
        getAmount(payment.amount)
      );
    },
    0
  );
}

export function useReport(
  selectedMonth: string
) {
  const { workspace } =
  useWorkspace();

const companyId =
  workspace?.company?.id;

  const [summary, setSummary] =
    useState<ReportSummary>({
      totalSales: 0,
      totalOtherIncome: 0,
      totalExpense: 0,
      remainingDebt: 0,
      netBalance: 0,

      monthlySales: 0,
      monthlyOtherIncome: 0,
      monthlyExpense: 0,
      monthlyNewDebt: 0,
      monthlyDebtPayment: 0,
      monthlyRemainingDebt: 0,
      monthlyNetBalance: 0,
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadReport =
    useCallback(async () => {
      if (!companyId) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [
          transactions,
          incomes,
          expenses,
          debts,
        ] = await Promise.all([
          transactionDI.repository.getAll(
            companyId
          ),

          otherIncomeDI.repository.getAll(
            companyId
          ),

          expenseDI.repository.getAll(
            companyId
          ),

          debtDI.repository.getAll(
            companyId
          ),
        ]);

        const [
          yearString,
          monthString,
        ] = selectedMonth.split("-");

        const year =
          Number(yearString);

        const month =
          Number(monthString) - 1;

        // =========================
        // GLOBAL PENJUALAN
        // =========================

        const totalSales =
          transactions.reduce(
            (total, transaction) =>
              total +
              getAmount(
                transaction.total
              ),
            0
          );

        // =========================
        // PENJUALAN BULAN
        // =========================

        const monthlySales =
          transactions
            .filter((transaction) =>
              isSameMonth(
                getTransactionDate(
                  transaction
                ),
                year,
                month
              )
            )
            .reduce(
              (total, transaction) =>
                total +
                getAmount(
                  transaction.total
                ),
              0
            );

        // =========================
        // PEMASUKAN LAIN
        // =========================

        const totalOtherIncome =
          incomes.reduce(
            (total, income) =>
              total +
              getAmount(
                (
                  income as OtherIncome & {
                    amount?: unknown;
                  }
                ).amount
              ),
            0
          );

        const monthlyOtherIncome =
          incomes
            .filter((income) =>
              isSameMonth(
                getIncomeDate(income),
                year,
                month
              )
            )
            .reduce(
              (total, income) =>
                total +
                getAmount(
                  (
                    income as OtherIncome & {
                      amount?: unknown;
                    }
                  ).amount
                ),
              0
            );

        // =========================
        // PENGELUARAN
        // =========================

        const totalExpense =
          expenses.reduce(
            (total, expense) =>
              total +
              getAmount(
                (
                  expense as Expense & {
                    amount?: unknown;
                  }
                ).amount
              ),
            0
          );

        const monthlyExpense =
          expenses
            .filter((expense) =>
              isSameMonth(
                getExpenseDate(expense),
                year,
                month
              )
            )
            .reduce(
              (total, expense) =>
                total +
                getAmount(
                  (
                    expense as Expense & {
                      amount?: unknown;
                    }
                  ).amount
                ),
              0
            );

        // =========================
        // HUTANG
        // =========================

        const remainingDebt =
          debts.reduce(
            (total, debt) =>
              total +
              getDebtRemainingAmount(
                debt
              ),
            0
          );

        // =========================
        // HUTANG BARU BULAN INI
        // =========================

        const monthlyNewDebt =
          debts
            .filter((debt) =>
              isSameMonth(
                getDebtDate(debt),
                year,
                month
              )
            )
            .reduce(
              (total, debt) =>
                total +
                getDebtAmount(debt),
              0
            );

        // =========================
        // PEMBAYARAN HUTANG BULAN INI
        // =========================

        const monthlyDebtPayment =
          debts.reduce(
            (total, debt) =>
              total +
              getMonthlyDebtPaymentAmount(
                debt,
                year,
                month
              ),
            0
          );

        // =========================
        // SISA HUTANG AKHIR BULAN
        // =========================

        const monthlyRemainingDebt =
  debts.reduce(
    (total, debt) => {
      const debtDate =
        toDate(debt.date);

      if (!debtDate) {
        return total;
      }

      const monthEnd =
        new Date(
          year,
          month + 1,
          0,
          23,
          59,
          59,
          999
        );

      // Hutang belum dibuat pada akhir
      // bulan yang dipilih.
      if (
        debtDate.getTime() >
        monthEnd.getTime()
      ) {
        return total;
      }

      const paidBeforeEnd =
        Array.isArray(
          debt.payments
        )
          ? debt.payments.reduce(
              (
                sum,
                payment
              ) => {
                const paidAt =
                  toDate(
                    payment.paidAt
                  );

                if (
                  !paidAt ||
                  paidAt.getTime() >
                    monthEnd.getTime()
                ) {
                  return sum;
                }

                return (
                  sum +
                  getAmount(
                    payment.amount
                  )
                );
              },
              0
            )
          : 0;

      const remaining =
        Math.max(
          0,
          getDebtAmount(debt) -
            paidBeforeEnd
        );

      return total + remaining;
    },
    0
  );

        // =========================
        // SALDO BERSIH GLOBAL
        // =========================

        const netBalance =
          totalSales +
          totalOtherIncome -
          totalExpense -
          remainingDebt;

        // =========================
        // SALDO BERSIH BULAN
        // =========================

        const monthlyNetBalance =
          monthlySales +
          monthlyOtherIncome -
          monthlyExpense -
          monthlyRemainingDebt;

        setSummary({
          totalSales,
          totalOtherIncome,
          totalExpense,
          remainingDebt,
          netBalance,

          monthlySales,
          monthlyOtherIncome,
          monthlyExpense,
          monthlyNewDebt,
          monthlyDebtPayment,
          monthlyRemainingDebt,
          monthlyNetBalance,
        });
      } catch (err) {
        console.error(
          "Gagal memuat laporan:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Gagal memuat laporan."
        );
      } finally {
        setLoading(false);
      }
    }, [
      companyId,
      selectedMonth,
    ]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  return {
    summary,
    loading,
    error,
    reload: loadReport,
  };
}