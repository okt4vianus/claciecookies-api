import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { UserSchema } from "~/generated/zod";
import { hashPassword, verifyPassword } from "~/lib/password";
import { prisma } from "~/lib/prisma";
import { signToken } from "~/lib/token";
import { checkAuthorized } from "~/modules/auth/middleware";
import { ErrorResponseSchema } from "~/modules/common/schema";
import { LoginBodySchema, RegisterBodySchema } from "~/modules/auth/schema";

export const authRoute = new OpenAPIHono();

const tags = ["Auth"];

// POST /auth/register
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

// POST /auth/login
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
      200: {
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

      return c.json({ token, user: userWithoutPassword }, 201);
    } catch (error) {
      return c.json({ message: "User login failed", details: error }, 500);
    }
  }
);

// GET /auth/me
authRoute.openapi(
  createRoute({
    tags,
    summary: "Get authenticated user profile",
    method: "get",
    path: "/me",
    security: [{ BearerAuth: [] }], // OpenAPI security scheme
    middleware: checkAuthorized, // Actual logic process- Custom middleware to check authorization
    responses: {
      200: {
        description: "Successfully retrieved authenticated user",
        content: { "application/json": { schema: UserSchema } },
      },
      401: {
        description: "Unauthorized - Invalid or missing token",
        content: { "application/json": { schema: ErrorResponseSchema } },
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

      if (!user) {
        return c.json({ message: "User not found" }, 404);
      }

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
