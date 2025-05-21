import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { ParamUsernameSchema, UsersSchema } from "./schema";
import { prisma } from "../../lib/prisma";
import { ErrorResponseSchema } from "../common/schema";
import { UserSchema } from "../../generated/zod";

export const usersRoute = new OpenAPIHono();

const tags = ["User"];

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

// ✅ GET /users/:username
usersRoute.openapi(
  createRoute({
    tags,
    summary: "Get user by identifier (ID or username)",
    method: "get",
    path: "/:username",
    request: {
      params: ParamUsernameSchema,
    },
    responses: {
      200: {
        content: { "application/json": { schema: UserSchema } },
        description: "Get user by identifier",
      },
      404: {
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
      const { username } = c.req.valid("param");
      const user = await prisma.user.findFirst({ where: { username } });
      if (!user) return c.notFound();
      return c.json(user);
    } catch (error) {
      return c.json({ message: "Failed to get user", error }, 500);
    }
  }
);
