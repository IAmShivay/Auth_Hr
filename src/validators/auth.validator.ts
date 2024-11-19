import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(3),
  mobile: z.string().optional(),
  companyName: z.string().min(3),
  // terms: z.boolean()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export const updateUserSchema = z.object({
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
  mobile: z.string().optional()
});

export const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(6)
});

export const forgotPasswordSchema = z.object({
  email: z.string().email()
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(6)
});