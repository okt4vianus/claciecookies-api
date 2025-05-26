import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { ParamUserIdentifierSchema, UsersSchema } from "./schema";
import { prisma } from "../../lib/prisma";
import { ErrorResponseSchema, SuccessResponseSchema } from "../common/schema";
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
        content: { "application/json": { schema: UsersSchema } },
        description: "Get all users",
      },
    },
  }),
  async (c) => {
    const users = await prisma.user.findMany({
      orderBy: [{ id: "asc" }, { createdAt: "asc" }],
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
        content: { "application/json": { schema: UserSchema } },
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
