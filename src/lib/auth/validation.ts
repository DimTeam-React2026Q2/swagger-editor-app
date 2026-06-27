import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .refine((v) => /\p{L}/u.test(v), "Password must contain at least one letter")
  .refine((v) => /\d/u.test(v), "Password must contain at least one digit")
  .refine(
    (v) => /[^\p{L}\d]/u.test(v),
    "Password must contain at least one special character"
  );

export const signInSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const signUpSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: passwordSchema,
});

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
