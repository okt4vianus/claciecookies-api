import { z } from "@hono/zod-openapi";
import { ProductResponseSchema } from "../product/schema";

// Schema for creating a new product image
export const CreateProductImageSchema = z.object({
  name: z.string().min(3, "Name is required"),
  url: z.string().url("URL is required"),
  productSlug: z.string().optional(),
});

// Schema Update Patch product image (all field optional)
export const UpdatePatchProductImageSchema = z.object({
  name: z.string().min(3).optional(),
  url: z.string().url().optional(),
  productSlug: z.string().optional(),
});

// Schema for parameter
export const ParamProductImageIdSchema = z.object({
  id: z.string().min(3, "Product Image ID is required"),
});

export const ParamProductImageIdentifierSchema = z.object({
  identifier: z.string().min(3, "Identifier is required"), // Product Image ID or name
});

export const ProductImageResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  product: ProductResponseSchema.optional().nullable(),
});

export const ProductImagesResponseSchema = z.array(ProductImageResponseSchema);
