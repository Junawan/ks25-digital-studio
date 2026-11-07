"use client";

import { useState } from "react";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { storage } from "@/modules/invitation/lib/firebase";
import { auth } from "@/modules/invitation/lib/firebase";

export default function GalleryUpload({
  slug,
  onUploaded,
}: {
  slug: string;
  onUploaded: (
    urls: string[]
  ) => void;
}) {

  const [loading, setLoading] =
    useState(false);

  const uploadFiles =
    async (
      files: FileList
    ) => {

      try {

        setLoading(true);

        const urls: string[] = [];
        const uid = auth.currentUser?.uid;
        if (!uid) throw new Error("Silakan login untuk mengunggah foto.");

        for (
          let i = 0;
          i < files.length;
          i++
        ) {

          const file =
            files[i];

          const storageRef =
            ref(
              storage,
              `invitation-assets/${uid}/gallery/${slug}/${Date.now()}-${file.name}`
            );

          await uploadBytes(
            storageRef,
            file
          );

          const url =
            await getDownloadURL(
              storageRef
            );

          urls.push(url);
        }

        onUploaded(urls);

      } finally {

        setLoading(false);

      }
    };

  return (
    <input
      type="file"
      multiple
      accept="image/*"
      disabled={loading}
      onChange={(e) => {

        const files =
          e.target.files;

        if (!files) return;

        uploadFiles(files);

      }}
    />
  );
}
