import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { prisma } from "~/lib/prisma";
import { checkAuthorized } from "~/modules/auth/middleware";
import { CreateNewOrderSchema, OrderSchema } from "~/modules/order/schema";
import { ErrorResponseSchema } from "~/modules/common/schema";

export const ordersRoute = new OpenAPIHono();

const tags = ["Orders"];

// POST /orders
ordersRoute.openapi(
  createRoute({
    tags,
    summary: "Create new order from checkout",
    method: "post",
    path: "/",
    security: [{ BearerAuth: [] }],
    middleware: checkAuthorized,
    request: {
      body: { content: { "application/json": { schema: CreateNewOrderSchema } } },
    },
    responses: {
      201: {
        content: { "application/json": { schema: OrderSchema } },
        description: "Successfully created order",
      },
      400: {
        content: { "application/json": { schema: ErrorResponseSchema } },
        description: "Cart is empty or insufficient stock",
      },
      404: {
        content: { "application/json": { schema: ErrorResponseSchema } },
        description: "Cart not found",
      },
      500: {
        content: { "application/json": { schema: ErrorResponseSchema } },
        description: "Internal server error",
      },
    },
  }),
  async (c) => {
    try {
      const user = c.get("user");
      const body = c.req.valid("json");

      const cart = await prisma.cart.findUnique({
        where: { userId: user.id },
        include: { items: { include: { product: true } } },
      });
      if (!cart || cart.items.length === 0) {
        return c.json({ message: "Cart is empty" }, 400);
      }

      const address = await prisma.address.findUnique({
        where: { id: body.addressId },
      });
      if (!address) {
        return c.json({ message: "Address not found" }, 400);
      }

      const shippingMethod = await prisma.shippingMethod.findUnique({
        where: { slug: body.shippingMethodSlug },
      });
      if (!shippingMethod) {
        return c.json({ message: "Shipping method not found" }, 400);
      }

      const paymentMethod = await prisma.paymentMethod.findUnique({
        where: { slug: body.paymentMethodSlug },
      });
      if (!paymentMethod) {
        return c.json({ message: "Shipping method not found" }, 400);
      }

      const shippingCost = shippingMethod?.price;
      const totalAmount = cart.totalPrice + shippingCost;

      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      const newOrder = await prisma.order.create({
        data: {
          status: "PENDING",
          orderNumber,

          userId: user.id,

          shippingAddressId: address.id, // TODO: Will copy the address
          notes: address.notes || "",

          courier: null,
          trackingNumber: null,

          paymentMethodId: paymentMethod.id,

          orderItems: {
            createMany: {
              data: cart.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price,
                total: item.quantity * item.product.price,
              })),
            },
          },

          subTotal: 0,
          shippingCost,
          discount: 0,
          totalAmount,
        },
      });

      return c.json(newOrder, 201);
    } catch (error) {
      console.error("Create new order error:", error);
      return c.json({ message: "Failed to create new order", error }, 500);
    }
  }
);
