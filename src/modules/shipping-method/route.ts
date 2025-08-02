import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { prisma } from "@/lib/prisma";
import { ShippingMethodsSchema } from "@/modules/shipping-method/schema";

export const shippingMethodRoute = new OpenAPIHono();

const tags = ["Shipping Method"];

// ✅ GET /shipping-methods
shippingMethodRoute.openapi(
  createRoute({
    tags,
    summary: "Get all shipping methods",
    method: "get",
    path: "/",
    responses: {
      200: {
        content: { "application/json": { schema: ShippingMethodsSchema } },
        description: "Successfully retrieved all shipping methods",
      },
    },
  }),
  async (c) => {
    const shippingMethods = await prisma.shippingMethod.findMany({
      orderBy: [{ id: "asc" }],
    });

    return c.json(shippingMethods);
  }
);
