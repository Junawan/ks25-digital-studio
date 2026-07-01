"use client";

import { useEffect, useMemo, useState } from "react";
import { Product } from "../product.types";
import { productRepository } from "../product.repository";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";


interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  products: Product[];

  onSuccess?: () => void;
}

export default function GenerateAIDialog({
  open,
  onOpenChange,
  onSuccess,
  products,
}: Props) {

  const [overwrite, setOverwrite] = useState(false);

const [running, setRunning] = useState(false);

const [currentProduct, setCurrentProduct] = useState("");

const [progress, setProgress] = useState(0);

const [total, setTotal] = useState(0);

const [success, setSuccess] = useState(0);

const [failed, setFailed] = useState(0);

const [generateTeleprompter, setGenerateTeleprompter] = useState(true);

const [generateNotes, setGenerateNotes] = useState(true);

const [generateFaq, setGenerateFaq] = useState(true);

const targetProducts = useMemo(() => {
  if (overwrite) return products;

  return products.filter((p) => {
    return (
      !p.teleprompterText &&
      !p.notes &&
      !p.faq
    );
  });
}, [products, overwrite]);

useEffect(() => {

    if (!open) return;

    setRunning(false);

    setCurrentProduct("");

    setProgress(0);

    setTotal(0);

    setSuccess(0);

    setFailed(0);

}, [open]);

async function handleGenerate() {
  console.log("Generate diklik");
  console.log("Target:", targetProducts);

  if (!targetProducts.length) {
    console.log("Tidak ada produk yang diproses");
    return;
  }

  if (!targetProducts.length) return;

  setRunning(true);

  setProgress(0);

  setSuccess(0);

  setFailed(0);

  setTotal(targetProducts.length);

  for (let i =0; i<targetProducts.length; i++) {

    const product = targetProducts[i];

    setCurrentProduct(product.title);

    setProgress(i + 1);

    try {

  // Generate AI
  const response = await fetch("/api/ai/generate-product", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: product.title,
      productInfo: product.productInfo ?? "",
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const ai = await response.json();

  await productRepository.updateAI(
    product.productId,
    {
      teleprompterText:
        generateTeleprompter
          ? ai.teleprompterText
          : product.teleprompterText ?? "",

      notes:
        generateNotes
          ? ai.notes
          : product.notes ?? "",

      faq:
        generateFaq
          ? ai.faq
          : product.faq ?? [],
    }
  );

  setSuccess((v) => v + 1);

} catch (err) {

  console.error(product.title, err);

  setFailed((v) => v + 1);

}

  }

  setRunning(false);

  onSuccess?.();
}
  return (
    <Dialog
    open={open}
    onOpenChange={(v)=>{

        if(running) return;

        onOpenChange(v);

    }}
>
      <DialogContent className="max-w-lg">

        <DialogHeader>

          <DialogTitle>
            ✨ Generate AI
          </DialogTitle>

        </DialogHeader>

        <div className="space-y-6">

          <div>

            <h3 className="font-medium">
              Yang akan dibuat
            </h3>

            <div className="mt-3 space-y-2">

              <label>
                <input
    type="checkbox"
    checked={generateTeleprompter}
    onChange={(e)=>setGenerateTeleprompter(e.target.checked)}
/>

                Script Teleprompter
              </label>

              <label>
                <input
    type="checkbox"
    checked={generateTeleprompter}
    onChange={(e)=>setGenerateTeleprompter(e.target.checked)}
/>

                Catatan Host
              </label>

              <label>
                <input
    type="checkbox"
    checked={generateTeleprompter}
    onChange={(e)=>setGenerateTeleprompter(e.target.checked)}
/>

                FAQ
              </label>

            </div>

          </div>

          <div>

            <h3 className="font-medium">
              Mode
            </h3>

            <div className="mt-3 space-y-2">

              <label className="flex items-center gap-2">
  <input
    type="radio"
    name="mode"
    checked={!overwrite}
    onChange={() => setOverwrite(false)}
  />

  Hanya produk yang kosong
</label>

<label className="flex items-center gap-2">
  <input
    type="radio"
    name="mode"
    checked={overwrite}
    onChange={() => setOverwrite(true)}
  />

  Timpa semua
</label>

            </div>

          </div>

        </div>

        {running && (

<div className="space-y-3">

    <Progress
        value={(progress/Math.max(total,1))*100}
    />

    <div className="text-sm text-muted-foreground">

        {progress} / {total}

    </div>

    <div className="font-medium">

        {currentProduct}

    </div>

    <div className="text-sm">

        ✅ {success} berhasil

        {" · "}

        ❌ {failed} gagal

    </div>

</div>

)}

        <DialogFooter>

          <div className="rounded-lg border p-4 text-sm">

    <div className="flex justify-between">

        <span>Total Produk</span>

        <span>{products.length}</span>

    </div>

    <div className="flex justify-between mt-2">

        <span>Akan Diproses</span>

        <span>{targetProducts.length}</span>

    </div>

</div>

          <Button
    onClick={handleGenerate}
    disabled={
        running ||
        targetProducts.length===0
    }
>
    {running
        ? `Generate ${progress}/${total}`
        : `Generate ${targetProducts.length} Produk`}
</Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}