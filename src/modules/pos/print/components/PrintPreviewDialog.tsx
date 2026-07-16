"use client";

import { useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

import { Button } from "@/shared/components/ui/button";

import ThermalReceipt from "./ThermalReceipt";
import InvoiceA4 from "./InvoiceA4";

import {
  PrintData,
  PrintPaper,
} from "../types/print";

import { printService }
from "../services/PrintService";

interface Props {
  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;

  data: PrintData;
}

export default function PrintPreviewDialog({
  open,
  onOpenChange,
  data,
}: Props) {

  const [paper, setPaper] =
    useState<PrintPaper>(
      "thermal58"
    );

  const title =
    useMemo(() => {

      switch (paper) {

        case "thermal58":
          return "Thermal 58 mm";

        case "thermal80":
          return "Thermal 80 mm";

        case "a4":
          return "Invoice A4";

      }

    }, [paper]);

  async function handlePrint() {

    await printService.print({

        paper,

        title:
            data.transaction
                .invoiceNumber,

    });

}

  return (

    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >

      <DialogContent
        className="
        max-w-6xl
        h-[90vh]
        flex
        flex-col
        "
      >

        <DialogHeader>

          <DialogTitle>

            Preview Cetak

          </DialogTitle>

        </DialogHeader>

        <div
          className="
          flex
          gap-6
          flex-1
          overflow-hidden
          "
        >

          {/* Sidebar */}

          <div
            className="
            w-64
            border-r
            pr-4
            "
          >

            <p
              className="
              font-semibold
              mb-4
              "
            >

              Format Cetak

            </p>

            <div className="space-y-2">

              <Button

                variant={
                  paper ===
                  "thermal58"

                    ? "default"

                    : "outline"
                }

                className="w-full"

                onClick={() =>
                  setPaper(
                    "thermal58"
                  )
                }

              >

                Thermal 58 mm

              </Button>

              <Button

                variant={
                  paper ===
                  "thermal80"

                    ? "default"

                    : "outline"
                }

                className="w-full"

                onClick={() =>
                  setPaper(
                    "thermal80"
                  )
                }

              >

                Thermal 80 mm

              </Button>

              <Button

                variant={
                  paper === "a4"

                    ? "default"

                    : "outline"
                }

                className="w-full"

                onClick={() =>
                  setPaper("a4")
                }

              >

                Invoice A4

              </Button>

            </div>

          </div>

          {/* Preview */}

          <div
className="
flex-1
overflow-auto
bg-zinc-100
rounded-lg
p-6
"
>

<div
id={`print-${paper}`}
>

            <div
              className="
              mb-6
              flex
              items-center
              justify-between
              "
            >

              <h2
                className="
                text-lg
                font-semibold
                "
              >

                {title}

              </h2>

            </div>

                        {paper ===
              "thermal58" && (
              <ThermalReceipt
                data={data}
                paper="58"
              />
            )}

            {paper ===
              "thermal80" && (
              <ThermalReceipt
                data={data}
                paper="80"
              />
            )}

            {paper === "a4" && (
              <InvoiceA4
                data={data}
              />
            )}

          </div>

        </div>

        <div
          className="
          mt-4
          flex
          items-center
          justify-between
          border-t
          pt-4
          "
        >

          <Button
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
          >
            Tutup
          </Button>

          <div className="flex gap-2">

            <Button
              variant="outline"
              disabled
            >
              Simpan PDF
            </Button>

            <Button
              onClick={
                handlePrint
              }
            >
              Cetak
            </Button>

          </div>
          </div>

        </div>

      </DialogContent>

    </Dialog>

  );

}