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
    // const query = c.req.query("q");
    // const products = await prisma.product.findMany({
    //   where: {
    //     OR: [
    //       { name: { contains: query, mode: "insensitive" } },
    //       { slug: { contains: query, mode: "insensitive" } },
    //       { description: { contains: query, mode: "insensitive" } },
    //     ],
    //   },
    //   orderBy: [{ id: "asc" }, { createdAt: "asc" }],
    //   include: { images: true },
    // });

    // Cek word by word
    const rawQuery = c.req.query("q") || "";
    const keywords = rawQuery.trim().split(/\s+/).filter(Boolean);

    if (keywords.length === 0) {
      return c.json([]);
    }

    const conditions = keywords.flatMap((word) => [
      { name: { contains: word, mode: "insensitive" as const } },
      { slug: { contains: word, mode: "insensitive" as const } },
      { description: { contains: word, mode: "insensitive" as const } },
    ]);

    const products = await prisma.product.findMany({
      where: { OR: conditions },
      orderBy: [{ id: "asc" }, { createdAt: "asc" }],
      include: { images: true },
    });

    return c.json(products);
  }
);
