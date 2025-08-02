import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { prisma } from "@/lib/prisma";
import { PaymentMethodsSchema } from "@/modules/payment-method/schema";

export const paymentMethodRoute = new OpenAPIHono();

const tags = ["Payment Method"];

// ✅ GET /payment-methods
paymentMethodRoute.openapi(
  createRoute({
    tags,
    summary: "Get all payment methods",
    method: "get",
    path: "/",
    responses: {
      200: {
        content: { "application/json": { schema: PaymentMethodsSchema } },
        description: "Successfully retrieved all payment methods",
      },
    },
  }),
  async (c) => {
    const paymentMethods = await prisma.paymentMethod.findMany({
      orderBy: [{ id: "asc" }],
    });

    return c.json(paymentMethods);
  }
);
