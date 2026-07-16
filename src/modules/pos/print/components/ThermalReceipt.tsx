"use client";

import { PrintData } from "../types/print";

import {
  formatCurrency,
} from "../utils/currency";

import {
  formatDate,
} from "../utils/date";

interface Props {
  data: PrintData;

  paper?: "58" | "80";
}

export default function ThermalReceipt({
  data,
  paper = "58",
}: Props) {
  const width =
    paper === "58"
      ? "w-[58mm]"
      : "w-[80mm]";

  return (
    <div
      className={`
        ${width}
        mx-auto
        bg-white
        p-3
        text-xs
        text-black
        font-mono
      `}
    >
      <div className="text-center">
        <h1 className="font-bold text-base">
          {data.companyName}
        </h1>

        {data.address && (
          <p>{data.address}</p>
        )}

        {data.phone && (
          <p>{data.phone}</p>
        )}

        <div className="my-2 border-t border-dashed" />
      </div>

      <Row
        label="Invoice"
        value={
          data.transaction
            .invoiceNumber
        }
      />

      <Row
        label="Tanggal"
        value={formatDate(
          data.transaction
            .createdAt
        )}
      />

      <Row
        label="Kasir"
        value={
          data.transaction
            .cashierName
        }
      />

      <div className="my-2 border-t border-dashed" />

      {data.transaction.items.map(
        (item) => (
          <div
            key={
              item.variantId
            }
            className="mb-2"
          >
            <div>
              {item.productName}
            </div>

            <div className="text-muted-foreground">
              {item.variantName}
            </div>

            <div className="flex justify-between">
              <span>
                {item.qty} ×{" "}
                {formatCurrency(
                  item.price
                )}
              </span>

              <span>
                {formatCurrency(
                  item.subtotal
                )}
              </span>
            </div>
          </div>
        )
      )}

      <div className="my-2 border-t border-dashed" />

      <Row
        label="Subtotal"
        value={formatCurrency(
          data.transaction
            .subtotal
        )}
      />

      <Row
        label="Diskon"
        value={formatCurrency(
          data.transaction
            .discount
        )}
      />

      <Row
        label="TOTAL"
        bold
        value={formatCurrency(
          data.transaction
            .total
        )}
      />

      <Row
        label="Bayar"
        value={formatCurrency(
          data.transaction
            .paidAmount
        )}
      />

      <Row
        label="Kembali"
        value={formatCurrency(
          data.transaction
            .changeAmount
        )}
      />

      <div className="my-2 border-t border-dashed" />

      <div className="text-center text-[11px]">
        {data.footer ??
          "Terima kasih telah berbelanja"}
      </div>

      {data.website && (
        <div className="mt-1 text-center">
          {data.website}
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;

  value: string;

  bold?: boolean;
}) {
  return (
    <div
      className={`flex justify-between ${
        bold
          ? "font-bold"
          : ""
      }`}
    >
      <span>{label}</span>

      <span>{value}</span>
    </div>
  );
}