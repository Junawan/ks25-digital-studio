"use client";

import { useRouter } from "next/navigation";

import {
  Clock3,
  Home,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
} from "@/shared/components/ui/card";

export default function SubscriptionStatusPage() {

  const router = useRouter();

  return (

    <div
      className="
      mx-auto
      flex
      min-h-[70vh]
      max-w-xl
      items-center
      "
    >

      <Card className="w-full">

        <CardContent className="space-y-8 p-8">

          <div className="text-center">

            <div
              className="
              mx-auto
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              bg-yellow-100
              "
            >

              <Clock3
                className="
                h-10
                w-10
                text-yellow-600
                "
              />

            </div>

            <h1
              className="
              mt-6
              text-3xl
              font-bold
              "
            >

              Pembayaran Berhasil Dikirim

            </h1>

            <p
              className="
              mt-3
              text-muted-foreground
              "
            >

              Bukti pembayaran telah kami terima.

              <br />

              Admin akan melakukan verifikasi.

            </p>

          </div>

          <div
            className="
            rounded-xl
            bg-muted
            p-5
            text-center
            "
          >

            <div className="text-sm">

              Status

            </div>

            <div
              className="
              mt-2
              text-xl
              font-bold
              text-yellow-600
              "
            >

              Menunggu Verifikasi

            </div>

            <p
              className="
              mt-2
              text-sm
              text-muted-foreground
              "
            >

              Biasanya diverifikasi
              kurang dari 5 menit.

            </p>

          </div>

          <Button
            className="w-full"
            onClick={() =>
              router.push("/dashboard")
            }
          >

            <Home className="mr-2 h-4 w-4" />

            Kembali ke Dashboard

          </Button>

        </CardContent>

      </Card>

    </div>

  );

}