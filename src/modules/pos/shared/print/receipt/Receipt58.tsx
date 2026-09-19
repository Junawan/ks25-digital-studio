"use client";

import { Company } from "@/modules/company";
import { PosSettings } from "@/modules/pos/settings/types/PosSettings";
import { Transaction } from "@/modules/pos/transaction/types/transaction";

interface Props {
  company: Company;
  settings: PosSettings;
  transaction: Transaction;
}

export default function Receipt58({
  company,
  settings,
  transaction,
}: Props) {
  return (
    <div
      className="
        w-[58mm]
        bg-white
        p-4
        text-black
        text-xs
        font-mono
      "
    >
      {/* HEADER */}
      <div className="text-center">
        <h2 className="text-lg font-bold">
          {company.name}
        </h2>

        {settings.address && (
          <p>{settings.address}</p>
        )}

        {settings.phone && (
          <p>{settings.phone}</p>
        )}

        {settings.website && (
          <p>{settings.website}</p>
        )}
      </div>

      <hr className="my-2" />

      {/* INFO TRANSAKSI */}
      <div className="space-y-1">

        <div className="flex justify-between">
          <span>Invoice</span>
          <span>{transaction.invoiceNumber}</span>
        </div>

        <div className="flex justify-between">
          <span>Tanggal</span>
          <span>
            {new Date(
              transaction.createdAt
            ).toLocaleString("id-ID")}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Kasir</span>
          <span>{transaction.cashierName}</span>
        </div>

        <div className="flex justify-between">
          <span>Pelanggan</span>
          <span>
            {transaction.customerName || "Umum"}
          </span>
        </div>

      </div>

      <hr className="my-2" />

      {/* ITEMS */}
      <div className="space-y-2">

        {transaction.items.map(
          (item, index) => (
            <div
              key={`${item.productId}-${item.variantId}-${index}`}
              className="border-b border-dashed pb-2"
            >
              <div className="font-semibold">
                {item.productName}
              </div>

              {item.variantName && (
                <div className="text-[10px] text-gray-500">
                  {item.variantName}
                </div>
              )}

              <div className="flex justify-between">
                <span>
                  {item.qty} × Rp{" "}
                  {item.price.toLocaleString(
                    "id-ID"
                  )}
                </span>

                <span>
                  Rp{" "}
                  {item.subtotal.toLocaleString(
                    "id-ID"
                  )}
                </span>
              </div>
            </div>
          )
        )}

      </div>

      <hr className="my-2" />

      {/* PEMBAYARAN */}
      <div className="space-y-1">

        <div className="flex justify-between">
          <span>Subtotal</span>

          <span>
            Rp{" "}
            {transaction.subtotal.toLocaleString(
              "id-ID"
            )}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Diskon</span>

          <span>
            Rp{" "}
            {transaction.discount.toLocaleString(
              "id-ID"
            )}
          </span>
        </div>

        <div className="flex justify-between text-sm font-bold">
          <span>TOTAL</span>

          <span>
            Rp{" "}
            {transaction.total.toLocaleString(
              "id-ID"
            )}
          </span>
        </div>

        {/* DP */}
        {transaction.dp > 0 && (
          <div className="flex justify-between">
            <span>DP</span>

            <span>
              Rp{" "}
              {transaction.dp.toLocaleString(
                "id-ID"
              )}
            </span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Metode</span>

          <span>
            {transaction.paymentMethod === "cash"
              ? "Cash"
              : transaction.paymentMethod ===
                "qris_static"
              ? "QRIS"
              : "QRIS API"}
          </span>
        </div>

        {/* TOTAL PEMBAYARAN YANG SUDAH DITERIMA */}
        <div className="flex justify-between">
          <span>Sudah Dibayar</span>

          <span>
            Rp{" "}
            {transaction.paidAmount.toLocaleString(
              "id-ID"
            )}
          </span>
        </div>

        {/* SISA */}
        {transaction.remainingAmount > 0 && (
          <div className="flex justify-between font-bold">
            <span>Sisa</span>

            <span>
              Rp{" "}
              {transaction.remainingAmount.toLocaleString(
                "id-ID"
              )}
            </span>
          </div>
        )}

        {/* KEMBALIAN */}
        {transaction.changeAmount > 0 && (
          <div className="flex justify-between font-bold">
            <span>Kembalian</span>

            <span>
              Rp{" "}
              {transaction.changeAmount.toLocaleString(
                "id-ID"
              )}
            </span>
          </div>
        )}

      </div>

      {/* STATUS */}
      <hr className="my-2" />

      <div className="text-center">

        {transaction.status === "unpaid" && (
          <div className="text-sm font-bold">
            *** BELUM LUNAS ***
          </div>
        )}

        {transaction.status === "paid" && (
          <div className="text-sm font-bold">
            *** LUNAS ***
          </div>
        )}

        {transaction.status === "cancelled" && (
          <div className="text-sm font-bold">
            *** DIBATALKAN ***
          </div>
        )}

      </div>

      {/* KETERANGAN */}
      {transaction.keterangan && (
        <>
          <hr className="my-2" />

          <div>
            <div className="font-bold">
              Keterangan:
            </div>

            <div className="whitespace-pre-line">
              {transaction.keterangan}
            </div>
          </div>
        </>
      )}

      <hr className="my-2" />

      {/* FOOTER */}
      <div className="text-center whitespace-pre-line">
        {settings.receiptFooter}
      </div>

    </div>
  );
}