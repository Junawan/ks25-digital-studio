import { z } from "zod";

export const receiptSettingsSchema = z.object({
  receiptFooter: z
    .string()
    .trim()
    .min(1, "Footer struk wajib diisi"),

  paperSize: z.enum([
    "58mm",
    "80mm",
  ]),

  autoPrint: z.boolean(),
});

export type ReceiptSettingsInput =
  z.infer<typeof receiptSettingsSchema>;