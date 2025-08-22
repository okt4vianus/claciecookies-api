import { z } from "zod";
import { UserSchema as BaseUserSchema } from "@/generated/zod";

export const PublicUserSchema = BaseUserSchema.omit({ email: true });
export const PublicUsersSchema = z.array(PublicUserSchema);

export const UserSchema = BaseUserSchema.pick({
  id: true,
  email: true,
  emailVerified: true,
  name: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  image: z.string().nullable().optional(),
});

export const UsersSchema = z.array(UserSchema);

export const ParamUserIdentifierSchema = z.object({
  identifier: z.string().min(3, "Identifier is required"), //User ID or Username"
});

export const PrivateUserProfileSchema = BaseUserSchema.pick({
  name: true,
  email: true,
  phoneNumber: true,
});

export const PrivateUserAddressSchema = UserSchema.extend({
  address: z.string(),
});

export const CheckoutUserSchema = BaseUserSchema.pick({
  name: true,
  email: true,
}).extend({
  phoneNumber: z.string(),
});

export type User = z.infer<typeof UserSchema>;
export type Users = z.infer<typeof UsersSchema>;
