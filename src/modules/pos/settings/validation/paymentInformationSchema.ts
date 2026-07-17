import { z } from "zod";

export const paymentInformationSchema = z.object({
  bankName: z
    .string()
    .trim()
    .min(1, "Nama bank wajib diisi"),

  accountNumber: z
    .string()
    .trim()
    .min(1, "Nomor rekening wajib diisi"),

  accountHolder: z
    .string()
    .trim()
    .min(1, "Nama pemilik rekening wajib diisi"),
});

export type PaymentInformationInput =
  z.infer<typeof paymentInformationSchema>;