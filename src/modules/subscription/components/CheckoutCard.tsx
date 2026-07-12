"use client";

import { useRef, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  Upload,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { useUploadSubscriptionPayment } from "../hooks/useUploadSubscriptionPayment";

interface Props {
  plan: string;
}

export default function CheckoutCard({
  plan,
}: Props) {

  const router = useRouter();

  const inputRef =
    useRef<HTMLInputElement>(null);

  const {
    upload,
    loading,
  } =
    useUploadSubscriptionPayment();

  const [file, setFile] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState<string | null>(null);

  async function handleSubmit() {

    if (!file) {

      alert(
        "Silakan upload bukti pembayaran."
      );

      return;

    }

    const ok =
      await upload(file);

    if (!ok) {

      alert(
        "Upload gagal."
      );

      return;

    }

    router.replace(
      "/dashboard/subscription/status"
    );

  }

  return (

    <div
      className="
      mx-auto
      max-w-2xl
      space-y-6
      rounded-2xl
      border
      bg-card
      p-8
      "
    >

      <div>

        <h1
          className="
          text-3xl
          font-bold
          "
        >

          Upgrade ke PRO

        </h1>

        <p
          className="
          mt-2
          text-muted-foreground
          "
        >

          Scan QRIS berikut,
          kemudian upload bukti pembayaran.

        </p>

      </div>

      <div
        className="
        rounded-xl
        bg-violet-50
        p-6
        text-center
        "
      >

        <div
          className="
          text-sm
          text-muted-foreground
          "
        >

          Total Pembayaran

        </div>

        <div
          className="
          mt-2
          text-5xl
          font-black
          text-violet-700
          "
        >

          Rp20.000

        </div>

      </div>

      <div className="flex justify-center">

        <Image
          src="/images/payment/qris.png"
          alt="QRIS"
          width={280}
          height={280}
        />

      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() =>
          inputRef.current?.click()
        }
      >

        <Upload className="mr-2 h-4 w-4" />

        Pilih Bukti Pembayaran

      </Button>

      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/*"
        onChange={(e) => {

          const f =
            e.target.files?.[0];

          if (!f) return;

          setFile(f);

          setPreview(
            URL.createObjectURL(f)
          );

        }}
      />

      {preview && (

        <div
          className="
          rounded-xl
          border
          p-4
          "
        >

          <img
            src={preview}
            className="
            mx-auto
            max-h-80
            rounded-lg
            "
          />

        </div>

      )}

      <Button
        className="w-full"
        disabled={
          loading || !file
        }
        onClick={handleSubmit}
      >

        {loading ? (

          <>

            <Loader2
              className="
              mr-2
              h-4
              w-4
              animate-spin
              "
            />

            Mengirim...

          </>

        ) : (

          "Kirim Bukti Pembayaran"

        )}

      </Button>

    </div>

  );

}