import Image from "next/image";

import type { PosSettings } from "@/modules/pos/settings/types/PosSettings";
import type { Transaction } from "@/modules/pos/transaction/types/transaction";
import { formatCurrency } from "@/shared/utils/currency";

interface Props {
  settings: PosSettings;
  transaction: Transaction;
}

export default function Payment({
  settings,
  transaction,
}: Props) {
  return (
    <div className="mt-10 grid grid-cols-2 gap-10">

      {/* Informasi Pembayaran */}

      <div className="rounded-lg border p-4 h-full">

        <h3 className="mb-3 text-base font-semibold">
          Informasi Pembayaran
        </h3>

        {(settings.bankName ||
          settings.accountNumber ||
          settings.accountHolder) && (

          <div className="rounded-lg border p-4">

            {settings.bankName && (
              <div className="flex justify-between py-1">
                <span>Bank</span>

                <span className="font-medium">
                  {settings.bankName}
                </span>
              </div>
            )}

            {settings.accountNumber && (
              <div className="flex justify-between py-1">
                <span>No. Rekening</span>

                <span className="font-medium">
                  {settings.accountNumber}
                </span>
              </div>
            )}

            {settings.accountHolder && (
              <div className="flex justify-between py-1">
                <span>Atas Nama</span>

                <span className="font-medium">
                  {settings.accountHolder}
                </span>
              </div>
            )}

          </div>

        )}

      </div>

      {/* Detail Transaksi */}

      <div className="rounded-lg border p-4 h-full">

        <h3 className="mb-3 text-base font-semibold">
          Detail Pembayaran
        </h3>

        <div className="rounded-lg border p-4">

          <div className="flex justify-between py-1">
            <span>Metode</span>

            <span className="font-medium">
              {transaction.paymentMethod === "cash"
                ? "Tunai"
                : transaction.paymentMethod ===
                  "qris_static"
                ? "QRIS"
                : "QRIS Dinamis"}
            </span>
          </div>

          {transaction.paymentMethod === "cash" && (
            <>
              <div className="flex justify-between py-1">
                <span>Uang Diterima</span>

                <span className="font-medium">
                  {formatCurrency(
                    transaction.paidAmount
                  )}
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span>Kembalian</span>

                <span className="font-medium">
                  {formatCurrency(
                    transaction.changeAmount
                  )}
                </span>
              </div>
            </>
          )}

        </div>

      </div>

    </div>
  );
}