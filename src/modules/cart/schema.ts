import { z } from "zod";
import {
  CartSchema as BaseChartSchema,
  CartItemSchema as BaseItemChartSchema,
  CartItemScalarFieldEnumSchema,
} from "~/generated/zod";
import { ProductSchema } from "~/modules/product/schema";

export const CartItemSchema = BaseItemChartSchema.extend({
  product: ProductSchema,
});

export const CartSchema = BaseChartSchema.extend({
  items: z.array(CartItemSchema),
});
