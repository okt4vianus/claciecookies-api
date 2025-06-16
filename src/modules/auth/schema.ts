// import { z } from "@hono/zod-openapi";
import { use } from "hono/jsx";
import { z } from "zod";
import { UserSchema } from "~/generated/zod";

export const UsersSchema = z.array(UserSchema);

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
  username: true,
  email: true,
  fullName: true,
  password: true,
});

export const LoginBodySchema = AuthBodySchema.pick({
  email: true,
  password: true,
});

export const LoginResponseSchema = z.object({
  token: z.string(),
  user: UserSchema,
});

export type RegisterBody = z.infer<typeof RegisterBodySchema>;
export type LoginBody = z.infer<typeof LoginBodySchema>;
