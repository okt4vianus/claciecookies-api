import { z } from "zod";
import {
  CartSchema as BaseChartSchema,
  CartItemSchema as BaseItemChartSchema,
} from "~/generated/zod";
import { ProductSchema } from "~/modules/product/schema";
import { cardItemQuantitySchema } from "~/modules/common/schema";

export const CartItemSchema = BaseItemChartSchema.extend({
  product: ProductSchema,
});

export const CartSchema = BaseChartSchema.extend({
  items: z.array(CartItemSchema),
});

export const AddProductToCartSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: cardItemQuantitySchema,
});
