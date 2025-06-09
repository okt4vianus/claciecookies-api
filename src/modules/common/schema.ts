import { z } from "@hono/zod-openapi";

export const SuccessResponseSchema = z.object({
  message: z.string(),
  data: z.any().optional(),
});

export const ErrorResponseSchema = z.object({
  message: z.string(),
  field: z.any().optional(),
  error: z.any().optional(),
});

export const ResponseStringSchema = z.object({ message: z.string() });

export const cardItemQuantitySchema = z
  .number()
  .int()
  .positive("Quantity must be a positive integer")
  .min(1, "Quantity must be at least 1");

export const stockQuantitySchema = z
  .number()
  .int()
  .nonnegative("Quantity must be a non-negative integer");
