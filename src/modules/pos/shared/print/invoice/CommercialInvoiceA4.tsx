import type { Company } from "@/modules/company/company.types";
import type { Transaction } from "@/modules/pos/transaction/types/transaction";
import type { CommercialInvoiceDetails } from "../printInvoice";
import InvoiceStyles from "./InvoiceStyles";

interface Props {
  company: Company;
  transaction: Transaction;
  details: CommercialInvoiceDetails;
}

export default function CommercialInvoiceA4({ company, transaction, details }: Props) {
  const formatMoney = (amount: number) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: details.currency,
    currencyDisplay: "code",
    maximumFractionDigits: details.currency === "IDR" ? 0 : 2,
  }).format(amount / details.idrPerCurrency);
  const date = transaction.createdAt instanceof Date
    ? transaction.createdAt
    : new Date(transaction.createdAt);

  return <>
    <InvoiceStyles />
    <main className="invoice-page p-10 text-sm">
      <header className="flex items-start justify-between gap-8 border-b-2 border-black pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-wide">COMMERCIAL INVOICE</h1>
          <p className="mt-2 text-xs uppercase tracking-[0.2em]">Export invoice</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">Invoice No.</p>
          <p>{transaction.invoiceNumber}</p>
          <p className="mt-2 font-semibold">Invoice Date</p>
          <p>{date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</p>
        </div>
      </header>

      <section className="mt-7 grid grid-cols-2 gap-8">
        <div>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wider">Exporter / Seller</h2>
          <p className="font-semibold">{details.sellerName}</p>
          {details.sellerAddress && <p className="whitespace-pre-line">{details.sellerAddress}</p>}
          {details.sellerPhone && <p>{details.sellerPhone}</p>}
          {company.email && <p>{company.email}</p>}
        </div>
        <div>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wider">Consignee / Buyer</h2>
          <p className="font-semibold">{details.buyerName}</p>
          {details.buyerAddress && <p className="whitespace-pre-line">{details.buyerAddress}</p>}
          {details.buyerPhone && <p>{details.buyerPhone}</p>}
        </div>
      </section>

      <section className="mt-7 grid grid-cols-3 gap-4 border-y border-gray-400 py-4">
        <div><p className="text-xs font-bold uppercase">Country of Origin</p><p>{details.originCountry}</p></div>
        <div><p className="text-xs font-bold uppercase">Country of Destination</p><p>{details.destinationCountry}</p></div>
        <div><p className="text-xs font-bold uppercase">Incoterms</p><p>{details.incoterm}</p></div>
      </section>

      <table className="mt-7 w-full border-collapse">
        <thead><tr className="border-b-2 border-black text-left">
          <th className="py-2 pr-2">Description of Goods</th>
          <th className="px-2 py-2 text-center">HS Code</th>
          <th className="px-2 py-2 text-right">Quantity</th>
          <th className="px-2 py-2 text-right">Unit Price</th>
          <th className="py-2 pl-2 text-right">Amount</th>
        </tr></thead>
        <tbody>{transaction.items.map((item, index) => <tr key={`${item.productId}-${item.variantId}-${index}`} className="border-b border-gray-300 align-top">
          <td className="py-3 pr-2"><p className="font-medium">{item.productName}</p>{item.variantName && <p className="text-xs text-gray-600">{item.variantName}</p>}</td>
          <td className="px-2 py-3 text-center">{details.hsCodes[index]}</td>
          <td className="px-2 py-3 text-right">{item.qty}</td>
          <td className="px-2 py-3 text-right">{formatMoney(item.price)}</td>
          <td className="py-3 pl-2 text-right">{formatMoney(item.subtotal)}</td>
        </tr>)}</tbody>
      </table>

      <section className="mt-6 flex justify-end">
        <div className="min-w-64 border-t-2 border-black pt-3 text-right">
          <p className="text-xs font-bold uppercase tracking-wider">Grand Total</p>
          <p className="mt-1 text-xl font-bold">{formatMoney(transaction.total)}</p>
        </div>
      </section>

      <section className="mt-8 border-t border-gray-300 pt-4 text-xs text-gray-700">
        <p><span className="font-semibold">Payment status:</span> {transaction.status === "paid" ? "Paid" : transaction.status === "unpaid" ? "Unpaid" : "Cancelled"}</p>
        {transaction.paidAmount > 0 && <p className="mt-1"><span className="font-semibold">Amount paid:</span> {formatMoney(transaction.paidAmount)}</p>}
        <p className="mt-1">Currency: {details.currency}{details.currency !== "IDR" ? ` (exchange rate: 1 ${details.currency} = ${details.idrPerCurrency.toLocaleString("en-US")} IDR)` : ""}</p>
      </section>
    </main>
  </>;
}
