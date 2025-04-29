import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { ProductImagesResponseSchema } from "./schema";
import { prisma } from "../../lib/prisma";

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
