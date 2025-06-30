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

export const CheckoutAddressSchema = z.object({
  label: z.string().optional().or(z.literal("")),

  recipientName: z.string().min(5, "Recipient name is required"),

  phone: phoneNumber,

  street: z.string().min(10, "Street address is required"),

  city: z.string().min(3, "City is required"),

  province: z.string().min(5, "Province is required").default("Sulawesi Utara"),

  postalCode: z
    .string()
    .min(5, "Postal code must be at least 5 digits")
    .max(5, "Postal code too long"),

  country: z.string().default("Indonesia"),

  landmark: z.string().max(255).optional().or(z.literal("")),

  notes: z.string().max(500).optional().or(z.literal("")),

  isDefault: z
    .union([z.boolean(), z.string().transform((v) => v === "true")])
    .optional()
    .default(false),

  // opsional for peta/gps
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
});
// export type User = z.infer<typeof UserSchema>;
// export type Users = z.infer<typeof UsersSchema>;
