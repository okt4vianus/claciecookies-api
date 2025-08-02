import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { Env } from "@/index";
import { prisma } from "@/lib/prisma";
import {
  AddProductToCartSchema,
  CartItemSchema,
  CartSchema,
  ParamItemIdSchema,
  UpdateCartItemQuantitySchema,
} from "@/modules/cart/schema";
import { ErrorResponseSchema, ResponseStringSchema } from "@/modules/common/schema";

export const cartRoute = new OpenAPIHono<Env>();

const tags = ["Cart"];

// GET /cart
cartRoute.openapi(
  createRoute({
    tags,
    summary: "Get user's cart",
    method: "get",
    path: "/",
    responses: {
      401: { description: "Unauthorized" },
      200: {
        content: { "application/json": { schema: CartSchema } },
        description: "Successfully get user's cart",
      },
    },
  }),
  async (c) => {
    const user = c.get("user");
    if (!user) return c.text("Unauthorized", 401);

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
cartRoute.openapi(
  createRoute({
    tags,
    summary: "Update product in cart",
    method: "put",
    path: "/items",
    request: {
      body: {
        content: { "application/json": { schema: AddProductToCartSchema } },
      },
    },
    responses: {
      401: { description: "Unauthorized" },

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
      const user = c.get("user");
      if (!user) return c.text("Unauthorized", 401);

      const body = c.req.valid("json");

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
        // Update existing cart item by adding more quantity or replacing quantity
        let newQuantity = 0;
        if (body.intent === "add") {
          newQuantity = cartItemWithProduct.quantity + body.quantity;
        } else if (body.intent === "update") {
          newQuantity = body.quantity;
        } else {
          newQuantity = 1;
        }

        // Validate the new quantity against stock
        if (newQuantity > product.stockQuantity) {
          return c.json(
            {
              message: `Quantity exceeds available stock. Available: ${product.stockQuantity}`,
            },
            400
          );
        }

        // Update existing cart item
        const cartItem = await prisma.cartItem.update({
          where: { id: cartItemWithProduct.id },
          data: {
            quantity: newQuantity,
            subTotalPrice: newQuantity * product.price,
          },
          include: { product: { include: { images: true } } },
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

// DELETE /cart/items/{id}
cartRoute.openapi(
  createRoute({
    tags,
    summary: "Remove item from cart",
    method: "delete",
    path: "/items/{id}",
    request: {
      params: ParamItemIdSchema,
    },
    responses: {
      401: { description: "Unauthorized" },
      200: {
        content: { "application/json": { schema: ResponseStringSchema } },
        description: "Successfully removed item from cart",
      },
      404: {
        content: { "application/json": { schema: ErrorResponseSchema } },
        description: "Cart item not found or doesn't belong to user",
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
      if (!user) return c.text("Unauthorized", 401);

      const { id: itemId } = c.req.valid("param");

      // Find the user's cart
      const cart = await prisma.cart.findFirst({
        where: { userId: user.id },
        include: {
          items: true,
        },
      });

      if (!cart) {
        return c.json({ message: "Cart not found" }, 404);
      }

      // Find the cart item to delete
      const cartItem = await prisma.cartItem.findFirst({
        where: {
          id: itemId,
          cartId: cart.id, // Ensure the item belongs to the user's cart
        },
        include: {
          product: { select: { id: true, name: true } },
        },
      });

      if (!cartItem) {
        return c.json({ message: "Cart item not found" }, 404);
      }

      // Delete the cart item
      await prisma.cartItem.delete({
        where: { id: cartItem.id },
      });

      // Recalculate total price after deletion
      const remainingItems = await prisma.cartItem.findMany({
        where: { cartId: cart.id },
      });

      const totalPrice = remainingItems.reduce((total, item) => {
        return total + (item.subTotalPrice || 0);
      }, 0);

      // Update cart total price
      await prisma.cart.update({
        where: { id: cart.id },
        data: { totalPrice },
      });

      return c.json(
        {
          message: "Item successfully removed from cart",
          deletedItem: cartItem,
        },
        200
      );
    } catch (error) {
      return c.json({ message: "Failed to remove item from cart", error }, 500);
    }
  }
);

// PATCH /cart/items/{id}
cartRoute.openapi(
  createRoute({
    tags,
    summary: "Update product quantity in cart",
    method: "patch",
    path: "/items/{id}",
    request: {
      params: ParamItemIdSchema,
      body: {
        content: {
          "application/json": {
            schema: UpdateCartItemQuantitySchema, //cardItemQuantitySchema,
          },
        },
      },
    },
    responses: {
      401: { description: "Unauthorized" },
      200: {
        content: {
          "application/json": { schema: UpdateCartItemQuantitySchema },
        },
        description: "Successfully updated product quantity in cart",
      },
      400: {
        content: { "application/json": { schema: ErrorResponseSchema } },
        description: "Quantity exceeds available stock or invalid request",
      },
      404: {
        content: { "application/json": { schema: ErrorResponseSchema } },
        description: "Cart item not found or doesn't belong to user",
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
      if (!user) return c.text("Unauthorized", 401);

      const { id: itemId } = c.req.valid("param");
      const body = c.req.valid("json");

      // Find the user's cart
      const cart = await prisma.cart.findFirst({
        where: { userId: user.id },
        include: {
          items: true,
        },
      });

      if (!cart) {
        return c.json({ message: "Cart not found" }, 404);
      }

      // Find the cart item to update
      const cartItem = await prisma.cartItem.findFirst({
        where: {
          id: itemId,
          cartId: cart.id, // Ensure the item belongs to the user's cart
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              stockQuantity: true,
              images: true,
            },
          },
        },
      });

      if (!cartItem) {
        return c.json({ message: "Cart item not found" }, 404);
      }

      // Validate the new quantity against stock
      if (body.quantity > cartItem.product.stockQuantity) {
        return c.json(
          {
            message: `Quantity exceeds available stock. Available: ${cartItem.product.stockQuantity}`,
          },
          400
        );
      }

      // Update the cart item quantity and subtotal
      const updatedCartItem = await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: {
          quantity: body.quantity,
          subTotalPrice: body.quantity * cartItem.product.price,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              images: true,
            },
          },
        },
      });

      // Recalculate total price for the entire cart
      const allCartItems = await prisma.cartItem.findMany({
        where: { cartId: cart.id },
      });

      const totalPrice = allCartItems.reduce((total, item) => {
        if (item.id === cartItem.id) {
          return total + updatedCartItem.subTotalPrice;
        }
        return total + (item.subTotalPrice || 0);
      }, 0);

      // Update cart total price
      await prisma.cart.update({
        where: { id: cart.id },
        data: { totalPrice },
      });

      return c.json(updatedCartItem, 200);
    } catch (error) {
      return c.json({ message: "Failed to update cart item quantity", error }, 500);
    }
  }
);
