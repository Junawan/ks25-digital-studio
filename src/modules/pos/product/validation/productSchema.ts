import { z } from "zod";

export const variantSchema = z.object({
  variantId: z.string(),

  name: z.string().trim().min(1),

  barcode: z.string(),

  price: z.number(),

  stock: z.number(),

  active: z.boolean(),
});

export const productSchema = z.object({
  name: z.string().trim().min(1),

  active: z.boolean(),

  variants: z.array(variantSchema).min(1),
});

export type ProductFormValues = z.infer<typeof productSchema>;