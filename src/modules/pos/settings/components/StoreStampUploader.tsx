"use client";

import ImageUploader from "./ImageUploader";

interface Props {
  value: string | null;

  loading?: boolean;

  disabled?: boolean;

  onUpload: (file: File) => Promise<void>;

  onRemove: () => Promise<void>;
}

export default function StoreStampUploader(
  props: Props
) {
  return (
    <ImageUploader
      title="Stempel"
      uploadLabel={
        props.value
          ? "Ganti Stempel"
          : "Upload Stempel"
      }
      removeLabel="Hapus Stempel"
      {...props}
    />
  );
}