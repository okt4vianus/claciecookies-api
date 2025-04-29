import { z } from "zod";

// Schema Create Product (name, price, required)
export const CreateProductSchema = z.object({
  name: z.string().min(3, "Name is required"),
  slug: z.string().min(3).optional(),
  description: z.string().optional(),
  price: z.number().int().positive("Price must be a positive number"),
  stockQuantity: z
    .number()
    .int()
    .positive("Stock quantity must be a positive number"),
});

//   Schema Update Patch Product (all field optional)
export const UpdatePatchProductSchema = z.object({
  name: z.string().min(3).optional(),
  slug: z.string().min(3).optional(),
  description: z.string().optional(),
  price: z
    .number()
    .int()
    .positive("Price must be a positive number")
    .optional(),
  stockQuantity: z
    .number()
    .int()
    .positive("Stock quantity must be a positive number")
    .optional(),
});

export const ParamProductIdSchema = z.object({
  id: z.string().min(3, "Product ID is required"),
});

export const ParamProductSlugSchema = z.object({
  slug: z.string().min(3, "Product slug is required"),
});

export const ParamProductIdentifierSchema = z.object({
  identifier: z.string().min(3, "Identifier is required"), //Product ID or slug"
});

export const QuerySearchProductSchema = z.object({
  q: z.string().min(3, "Search query is required"),
});

// Schema for response
export const ProductResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  stockQuantity: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ProductsResponseSchema = z.array(ProductResponseSchema);
