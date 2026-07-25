"use client";

import Barcode from "react-barcode";

interface Props {
  value: string;
}

export default function BarcodeView({
  value,
}: Props) {
  return (
    <Barcode
      value={value}
      format="CODE128"
      width={1.5}
      height={45}
      margin={0}
      displayValue={false}
      background="#ffffff"
    />
  );
}