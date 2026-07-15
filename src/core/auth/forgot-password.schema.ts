import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .email("Email tidak valid")
    .trim(),
});

export type ForgotPasswordFormValues = z.infer<
  typeof forgotPasswordSchema
>;