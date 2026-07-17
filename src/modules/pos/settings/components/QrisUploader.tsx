"use client";

import ImageUploader from "./ImageUploader";

interface Props {
  value: string | null;

  loading?: boolean;

  disabled?: boolean;

  onUpload: (file: File) => Promise<void>;

  onRemove: () => Promise<void>;
}

export default function QrisUploader(
  props: Props
) {
  return (
    <ImageUploader
      title="QRIS Pembayaran"
      uploadLabel={
        props.value
          ? "Ganti QRIS"
          : "Upload QRIS"
      }
      removeLabel="Hapus QRIS"
      {...props}
    />
  );
}