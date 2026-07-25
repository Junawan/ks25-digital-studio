"use client";

import ImageUploader from "./ImageUploader";

interface Props {
  value: string | null;

  loading?: boolean;

  disabled?: boolean;

  onUpload: (file: File) => Promise<void>;

  onRemove: () => Promise<void>;
}

export default function StoreSignatureUploader(
  props: Props
) {
  return (
    <ImageUploader
      title="Tanda Tangan"
      uploadLabel={
        props.value
          ? "Ganti Tanda tangan"
          : "Upload Tanda Tangan"
      }
      removeLabel="Hapus Tanda Tangan"
      {...props}
    />
  );
}