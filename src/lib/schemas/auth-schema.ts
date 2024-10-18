import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email().min(1, "Mail is required"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(1, "username is required").trim(),
  email: z.string().email().min(1, "Mail is required"),
  password: z.string().min(8, "Password is required"),
});

export type loginValues = z.infer<typeof loginSchema>;
export type registerValues = z.infer<typeof registerSchema>;
