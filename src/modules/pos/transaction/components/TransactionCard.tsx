"use client";

import {
  MoreVertical,
  Receipt,
  FileText,
  Eye,
  Trash2,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/button";

import {
  Transaction,
} from "../types/transaction";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { Badge } from "@/shared/components/ui/badge";

interface Props {
  transaction: Transaction;

  onDetail: (
    transaction: Transaction
  ) => void;

  onPrintReceipt: (
    transaction: Transaction
  ) => void;

  onPrintInvoice: (
    transaction: Transaction
  ) => void;

  onDelete: (
    transaction: Transaction
  ) => void;
}

export default function TransactionCard({
  transaction,
  onDetail,
  onPrintReceipt,
  onPrintInvoice,
  onDelete,
}: Props) {
  return (
    <div
      className="
      rounded-xl
      border
      bg-card
      p-4
      shadow-sm
      "
    >
      <div
        className="
        flex
        items-start
        justify-between
        "
      >
        <div>
          <h3
            className="
            font-semibold
            "
          >
            {
              transaction.invoiceNumber
            }
          </h3>

          <p
            className="
            text-sm
            text-muted-foreground
            "
          >
            {
              transaction.cashierName
            }
          </p>

          <p
            className="
            text-xs
            text-muted-foreground
            "
          >
            {new Date(
              transaction.createdAt
            ).toLocaleString(
              "id-ID"
            )}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
          >
            <Button
              size="icon"
              variant="ghost"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
          >
            <DropdownMenuItem
              onClick={() =>
                onDetail(
                  transaction
                )
              }
            >
              <Eye className="mr-2 h-4 w-4" />

              Detail
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() =>
                onPrintReceipt(
                  transaction
                )
              }
            >
              <Receipt className="mr-2 h-4 w-4" />

              Cetak Struk
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() =>
                onPrintInvoice(
                  transaction
                )
              }
            >
              <FileText className="mr-2 h-4 w-4" />

              Cetak Invoice
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-red-600"
              onClick={() =>
                onDelete(
                  transaction
                )
              }
            >
              <Trash2 className="mr-2 h-4 w-4" />

              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div
        className="
        mt-4
        flex
        items-center
        justify-between
        "
      >
        <div
          className="
          flex
          items-center
          gap-2
          "
        >
          <Badge
            variant="secondary"
          >
            {transaction.paymentMethod ===
            "cash"
              ? "Cash"
              : transaction.paymentMethod ===
                  "qris_static"
                ? "QRIS"
                : "QRIS API"}
          </Badge>

          <Badge
            variant="outline"
          >
            {
              transaction.items.length
            } Produk
          </Badge>
        </div>

        <div
          className="
          text-right
          "
        >
          <p
            className="
            text-lg
            font-bold
            "
          >
            Rp{" "}
            {transaction.total.toLocaleString(
              "id-ID"
            )}
          </p>

          <p
            className="
            text-xs
            text-muted-foreground
            "
          >
            {
              transaction.customerName ||
              "-"
            }
          </p>
        </div>
      </div>
    </div>
  );
}