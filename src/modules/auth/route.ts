import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { prisma } from "../../lib/prisma";
import { ErrorResponseSchema, SuccessResponseSchema } from "../common/schema";
import { RegisterBodySchema } from "./schema";
import { UserSchema } from "../../generated/zod";
import { hashPassword } from "../../lib/password";

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
        description: "user register failed",
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

// // ✅ GET /products
// productsRoute.openapi(
//   createRoute({
//     tags,
//     summary: "Get all products",
//     method: "get",
//     path: "/",
//     responses: {
//       200: {
//         content: { "application/json": { schema: ManyProductsResponseSchema } },
//         description: "Get all products",
//       },
//     },
//   }),
//   async (c) => {
//     const products = await prisma.product.findMany({
//       orderBy: [{ id: "asc" }, { createdAt: "asc" }],
//       include: { images: true },
//     });

//     return c.json(products);
//   }
// );

// // ✅ GET /products/:identifier
// productsRoute.openapi(
//   createRoute({
//     tags,
//     summary: "Get product by identifier (ID or slug)",
//     method: "get",
//     path: "/:identifier",
//     request: {
//       params: ParamProductIdentifierSchema,
//     },
//     responses: {
//       200: {
//         content: { "application/json": { schema: OneProductResponseSchema } },
//         description: "Get product by identifier",
//       },
//       404: {
//         // content: { "applicati on/json": { schema: ErrorResponseSchema } },
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
//       const { identifier } = c.req.valid("param");

//       const product = await prisma.product.findFirst({
//         where: {
//           OR: [{ id: identifier }, { slug: identifier }],
//         },
//         include: { images: true },
//       });

//       if (!product) {
//         return c.notFound();
//       }

//       return c.json(product);
//     } catch (error) {
//       return c.json({ message: "Failed to get product", error }, 500);
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
