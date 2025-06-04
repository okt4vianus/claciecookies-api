import { z } from "zod";
import {
  ProductImageSchema,
  UpsertProductImageSchema,
} from "~/modules/product-image/schema";
import { ProductSchema as BaseProductSchema } from "~/generated/zod";

// export const ProductSchema = z.object({
//   id: z.string(),
//   name: z.string().min(3, "Name is required"),
//   slug: z.string(),
//   description: z.string().optional(),
//   price: z.number().int().positive("Price must be a positive number"),
//   stockQuantity: z
//     .number()
//     .int()
//     .nonnegative("Stock quantity must be more than or equal to 0"),
//   images: z.array(ProductImageSchema).optional(),
//   createdAt: z.date(),
//   updatedAt: z.date(),
// });

export const ProductSchema = BaseProductSchema.extend({
  name: z.string().min(3, "Name is required"),
  description: z.string().optional(),
  price: z.number().int().positive("Price must be a positive number"),
  stockQuantity: z
    .number()
    .int()
    .nonnegative("Stock quantity must be more than or equal to 0"),
  images: z.array(ProductImageSchema).optional(),
});

export const CreateProductSchema = ProductSchema.omit({
  id: true,
}).extend({
  slug: z.string().optional(),
  images: z.array(UpsertProductImageSchema).optional(),
});

export const UpsertProductSchema = CreateProductSchema.partial();

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

export const OneProductResponseSchema = ProductSchema;

export const ManyProductsResponseSchema = z.array(ProductSchema);
