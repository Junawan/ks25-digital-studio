import { z } from "zod";

export const paymentInformationSchema = z.object({
  bankAccounts: z.array(z.object({
    bankName: z.string().trim().min(1, "Nama bank wajib diisi").max(100, "Nama bank maksimal 100 karakter."),
    accountNumber: z.string().trim().min(1, "Nomor rekening wajib diisi").max(50, "Nomor rekening maksimal 50 karakter."),
    accountHolder: z.string().trim().min(1, "Nama pemilik rekening wajib diisi").max(100, "Nama pemilik rekening maksimal 100 karakter."),
  })),
});

export type PaymentInformationInput =
  z.infer<typeof paymentInformationSchema>;
