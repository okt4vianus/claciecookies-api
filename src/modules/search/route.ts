import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

import { prisma } from "~/lib/prisma";
import { ManyProductsResponseSchema } from "~/modules/product/schema";
import { SearchQuerySchema } from "~/modules/search/schema";

export const searchRoute = new OpenAPIHono();

const tags = ["Search"];

// ✅ GET /search?q={query}
searchRoute.openapi(
  createRoute({
    tags,
    summary: "Search products",
    method: "get",
    path: "/",
    request: {
      query: SearchQuerySchema,
    },
    responses: {
      200: {
        content: { "application/json": { schema: ManyProductsResponseSchema } },
        description: "Search results",
      },
    },
  }),
  async (c) => {
    const q = c.req.query("q");

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { slug: { contains: q || "", mode: "insensitive" } },
          { name: { contains: q || "", mode: "insensitive" } },
          { description: { contains: q || "", mode: "insensitive" } },
        ],
      },
      include: { images: true },
    });

    return c.json(products);
  }
);
