import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { prisma } from "~/lib/prisma";
import { ShippingMethodSchema } from "~/modules/shipping/schema";

export const shippingRoute = new OpenAPIHono();

const tags = ["Shipping"];

// ✅ GET /shipping-methods
shippingRoute.openapi(
  createRoute({
    tags,
    summary: "Get all shipping methods",
    method: "get",
    path: "/",
    responses: {
      200: {
        content: { "application/json": { schema: ShippingMethodSchema } },
        description: "Successfully retrieved all shipping methods",
      },
    },
  }),
  async (c) => {
    const shippingMethods = await prisma.shippingMethod.findMany({
      orderBy: [{ id: "asc" }, { createdAt: "asc" }],
    });

    return c.json(shippingMethods);
  }
);
