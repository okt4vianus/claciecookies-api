import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { prisma } from "../../lib/prisma";
import { ErrorResponseSchema, SuccessResponseSchema } from "../common/schema";
import { LoginBodySchema, RegisterBodySchema } from "./schema";
import { UserSchema } from "../../generated/zod";
import { hashPassword, verifyPassword } from "../../lib/password";
import { signToken } from "../../lib/token";

export const authRoute = new OpenAPIHono();

const tags = ["Auth"];

// ✅ POST /auth/register
authRoute.openapi(
  createRoute({
    tags,
    summary: "Register a new user",
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
        content: { "application/json": { schema: ErrorResponseSchema } },
        description: "User register failed",
      },
    },
  }),
  async (c) => {
    try {
      const body = c.req.valid("json");
      const { password, ...userData } = body;

      const hashedPassword = await hashPassword(password);

      const newUser = await prisma.user.create({
        data: {
          ...userData,
          password: {
            create: { hash: hashedPassword },
          },
        },
      });

      return c.json(newUser, 201);
    } catch (error) {
      return c.json(
        { message: "Failed to registering user", details: error },
        500
      );
    }
  }
);

// // ✅ POST /auth/login
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
        // content: { "application/json": { schema: ErrorResponseSchema } },
        description: "User login failed",
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
      const { password, ...userData } = body;

      // const hashedPassword = await hashPassword(password);
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

      const isPasswordValid = await verifyPassword(
        password,
        user.password.hash
      );

      if (!isPasswordValid) {
        return c.json({ message: "Invalid password" }, 400);
      }

      // Remove password from the response
      const { password: _, ...userWithoutPassword } = user;

      const token = await signToken(userWithoutPassword.id);
      if (!token) {
        return c.json({ message: "Failed to generate token" }, 500);
      }

      c.header("Token", token);

      return c.json({ user: userWithoutPassword }, 201);
    } catch (error) {
      return c.json({ message: "User login failed", details: error }, 500);
    }
  }
);
