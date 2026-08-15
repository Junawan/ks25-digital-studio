"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useWorkspace } from "@/core/workspace/WorkspaceProvider";

import { transactionDI } from "../di/transaction";
import { Transaction } from "../types/transaction";

export function useTransactions() {
  const { workspace } =
    useWorkspace();

  const companyId =
    workspace?.company.id;

  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const load = useCallback(
    async () => {
      if (!companyId) {
        setTransactions([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data =
          await transactionDI
            .getTransactionsUseCase
            .execute(companyId);

        setTransactions(data);
      } catch (error) {
        console.error(
          "Gagal memuat transaksi:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Gagal memuat transaksi."
        );
      } finally {
        setLoading(false);
      }
    },
    [companyId]
  );

  useEffect(() => {
    void load();
  }, [load]);

  const remove = useCallback(
    async (
      transactionId: string
    ) => {
      await transactionDI
        .deleteTransactionUseCase
        .execute(transactionId);

      setTransactions(
        current =>
          current.filter(
            transaction =>
              transaction.transactionId !==
              transactionId
          )
      );
    },
    []
  );

  return {
    transactions,
    loading,
    error,
    reload: load,
    remove,
  };
}