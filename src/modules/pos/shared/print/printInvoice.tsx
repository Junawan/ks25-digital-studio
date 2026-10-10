"use client";

import { PosSettings } from "../../settings/types/PosSettings";
import InvoiceA4 from "./invoice/InvoiceA4";
import { renderPrintWindow } from "./renderPrintWindow";

import type { Company } from "@/modules/company/company.types";
import type { Transaction } from "@/modules/pos/transaction/types/transaction";
import CommercialInvoiceA4 from "./invoice/CommercialInvoiceA4";
import PackingListA4 from "./invoice/PackingListA4";
import type { ShipmentPackingDetails } from "./printPackingList";

export interface CommercialInvoiceDetails {
  buyerName: string;
  buyerAddress: string;
  originCountry: string;
  destinationCountry: string;
  currency: string;
  idrPerCurrency: number;
  incoterm: string;
  hsCodes: string[];
  packing: ShipmentPackingDetails;
}

interface PrintInvoiceOptions {
  company: Company;
  settings: PosSettings;
  transaction: Transaction;
}

export async function printInvoice({
  company,
  settings,
  transaction,
}: PrintInvoiceOptions, details?: CommercialInvoiceDetails) {
  await renderPrintWindow(
    details
      ? <>
          <CommercialInvoiceA4 company={company} transaction={transaction} details={details} />
          <PackingListA4
            company={company}
            transaction={transaction}
            forceNewPage
            details={{
              buyerName: details.buyerName,
              buyerAddress: details.buyerAddress,
              originCountry: details.originCountry,
              destinationCountry: details.destinationCountry,
              hsCodes: details.hsCodes,
              ...details.packing,
            }}
          />
        </>
      : <InvoiceA4 company={company} settings={settings} transaction={transaction} />,
    `${details ? "Commercial Invoice" : "Invoice"} ${transaction.invoiceNumber}`
  );
}
