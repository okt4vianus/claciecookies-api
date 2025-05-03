import { z } from "@hono/zod-openapi";
import { OneProductResponseSchema } from "../product/schema";

export const ProductImageSchema = z.object({
  id: z.string(),
  name: z.string().min(3, "Name is required"),
  url: z.string().url("URL is required"),
  productId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateProductImageSchema = ProductImageSchema.pick({
  name: true,
  url: true,
}).extend({
  productSlug: z.string().optional(),
});

export const UpdatePatchProductImageSchema = z.object({
  name: z.string().min(3).optional(),
  url: z.string().url().optional(),
  productSlug: z.string().optional(),
});

export const ParamProductImageIdSchema = z.object({
  id: z.string().min(3, "Product Image ID is required"),
});

export const ParamProductImageIdentifierSchema = z.object({
  identifier: z.string().min(3, "Identifier is required"), // Product Image ID or name
});

export const ProductImageResponseSchema = ProductImageSchema;

export const ProductImagesResponseSchema = z.array(ProductImageSchema);
