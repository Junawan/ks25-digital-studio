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
  return (
    <div className="flex justify-between border-b pb-5">

      <div className="flex gap-4">

        {settings.logoUrl && (
          <Image
            src={settings.logoUrl}
            alt="Logo"
            width={72}
            height={72}
            className="object-contain"
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

      <div className="text-right">

        <h2 className="text-3xl font-bold tracking-wide">
          INVOICE
        </h2>

        <div className="mt-4 space-y-2 text-sm">

          <div>
            <b>No</b>
            {" : "}
            {transaction.invoiceNumber}
          </div>

          <div className="flex justify-end py-2">
  <BarcodeView
    value={transaction.invoiceNumber}
  />
</div>

          <div>
            <b>Tanggal</b>
            {" : "}
            {formatDate(transaction.createdAt)}
          </div>

          <div>
            <b>Kasir</b>
            {" : "}
            {transaction.cashierName}
          </div>

          <div>
            <b>Kepada</b>
            {" : "}
            {transaction.customerName ||
              "-"}
          </div>

        </div>

      </div>

    </div>
  );
}