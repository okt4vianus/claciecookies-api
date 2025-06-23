import { z } from "zod";
import { UserSchema } from "~/generated/zod";

export const PublicUserSchema = UserSchema.omit({ email: true });
export const PublicUsersSchema = z.array(PublicUserSchema);

export const UsersSchema = z.array(UserSchema);

export const ParamUserIdentifierSchema = z.object({
  identifier: z.string().min(3, "Identifier is required"), //User ID or Username"
});

export const PrivateUserAddressSchema = UserSchema;

// export type User = z.infer<typeof UserSchema>;
// export type Users = z.infer<typeof UsersSchema>;
