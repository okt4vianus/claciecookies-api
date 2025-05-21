import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { RegisterBodySchema, UsersSchema } from "./schema";
import { prisma } from "../../lib/prisma";
import { ErrorResponseSchema } from "../common/schema";
import { UserSchema } from "../../generated/zod";

export const authRoute = new OpenAPIHono();

const tags = ["Auth"];

// ✅ POST /auth/register
authRoute.openapi(
  createRoute({
    tags,
    summary: "Register user",
    method: "post",
    path: "/register",
    request: {
      body: {
        content: { "application/json": { schema: RegisterBodySchema } },
      },
    },
    responses: {
      201: {
        content: { "application/json": { schema: UserSchema } },
        description: "User registered successfully",
      },
      500: {
        description: "User register failed",
      },
    },
  }),
  async (c) => {
    try {
      const body = c.req.valid("json");
      const { password, ...userData } = body;

      const newUser = await prisma.user.create({
        data: userData,
      });

      return c.json(newUser);
    } catch (error) {
      return c.json({ message: "User register failed", error: error }, 400);
    }
  }
);
