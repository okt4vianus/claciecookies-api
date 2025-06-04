import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { prisma } from "~/lib/prisma";
import { checkAuthorized } from "~/modules/auth/middleware";
import { CartSchema } from "~/modules/cart/schema";

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
