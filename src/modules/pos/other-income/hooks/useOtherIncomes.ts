"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useWorkspace } from "@/core/workspace/WorkspaceProvider";

import { otherIncomeDI } from "../di/otherIncome";
import { OtherIncome } from "../types/otherIncome";

export function useOtherIncomes() {
  const { workspace } =
    useWorkspace();

  const companyId =
    workspace?.company.id;

  const [
    incomes,
    setIncomes,
  ] = useState<OtherIncome[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const load =
    useCallback(async () => {

      if (!companyId) {
        setIncomes([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data =
          await otherIncomeDI
            .getAllUseCase
            .execute(companyId);

        setIncomes(data);

      } catch (error) {

        console.error(
          "Gagal memuat pemasukan lain:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Gagal memuat pemasukan lain."
        );

      } finally {
        setLoading(false);
      }

    }, [companyId]);

  useEffect(() => {
    void load();
  }, [load]);

  const create =
    useCallback(
      async (
        input: {
          source: string;
          amount: number;
          description?: string;
          date: Date;
        }
      ) => {

        if (!companyId) {
          throw new Error(
            "Company belum tersedia."
          );
        }

        const income =
          await otherIncomeDI
            .createUseCase
            .execute({
              companyId,
              ...input,
            });

        setIncomes(
          current => [
            income,
            ...current,
          ]
        );

        return income;

      },
      [companyId]
    );

  const update =
    useCallback(
      async (
        income: OtherIncome
      ) => {

        const updated =
          await otherIncomeDI
            .updateUseCase
            .execute(income);

        setIncomes(
          current =>
            current.map(item =>
              item.incomeId ===
              updated.incomeId
                ? updated
                : item
            )
        );

        return updated;
      },
      []
    );

  const remove =
    useCallback(
      async (
        incomeId: string
      ) => {

        await otherIncomeDI
          .deleteUseCase
          .execute(incomeId);

        setIncomes(
          current =>
            current.filter(
              item =>
                item.incomeId !==
                incomeId
            )
        );
      },
      []
    );

  return {
    incomes,
    loading,
    error,
    reload: load,
    create,
    update,
    remove,
  };
}