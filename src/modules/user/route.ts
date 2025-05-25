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

// ✅ GET /user/:identifier
usersRoute.openapi(
  createRoute({
    tags,
    summary: "Get user by identifier (User ID or Username)",
    method: "get",
    path: "/:identifier",
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

// // ✅ POST /products
// productsRoute.openapi(
//   createRoute({
//     tags,
//     summary: "Create a new product",
//     method: "post",
//     path: "/",
//     request: {
//       body: {
//         content: { "application/json": { schema: CreateProductSchema } },
//       },
//     },
//     responses: {
//       201: {
//         content: { "application/json": { schema: OneProductResponseSchema } },
//         description: "Product created successfully",
//       },
//       500: {
//         content: { "application/json": { schema: ErrorResponseSchema } },
//         description: "Internal server error",
//       },
//     },
//   }),
//   async (c) => {
//     try {
//       const body = c.req.valid("json");

//       const product = await prisma.product.create({
//         data: {
//           ...body,
//           slug: body.slug ?? createNewSlug(body.name),
//           images: { create: body.images },
//         },
//         include: { images: true },
//       });

//       return c.json(product, 201);
//     } catch (error) {
//       return c.json(
//         { error: "Failed to create new product", details: error },
//         500
//       );
//     }
//   }
// );

// // ✅ PATCH /products/:id
// productsRoute.openapi(
//   createRoute({
//     tags,
//     summary: "Update a product by ID",
//     method: "patch",
//     path: "/:id",
//     request: {
//       params: ParamProductIdSchema,
//       body: {
//         content: { "application/json": { schema: UpsertProductSchema } },
//       },
//     },
//     responses: {
//       200: {
//         content: { "application/json": { schema: OneProductResponseSchema } },
//         description: "Product updated successfully",
//       },
//       404: {
//         content: { "application/json": { schema: ErrorResponseSchema } },
//         description: "Product not found",
//       },
//       500: {
//         content: { "application/json": { schema: ErrorResponseSchema } },
//         description: "Internal server error",
//       },
//     },
//   }),
//   async (c) => {
//     try {
//       const { id } = c.req.valid("param");
//       const body = c.req.valid("json");

//       const { images, ...dataProduct } = body;

//       const updatedProduct = await prisma.product.update({
//         where: { id },
//         data: {
//           ...dataProduct,
//           slug: body.slug ?? createNewSlug(dataProduct.name ?? ""),
//           // images: {
//           //   deleteMany: {},
//           //   create: images,
//           // },
//         },
//         include: { images: true },
//       });

//       return c.json(updatedProduct, 200);
//     } catch (error) {
//       return c.json({ message: "Failed to update product", error }, 500);
//     }
//   }
// );

// // ✅ DELETE /products
// productsRoute.openapi(
//   createRoute({
//     tags,
//     summary: "Delete all products",
//     method: "delete",
//     path: "/",
//     responses: {
//       200: {
//         content: { "application/json": { schema: SuccessResponseSchema } },
//         description: "Delete all products",
//       },
//       500: {
//         content: { "application/json": { schema: ErrorResponseSchema } },
//         description: "Internal server error",
//       },
//     },
//   }),
//   async (c) => {
//     try {
//       await prisma.product.deleteMany();
//       return c.json({ message: "All products have been deleted" }, 200);
//     } catch (error) {
//       return c.json(
//         { error: "Failed to delete products", details: error },
//         500
//       );
//     }
//   }
// );

// // ✅ DELETE /products/:id
// productsRoute.openapi(
//   createRoute({
//     tags,
//     summary: "Delete a product by ID",
//     method: "delete",
//     path: "/:id",
//     request: { params: ParamProductIdSchema },
//     responses: {
//       200: {
//         content: { "application/json": { schema: OneProductResponseSchema } },
//         description: "Product deleted successfully",
//       },
//       // 404: {
//       //   content: { "application/json": { schema: ErrorResponseSchema } },
//       //   description: "Product not found",
//       // },
//       500: {
//         content: { "application/json": { schema: ErrorResponseSchema } },
//         description: "Internal server error",
//       },
//     },
//   }),
//   async (c) => {
//     try {
//       const { id } = c.req.valid("param");
//       // const deletedProduct = await prisma.product.delete({ where: { id } });
//       const deletedProduct = await prisma.product.delete({
//         where: { id },
//         include: { images: true },
//       });

//       return c.json(deletedProduct, 200);
//       // return c.json({
//       //   message: `Product with ID ${id} has been deleted`,
//       //   data: deletedProduct,
//       // });
//     } catch (error) {
//       return c.json({ error: "Failed to delete product", details: error }, 500);
//     }
//   }
// );
