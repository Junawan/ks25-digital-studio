"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { productDI } from "../di/product";

import { CreateProductInput, Product } from "../types/product";

import {
  productSchema,
  type ProductFormValues,
} from "../validation/productSchema";
import { useEffect } from "react";
import { toast } from "sonner";

interface Props {
  companyId: string;
  product?: Product;
  onSuccess?: () => void;
}

export function useProductForm({
  companyId,
  product,
  onSuccess,
}: Props) {
  const form = useForm<ProductFormValues>({
  resolver: zodResolver(productSchema),

    defaultValues: {
  name: product?.name ?? "",

  active: product?.active ?? true,

  variants:
    product?.variants.length
      ? product.variants.map((variant) => ({
          variantId: variant.variantId,
          name: variant.name,
          barcode: variant.barcode,
          price: variant.price,
          stock: variant.stock,
          active: variant.active,
        }))
      : [
          {
            variantId: crypto.randomUUID(),
            name: "Default",
            barcode: "",
            price: undefined,
            stock: undefined,
            active: true,
          },
        ],
},
  });

  useEffect(() => {
  if (product) {
    form.reset({
      name: product.name,
      active: product.active,
      variants: product.variants.map((variant) => ({
        variantId: variant.variantId,
        name: variant.name,
        barcode: variant.barcode,
        price: variant.price,
        stock: variant.stock,
        active: variant.active,
      })),
    });
  } else {
    form.reset({
      name: "",
      active: true,
      variants: [
        {
          variantId: crypto.randomUUID(),
          name: "Default",
          barcode: "",
          price: undefined,
          stock: undefined,
          active: true,
        },
      ],
    });
  }
}, [product, form]);
  

  const save = form.handleSubmit(async (values) => {
    if (!product) {
        const input: CreateProductInput = {
  companyId,
  name: values.name,
  active: values.active,
  variants: values.variants.map((variant) => ({
    ...variant,
  })),
};

await productDI.createProductUseCase.execute(input);
toast.success("Produk berhasil ditambahkan");
      
    } else {
      await productDI.updateProductUseCase.execute(
        companyId,
        product.productId,
        {
          name: values.name,

          active: values.active,

          variants:
            values.variants,
        }
      );
      toast.success("Produk berhasil diperbarui");
    }

    onSuccess?.();
  });

  return {
    form,
    save,
  };
}