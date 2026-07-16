"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";

import { transactionDI } from "../di/transaction";

import { Transaction } from "../types/transaction";

interface Props {
  companyId: string;
}

export function useTransactions({
  companyId,
}: Props) {

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    transactions,
    setTransactions,
  ] = useState<Transaction[]>([]);

  const load =
    useCallback(async () => {

      if (!companyId) {

        setTransactions([]);

        setLoading(false);

        return;

      }

      setLoading(true);

      try {

        const data =
          await transactionDI
            .getTransactionsUseCase
            .execute(
              companyId
            );

        setTransactions(data);

      } catch {

        toast.error(
          "Gagal memuat transaksi."
        );

      } finally {

        setLoading(false);

      }

    }, [companyId]);

  useEffect(() => {

    void load();

  }, [load]);

  return {

    loading,

    transactions,

    reload: load,

  };

}