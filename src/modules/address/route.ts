import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { prisma } from "@/lib/prisma";
import { ErrorResponseSchema } from "@/modules/common/schema";
import {
  AddressSchema,
  CreateAddressSchema,
  UpdateAddressSchema,
} from "@/modules/address/schema";
import { Env } from "@/index";

export const addressRoute = new OpenAPIHono<Env>();

const tags = ["Address"];

// GET /address
addressRoute.openapi(
  createRoute({
    tags,
    summary: "Get address of the auth user",
    method: "get",
    path: "/",
    responses: {
      401: { description: "Unauthorized" },
      200: {
        description: "Successfully retrieved authenticated user",
        content: { "application/json": { schema: AddressSchema } },
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
      if (!user) return c.text("Unauthorized", 401);

      const address = await prisma.address.findFirst({
        where: { userId: user.id, isDefault: true },
        take: 1,
      });

      if (!address) {
        const newAddress = await prisma.address.create({
          data: {
            isDefault: true,
            userId: user.id,
            label: "Rumah",
            recipientName: user.name,
            phoneNumber: user.phoneNumber || "+62",
            street: "",
            city: "",
            postalCode: "",
          },
        });

        return c.json(newAddress, 200);
      }

      return c.json(address, 200);
    } catch (error) {
      return c.json({ message: "Failed to get address", details: error }, 500);
    }
  }
);

// PATCH /address
addressRoute.openapi(
  createRoute({
    tags,
    summary: "Update an existing address",
    method: "patch",
    path: "/",
    request: {
      body: {
        content: { "application/json": { schema: UpdateAddressSchema } },
      },
    },
    responses: {
      401: { description: "Unauthorized" },
      200: {
        description: "Successfully updated address",
        content: { "application/json": { schema: AddressSchema } },
      },
    },
  }),
  async (c) => {
    const user = c.get("user");
    if (!user) return c.text("Unauthorized", 401);

    const addressData = c.req.valid("json");

    const updatedAddress = await prisma.address.update({
      where: { id: addressData.id, userId: user.id },
      data: addressData,
    });

    return c.json(updatedAddress);
  }
);

// POST /address
addressRoute.openapi(
  createRoute({
    tags,
    summary: "Create a new address",
    method: "post",
    path: "/",
    request: {
      body: {
        content: { "application/json": { schema: CreateAddressSchema } },
      },
    },
    responses: {
      401: { description: "Unauthorized" },
      201: {
        description: "Successfully created address",
        content: { "application/json": { schema: AddressSchema } },
      },
      400: {
        description: "Invalid request",
        content: { "application/json": { schema: ErrorResponseSchema } },
      },
      500: {
        description: "Internal server error",
        content: { "application/json": { schema: ErrorResponseSchema } },
      },
    },
  }),
  async (c) => {
    const user = c.get("user");
    if (!user) return c.text("Unauthorized", 401);

    try {
      const addressData = c.req.valid("json");

      const newAddress = await prisma.address.create({
        data: {
          ...addressData,
          userId: user.id,
        },
      });

      return c.json(newAddress, 201);
    } catch (error) {
      return c.json(
        { message: "Failed to create address", details: error },
        500
      );
    }
  }
);
