import { TransactionSummary }
from "../types/transaction";

interface Props {
  summary: TransactionSummary;
}

export default function CartSummary({
  summary,
}: Props) {
  return (
    <div
      className="
      rounded-xl
      border
      p-4
      "
    >
      <Row
        label="Subtotal"
        value={summary.subtotal}
      />

      <Row
        label="Diskon"
        value={summary.discount}
      />

      <div className="my-3 border-t" />

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
    <div
      className="
      flex
      justify-between
      py-1
      "
    >
      <span
        className={
          bold
            ? "font-semibold"
            : ""
        }
      >
        {label}
      </span>

      <span
        className={
          bold
            ? "font-semibold"
            : ""
        }
      >
        Rp{" "}
        {value.toLocaleString(
          "id-ID"
        )}
      </span>
    </div>
  );
}