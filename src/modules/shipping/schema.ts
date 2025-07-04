import { z } from "@hono/zod-openapi";
import { ShippingMethodSchema as BaseShippingMethodSchema } from "~/generated/zod";

export const ShippingMethodSchema = BaseShippingMethodSchema.extend({
  price: z.number().min(0, { message: "Price must be a non-negative number" }),
});

export const ShippingMethodsSchema = z.array(ShippingMethodSchema);
