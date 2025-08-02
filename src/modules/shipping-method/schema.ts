import { ShippingMethodSchema as BaseShippingMethodSchema } from "@/generated/zod";

export const ShippingMethodSchema = BaseShippingMethodSchema;

export const ShippingMethodsSchema = BaseShippingMethodSchema.array();
