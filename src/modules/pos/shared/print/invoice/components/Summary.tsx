import type { Transaction } from "@/modules/pos/transaction/types/transaction";
import { formatCurrency } from "@/shared/utils/currency";

interface Props {
  transaction: Transaction;
}

export default function Summary({
  transaction,
}: Props) {
  const totalQty = transaction.items.reduce(
    (total, item) => total + item.qty,
    0
  );

  return (
    <div className="mt-8 flex justify-between gap-10">

      {/* TOTAL QTY + STATUS */}

      <div className="flex flex-col items-start gap-4">

        <div className="rounded-lg border bg-slate-50 px-5 py-3">

          <div className="text-sm text-slate-500">
            Total Qty
          </div>

          <div className="mt-1 text-2xl font-bold">
            {totalQty}
          </div>

        </div>

        {/* STATUS */}

        <div
          className={`
            rounded-lg
            border
            px-5
            py-3
            text-center
            font-bold
            ${
              transaction.status === "unpaid"
                ? "border-slate-300 bg-slate-50"
                : transaction.status === "paid"
                ? "border-slate-300 bg-slate-50"
                : "border-slate-300 bg-slate-50"
            }
          `}
        >
          {transaction.status === "unpaid" && (
            <>
              <div className="text-xs">
                STATUS PEMBAYARAN
              </div>

              <div className="mt-1 text-lg">
                BELUM LUNAS
              </div>
            </>
          )}

          {transaction.status === "paid" && (
            <>
              <div className="text-xs">
                STATUS PEMBAYARAN
              </div>

              <div className="mt-1 text-lg">
                LUNAS
              </div>
            </>
          )}

          {transaction.status === "cancelled" && (
            <>
              <div className="text-xs">
                STATUS TRANSAKSI
              </div>

              <div className="mt-1 text-lg">
                DIBATALKAN
              </div>
            </>
          )}
        </div>

      </div>

      {/* RINGKASAN */}

      <div className="w-[340px]">

        <table className="w-full text-sm">

          <tbody>

            {/* SUBTOTAL */}

            <tr>
              <td className="py-1">
                Subtotal
              </td>

              <td className="py-1 text-right">
                {formatCurrency(
                  transaction.subtotal
                )}
              </td>
            </tr>

            {/* DISKON */}

            <tr>
              <td className="py-1">
                Diskon
              </td>

              <td className="py-1 text-right">
                {formatCurrency(
                  transaction.discount
                )}
              </td>
            </tr>

            <tr>
              <td
                colSpan={2}
                className="py-2"
              >
                <div className="border-t" />
              </td>
            </tr>

            {/* GRAND TOTAL */}

            <tr>

              <td className="pt-2 text-lg font-bold">
                GRAND TOTAL
              </td>

              <td className="pt-2 text-right text-2xl font-bold">
                {formatCurrency(
                  transaction.total
                )}
              </td>

            </tr>

            {/* DP */}

            {transaction.dp > 0 && (
              <tr>
                <td className="pt-3">
                  DP
                </td>

                <td className="pt-3 text-right">
                  {formatCurrency(
                    transaction.dp
                  )}
                </td>
              </tr>
            )}

            {/* SUDAH DIBAYAR */}

            <tr>
              <td className="pt-1 font-medium">
                Sudah Dibayar
              </td>

              <td className="pt-1 text-right font-medium">
                {formatCurrency(
                  transaction.paidAmount
                )}
              </td>
            </tr>

            {/* SISA PEMBAYARAN */}

            {transaction.remainingAmount > 0 && (
              <tr>
                <td className="pt-1 font-bold">
                  Sisa Pembayaran
                </td>

                <td className="pt-1 text-right font-bold">
                  {formatCurrency(
                    transaction.remainingAmount
                  )}
                </td>
              </tr>
            )}

            {/* KEMBALIAN */}

            {transaction.changeAmount > 0 && (
              <tr>
                <td className="pt-1 font-bold">
                  Kembalian
                </td>

                <td className="pt-1 text-right font-bold">
                  {formatCurrency(
                    transaction.changeAmount
                  )}
                </td>
              </tr>
            )}

          </tbody>

        </table>

        {/* KETERANGAN */}

        {transaction.keterangan && (
          <div className="mt-5 rounded-md border px-4 py-3">

            <div className="text-xs font-bold uppercase">
              Keterangan
            </div>

            <div className="mt-1 whitespace-pre-line text-sm">
              {transaction.keterangan}
            </div>

          </div>
        )}

      </div>

    </div>
  );
}