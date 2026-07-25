import type { Transaction } from "@/modules/pos/transaction/types/transaction";
import { formatCurrency } from "@/shared/utils/currency";

interface Props {
  transaction: Transaction;
}

export default function ItemsTable({
  transaction,
}: Props) {
  return (
    <table className="mt-6 w-full border-collapse text-sm">

      <thead>

        <tr className="border-y bg-slate-100">

          <th className="w-12 border px-2 py-2 text-center">
            No
          </th>

          <th className="w-16 border px-2 py-2 text-center">
            Qty
          </th>

          <th className="border px-3 py-2 text-left">
            Nama Barang
          </th>

          <th className="w-36 border px-3 py-2 text-right">
            Harga
          </th>

          <th className="w-40 border px-3 py-2 text-right">
            Jumlah
          </th>

        </tr>

      </thead>

      <tbody>

        {transaction.items.map((item, index) => (

          <tr
            key={`${item.productId}-${item.variantId}-${index}`}
            className="align-top"
          >

            <td className="border px-2 py-3 text-center">
              {index + 1}
            </td>

            <td className="border px-2 py-3 text-center">
              {item.qty}
            </td>

            <td className="border px-3 py-3">

              <div className="font-semibold">
                {item.productName}
              </div>

              {item.variantName && (
                <div className="mt-1 text-xs text-slate-500">
                  {item.variantName}
                </div>
              )}

            </td>

            <td className="border px-3 py-3 text-right whitespace-nowrap">
              {formatCurrency(item.price)}
            </td>

            <td className="border px-3 py-3 text-right whitespace-nowrap">
              {formatCurrency(item.subtotal)}
            </td>

          </tr>

        ))}

      </tbody>

    </table>
  );
}