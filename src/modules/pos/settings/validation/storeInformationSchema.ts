import { z } from "zod";

export const storeInformationSchema = z.object({
  address: z
    .string()
    .trim()
    .min(1, "Alamat wajib diisi"),

  phone: z
    .string()
    .trim()
    .min(1, "Nomor telepon wajib diisi"),

  email: z
    .string()
    .trim()
    .email("Format email tidak valid")
    .or(z.literal("")),

  website: z
    .string()
    .trim()
    .url("Format website tidak valid")
    .or(z.literal("")),
});

export type StoreInformationInput =
  z.infer<typeof storeInformationSchema>;