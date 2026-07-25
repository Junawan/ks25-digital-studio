"use client";

import { PosSettings } from "../../settings/types/PosSettings";
import Receipt58 from "./receipt/Receipt58";
import Receipt80 from "./receipt/Receipt80";
import { renderPrintWindow } from "./renderPrintWindow";

import type { Company } from "@/modules/company/company.types";
import type { Transaction } from "@/modules/pos/transaction/types/transaction";

interface PrintReceiptOptions {
  company: Company;
  settings: PosSettings;
  transaction: Transaction;
}

export async function printReceipt({
  company,
  settings,
  transaction,
}: PrintReceiptOptions) {
  if (settings.paperSize === "80mm") {
    await renderPrintWindow(
      <Receipt80
        company={company}
        settings={settings}
        transaction={transaction}
      />,
      "Receipt 80mm"
    );

    return;
  }

  await renderPrintWindow(
    <Receipt58
      company={company}
      settings={settings}
      transaction={transaction}
    />,
    "Receipt 58mm"
  );
}