import Image from "next/image";

import type { Company } from "@/modules/company/company.types";
import type { PosSettings } from "@/modules/pos/settings/types/PosSettings";
import type { Transaction } from "@/modules/pos/transaction/types/transaction";
import { formatDate } from "@/shared/utils/date";
import BarcodeView from "@/shared/components/barcode/Barcode";

interface Props {
  company: Company;
  settings: PosSettings;
  transaction: Transaction;
}

export default function Header({
  company,
  settings,
  transaction,
}: Props) {

    console.log("transaction", transaction);

console.log("createdAt", transaction.createdAt);

console.log(
  "createdAt instanceof Date",
  transaction.createdAt instanceof Date
);

console.log(
  "createdAt constructor",
  transaction.createdAt?.constructor?.name
);
  return (
    <div className="flex items-start justify-between gap-8 border-b pb-6">

      <div className="flex flex-1 gap-4">

        {settings.logoUrl && (
          <img
    src={settings.logoUrl}
    alt="Logo"
    width={80}
    height={80}
    style={{
        objectFit: "contain",
    }}
/>
        )}

        <div>

          <h1 className="text-2xl font-bold uppercase">
            {company.name}
          </h1>

          {settings.address && (
            <p className="text-sm">
              {settings.address}
            </p>
          )}

          <div className="mt-1 text-sm">

            {settings.phone && (
              <div>
                Telp : {settings.phone}
              </div>
            )}

            {settings.email && (
              <div>
                Email : {settings.email}
              </div>
            )}

            {settings.website && (
              <div>
                {settings.website}
              </div>
            )}

            {(settings.bankName ||
              settings.accountNumber) && (
              <div className="mt-1">
                Rek.
                {" "}
                {settings.bankName}
                {" "}
                {settings.accountNumber}
              </div>
            )}

          </div>

        </div>

      </div>

      <div className="w-[260px] shrink-0">

        <h2 className="text-3xl font-bold text-right">
          INVOICE
        </h2>

        <div className="mt-2 text-right text-sm font-medium">

          <div>
            <b>No</b>
            {" : "}
            {transaction.invoiceNumber}
          </div>

          <div className="flex justify-end my-3">
  <BarcodeView
    value={transaction.invoiceNumber}
  />
</div>

          <table className="ml-auto text-sm">
        <tbody>

            <tr>
                <td className="pr-2 font-medium">Tanggal</td>
                <td>{formatDate(transaction.createdAt)}</td>
            </tr>

            <tr>
                <td className="pr-2 font-medium">Kasir</td>
                <td>{transaction.cashierName}</td>
            </tr>

            <tr>
                <td className="pr-2 font-medium">Kepada</td>
                <td>{transaction.customerName || "-"}</td>
            </tr>

        </tbody>
    </table>

        </div>

      </div>

    </div>
  );
}