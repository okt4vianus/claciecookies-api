import { z } from "@hono/zod-openapi";

export const SuccessResponseSchema = z.object({
  message: z.string(),
  data: z.any().optional(),
});

export const ErrorResponseSchema = z.object({
  message: z.string(),
  error: z.any().optional(),
});

export const StockQuantitySchema = z
  .number()
  .int()
  .nonnegative("Must be more than or equal to 0");

export const CartItemQuantitySchema = z
  .number()
  .int()
  .min(1)
  .nonnegative("Must be more than or equal to 1");
