"use client";

import type { Company } from "@/modules/company/company.types";
import type { Transaction } from "@/modules/pos/transaction/types/transaction";
import PackingListA4 from "./invoice/PackingListA4";
import { renderPrintWindow } from "./renderPrintWindow";

export interface ShipmentPackingDetails {
  marksAndNumbers: string;
  packageCount: number;
  packageType: string;
  netWeightKg: number;
  grossWeightKg: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
}

export interface PackingListDetails extends ShipmentPackingDetails {
  buyerName: string;
  buyerAddress: string;
  originCountry: string;
  destinationCountry: string;
  hsCodes?: string[];
}

export async function printPackingList({
  company,
  transaction,
  details,
}: {
  company: Company;
  transaction: Transaction;
  details: PackingListDetails;
}) {
  await renderPrintWindow(
    <PackingListA4 company={company} transaction={transaction} details={details} />,
    `Packing List ${transaction.invoiceNumber}`
  );
}
