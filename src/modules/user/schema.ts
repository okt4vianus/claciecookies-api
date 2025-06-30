import { z } from "zod";
import { AddressIncludeSchema, UserSchema } from "~/generated/zod";
import { phoneNumber } from "../common/schema";

export const PublicUserSchema = UserSchema.omit({ email: true });
export const PublicUsersSchema = z.array(PublicUserSchema);

export const UsersSchema = z.array(UserSchema);

export const ParamUserIdentifierSchema = z.object({
  identifier: z.string().min(3, "Identifier is required"), //User ID or Username"
});

export const PrivateUserProfileSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().nullable(),
});

export const PrivateUserAddressSchema = UserSchema.extend({
  address: z.string(),
});

// export type User = z.infer<typeof UserSchema>;
// export type Users = z.infer<typeof UsersSchema>;
