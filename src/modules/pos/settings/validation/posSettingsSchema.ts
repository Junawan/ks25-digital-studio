import { z } from "zod";

export const posSettingsSchema = z.object({
  address: z
    .string()
    .trim()
    .min(1, "Alamat toko wajib diisi.")
    .max(500, "Alamat maksimal 500 karakter."),

  phone: z
    .string()
    .trim()
    .min(1, "Nomor telepon wajib diisi.")
    .max(30, "Nomor telepon maksimal 30 karakter."),

  email: z
    .string()
    .trim()
    .email("Format email tidak valid.")
    .nullable()
    .or(z.literal("")),

  website: z
    .string()
    .trim()
    .url("Format website tidak valid.")
    .nullable()
    .or(z.literal("")),

  logoUrl: z
    .string()
    .trim()
    .nullable()
    .or(z.literal("")),

  bankName: z
    .string()
    .trim()
    .max(100, "Nama bank maksimal 100 karakter."),

  accountNumber: z
    .string()
    .trim()
    .max(50, "Nomor rekening maksimal 50 karakter."),

  accountHolder: z
    .string()
    .trim()
    .max(100, "Nama pemilik rekening maksimal 100 karakter."),

  qrisImageUrl: z
    .string()
    .trim()
    .nullable()
    .or(z.literal("")),

  receiptFooter: z
    .string()
    .trim()
    .max(500, "Footer maksimal 500 karakter."),

  paperSize: z.enum(["58mm", "80mm"], {
    message: "Ukuran kertas tidak valid.",
  }),

  autoPrint: z.boolean(),
});

export type PosSettingsFormValues = z.infer<
  typeof posSettingsSchema
>;