import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { prisma } from "~/lib/prisma";
import { checkAuthorized } from "~/modules/auth/middleware";
import {
  CreateOrderSchema,
  OrderSchema,
  OrderListSchema,
  ParamOrderIdSchema,
  UpdateOrderStatusSchema,
} from "~/modules/order/schema";
import {
  ErrorResponseSchema,
  ResponseStringSchema,
} from "~/modules/common/schema";

export const ordersRoute = new OpenAPIHono();

const tags = ["Orders"];

// GET /orders
// ordersRoute.openapi(
//   createRoute({
//     tags,
//     summary: "Get user's orders",
//     method: "get",
//     path: "/",
//     security: [{ BearerAuth: [] }],
//     middleware: checkAuthorized,
//     responses: {
//       200: {
//         content: { "application/json": { schema: OrderListSchema } },
//         description: "Successfully get user's orders",
//       },
//     },
//   }),
//   async (c) => {
//     const user = c.get("user");

//     const orders = await prisma.order.findMany({
//       where: { userId: user.id },
//       include: {
//         items: {
//           include: {
//             product: {
//               include: { images: true },
//             },
//           },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     return c.json(orders);
//   }
// );

// GET /orders/{id}
// ordersRoute.openapi(
//   createRoute({
//     tags,
//     summary: "Get order by ID",
//     method: "get",
//     path: "/{id}",
//     security: [{ BearerAuth: [] }],
//     middleware: checkAuthorized,
//     request: {
//       params: ParamOrderIdSchema,
//     },
//     responses: {
//       200: {
//         content: { "application/json": { schema: OrderSchema } },
//         description: "Successfully get order details",
//       },
//       404: {
//         content: { "application/json": { schema: ErrorResponseSchema } },
//         description: "Order not found or doesn't belong to user",
//       },
//     },
//   }),
//   async (c) => {
//     const { id: orderId } = c.req.valid("param");
//     const user = c.get("user");

//     const order = await prisma.order.findFirst({
//       where: {
//         id: orderId,
//         userId: user.id,
//       },
//       include: {
//         items: {
//           include: {
//             product: {
//               include: { images: true },
//             },
//           },
//         },
//       },
//     });

//     if (!order) {
//       return c.json({ message: "Order not found" }, 404);
//     }

//     return c.json(order);
//   }
// );

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
      body: {
        content: { "application/json": { schema: CreateOrderSchema } },
      },
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
      const body = c.req.valid("json");

      const user = c.get("user");

      const cart = await prisma.cart.findUnique({
        where: { userId: user.id },
        include: { items: true },
      });

      if (!cart || cart.items.length === 0) {
        return c.json({ message: "Cart is empty" }, 400);
      }
      // Calculate shipping cost
      const getShippingCost = (method: string) => {
        switch (method) {
          case "express":
            return 25000;
          case "same_day":
            return 50000;
          default:
            return 15000;
        }
      };

      const shippingCost = getShippingCost(body.shippingMethod);
      const totalAmount = cart.totalPrice + shippingCost;

      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase()}`;

      // Create the order
      const order = await prisma.order.create({
        data: {
          status: "PENDING",
          orderNumber,
          userId: user.id,

          // Shipping info
          shippingAddressId: body.shippingAddressId,
          notes: body.notes,

          // Shipping method
          courier: body.shippingMethod,

          // Payment method
          paymentMethodId: body.paymentMethod,

          // Pricing
          subTotal: cart.totalPrice,
          shippingCost: 15000, //{...value of shippingMethod},
          discount: 0,
          totalAmount: totalAmount,

          // Create order items
          
      }

      // Update product stock quantities

      // Clear the cart after successful order creation

      return c.json(order, 201)
    } catch (error) {
      console.error("Create order error:", error);
      return c.json({ message: "Failed to create order", error }, 500);
    }
  }
);

// PATCH /orders/{id}/status
// ordersRoute.openapi(
//   createRoute({
//     tags,
//     summary: "Update order status (Admin only)",
//     method: "patch",
//     path: "/{id}/status",
//     security: [{ BearerAuth: [] }],
//     middleware: checkAuthorized,
//     request: {
//       params: ParamOrderIdSchema,
//       body: {
//         content: { "application/json": { schema: UpdateOrderStatusSchema } },
//       },
//     },
//     responses: {
//       200: {
//         content: { "application/json": { schema: OrderSchema } },
//         description: "Successfully updated order status",
//       },
//       403: {
//         content: { "application/json": { schema: ErrorResponseSchema } },
//         description: "Forbidden - Admin access required",
//       },
//       404: {
//         content: { "application/json": { schema: ErrorResponseSchema } },
//         description: "Order not found",
//       },
//     },
//   }),
//   async (c) => {
//     try {
//       const { id: orderId } = c.req.valid("param");
//       const body = c.req.valid("json");
//       const user = c.get("user");

//       // Check if user is admin (you might want to add role check here)
//       // if (user.role !== "admin") {
//       //   return c.json({ message: "Admin access required" }, 403);
//       // }

//       const order = await prisma.order.update({
//         where: { id: orderId },
//         data: {
//           status: body.status,
//           ...(body.status === "completed" && { paymentStatus: "paid" }),
//           ...(body.status === "cancelled" && { paymentStatus: "cancelled" }),
//         },
//         include: {
//           items: {
//             include: {
//               product: {
//                 include: { images: true },
//               },
//             },
//           },
//         },
//       });

//       return c.json(order);
//     } catch (error) {
//       return c.json({ message: "Failed to update order status", error }, 500);
//     }
//   }
// );

// // DELETE /orders/{id} - Cancel order
// ordersRoute.openapi(
//   createRoute({
//     tags,
//     summary: "Cancel order",
//     method: "delete",
//     path: "/{id}",
//     security: [{ BearerAuth: [] }],
//     middleware: checkAuthorized,
//     request: {
//       params: ParamOrderIdSchema,
//     },
//     responses: {
//       200: {
//         content: { "application/json": { schema: ResponseStringSchema } },
//         description: "Successfully cancelled order",
//       },
//       400: {
//         content: { "application/json": { schema: ErrorResponseSchema } },
//         description: "Order cannot be cancelled",
//       },
//       404: {
//         content: { "application/json": { schema: ErrorResponseSchema } },
//         description: "Order not found or doesn't belong to user",
//       },
//     },
//   }),
//   async (c) => {
//     try {
//       const { id: orderId } = c.req.valid("param");
//       const user = c.get("user");

//       const order = await prisma.order.findFirst({
//         where: {
//           id: orderId,
//           userId: user.id,
//         },
//         include: {
//           items: true,
//         },
//       });

//       if (!order) {
//         return c.json({ message: "Order not found" }, 404);
//       }

//       // Only allow cancellation if order is still pending
//       if (order.status !== "pending") {
//         return c.json({ message: "Order cannot be cancelled" }, 400);
//       }

//       // Restore product stock
//       for (const item of order.items) {
//         await prisma.product.update({
//           where: { id: item.productId },
//           data: {
//             stockQuantity: {
//               increment: item.quantity,
//             },
//           },
//         });
//       }

//       // Update order status to cancelled
//       await prisma.order.update({
//         where: { id: orderId },
//         data: {
//           status: "cancelled",
//           paymentStatus: "cancelled",
//         },
//       });

//       return c.json({ message: "Order successfully cancelled" });
//     } catch (error) {
//       return c.json({ message: "Failed to cancel order", error }, 500);
//     }
//   }
// );
