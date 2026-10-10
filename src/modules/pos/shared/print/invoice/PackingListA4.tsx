import type { Company } from "@/modules/company/company.types";
import type { Transaction } from "@/modules/pos/transaction/types/transaction";
import type { PackingListDetails } from "../printPackingList";
import InvoiceStyles from "./InvoiceStyles";

interface Props {
  company: Company;
  transaction: Transaction;
  details: PackingListDetails;
  forceNewPage?: boolean;
}

export default function PackingListA4({ company, transaction, details, forceNewPage = false }: Props) {
  const date = transaction.createdAt instanceof Date ? transaction.createdAt : new Date(transaction.createdAt);
  const totalQuantity = transaction.items.reduce((total, item) => total + item.qty, 0);
  const formatWeight = (weight: number) => `${weight.toLocaleString("en-US", { maximumFractionDigits: 3 })} kg`;
  const volumePerPackageCbm = details.lengthCm * details.widthCm * details.heightCm / 1_000_000;
  const totalVolumeCbm = volumePerPackageCbm * details.packageCount;

  return <>
    <InvoiceStyles />
    <main className="invoice-page p-10 text-sm" style={forceNewPage ? { breakBefore: "page", pageBreakBefore: "always" } : undefined}>
      <header className="flex items-start justify-between gap-8 border-b-2 border-black pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-wide">PACKING LIST</h1>
          <p className="mt-2 text-xs uppercase tracking-[0.2em]">Export shipment details</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">Invoice No.</p>
          <p>{transaction.invoiceNumber}</p>
          <p className="mt-2 font-semibold">Date</p>
          <p>{date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</p>
        </div>
      </header>

      <section className="mt-7 grid grid-cols-2 gap-8">
        <div>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wider">Exporter / Shipper</h2>
          <p className="font-semibold">{company.name}</p>
          {company.address && <p className="whitespace-pre-line">{company.address}</p>}
          {company.phone && <p>{company.phone}</p>}
          {company.email && <p>{company.email}</p>}
        </div>
        <div>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wider">Consignee / Buyer</h2>
          <p className="font-semibold">{details.buyerName}</p>
          {details.buyerAddress && <p className="whitespace-pre-line">{details.buyerAddress}</p>}
        </div>
      </section>

      <section className="mt-7 grid grid-cols-3 gap-4 border-y border-gray-400 py-4">
        <div><p className="text-xs font-bold uppercase">Country of Origin</p><p>{details.originCountry}</p></div>
        <div><p className="text-xs font-bold uppercase">Country of Destination</p><p>{details.destinationCountry}</p></div>
        <div><p className="text-xs font-bold uppercase">Marks &amp; Numbers</p><p>{details.marksAndNumbers || "—"}</p></div>
      </section>

      <table className="mt-7 w-full border-collapse">
        <thead><tr className="border-b-2 border-black text-left">
          <th className="py-2 pr-2">Description of Goods</th>
          <th className="px-2 py-2 text-center">HS Code</th>
          <th className="px-2 py-2 text-right">Quantity</th>
        </tr></thead>
        <tbody>{transaction.items.map((item, index) => <tr key={`${item.productId}-${item.variantId}-${index}`} className="border-b border-gray-300 align-top">
          <td className="py-3 pr-2"><p className="font-medium">{item.productName}</p>{item.variantName && <p className="text-xs text-gray-600">{item.variantName}</p>}</td>
          <td className="px-2 py-3 text-center">{details.hsCodes?.[index] || item.hsCode || "—"}</td>
          <td className="py-3 pl-2 text-right">{item.qty}</td>
        </tr>)}</tbody>
      </table>

      <section className="mt-6 flex justify-end">
        <div className="min-w-72 space-y-2 border-t-2 border-black pt-3">
          <div className="flex justify-between"><span>Total packages</span><span className="font-semibold">{details.packageCount} {details.packageType}</span></div>
          <div className="flex justify-between"><span>Total quantity</span><span className="font-semibold">{totalQuantity}</span></div>
          <div className="flex justify-between"><span>Total net weight</span><span className="font-semibold">{formatWeight(details.netWeightKg)}</span></div>
          <div className="flex justify-between"><span>Total gross weight</span><span className="font-semibold">{formatWeight(details.grossWeightKg)}</span></div>
          <div className="flex justify-between"><span>Dimensions per package</span><span className="font-semibold">{details.lengthCm} × {details.widthCm} × {details.heightCm} cm</span></div>
          <div className="flex justify-between"><span>Volume per package</span><span className="font-semibold">{volumePerPackageCbm.toLocaleString("en-US", { maximumFractionDigits: 3 })} CBM</span></div>
          <div className="flex justify-between"><span>Total volume ({details.packageCount} packages)</span><span className="font-semibold">{totalVolumeCbm.toLocaleString("en-US", { maximumFractionDigits: 3 })} CBM</span></div>
        </div>
      </section>
    </main>
  </>;
}
