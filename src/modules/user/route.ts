import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import {
  ParamUserIdentifierSchema,
  PublicUserSchema,
  PublicUsersSchema,
} from "./schema";
import { prisma } from "../../lib/prisma";
import { ErrorResponseSchema } from "../common/schema";
import { UserSchema } from "../../generated/zod";

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
        description: "Get user by identifier",
        content: { "application/json": { schema: PublicUserSchema } },
      },
      404: {
        description: "User not found",
        // content: { "application/json": { schema: ErrorResponseSchema } },
      },
      500: {
        description: "Internal server error",
        content: { "application/json": { schema: ErrorResponseSchema } },
      },
    },
  }),
  async (c) => {
    try {
      const { identifier } = c.req.valid("param");

      const user = await prisma.user.findFirst({
        where: { OR: [{ id: identifier }, { username: identifier }] },
        omit: { email: true },
      });

      if (!user) return c.notFound();

      return c.json(user);
    } catch (error) {
      return c.json({ message: "Failed to get user", error }, 500);
    }
  }
);
