"use client";

interface CurrencyProps {
  value: number;
}

export default function Currency({
  value,
}: CurrencyProps) {
  return (
    <>
      {new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(value)}
    </>
  );
}