import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { prisma } from "~/lib/prisma";
import { checkAuthorized } from "~/modules/auth/middleware";
import {
  AddProductToCartSchema,
  CartItemSchema,
  CartSchema,
} from "~/modules/cart/schema";
import { ErrorResponseSchema } from "../common/schema";

export const cartRoute = new OpenAPIHono();

const tags = ["Cart"];

// ✅ GET /cart
cartRoute.openapi(
  createRoute({
    tags,
    summary: "Get user's cart",
    method: "get",
    path: "/",
    security: [{ BearerAuth: [] }],
    middleware: checkAuthorized,
    responses: {
      200: {
        content: { "application/json": { schema: CartSchema } },
        description: "Successfully get user's cart",
      },
    },
  }),
  async (c) => {
    const user = c.get("user");

    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
      include: {
        items: { include: { product: { include: { images: true } } } },
      },
    });

    if (!cart) {
      const newCart = await prisma.cart.create({
        data: { userId: user.id },
        include: {
          items: { include: { product: { include: { images: true } } } },
        },
      });

      return c.json(newCart);
    }

    return c.json(cart);
  }
);

// PUT /cart/items
// will also calculate the subtotal and total price
cartRoute.openapi(
  createRoute({
    tags,
    summary: "Add product to cart",
    method: "put",
    path: "/items",
    security: [{ BearerAuth: [] }],
    middleware: checkAuthorized,
    request: {
      body: {
        content: { "application/json": { schema: AddProductToCartSchema } },
      },
    },
    responses: {
      201: {
        content: { "application/json": { schema: CartItemSchema } },
        description: "Product created successfully",
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

      const cart = await prisma.cart.findFirst({
        where: { userId: user.id },
      });
      if (!cart) throw new Error("No user's cart");

      const cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: body.productId,
          quantity: body.quantity,
        },
        include: { product: { include: { images: true } } },
      });

      return c.json(cartItem, 201);
    } catch (error) {
      return c.json({ message: "Failed to add product to cart", error }, 500);
    }
  }
);
