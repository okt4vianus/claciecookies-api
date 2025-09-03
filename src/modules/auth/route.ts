import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { prisma } from "@/lib/prisma";
import { ErrorResponseSchema } from "@/modules/common/schema";
import { PrivateUserProfileSchema, UserSchema } from "@/modules/user/schema";
import { AddressesSchema } from "@/modules/address/schema";
import { Env } from "@/index";

export const authRoute = new OpenAPIHono<Env>();

const tags = ["Auth"];

// GET /auth/me
authRoute.openapi(
  createRoute({
    tags,
    summary: "Get authenticated user profile",
    method: "get",
    path: "/me",
    responses: {
      401: { description: "Unauthorized" },
      200: {
        description: "Successfully retrieved authenticated user",
        content: { "application/json": { schema: UserSchema } },
      },
      404: {
        description: "User not found",
        content: { "application/json": { schema: ErrorResponseSchema } },
      },
      500: {
        description: "Internal server error",
        content: { "application/json": { schema: ErrorResponseSchema } },
      },
    },
  }),
  async (c) => {
    try {
      const user = c.get("user");
      if (!user) return c.text("Unauthorized", 401);

      if (!user) return c.json({ message: "User not found" }, 404);
      return c.json(user, 200);
    } catch (error) {
      console.error("Error retrieving authenticated user:", error);
      return c.json(
        { message: "Failed to retrieve authenticated user", details: error },
        500
      );
    }
  }
);

// PATCH /auth/profile
authRoute.openapi(
  createRoute({
    tags,
    summary: "Update user profile",
    method: "patch",
    path: "/profile",
    request: {
      body: {
        content: { "application/json": { schema: PrivateUserProfileSchema } },
      },
    },
    responses: {
      200: {
        description: "Successfully updated user",
        content: { "application/json": { schema: PrivateUserProfileSchema } },
      },
      400: {
        description: "Error",
        content: { "application/json": { schema: ErrorResponseSchema } },
      },
      401: { description: "Unauthorized" },
    },
  }),
  async (c) => {
    const user = c.get("user");
    if (!user) return c.text("Unauthorized", 401);

    const userData = c.req.valid("json");

    try {
      const userProfile = await prisma.user.update({
        where: { id: user.id },
        data: userData,
      });
      return c.json(userProfile);
    } catch (error: any) {
      if (
        error.code === "P2002" &&
        error.meta &&
        Array.isArray(error.meta.target)
      ) {
        if (error.meta.target.includes("email")) {
          return c.json(
            {
              message: "Email already used by other user",
              field: "email",
              error: error,
            },
            400
          );
        }
        if (error.meta.target.includes("phoneNumber")) {
          return c.json(
            {
              message: "Phone number already used by other user",
              field: "phoneNumber",
              error: error,
            },
            400
          );
        }
      }
      return c.json(
        {
          message: "Failed to update user profile",
          error: error?.message || error,
        },
        400
      );
    }
  }
);

// GET /auth/addresses
authRoute.openapi(
  createRoute({
    tags,
    summary: "Get addresses of the auth user",
    method: "get",
    path: "/addresses",
    responses: {
      401: { description: "Unauthorized" },
      200: {
        description: "Successfully retrieved addresses",
        content: { "application/json": { schema: AddressesSchema } },
      },
      404: {
        description: "User not found",
        content: { "application/json": { schema: ErrorResponseSchema } },
      },
      500: {
        description: "Internal server error",
        content: { "application/json": { schema: ErrorResponseSchema } },
      },
    },
  }),
  async (c) => {
    const user = c.get("user");
    if (!user) return c.text("Unauthorized", 401);

    try {
      if (!user) {
        return c.json({ message: "User not found" }, 404);
      }

      const addresses = await prisma.address.findMany({
        where: { userId: user.id },
        orderBy: [{ createdAt: "asc" }],
      });
      if (!addresses || addresses.length === 0) {
        return c.json({ message: "No addresses found" }, 404);
      }

      return c.json(addresses, 200);
    } catch (error) {
      return c.json(
        { message: "Failed to retrieve addresses", details: error },
        500
      );
    }
  }
);
