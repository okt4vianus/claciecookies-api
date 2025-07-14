import { z } from "zod";
import { OrderSchema as BaseOrderSchema } from "~/generated/zod";

// Order Item Schema
// TODO: Simplify by removing the ones already provided by generatod/zod
export const OrderItemSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  productId: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
  subtotal: z.number().positive(),
  product: z.object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
    images: z
      .array(
        z.object({
          id: z.string(),
          url: z.string(),
          alt: z.string().optional(),
        })
      )
      .optional(),
    stockQuantity: z.number(),
  }),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Order Schema
export const OrderSchema = BaseOrderSchema.extend({
  totalAmount: z.number().positive(),
  subtotalAmount: z.number().positive(),
  shippingCost: z.number().nonnegative(),
  orderItems: z.array(OrderItemSchema),
});

// Create Order Schema (for POST request)
export const CreateNewOrderSchema = z.object({
  addressId: z.string(),
  shippingMethodSlug: z.enum(["regular", "express", "same_day"]),
  paymentMethodSlug: z.enum(["bank_transfer", "e_wallet", "cod"]),
  // User Profile and Latest Cart from database
});

// Order List Schema
export const OrderListSchema = z.array(OrderSchema);

// Update Order Status Schema
export const UpdateOrderStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]),
});

// Param Schema
export const ParamOrderIdSchema = z.object({
  id: z.string().min(1, "Order ID is required"),
});
