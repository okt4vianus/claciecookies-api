import { z } from "@hono/zod-openapi";
import { ProductImageSchema as BaseProductImageSchema } from "@/generated/zod";

export const ProductImageSchema = BaseProductImageSchema.extend({
  name: z.string().min(3, "Name is required"),
  url: z.string().url("URL is required"),
});

export const UpsertProductImageSchema = ProductImageSchema.pick({
  name: true,
  url: true,
});

export const CreateProductImageSchema = UpsertProductImageSchema.extend({
  productSlug: z.string().optional(),
});

// export const UpdatePatchProductImageSchema = z.object({
//   name: z.string().min(3).optional(),
//   url: z.string().url().optional(),
//   productSlug: z.string().optional(),
// });

export const ParamProductImageIdSchema = z.object({
  id: z.string().min(3, "Product Image ID is required"),
});

export const ParamProductImageIdentifierSchema = z.object({
  identifier: z.string().min(3, "Identifier is required"), // Product Image ID or name
});

export const ProductImageResponseSchema = ProductImageSchema;

export const ProductImagesResponseSchema = z.array(ProductImageSchema);
