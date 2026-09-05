interface Props {
  label: string;
  value: string;
  variant?: "default" | "positive" | "negative";
}

export default function ReportCard({
  label,
  value,
  variant = "default",
}: Props) {
  const valueClass =
    variant === "positive"
      ? "text-green-600"
      : variant === "negative"
        ? "text-red-600"
        : "text-slate-900";

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p
        className={`mt-1 text-xl font-bold ${valueClass}`}
      >
        {value}
      </p>
    </div>
  );
}