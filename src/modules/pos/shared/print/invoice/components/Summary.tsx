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
    <div className="mt-8 flex justify-between">

      {/* Total Qty */}

      <div className="flex items-start">

        <div className="rounded-lg border bg-slate-50 px-5 py-3">

          <div className="text-sm text-slate-500">
            Total Qty
          </div>

          <div className="mt-1 text-2xl font-bold">
            {totalQty}
          </div>

        </div>

      </div>

      {/* Ringkasan */}

      <div className="w-[340px]">

        <table className="w-full text-sm">

          <tbody>

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

          </tbody>

        </table>

      </div>

    </div>
  );
}