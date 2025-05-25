import { z } from "@hono/zod-openapi";
// import { z } from "zod";
import { UserSchema } from "../../generated/zod";

export const UsersSchema = z.array(UserSchema);

export const AuthBodySchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
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

export type RegisterBody = z.infer<typeof RegisterBodySchema>;
export type LoginBody = z.infer<typeof LoginBodySchema>;

// export const LoginBodySchema = z.object({
//   usernameOrEmail: z.string().min(3, "Username or email is required"),
//   password: z.string().min(6, "Password must be at least 6 characters long"),
// });

// export const RegisterBodySchema = UserSchema.omit({
//   id: true,
//   createdAt: true,
//   updatedAt: true,
// })
//   .pick({
//     username: true,
//     email: true,
//     fullName: true,
//   })
//   .extend({
//     password: z.string().min(6, "Password must be at least 6 characters long"),
//   });

// export const RegisterBodySchema = UserSchema.pick({
//   username: true,
//   email: true,
//   fullName: true,
// }).extend({
//   password: z.string().min(6, "Password must be at least 6 characters long"),
// });
