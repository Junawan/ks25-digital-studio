"use client";

import ImageUploader from "./ImageUploader";

interface Props {
  value: string | null;

  loading?: boolean;

  disabled?: boolean;

  onUpload: (file: File) => Promise<void>;

  onRemove: () => Promise<void>;
}

export default function StoreLogoUploader(
  props: Props
) {
  return (
    <ImageUploader
      title="Logo Toko"
      uploadLabel={
        props.value
          ? "Ganti Logo"
          : "Upload Logo"
      }
      removeLabel="Hapus Logo"
      {...props}
    />
  );
}