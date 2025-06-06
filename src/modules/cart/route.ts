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

// ✅ PUT /cart/items

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
        description: "Quantity exceeds available stock or invalid request",
      },
      404: {
        content: { "application/json": { schema: ErrorResponseSchema } },
        description: "Cart or Product not found",
      },
      500: {
        content: { "application/json": { schema: ErrorResponseSchema } },
        description: "Internal server error",
      },
    },
  }),
  async (c) => {
    try {
      const body = c.req.valid("json");
      const user = c.get("user");

      // Find the user's cart
      const cart = await prisma.cart.findFirst({
        where: { userId: user.id },
        include: {
          items: { include: { product: { include: { images: true } } } },
        },
      });

      if (!cart) return c.json({ message: "Cart not found" }, 404);

      // Find the product
      const product = await prisma.product.findUnique({
        where: { id: body.productId },
        select: { price: true, stockQuantity: true },
      });

      if (!product) return c.json({ message: "Product not found" }, 404);

      // Validate the quantity
      if (body.quantity <= 0) {
        return c.json({ message: "Quantity must be greater than 0" }, 400);
      }

      if (body.quantity > product.stockQuantity) {
        return c.json({ message: "Quantity exceeds available stock" }, 400);
      }

      // Check if the product is already in the cart
      const cartItemWithProduct = cart.items.find((item) => {
        return item.productId === body.productId;
      });

      if (!cartItemWithProduct) {
        // Create new cart item
        const cartItem = await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: body.productId,
            quantity: body.quantity,
            subTotalPrice: body.quantity * product.price, // Calculate subtotal price
          },
          include: {
            product: { include: { images: true } },
          },
        });

        // Calculate total price for new item
        const totalPrice =
          cart.items.reduce((total, item) => {
            return total + (item.subTotalPrice || 0);
          }, 0) + cartItem.subTotalPrice;

        // Save totalPrice to cart table
        await prisma.cart.update({
          where: { id: cart.id },
          data: { totalPrice },
        });

        return c.json(cartItem, 201);
      } else {
        // Update existing cart item
        const cartItem = await prisma.cartItem.update({
          where: { id: cartItemWithProduct.id },
          data: {
            quantity: body.quantity,
            subTotalPrice: body.quantity * product.price, // Update subtotal price

            // quantity: cartItemWithProduct.quantity + body.quantity,
            // subTotalPrice:
            //   (cartItemWithProduct.quantity + body.quantity) * product.price, // Update subtotal price
          },
          include: {
            product: { include: { images: true } },
          },
        });

        // Calculate total price for updated item
        const totalPrice = cart.items.reduce((total, item) => {
          if (item.productId === body.productId) {
            return total + cartItem.subTotalPrice;
          }
          return total + (item.subTotalPrice || 0);
        }, 0);

        // Save totalPrice to cart table
        await prisma.cart.update({
          where: { id: cart.id },
          data: { totalPrice },
        });

        return c.json(cartItem, 200);
      }
    } catch (error) {
      return c.json({ message: "Failed to add product to cart", error }, 500);
    }
  }
);
