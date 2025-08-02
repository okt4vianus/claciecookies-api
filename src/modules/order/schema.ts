import { z } from "zod";
import { OrderSchema as BaseOrderSchema, OrderItemSchema as BaseOrderItemSchema } from "@/generated/zod";
import { PaymentMethodSchema } from "@/modules/payment-method/schema";
import { AddressSchema } from "@/modules/address/schema";
import { ProductSchema } from "@/modules/product/schema";

export const OrderItemSchema = BaseOrderItemSchema.extend({
  product: ProductSchema,
});

// Order Schema
export const OrderSchema = BaseOrderSchema.extend({
  totalAmount: z.number().positive(),
  subtotalAmount: z.number().positive(),
  shippingCost: z.number().nonnegative(),
  shippingAddress: AddressSchema,
  paymentMethod: PaymentMethodSchema,
  orderItems: z.array(OrderItemSchema),
});

// Create Order Schema (for POST request)
export const CreateNewOrderSchema = z.object({
  addressId: z.string(),
  shippingMethodSlug: z.string(),
  paymentMethodSlug: z.string(),
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
  id: z.string().min(3, "Order ID is required"),
});
