import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { prisma } from "~/lib/prisma";
import { ErrorResponseSchema } from "~/modules/common/schema";
import {
  ParamUserIdentifierSchema,
  PublicUserSchema,
  PublicUsersSchema,
} from "~/modules/user/schema";

export const usersRoute = new OpenAPIHono();

const tags = ["Users"];

// ✅ GET /users
usersRoute.openapi(
  createRoute({
    tags,
    summary: "Get all users",
    method: "get",
    path: "/",
    responses: {
      200: {
        content: { "application/json": { schema: PublicUsersSchema } },
        description: "Get all users",
      },
    },
  }),
  async (c) => {
    const users = await prisma.user.findMany({
      orderBy: [{ id: "asc" }, { createdAt: "asc" }],
      omit: { email: true },
    });

    return c.json(users);
  }
);

// ✅ GET /user/{identifier}
usersRoute.openapi(
  createRoute({
    tags,
    summary: "Get user by identifier (User ID or Username)",
    method: "get",
    path: "/{identifier}",
    request: {
      params: ParamUserIdentifierSchema,
    },
    responses: {
      200: {
        content: { "application/json": { schema: PublicUserSchema } },
        description: "Get user by identifier",
      },
      404: {
        // content: { "application/json": { schema: ErrorResponseSchema } },
        description: "User not found",
      },
      500: {
        content: { "application/json": { schema: ErrorResponseSchema } },
        description: "Internal server error",
      },
    },
  }),
  async (c) => {
    try {
      const { identifier } = c.req.valid("param");

      const user = await prisma.user.findFirst({
        where: {
          OR: [{ id: identifier }, { username: identifier }],
        },
        omit: { email: true }, // Omit email for public user data
      });

      if (!user) {
        return c.notFound();
      }

      return c.json(user);
    } catch (error) {
      return c.json({ message: "Failed to get user", error }, 500);
    }
  }
);
