"use client";

import { useCallback, useEffect, useState } from "react";

import { toast } from "sonner";

import { cashierDI } from "../di/cashier";

import { Cashier } from "../types/cashier";

interface UseCashiersProps {
  companyId: string;
}

export function useCashiers({
  companyId,
}: UseCashiersProps) {
  const [cashiers, setCashiers] =
    useState<Cashier[]>([]);

  const [loading, setLoading] =
    useState(true);

  const load = useCallback(async () => {
    if (!companyId) {
      setCashiers([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data =
        await cashierDI.getCashiersUseCase.execute(
          companyId
        );

      setCashiers(data);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    void load();
  }, [load]);

  const create = useCallback(
  async (name: string) => {
    const cashier =
      await cashierDI.createCashierUseCase.execute({
        companyId,
        name,
      });

    toast.success(
      "Kasir berhasil ditambahkan."
    );

    await load();

    return cashier;
  },
  [companyId, load]
);

  const remove = useCallback(
    async (cashierId: string) => {
      await cashierDI.deleteCashierUseCase.execute(
        cashierId
      );

      toast.success(
        "Kasir berhasil dihapus"
      );

      await load();
    },
    [load]
  );

  return {
  loading,

  cashiers,

  reload: load,

  create,

  remove,
};
}