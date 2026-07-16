"use client";

import { useEffect } from "react";

import { ChevronDown, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

import { useCashiers } from "../hooks/useCashiers";

interface Props {
  companyId: string;

  value: string;

  onChange: (cashierId: string) => void;

  onCreate: () => void;
}

export function CashierSelect({
  companyId,
  value,
  onChange,
  onCreate,
}: Props) {
  const {
    loading,
    cashiers,
  } = useCashiers({
    companyId,
  });

  useEffect(() => {
    if (
      loading ||
      value ||
      cashiers.length === 0
    ) {
      return;
    }

    onChange(
      cashiers[0].cashierId
    );
  }, [
    loading,
    value,
    cashiers,
    onChange,
  ]);

  const selectedCashier =
    cashiers.find(
      (cashier) =>
        cashier.cashierId === value
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between"
        >
          <span>
            {selectedCashier?.name ??
              "Pilih Kasir"}
          </span>

          <ChevronDown className="h-4 w-4 opacity-60" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-64"
      >
        {cashiers.map(
          (cashier) => (
            <DropdownMenuItem
              key={
                cashier.cashierId
              }
              onClick={() =>
                onChange(
                  cashier.cashierId
                )
              }
            >
              {cashier.name}
            </DropdownMenuItem>
          )
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={onCreate}
        >
          <Plus className="mr-2 h-4 w-4" />

          Tambah Kasir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}