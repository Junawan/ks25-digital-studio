import { TransactionSummary } from "../types/transaction";

interface Props {
  summary: TransactionSummary;
}

export default function CartSummary({
  summary,
}: Props) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="space-y-3">
        <Row
          label="Subtotal"
          value={summary.subtotal}
        />

        <Row
          label="Diskon"
          value={summary.discount}
        />
      </div>

      <div className="my-4 border-t" />

      <Row
        bold
        label="Total"
        value={summary.total}
      />
    </div>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: number;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={
          bold
            ? "font-semibold"
            : "text-muted-foreground"
        }
      >
        {label}
      </span>

      <span
        className={
          bold
            ? "text-lg font-bold"
            : "font-medium"
        }
      >
        Rp {value.toLocaleString("id-ID")}
      </span>
    </div>
  );
}