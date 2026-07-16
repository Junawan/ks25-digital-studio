"use client";

import Image from "next/image";

import { PrintData } from "../types/print";
import { formatCurrency } from "../utils/currency";
import { formatDate } from "../utils/date";

interface Props {
  data: PrintData;
}

export default function InvoiceA4({
  data,
}: Props) {
  return (
    <div
      className="
      mx-auto
      w-[210mm]
      min-h-[297mm]
      bg-white
      p-10
      text-black
      text-sm
      "
    >
      {/* Header */}

      <div className="flex items-start justify-between border-b pb-6">
        <div className="flex items-center gap-5">
          {data.logo && (
            <Image
              src={data.logo}
              alt="Logo"
              width={80}
              height={80}
            />
          )}

          <div>
            <h1 className="text-3xl font-bold">
              {data.companyName}
            </h1>

            {data.address && (
              <p className="mt-1">
                {data.address}
              </p>
            )}

            {data.phone && (
              <p>{data.phone}</p>
            )}

            {data.website && (
              <p>{data.website}</p>
            )}
          </div>
        </div>

        <div className="text-right">
          <h2 className="text-4xl font-bold tracking-widest">
            INVOICE
          </h2>

          <p className="mt-2 text-zinc-500">
            Bukti Transaksi
          </p>
        </div>
      </div>

      {/* Informasi */}

      <div className="mt-8 grid grid-cols-2 gap-10">
        <div className="space-y-3">
          <InfoRow
            label="No. Invoice"
            value={
              data.transaction
                .invoiceNumber
            }
          />

          <InfoRow
            label="Tanggal"
            value={formatDate(
              data.transaction
                .createdAt
            )}
          />
        </div>

        <div className="space-y-3">
          <InfoRow
            label="Kasir"
            value={
              data.transaction
                .cashierName
            }
          />

          <InfoRow
            label="Pelanggan"
            value={
              data.transaction
                .customerName ||
              "-"
            }
          />

          <InfoRow
            label="Pembayaran"
            value={
              data.transaction
                .paymentMethod
            }
          />
        </div>
      </div>

      {/* Table */}

      <div className="mt-10 rounded-lg border overflow-hidden">
        <div
          className="
          grid
          grid-cols-12
          bg-zinc-100
          border-b
          font-semibold
          "
        >
          <div className="col-span-1 p-3">
            No
          </div>

          <div className="col-span-5 p-3">
            Produk
          </div>

          <div className="col-span-2 p-3 text-center">
            Qty
          </div>

          <div className="col-span-2 p-3 text-right">
            Harga
          </div>

          <div className="col-span-2 p-3 text-right">
            Subtotal
          </div>
        </div>

        {data.transaction.items.map(
          (item, index) => (
            <div
              key={item.variantId}
              className="
              grid
              grid-cols-12
              border-b
              last:border-b-0
              "
            >
              <div className="col-span-1 p-3">
                {index + 1}
              </div>

              <div className="col-span-5 p-3">
                <p className="font-medium">
                  {item.productName}
                </p>

                <p className="text-xs text-zinc-500">
                  {item.variantName}
                </p>
              </div>

              <div className="col-span-2 p-3 text-center">
                {item.qty}
              </div>

              <div className="col-span-2 p-3 text-right">
                {formatCurrency(
                  item.price
                )}
              </div>

              <div className="col-span-2 p-3 text-right font-medium">
                {formatCurrency(
                  item.subtotal
                )}
              </div>
            </div>
          )
        )}
      </div>

            <div className="mt-8 flex justify-end">
        <div className="w-96 space-y-2">
          <SummaryRow
            label="Subtotal"
            value={formatCurrency(
              data.transaction.subtotal
            )}
          />

          <SummaryRow
            label="Diskon"
            value={formatCurrency(
              data.transaction.discount
            )}
          />

          <SummaryRow
            bold
            label="TOTAL"
            value={formatCurrency(
              data.transaction.total
            )}
          />

          <SummaryRow
            label="Dibayar"
            value={formatCurrency(
              data.transaction.paidAmount
            )}
          />

          <SummaryRow
            label="Kembalian"
            value={formatCurrency(
              data.transaction.changeAmount
            )}
          />
        </div>
      </div>

      <div className="mt-16 grid grid-cols-2 gap-20">
        <div className="text-center">
          <p className="font-medium">
            Kasir
          </p>

          <div className="h-24" />

          <div className="border-t pt-2">
            {
              data.transaction
                .cashierName
            }
          </div>
        </div>

        <div className="text-center">
          <p className="font-medium">
            Pelanggan
          </p>

          <div className="h-24" />

          <div className="border-t pt-2">
            {data.transaction
              .customerName || ""}
          </div>
        </div>
      </div>

      <div className="mt-16 border-t pt-6 text-center text-xs text-zinc-500">
        {data.footer ??
          "Terima kasih atas kepercayaan Anda."}
      </div>
    </div>
  );
}

interface InfoRowProps {
  label: string;

  value: string;
}

function InfoRow({
  label,
  value,
}: InfoRowProps) {
  return (
    <div className="flex">
      <div className="w-32 font-medium">
        {label}
      </div>

      <div className="mr-2">
        :
      </div>

      <div>{value}</div>
    </div>
  );
}

interface SummaryRowProps {
  label: string;

  value: string;

  bold?: boolean;
}

function SummaryRow({
  label,
  value,
  bold = false,
}: SummaryRowProps) {
  return (
    <div
      className={`flex items-center justify-between border-b pb-2 ${
        bold
          ? "text-lg font-bold"
          : ""
      }`}
    >
      <span>{label}</span>

      <span>{value}</span>
    </div>
  );
}