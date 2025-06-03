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
        description: "Search results of products",
      },
    },
  }),
  async (c) => {
    const query = c.req.query("q");
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { slug: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: [{ id: "asc" }, { createdAt: "asc" }],
      include: { images: true },
    });

    return c.json(products);
  }
);
