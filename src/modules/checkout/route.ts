import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { prisma } from "~/lib/prisma";

import { checkAuthorized } from "~/modules/auth/middleware";
import { ErrorResponseSchema } from "~/modules/common/schema";
import { CheckoutResponseSchema } from "~/modules/checkout/schema";

export const checkoutRoute = new OpenAPIHono();
const tags = ["Checkout"];

// GET /checkout
checkoutRoute.openapi(
  createRoute({
    tags,
    summary: "Get checkout page data (profile, cart, address, shipping-methods, payment-methods)",
    method: "get",
    path: "/checkout",
    security: [{ BearerAuth: [] }],
    middleware: checkAuthorized,
    responses: {
      200: {
        description: "Successfully fetched all checkout data",
        content: {
          "application/json": {
            schema: CheckoutResponseSchema,
          },
        },
      },

      401: {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
      500: {
        description: "Server error",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  }),
  async (c) => {
    const user = c.get("user");

    try {
      // Get user profile
      const foundUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          name: true,
          email: true,
          phoneNumber: true,
        },
      });

      if (!foundUser) {
        return c.json({ message: "User not found" }, 401);
      }

      // Get or create cart
      let cart = await prisma.cart.findFirst({
        where: { userId: user.id },
        include: {
          items: { include: { product: { include: { images: true } } } },
        },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId: user.id },
          include: {
            items: { include: { product: { include: { images: true } } } },
          },
        });
      }

      // Get or create default address
      let address = await prisma.address.findFirst({
        where: { userId: user.id, isDefault: true },
      });

      if (!address) {
        address = await prisma.address.create({
          data: {
            isDefault: true,
            userId: user.id,
            label: "Rumah",
            recipientName: foundUser.name,
            phoneNumber: foundUser.phoneNumber || "+62",
            street: "",
            city: "",
            postalCode: "",
          },
        });
      }

      // Get shipping and payment methods
      const [shippingMethods, paymentMethods] = await Promise.all([
        prisma.shippingMethod.findMany({
          orderBy: [{ id: "asc" }],
        }),
        prisma.paymentMethod.findMany({
          orderBy: [{ id: "asc" }],
        }),
      ]);

      return c.json({
        profile: foundUser,
        cart,
        address,
        shippingMethods,
        paymentMethods,
      });
    } catch (error) {
      console.error("[GET /checkout] error:", error);
      return c.json({ message: "Failed to load checkout data", error }, 500);
    }
  }
);
