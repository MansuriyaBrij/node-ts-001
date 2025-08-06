import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2).max(100).optional(),
   profile: z.any().optional(), 
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

//profileScheme
export const profileScheme = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  age: z.number().min(0).optional(),
});