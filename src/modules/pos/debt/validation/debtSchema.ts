import { z } from "zod";

export const debtSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama wajib diisi."),

  amount: z
    .number()
    .positive(
      "Nominal hutang harus lebih dari 0."
    ),

  type: z.enum([
    "kasbon",
    "payment_shortage",
    "other",
  ]),

  note: z
    .string()
    .trim()
    .optional(),

  date: z
    .date(),
});

export type DebtFormInput =
  z.infer<typeof debtSchema>;