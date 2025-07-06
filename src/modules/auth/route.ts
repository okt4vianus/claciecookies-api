import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { UserSchema as PrivateUserAddressSchema } from "~/generated/zod";
import { hashPassword, verifyPassword } from "~/lib/password";
import { prisma } from "~/lib/prisma";
import { signToken } from "~/lib/token";
import { checkAuthorized } from "~/modules/auth/middleware";
import {
  LoginBodySchema,
  LoginResponseSchema,
  RegisterBodySchema,
} from "~/modules/auth/schema";
import { ErrorResponseSchema } from "~/modules/common/schema";
import { PrivateUserProfileSchema } from "../user/schema";

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
        content: { "application/json": { schema: PrivateUserAddressSchema } },
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
      const { password, ...userData } = body;

      const user = await prisma.user.findUnique({
        where: { email: userData.email },
        include: { password: true },
      });

      if (!user) {
        return c.json(
          { field: "email", message: "User not found", error: null },
          400
        );
      }

      if (!user.password) {
        return c.json(
          {
            field: "password",
            message:
              "User does not have a password. Might have login with Google.",
            error: null,
          },
          400
        );
      }

      const isPasswordValid = await verifyPassword(
        password,
        user.password.hash
      );

      if (!isPasswordValid) {
        return c.json(
          {
            field: "password",
            message: "Invalid password",
            error: null,
          },
          400
        );
      }

      // Remove password from the response
      // Only return the user fields as defined in UserSchema
      const { password: _, ...userWithoutPassword } = user;

      const token = await signToken(userWithoutPassword.id);
      if (!token) {
        return c.json(
          { message: "Failed to generate token", error: null },
          400
        );
      }

      c.header("Token", token);

      return c.json({ token, user: userWithoutPassword, error: null }, 200);
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
    security: [{ BearerAuth: [] }], // OpenAPI security scheme
    middleware: checkAuthorized, // Actual logic process- Custom middleware to check authorization
    responses: {
      200: {
        description: "Successfully retrieved authenticated user",
        content: { "application/json": { schema: PrivateUserAddressSchema } },
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

// GET /auth/profile
authRoute.openapi(
  createRoute({
    tags,
    summary: "Get complete authenticated user profile",
    method: "get",
    path: "/profile",
    security: [{ BearerAuth: [] }],
    middleware: checkAuthorized,
    responses: {
      200: {
        description: "Successfully retrieved authenticated user",
        content: { "application/json": { schema: PrivateUserProfileSchema } },
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

      // const userProfile = await prisma.user.findUnique({
      //   where: { id: user.id },
      //   select: { fullName: true, email: true, phoneNumber: true },
      // });

      const userProfile = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          fullName: true,
          email: true,
          phoneNumber: true,
          addresses: {
            where: { isDefault: true },
            take: 1,
            select: {
              id: true,
              street: true,
              city: true,
            },
          },
        },
      });

      if (!userProfile) {
        return c.json({ message: "User not found" }, 404);
      }

      // const userAddress = await prisma.user.findUnique({
      //   where: { id: user.id },
      //   // include: {address: true}
      // });

      return c.json(userProfile, 200);
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
