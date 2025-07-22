import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { prisma } from "~/lib/prisma";
import { checkAuthorized } from "~/modules/auth/middleware";
import {
  LoginBodySchema,
  LoginResponseSchema,
  RegisterBodySchema,
  RegisterResponseSchema,
} from "~/modules/auth/schema";
import { ErrorResponseSchema } from "~/modules/common/schema";
import { PrivateUserProfileSchema, UserSchema } from "~/modules/user/schema";
import { AddressesSchema } from "~/modules/address/schema";
import { auth } from "~/auth";

export const authRoute = new OpenAPIHono();

const tags = ["Auth"];

// POST /auth/register
authRoute.openapi(
  createRoute({
    tags,
    summary: "Register a new user",
    method: "post",
    path: "/register",
    request: { body: { content: { "application/json": { schema: RegisterBodySchema } } } },
    responses: {
      201: {
        content: { "application/json": { schema: RegisterResponseSchema } },
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
      const { token, user } = await auth.api.signUpEmail({ body });
      return c.json({ token, user }, 201);
    } catch (error) {
      return c.json({ message: "Failed to registering user", details: error }, 500);
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
    request: { body: { content: { "application/json": { schema: LoginBodySchema } } } },
    responses: {
      200: {
        content: { "application/json": { schema: LoginResponseSchema } },
        description: "User logged in successfully",
      },
      400: {
        content: { "application/json": { schema: ErrorResponseSchema } },
        description: "Unable to login",
      },
    },
  }),
  async (c) => {
    try {
      const body = c.req.valid("json");

      const existingUser = await prisma.user.findUnique({
        where: { email: body.email },
      });
      if (!existingUser) {
        return c.json({ field: "email", message: "User not found", error: null }, 400);
      }

      const { redirect, url, token, user } = await auth.api.signInEmail({
        body,
      });

      c.header("Token", token);
      return c.json({ redirect, url, token, user }, 200);
    } catch (error) {
      return c.json({ message: "User login failed", details: error }, 400);
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
    security: [{ BearerAuth: [] }],
    middleware: checkAuthorized,
    responses: {
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
      if (!user) return c.json({ message: "User not found" }, 404);
      return c.json(user, 200);
    } catch (error) {
      console.error("Error retrieving authenticated user:", error);
      return c.json({ message: "Failed to retrieve authenticated user", details: error }, 500);
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
    security: [{ BearerAuth: [] }],
    middleware: checkAuthorized,
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
    },
  }),
  async (c) => {
    const user = c.get("user");
    const userData = c.req.valid("json");
    const userProfile = await prisma.user.update({
      where: { id: user.id },
      data: userData,
    });
    return c.json(userProfile);
  }
);

// GET /auth/addresses
authRoute.openapi(
  createRoute({
    tags,
    summary: "Get addresses of the auth user",
    method: "get",
    path: "/addresses",
    security: [{ BearerAuth: [] }],
    middleware: checkAuthorized,
    responses: {
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
    try {
      const user = c.get("user");

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
      return c.json({ message: "Failed to retrieve addresses", details: error }, 500);
    }
  }
);
