import { z } from "zod";
import {
  CartSchema as BaseCartSchema,
  CartItemSchema as BaseCartItemSchema,
} from "~/generated/zod";
import { ProductSchema } from "~/modules/product/schema";

export const CartItemSchema = BaseCartItemSchema.extend({
  product: ProductSchema,
});

export const CartSchema = BaseCartSchema.extend({
  items: z.array(CartItemSchema),
});
