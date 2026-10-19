"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useWorkspace } from "@/core/workspace/WorkspaceProvider";

import {
  Debt,
  DebtStatus,
} from "../types/debt";

import { debtDI } from "../di";

export function useDebts() {
  const {
    workspace,
    loading: workspaceLoading,
  } = useWorkspace();

  const companyId =
    workspace?.company.id;

  const [debts, setDebts] =
    useState<Debt[]>([]);

  const [status, setStatus] =
    useState<DebtStatus | "all">(
      "unpaid"
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadDebts =
    useCallback(async () => {
      if (!companyId) {
        setDebts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data =
          await debtDI
            .getDebtsUseCase
            .execute(
              companyId,
              status
            );

        setDebts(data);
      } catch (error) {
        console.error(
          "Gagal memuat hutang:",
          error
        );

        setError(
          "Gagal memuat data hutang."
        );
      } finally {
        setLoading(false);
      }
    }, [
      companyId,
      status,
    ]);

  useEffect(() => {
    if (workspaceLoading) {
      return;
    }

    loadDebts();
  }, [
    workspaceLoading,
    loadDebts,
  ]);

  const createDebt =
    useCallback(
      async (input: {
        name: string;
        debtorType: "employee" | "customer";
        amount: number;
        type:
          | "kasbon"
          | "payment_shortage"
          | "other";
        note?: string | null;
        date: Date;
      }) => {
        if (!companyId) {
          throw new Error(
            "Company tidak ditemukan."
          );
        }

        const debt =
          await debtDI
            .createDebtUseCase
            .execute({
              companyId,
              ...input,
            });

        setDebts(
          (current) => [
            debt,
            ...current,
          ]
        );

        return debt;
      },
      [companyId]
    );

  const payDebt =
    useCallback(
      async (input: {
        debtId: string;
        amount: number;
        note?: string | null;
        paidAt: Date;
      }) => {
        const updated =
          await debtDI
            .payDebtUseCase
            .execute(input);

        setDebts(
          (current) =>
            current.map(
              (debt) =>
                debt.debtId ===
                updated.debtId
                  ? updated
                  : debt
            )
        );

        return updated;
      },
      []
    );

  const deleteDebt =
    useCallback(
      async (
        debtId: string
      ) => {
        await debtDI
          .deleteDebtUseCase
          .execute(debtId);

        setDebts(
          (current) =>
            current.filter(
              (debt) =>
                debt.debtId !==
                debtId
            )
        );
      },
      []
    );

  const updateDebtorType = useCallback(async (debtId: string, debtorType: "employee" | "customer") => {
    const debt = debts.find((item) => item.debtId === debtId);
    if (!debt) return;
    const updated = { ...debt, debtorType, updatedAt: new Date() };
    await debtDI.repository.update(updated);
    setDebts((current) => current.map((item) => item.debtId === debtId ? updated : item));
  }, [debts]);

  const refresh =
    useCallback(async () => {
      await loadDebts();
    }, [loadDebts]);

  return {
    debts,

    status,
    setStatus,

    loading:
      loading ||
      workspaceLoading,

    error,

    createDebt,

    payDebt,

    deleteDebt,
    updateDebtorType,

    refresh,
  };
}
