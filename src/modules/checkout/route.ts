import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { prisma } from "~/lib/prisma";
import { ErrorResponseSchema } from "~/modules/common/schema";
import { CheckoutResponseSchema } from "~/modules/checkout/schema";
import { Env } from "~/index";

export const checkoutRoute = new OpenAPIHono<Env>();
const tags = ["Checkout"];

// GET /checkout
checkoutRoute.openapi(
  createRoute({
    tags,
    summary: "Get checkout page data (profile, cart, address, shipping-methods, payment-methods)",
    method: "get",
    path: "/checkout",
    security: [{ BearerAuth: [] }],
    responses: {
      401: { description: "Unauthorized" },
      200: {
        description: "Successfully fetched all checkout data",
        content: { "application/json": { schema: CheckoutResponseSchema } },
      },
      500: { description: "Server error" },
    },
  }),
  async (c) => {
    const user = c.get("user");
    if (!user) return c.text("Unauthorized", 401);

    try {
      const cart = await prisma.cart.findFirst({
        where: { userId: user.id },
        include: {
          items: { include: { product: { include: { images: true } } } },
        },
      });

      if (!cart) return c.json({ message: "Cart not found" }, 401);

      let address = await prisma.address.findFirst({
        where: { userId: user.id, isDefault: true },
      });

      if (!address) {
        address = await prisma.address.create({
          data: {
            isDefault: true,
            userId: user.id,
            label: "Rumah",
            recipientName: user.name,
            phoneNumber: user.phoneNumber || "+62",
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
        user,
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
