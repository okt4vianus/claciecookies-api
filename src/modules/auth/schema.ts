import { z } from "zod";
import { UserSchema } from "~/modules/user/schema";

export const AuthBodySchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().email("Invalid email format"),
  fullName: z.string().min(3, "Full name cannot be empty"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const RegisterBodySchema = AuthBodySchema.pick({
  name: true,
  email: true,
  username: true,
  password: true,
});

export const RegisterResponseSchema = z.object({
  token: z.string().nullable(),
  user: UserSchema,
});

export const LoginBodySchema = AuthBodySchema.pick({
  email: true,
  password: true,
});

export const LoginResponseSchema = z.object({
  redirect: z.boolean(),
  url: z.string().optional(),
  token: z.string(),
  user: UserSchema,
});

export type RegisterBody = z.infer<typeof RegisterBodySchema>;
export type LoginBody = z.infer<typeof LoginBodySchema>;
