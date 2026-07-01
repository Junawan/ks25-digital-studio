"use client";

import { useState } from "react";

import { useRef } from "react";
import { Product } from "../../product/product.types";
import { productRepository } from "../../product/product.repository";

export function useGeneratePlaylistAI() {

  const [running, setRunning] = useState(false);

  const [progress, setProgress] = useState(0);

  const [total, setTotal] = useState(0);

  const [currentProduct, setCurrentProduct] =
    useState("");

  const [success, setSuccess] = useState(0);

  const [failed, setFailed] = useState(0);

  const stopRef = useRef(false);

  function stop() {
  stopRef.current = true;
}

  async function generate(
    products: Product[],
    onFinish?: () => void
  ) {

    const targets = products.filter(
      (p) => !p.teleprompterText?.trim()
    );

    if (!targets.length) {

      alert("Semua produk sudah memiliki AI.");

      return;

    }

    setRunning(true);

    stopRef.current = false;

    setProgress(0);

    setTotal(targets.length);

    setSuccess(0);

    setFailed(0);

    for (let i = 0; i < targets.length; i++) {
        if (stopRef.current) {
  break;
}

      const product = targets[i];

      setCurrentProduct(product.title);

      setProgress(i + 1);

      try {

        const res = await fetch(
          "/api/ai/generate-product",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              title: product.title,
              productInfo:
                product.productInfo,
            }),
          }
        );

        if (!res.ok) {

          throw new Error();

        }

        const ai = await res.json();

        await productRepository.updateAI(
          product.productId,
          {
            teleprompterText:
              ai.teleprompterText,

            notes: ai.notes,

            faq: ai.faq,
          }
        );

        setSuccess((v) => v + 1);

      } catch (err) {

        console.error(err);

        setFailed((v) => v + 1);

      }

    }

    setRunning(false);

    onFinish?.();

  }

  return {

    generate,

    stop,

    running,

    progress,

    total,

    currentProduct,

    success,

    failed,

  };

}