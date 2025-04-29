import { z } from "@hono/zod-openapi";

export const SuccessResponseSchema = z.object({
  message: z.string(),
  data: z.any().optional(),
});

export const ErrorResponseSchema = z.object({
  message: z.string(),
  error: z.any().optional(),
});
