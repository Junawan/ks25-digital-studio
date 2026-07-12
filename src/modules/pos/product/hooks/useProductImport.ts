"use client";

import { useState } from "react";

import { productDI } from "../di/product";
import { toast } from "sonner";

import { ProductExcelImporter } from "../utils/ProductExcelImporter";
import { ProductImportRow } from "../types/ProductImport";

interface Props {
  companyId: string;
  onSuccess?: () => void;
}

interface ImportSummary {
  total: number;
  success: number;
  skipped: number;
  failed: number;
  errors: string[];
}

export function useProductImport({
  companyId,
  onSuccess,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [file, setFile] =
    useState<File>();

  const [rows, setRows] =
    useState<ProductImportRow[]>([]);

  const [validRows, setValidRows] =
    useState(0);

  const [errors, setErrors] =
    useState<string[]>([]);

  const [current, setCurrent] =
    useState(0);

  const [total, setTotal] =
    useState(0);

  const [currentProduct, setCurrentProduct] =
    useState("");

  const [progressOpen, setProgressOpen] =
    useState(false);

  const [summaryOpen, setSummaryOpen] =
    useState(false);

  const [summary, setSummary] =
    useState<ImportSummary>({
      total: 0,
      success: 0,
      skipped: 0,
      failed: 0,
      errors: [],
    });

  async function selectFile(file: File) {
    setFile(file);

    const result =
      await ProductExcelImporter.parse(file);

    setRows(result.rows);

    setValidRows(result.rows.length);

    setErrors(result.errors);
  }

  async function importFile() {
    if (!file || rows.length === 0) {
      return;
    }

    setLoading(true);

    setProgressOpen(true);

    try {
      const result =
        await productDI.importProductsUseCase.execute(
          companyId,
          rows,
          (
            current,
            total,
            productName
          ) => {
            setCurrent(current);

            setTotal(total);

            setCurrentProduct(
              productName
            );
          }
        );

      setSummary(result);
      toast.success("Import selesai", {
  description: `${result.success} produk berhasil diimport.`,
});

      setSummaryOpen(true);

      onSuccess?.();

      return result;
    } finally {
      setLoading(false);

      setProgressOpen(false);
    }
  }

  function reset() {
    setFile(undefined);

    setRows([]);

    setValidRows(0);

    setErrors([]);

    setCurrent(0);

    setTotal(0);

    setCurrentProduct("");
  }

  return {
    loading,

    file,

    rows,

    validRows,

    errors,

    current,

    total,

    currentProduct,

    progressOpen,

    summary,

    summaryOpen,

    setSummaryOpen,

    selectFile,

    importFile,

    reset,
  };
}