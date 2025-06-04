import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { prisma } from "~/lib/prisma";
import { checkAuthorized } from "~/modules/auth/middleware";
import {
  AddProductToCartSchema,
  CartItemSchema,
  CartSchema,
} from "~/modules/cart/schema";
import { ErrorResponseSchema } from "~/modules/common/schema";

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
      200: {
        content: { "application/json": { schema: CartItemSchema } },
        description: "Successfully update product in cart",
      },
      201: {
        content: { "application/json": { schema: CartItemSchema } },
        description: "Successfully add product to cart",
      },
      400: {
        content: { "application/json": { schema: ErrorResponseSchema } },
        description: "Failed to add product to cart",
      },
      500: {
        content: { "application/json": { schema: ErrorResponseSchema } },
        description: "Internal server error",
      },
    },
  }),
  async (c) => {
    // Calculate subTotalPrice and totalPrice

    try {
      const user = c.get("user");
      const body = c.req.valid("json");

      const cart = await prisma.cart.findFirst({
        where: { userId: user.id },
        include: { items: true },
      });
      if (!cart) throw new Error("No user's cart found");

      const product = await prisma.product.findUnique({
        where: { id: body.productId },
      });
      if (!product) throw new Error("No product found");

      const hasEnoughStock = product.stockQuantity >= body.quantity;
      if (!hasEnoughStock) {
        return c.json(
          { message: "The quantity is larger than available stock." },
          400
        );
      }

      const cartItemWithProduct = cart.items.find((item) => {
        return item.productId === body.productId;
      });
      if (!cartItemWithProduct) {
        const cartItem = await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: body.productId,
            quantity: body.quantity,
          },
          include: { product: { include: { images: true } } },
        });
        return c.json(cartItem, 201);
      }

      const newCartItem = await prisma.cartItem.update({
        where: { id: cartItemWithProduct.id },
        data: { quantity: body.quantity },
        include: { product: { include: { images: true } } },
      });

      return c.json(newCartItem, 200);
    } catch (error) {
      return c.json({ message: "Failed to add product to cart", error }, 500);
    }
  }
);
