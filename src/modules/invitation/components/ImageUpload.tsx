"use client";

import { useState } from "react";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import {
  storage,
} from "@/modules/invitation/lib/firebase";
import { auth } from "@/modules/invitation/lib/firebase";

export default function ImageUpload({
  path,
  onUploaded,
}: {
  path: string;
  onUploaded: (
    url: string
  ) => void;
}) {

  const [loading, setLoading] =
    useState(false);

  const upload =
    async (
      file: File
    ) => {

      try {

        setLoading(true);

        const uid = auth.currentUser?.uid;
        if (!uid) throw new Error("Silakan login untuk mengunggah foto.");
        const storageRef =
          ref(
            storage,
            `invitation-assets/${uid}/${path}`
          );

        await uploadBytes(
          storageRef,
          file
        );

        const url =
          await getDownloadURL(
            storageRef
          );

        onUploaded(url);

      } finally {

        setLoading(false);

      }
    };

  return (
    <input
      type="file"
      accept="image/*"
      disabled={loading}
      onChange={(e) => {

        const file =
          e.target.files?.[0];

        if (!file)
          return;

        upload(file);

      }}
    />
  );
}
