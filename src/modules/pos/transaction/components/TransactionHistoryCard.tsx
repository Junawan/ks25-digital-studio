"use client";

import { Printer, FileText, Trash2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/shared/components/ui/card";

import { Transaction } from "../types/transaction";

import { formatCurrency } from "@/shared/utils/currency";
import { formatDateTime } from "@/shared/utils/date";

interface Props {
  transaction: Transaction;

  onPrintReceipt: (
    transaction: Transaction
  ) => void | Promise<void>;

  onPrintInvoice: (
    transaction: Transaction
  ) => void | Promise<void>;

  onDelete: (
    transaction: Transaction
  ) => void | Promise<void>;
}

export default function TransactionHistoryCard({
  transaction,
  onPrintReceipt,
  onPrintInvoice,
  onDelete,
}: Props) {
  const totalQty =
    transaction.items.reduce(
      (total, item) =>
        total + item.qty,
      0
    );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">

          <div>
            <h3 className="font-semibold">
              {transaction.invoiceNumber}
            </h3>

            <p className="text-sm text-muted-foreground">
              {formatDateTime(
                transaction.createdAt
              )}
            </p>
          </div>

          <div className="text-right text-sm">
            <div>
              Kasir:{" "}
              <span className="font-medium">
                {transaction.cashierName}
              </span>
            </div>

            {transaction.customerName && (
              <div className="text-muted-foreground">
                Pelanggan:{" "}
                {transaction.customerName}
              </div>
            )}
          </div>

        </div>
      </CardHeader>

      <CardContent className="space-y-4">

        {/* Daftar Produk */}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead>
              <tr className="border-b">
                <th className="px-2 py-2 text-left">
                  Produk
                </th>

                <th className="px-2 py-2 text-center">
                  Qty
                </th>

                <th className="px-2 py-2 text-right">
                  Harga
                </th>

                <th className="px-2 py-2 text-right">
                  Jumlah
                </th>
              </tr>
            </thead>

            <tbody>
              {transaction.items.map(
                (item, index) => (
                  <tr
                    key={`${item.productId}-${item.variantId}-${index}`}
                    className="border-b last:border-0"
                  >

                    <td className="px-2 py-2">
                      <div className="font-medium">
                        {item.productName}
                      </div>

                      {item.variantName && (
                        <div className="text-xs text-muted-foreground">
                          {item.variantName}
                        </div>
                      )}
                    </td>

                    <td className="px-2 py-2 text-center">
                      {item.qty}
                    </td>

                    <td className="px-2 py-2 text-right">
                      {formatCurrency(
                        item.price
                      )}
                    </td>

                    <td className="px-2 py-2 text-right">
                      {formatCurrency(
                        item.subtotal
                      )}
                    </td>

                  </tr>
                )
              )}
            </tbody>

          </table>
        </div>

        {/* Ringkasan */}

        <div className="flex justify-between gap-6">

          <div className="text-sm text-muted-foreground">
            Total Qty:{" "}
            <span className="font-medium text-foreground">
              {totalQty}
            </span>
          </div>

          <div className="w-full max-w-xs space-y-1 text-sm">

            <div className="flex justify-between">
              <span>
                Subtotal
              </span>

              <span>
                {formatCurrency(
                  transaction.subtotal
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span>
                Diskon
              </span>

              <span>
                {formatCurrency(
                  transaction.discount
                )}
              </span>
            </div>

            <div className="flex justify-between border-t pt-2 text-base font-bold">
              <span>
                TOTAL
              </span>

              <span>
                {formatCurrency(
                  transaction.total
                )}
              </span>
            </div>

          </div>

        </div>

        {/* Tombol */}

        <div className="flex flex-wrap justify-end gap-2 border-t pt-4">

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              void onPrintReceipt(
                transaction
              )
            }
          >
            <Printer className="mr-2 h-4 w-4" />
            Cetak Struk
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              void onPrintInvoice(
                transaction
              )
            }
          >
            <FileText className="mr-2 h-4 w-4" />
            Invoice
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={() =>
              void onDelete(
                transaction
              )
            }
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Hapus
          </Button>

        </div>

      </CardContent>
    </Card>
  );
}