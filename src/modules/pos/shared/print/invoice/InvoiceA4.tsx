"use client";

import type { Company } from "@/modules/company/company.types";
import type { Transaction } from "@/modules/pos/transaction/types/transaction";
import { PosSettings } from "../../../settings/types/PosSettings";

interface Props {
  company: Company;
  settings: PosSettings;
  transaction: Transaction;
}

export default function InvoiceA4({
  company,
  settings,
  transaction,
}: Props) {
  return (
    <div
      className="mx-auto w-[210mm] min-h-[297mm] bg-white p-10 text-black"
      style={{
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* HEADER */}

      <div className="border-b pb-6">

        <h1 className="text-3xl font-bold">
          {company.name}
        </h1>

        {settings.address && (
          <p>{settings.address}</p>
        )}

        <div className="mt-2 space-y-1 text-sm">

          {settings.phone && (
            <p>
              Telp : {settings.phone}
            </p>
          )}

          {settings.email && (
            <p>
              Email : {settings.email}
            </p>
          )}

          {settings.website && (
            <p>
              Website : {settings.website}
            </p>
          )}

        </div>

      </div>

      {/* INFO */}

      <div className="mt-8 flex justify-between">

        <div>

          <h2 className="text-2xl font-bold">
            INVOICE
          </h2>

          <p className="mt-2">
            No :
            {" "}
            {transaction.invoiceNumber}
          </p>

          <p>
            Tanggal :
            {" "}
            {new Date(
              transaction.createdAt
            ).toLocaleString("id-ID")}
          </p>

        </div>

        <div className="text-right">

          <p>
            Kasir :
            {" "}
            {transaction.cashierName}
          </p>

          <p>
            Customer :
            {" "}
            {transaction.customerName ||
              "Umum"}
          </p>

        </div>

      </div>

      {/* TABLE */}

      <table className="mt-8 w-full border-collapse">

        <thead>

          <tr className="border-y bg-gray-100">

            <th className="p-3 text-left">
              Produk
            </th>

            <th className="w-20 p-3 text-center">
              Qty
            </th>

            <th className="w-40 p-3 text-right">
              Harga
            </th>

            <th className="w-40 p-3 text-right">
              Subtotal
            </th>

          </tr>

        </thead>

        <tbody>

          {transaction.items.map(
            (item) => (

              <tr
                key={
                  item.variantId
                }
                className="border-b"
              >

                <td className="p-3">

                  <div>
                    {item.productName}
                  </div>

                  {item.variantName && (

                    <div className="text-xs text-gray-500">
                      {item.variantName}
                    </div>

                  )}

                </td>

                <td className="p-3 text-center">
                  {item.qty}
                </td>

                <td className="p-3 text-right">
                  Rp{" "}
                  {item.price.toLocaleString(
                    "id-ID"
                  )}
                </td>

                <td className="p-3 text-right">
                  Rp{" "}
                  {item.subtotal.toLocaleString(
                    "id-ID"
                  )}
                </td>

              </tr>

            )
          )}

        </tbody>

      </table>

            {/* SUMMARY */}

      <div className="mt-8 flex justify-end">

        <div className="w-[350px] space-y-2">

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

          <div className="flex justify-between border-t pt-2 text-xl font-bold">
            <span>TOTAL</span>

            <span>
              Rp{" "}
              {transaction.total.toLocaleString(
                "id-ID"
              )}
            </span>
          </div>

          <div className="flex justify-between pt-3">
            <span>Metode Pembayaran</span>

            <span>
              {transaction.paymentMethod ===
              "cash"
                ? "Cash"
                : transaction.paymentMethod ===
                  "qris_static"
                ? "QRIS"
                : "QRIS API"}
            </span>
          </div>

          {transaction.paymentMethod ===
            "cash" && (
            <>
              <div className="flex justify-between">
                <span>Uang Diterima</span>

                <span>
                  Rp{" "}
                  {transaction.paidAmount.toLocaleString(
                    "id-ID"
                  )}
                </span>
              </div>

              <div className="flex justify-between font-bold">
                <span>Kembalian</span>

                <span>
                  Rp{" "}
                  {transaction.changeAmount.toLocaleString(
                    "id-ID"
                  )}
                </span>
              </div>
            </>
          )}

        </div>

      </div>

      {/* INFORMASI PEMBAYARAN */}

      {(settings.bankName ||
        settings.accountNumber ||
        settings.accountHolder) && (

        <div className="mt-10 rounded-lg border p-5">

          <h3 className="mb-3 text-lg font-semibold">
            Informasi Pembayaran
          </h3>

          {settings.bankName && (
            <div className="flex justify-between py-1">
              <span>Bank</span>

              <span>
                {settings.bankName}
              </span>
            </div>
          )}

          {settings.accountNumber && (
            <div className="flex justify-between py-1">
              <span>No. Rekening</span>

              <span>
                {settings.accountNumber}
              </span>
            </div>
          )}

          {settings.accountHolder && (
            <div className="flex justify-between py-1">
              <span>Atas Nama</span>

              <span>
                {settings.accountHolder}
              </span>
            </div>
          )}

        </div>

      )}

      {/* FOOTER */}

      <div className="mt-16 border-t pt-8 text-center">

        <p className="font-semibold">
          Terima kasih telah berbelanja di{" "}
          {company.name}
        </p>

        {settings.receiptFooter && (
          <p className="mt-3 whitespace-pre-line text-sm text-gray-600">
            {settings.receiptFooter}
          </p>
        )}

      </div>

    </div>
  );
}