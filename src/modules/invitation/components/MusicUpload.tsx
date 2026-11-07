"use client";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { storage }
from "@/modules/invitation/lib/firebase";
import { auth } from "@/modules/invitation/lib/firebase";

export default function MusicUpload({
  path,
  onUploaded,
}: {
  path: string;
  onUploaded: (
    url: string
  ) => void;
}) {

  const upload =
    async (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {

      const file =
        e.target.files?.[0];

      if (!file)
        return;

      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("Silakan login untuk mengunggah musik.");
      const storageRef =
        ref(
          storage,
          `invitation-assets/${uid}/${path}/${Date.now()}-${file.name}`
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
    };

  return (
    <input
      type="file"
      accept=".mp3,audio/*"
      onChange={upload}
    />
  );
}
