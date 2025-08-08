import { z } from "zod";
import { AddressSchema as BaseAddressSchema } from "@/generated/zod";
import { phoneNumber } from "@/modules/common/schema";

export const AddressSchema = BaseAddressSchema.extend({
  id: z.string(),
  label: z.string().optional().or(z.literal("")),
  recipientName: z.string().min(5, "Recipient name is required"),
  phoneNumber,
  street: z.string().min(10, "Street address is required"),
  city: z.string().min(3, "City is required"),
  province: z.string().min(5, "Province is required").default("Sulawesi Utara"),
  postalCode: z.string().min(5, "Postal code must be at least 5 digits").max(5),
  country: z.string().default("Indonesia"),
  landmark: z.string().max(255).optional().or(z.literal("")),
  notes: z.string().max(500).optional().or(z.literal("")),
  isDefault: z.union([z.boolean(), z.string().transform((v) => v === "true")]).optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
});

export const AddressesSchema = z.array(AddressSchema);

export const CreateAddressSchema = AddressSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  province: z.string().optional(),
  country: z.string().optional(),
});

export const UpdateAddressSchema = AddressSchema;
