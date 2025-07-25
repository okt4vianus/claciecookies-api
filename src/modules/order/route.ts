import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { prisma } from "~/lib/prisma";
import { CreateNewOrderSchema, OrderSchema, ParamOrderIdSchema } from "~/modules/order/schema";
import { ErrorResponseSchema } from "~/modules/common/schema";
import { Env } from "~/index";

export const ordersRoute = new OpenAPIHono<Env>();

const tags = ["Orders"];

// POST /orders
ordersRoute.openapi(
  createRoute({
    tags,
    summary: "Create new order from checkout",
    method: "post",
    path: "/",
    security: [{ BearerAuth: [] }],
    request: {
      body: { content: { "application/json": { schema: CreateNewOrderSchema } } },
    },
    responses: {
      401: { description: "Unauthorized" },
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
    const user = c.get("user");
    if (!user) return c.text("Unauthorized", 401);

    const body = c.req.valid("json");

    try {
      const [cart, address, shippingMethod, paymentMethod] = await Promise.all([
        prisma.cart.findUnique({
          where: { userId: user.id },
          include: { items: { include: { product: true } } },
        }),
        prisma.address.findUnique({ where: { id: body.addressId } }),
        prisma.shippingMethod.findUnique({
          where: { slug: body.shippingMethodSlug },
        }),
        prisma.paymentMethod.findUnique({
          where: { slug: body.paymentMethodSlug },
        }),
      ]);

      if (!cart || cart.items.length === 0) {
        return c.json({ message: "Cart is empty" }, 400);
      }
      if (!address) {
        return c.json({ message: "Address not found" }, 400);
      }
      if (!shippingMethod) {
        return c.json({ message: "Shipping method not found" }, 400);
      }
      if (!paymentMethod) {
        return c.json({ message: "Payment method not found" }, 400);
      }

      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const shippingCost = shippingMethod.price;
      const totalAmount = cart.totalPrice + shippingCost;

      const newOrder = await prisma.order.create({
        data: {
          status: "PENDING",
          orderNumber,
          userId: user.id,
          shippingAddressId: address.id, // TODO: will copy the address
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
          subTotal: cart.totalPrice,
          shippingCost,
          discount: 0,
          totalAmount,
        },
        include: {
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  price: true,
                  images: true,
                  description: true,
                  stockQuantity: true,
                },
              },
            },
          },
          shippingAddress: true,
          paymentMethod: true,
        },
      });

      const response = {
        ...newOrder,
        subtotalAmount: newOrder.subTotal,
        orderItems: newOrder.orderItems.map((item) => ({
          ...item,
          subtotal: item.total,
          product: {
            id: item.product.id,
            name: item.product.name,
            slug: item.product.slug,
            price: item.product.price,
            description: item.product.description || "",
            images: item.product.images || [],
            stockQuantity: item.product.stockQuantity || 0,
          },
        })),
      };

      return c.json(response, 201);
    } catch (error) {
      console.error("Create new order error:", error);
      return c.json({ message: "Failed to create new order" }, 500);
    }
  }
);

// GET /orders/{id}
ordersRoute.openapi(
  createRoute({
    method: "get",
    path: "/{id}",
    summary: "Get order by ID",
    tags,
    security: [{ BearerAuth: [] }],
    request: { params: ParamOrderIdSchema },
    responses: {
      401: { description: "Unauthorized" },
      200: {
        description: "Get Order detail by id",
        content: { "application/json": { schema: OrderSchema } },
      },
      404: { description: "Order not found" },
    },
  }),
  async (c) => {
    const user = c.get("user");
    if (!user) return c.text("Unauthorized", 401);

    const { id } = c.req.valid("param");

    try {
      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          shippingAddress: true,
          paymentMethod: true,
          orderItems: { include: { product: { include: { images: true } } } },
        },
      });

      if (!order || order.userId !== user.id) {
        return c.json({ message: `Order by id ${id} not found` }, 404);
      }

      return c.json(order);
    } catch (error) {
      console.error("[GET /orders/{id}] Error:", error);
      return c.json({ message: "Failed to get order by id" }, 500);
    }
  }
);
