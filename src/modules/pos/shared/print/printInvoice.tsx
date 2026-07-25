"use client";

import { PosSettings } from "../../settings/types/PosSettings";
import InvoiceA4 from "./invoice/InvoiceA4";
import { renderPrintWindow } from "./renderPrintWindow";

import type { Company } from "@/modules/company/company.types";
import type { Transaction } from "@/modules/pos/transaction/types/transaction";

interface PrintInvoiceOptions {
  company: Company;
  settings: PosSettings;
  transaction: Transaction;
}

export async function printInvoice({
  company,
  settings,
  transaction,
}: PrintInvoiceOptions) {
  await renderPrintWindow(
    <InvoiceA4
      company={company}
      settings={settings}
      transaction={transaction}
    />,
    `Invoice ${transaction.invoiceNumber}`
  );
}