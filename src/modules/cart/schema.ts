import { z } from "zod";
import {
  CartSchema as BaseChartSchema,
  CartItemSchema as BaseItemChartSchema,
} from "~/generated/zod";
import { cardItemQuantitySchema } from "~/modules/common/schema";
import { ProductSchema } from "~/modules/product/schema";

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

export const ParamItemIdSchema = z.object({
  id: z.string().min(3, "Cart item ID is required"), // itemId
});

export const UpdateCartItemQuantitySchema = z.object({
  quantity: cardItemQuantitySchema,
});
