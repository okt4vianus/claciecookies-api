import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { prisma } from "@/lib/prisma";
import { ProductImagesResponseSchema } from "@/modules/product-image/schema";

export const productImagesRoute = new OpenAPIHono();

const tags = ["Product Image"];

// GET /productImages
productImagesRoute.openapi(
  createRoute({
    tags,
    summary: "Get all product images",
    method: "get",
    path: "/",
    responses: {
      200: {
        content: {
          "application/json": { schema: ProductImagesResponseSchema },
        },
        description: "Get all product images",
      },
    },
  }),
  async (c) => {
    const productImages = await prisma.productImage.findMany({
      relationLoadStrategy: "join",
      include: {
        product: true,
      },
      orderBy: [{ id: "asc" }, { createdAt: "asc" }],
    });

    return c.json(productImages);
  }
);

// ✅ POST /productImages
// productImagesRoute.openapi(
//   createRoute({
//     tags,
//     summary: "Create a new product image",
//     method: "post",
//     path: "/",
//     request: {
//       body: {
//         content: { "application/json": { schema: CreateProductImageSchema } },
//       },
//     },
//     responses: {
//       201: {
//         content: { "application/json": { schema: ProductImageResponseSchema } },
//         description: "Product Image created successfully",
//       },
//       500: {
//         content: { "application/json": { schema: ErrorResponseSchema } },
//         description: "Internal server error",
//       },
//     },
//   }),
//   async (c) => {
//     try {
//       const { productSlug, ...body } = c.req.valid("json");

//       const productImage = await prisma.productImage.create({
//         data: {
//           ...body,
//           //   name: body.name ?? createNewSlug(body.name),
//           product: productSlug ? { connect: { slug: productSlug } } : undefined,
//         },
//         // include: { product: true },
//       });

//       return c.json(productImage, 201);
//     } catch (error) {
//       return c.json(
//         { message: "Failed to create new product image", error },
//         500
//       );
//     }
//   }
// );
