import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, "Nama minimal 3 karakter"),

    companyName: z
      .string()
      .trim()
      .min(3, "Nama perusahaan minimal 3 karakter"),

    email: z
      .string()
      .trim()
      .email("Email tidak valid"),

    password: z
      .string()
      .min(6, "Password minimal 6 karakter"),

    confirmPassword: z.string(),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Konfirmasi password tidak sama",
    }
  );

export type RegisterFormValues = z.infer<
  typeof registerSchema
>;