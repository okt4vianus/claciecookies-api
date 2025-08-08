import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { prisma } from "@/lib/prisma";
import { CreateCheckoutBodySchema, GetCheckoutResponseSchema } from "@/modules/checkout/schema";
import { Env } from "@/index";
import { OrderSchema } from "@/modules/order/schema";
import { ErrorResponseSchema } from "@/modules/common/schema";
import { AddressSchema } from "@/modules/address/schema";
import { PrivateUserProfileSchema } from "@/modules/user/schema";

export const checkoutRoute = new OpenAPIHono<Env>();
const tags = ["Checkout"];

// GET /checkout
checkoutRoute.openapi(
  createRoute({
    tags,
    summary: "Get checkout page data (profile, cart, address, shipping-methods, payment-methods)",
    method: "get",
    path: "/checkout",
    responses: {
      401: { description: "Unauthorized" },
      200: {
        description: "Successfully fetched all checkout data",
        content: { "application/json": { schema: GetCheckoutResponseSchema } },
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

// POST /checkout
checkoutRoute.openapi(
  createRoute({
    tags,
    summary:
      "Checkout to validate customer info, shipping address, shipping method, payment method; before create new order",
    method: "post",
    path: "/checkout",
    request: { body: { content: { "application/json": { schema: CreateCheckoutBodySchema } } } },
    responses: {
      201: {
        description: "Successfully checked out and created new order",
        content: { "application/json": { schema: OrderSchema } },
      },
      401: { description: "Unauthorized" },
      404: {
        content: { "application/json": { schema: ErrorResponseSchema } },
        description: "Cart not found",
      },
      500: { description: "Server error" },
    },
  }),
  async (c) => {
    const user = c.get("user");
    if (!user) return c.text("Unauthorized", 401);
    const body = c.req.valid("json");

    try {
      const [cart, address, shippingMethod, paymentMethod] = await Promise.all([
        prisma.cart.findFirst({
          where: { userId: user.id },
          include: { items: { include: { product: { include: { images: true } } } } },
        }),
        prisma.address.findFirst({
          where: { id: body.addressId, userId: user.id },
        }),
        prisma.shippingMethod.findUnique({
          where: { slug: body.shippingMethodSlug },
        }),
        prisma.paymentMethod.findUnique({
          where: { slug: body.paymentMethodSlug },
        }),
      ]);

      if (!cart || cart.items.length === 0) return c.json({ message: "Cart not found or empty" }, 404);
      if (!address) return c.json({ message: "Address not found" }, 404);
      if (!shippingMethod) return c.json({ message: "Shipping method not found" }, 404);
      if (!paymentMethod) return c.json({ message: "Payment method not found" }, 404);

      const userParssed = PrivateUserProfileSchema.safeParse(user);
      if (!userParssed.success)
        return c.json({ message: "Please complete customer information: full name, email address, phone number" }, 400);

      const addressParsed = AddressSchema.safeParse(address);
      if (!addressParsed.success) return c.json({ message: "Please complete address information" }, 400);

      // TODO: Refactor into separate function
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const shippingCost = shippingMethod.price;
      const totalAmount = cart.totalPrice + shippingCost;

      const order = await prisma.order.create({
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
          orderItems: { include: { product: { include: { images: true } } } },
          shippingAddress: true,
          paymentMethod: true,
        },
      });

      return c.json(order, 201);
    } catch (error) {
      console.error("[GET /checkout] error:", error);
      return c.json({ message: "Failed to load checkout data", error }, 500);
    }
  }
);
