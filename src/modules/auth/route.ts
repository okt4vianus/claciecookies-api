import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { LoginBodySchema, RegisterBodySchema, UsersSchema } from "./schema";
import { prisma } from "../../lib/prisma";
import { ErrorResponseSchema } from "../common/schema";
import { UserSchema } from "../../generated/zod";
import { comparePassword, hashPassword } from "../../lib/password";
import { signToken } from "../../lib/token";

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

      const hash = await hashPassword(password);

      const newUser = await prisma.user.create({
        data: {
          ...userData,
          password: { create: { hash } },
        },
      });

      return c.json(newUser);
    } catch (error) {
      return c.json({ message: "User register failed", error: error }, 500);
    }
  }
);

// ✅ POST /auth/login
authRoute.openapi(
  createRoute({
    tags,
    summary: "Login user",
    method: "post",
    path: "/login",
    request: {
      body: {
        content: { "application/json": { schema: LoginBodySchema } },
      },
    },
    responses: {
      201: {
        content: { "application/json": { schema: UserSchema } },
        description: "User logged in successfully",
      },
      400: {
        description: "User login failed",
      },
      500: {
        description: "User login failed",
      },
    },
  }),
  async (c) => {
    try {
      const body = c.req.valid("json");
      const { password, ...userData } = body;

      const user = await prisma.user.findUnique({
        where: { email: userData.email },
        include: { password: true },
      });

      if (!user) {
        return c.json({ message: "User not found" }, 400);
      }

      if (!user.password) {
        return c.json({ message: "User does not have a password" }, 400);
      }

      const isPasswordValid = await comparePassword(
        password,
        user.password.hash
      );

      if (!isPasswordValid) {
        return c.json({ message: "Invalid password" }, 400);
      }

      const { password: _, ...userWithoutPassword } = user;

      const token = await signToken(userWithoutPassword.id);

      c.header("Token", token);
      return c.json({ token });
    } catch (error) {
      return c.json({ message: "User login failed", error: error }, 500);
    }
  }
);
