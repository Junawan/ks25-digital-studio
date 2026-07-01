"use client";

import { useWorkspace } from "@/core/workspace/WorkspaceProvider";
import { useState } from "react";
import { ImportProduct } from "../import.product";
import { importProductsUseCase } from "../../di";
import * as XLSX from "xlsx";


export function useImportProducts() {

  const { workspace } = useWorkspace();
  
  const company = workspace?.company;

  const [progress, setProgress] =
    useState(0);

  const [total, setTotal] =
    useState(0);

  async function importExcel(
    file: File
  ) {

    if (!company) {
      throw new Error(
        "Company tidak ditemukan"
      );
    }

    const buffer =
      await file.arrayBuffer();

    const workbook =
      XLSX.read(buffer);

    const sheet =
      workbook.Sheets[
        workbook.SheetNames[0]
      ];

    const rawRows =
      XLSX.utils.sheet_to_json<any>(
        sheet
      );

    console.log("Excel Raw :", rawRows);

    const rows: ImportProduct[] =
  rawRows.map((row) => ({

    title:
      row["title"]?.trim() ?? "",

    image:
      row["image url"]?.trim() ?? "",

    productInfo:
      row["product info"]?.trim() ?? "",

  }));

    console.log(
      "Mapped :",
      rows
    );

    await importProductsUseCase.execute(
      workspace.company.id,
      rows,
      (current, total) => {

        setProgress(current);

        setTotal(total);

      }
    );
  }

  return {

    importExcel,

    progress,

    total,

  };
}