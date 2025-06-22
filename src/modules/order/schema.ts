import { z } from "zod";

// Order Item Schema
export const OrderItemSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  productId: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
  subtotal: z.number().positive(),
  product: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
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
  }),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Order Schema
export const OrderSchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  userId: z.string(),
  status: z.enum([
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ]),
  totalAmount: z.number().positive(),
  subtotalAmount: z.number().positive(),
  shippingCost: z.number().nonnegative(),

  // Customer Information
  customerName: z.string(),
  customerEmail: z.string().email(),
  customerPhone: z.string(),

  // Shipping Information
  shippingAddress: z.string(),
  shippingCity: z.string(),
  shippingPostalCode: z.string(),
  shippingMethod: z.enum(["regular", "express", "same_day"]),

  // Payment Information
  paymentMethod: z.enum(["bank_transfer", "e_wallet", "cod"]),
  paymentStatus: z.enum(["pending", "paid", "failed", "cancelled"]),

  // Optional fields
  notes: z.string().optional(),
  trackingNumber: z.string().optional(),

  // Order Items
  items: z.array(OrderItemSchema),

  // Timestamps
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Create Order Schema (for POST request)
export const CreateOrderSchema = z.object({
  fullName: z.string().min(1, "Nama lengkap wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  phone: z.string().min(10, "Nomor telepon minimal 10 digit"),
  address: z.string().min(10, "Alamat minimal 10 karakter"),
  city: z.string().min(1, "Kota wajib diisi"),
  postalCode: z.string().min(5, "Kode pos minimal 5 digit"),
  shippingMethod: z.enum(["regular", "express", "same_day"]),
  paymentMethod: z.enum(["bank_transfer", "e_wallet", "cod"]),
  notes: z.string().optional(),
});

// Order List Schema
export const OrderListSchema = z.array(OrderSchema);

// Update Order Status Schema
export const UpdateOrderStatusSchema = z.object({
  status: z.enum([
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ]),
});

// Param Schema
export const ParamOrderIdSchema = z.object({
  id: z.string().min(1, "Order ID is required"),
});

// Checkout Schema (sama dengan CreateOrderSchema, tapi untuk frontend)
export const CheckoutSchema = CreateOrderSchema;
