import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { prisma } from "@/lib/prisma";
import { OrderSchema, ParamOrderIdSchema } from "@/modules/order/schema";
import { Env } from "@/index";

export const ordersRoute = new OpenAPIHono<Env>();

const tags = ["Orders"];

// GET /orders/{id}
ordersRoute.openapi(
  createRoute({
    method: "get",
    path: "/{id}",
    summary: "Get order by ID",
    tags,
    request: { params: ParamOrderIdSchema },
    responses: {
      200: {
        description: "Get Order detail by id",
        content: { "application/json": { schema: OrderSchema } },
      },
      401: { description: "Unauthorized" },
      404: { description: "Order not found" },
    },
  }),
  async (c) => {
    const user = c.get("user");
    if (!user) return c.text("Unauthorized", 401);

    const { id } = c.req.valid("param");

    try {
      const order = await prisma.order.findUnique({
        where: { id, userId: user.id },
        include: {
          shippingAddress: true,
          paymentMethod: true,
          orderItems: { include: { product: { include: { images: true } } } },
        },
      });

      if (!order || order.userId !== user.id) {
        return c.json({ message: `Order not found` }, 404);
      }

      return c.json(order);
    } catch (error) {
      console.error("[GET /orders/{id}] Error:", error);
      return c.json({ message: "Failed to get order by id" }, 500);
    }
  }
);
