import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { prisma } from "@/lib/prisma";
import { createNewSlug } from "@/lib/slug";
import { ErrorResponseSchema, SuccessResponseSchema } from "@/modules/common/schema";
import {
  CreateProductSchema,
  ManyProductsResponseSchema,
  OneProductResponseSchema,
  ParamProductIdentifierSchema,
  ParamProductIdSchema,
  UpsertProductSchema,
} from "@/modules/product/schema";

export const productsRoute = new OpenAPIHono();

const tags = ["Product"];

// ✅ GET /products
productsRoute.openapi(
  createRoute({
    tags,
    summary: "Get all products",
    method: "get",
    path: "/",
    responses: {
      200: {
        content: { "application/json": { schema: ManyProductsResponseSchema } },
        description: "Get all products",
      },
    },
  }),
  async (c) => {
    const products = await prisma.product.findMany({
      orderBy: [{ id: "asc" }, { createdAt: "asc" }],
      include: { images: true },
    });

    return c.json(products);
  }
);

// ✅ GET /products/{identifier}
productsRoute.openapi(
  createRoute({
    tags,
    summary: "Get product by identifier (ID or slug)",
    method: "get",
    path: "/{identifier}",
    request: {
      params: ParamProductIdentifierSchema,
    },
    responses: {
      200: {
        content: { "application/json": { schema: OneProductResponseSchema } },
        description: "Get product by identifier",
      },
      404: {
        // content: { "applicati on/json": { schema: ErrorResponseSchema } },
        description: "Product not found",
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

      const product = await prisma.product.findFirst({
        where: {
          OR: [{ id: identifier }, { slug: identifier }],
        },
        include: { images: true },
      });

      if (!product) {
        return c.notFound();
      }

      return c.json(product);
    } catch (error) {
      return c.json({ message: "Failed to get product", error }, 500);
    }
  }
);

// ✅ POST /products
productsRoute.openapi(
  createRoute({
    tags,
    summary: "Create a new product",
    method: "post",
    path: "/",
    request: {
      body: {
        content: { "application/json": { schema: CreateProductSchema } },
      },
    },
    responses: {
      201: {
        content: { "application/json": { schema: OneProductResponseSchema } },
        description: "Product created successfully",
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

      const product = await prisma.product.create({
        data: {
          ...body,
          slug: body.slug ?? createNewSlug(body.name),
          images: { create: body.images },
        },
        include: { images: true },
      });

      return c.json(product, 201);
    } catch (error) {
      return c.json({ error: "Failed to create new product", details: error }, 500);
    }
  }
);

// ✅ PATCH /products/{id}
productsRoute.openapi(
  createRoute({
    tags,
    summary: "Update a product by ID",
    method: "patch",
    path: "/{id}",
    request: {
      params: ParamProductIdSchema,
      body: {
        content: { "application/json": { schema: UpsertProductSchema } },
      },
    },
    responses: {
      200: {
        content: { "application/json": { schema: OneProductResponseSchema } },
        description: "Product updated successfully",
      },
      404: {
        content: { "application/json": { schema: ErrorResponseSchema } },
        description: "Product not found",
      },
      500: {
        content: { "application/json": { schema: ErrorResponseSchema } },
        description: "Internal server error",
      },
    },
  }),
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      const body = c.req.valid("json");

      const { images, ...dataProduct } = body;

      const updatedProduct = await prisma.product.update({
        where: { id },
        data: {
          ...dataProduct,
          slug: body.slug ?? createNewSlug(dataProduct.name ?? ""),
          // images: {
          //   deleteMany: {},
          //   create: images,
          // },
        },
        include: { images: true },
      });

      return c.json(updatedProduct, 200);
    } catch (error) {
      return c.json({ message: "Failed to update product", error }, 500);
    }
  }
);

// ✅ DELETE /products
productsRoute.openapi(
  createRoute({
    tags,
    summary: "Delete all products",
    method: "delete",
    path: "/",
    responses: {
      200: {
        content: { "application/json": { schema: SuccessResponseSchema } },
        description: "Delete all products",
      },
      500: {
        content: { "application/json": { schema: ErrorResponseSchema } },
        description: "Internal server error",
      },
    },
  }),
  async (c) => {
    try {
      await prisma.product.deleteMany();
      return c.json({ message: "All products have been deleted" }, 200);
    } catch (error) {
      return c.json({ error: "Failed to delete products", details: error }, 500);
    }
  }
);

// ✅ DELETE /products/{id}
productsRoute.openapi(
  createRoute({
    tags,
    summary: "Delete a product by ID",
    method: "delete",
    path: "/{id}",
    request: { params: ParamProductIdSchema },
    responses: {
      200: {
        content: { "application/json": { schema: OneProductResponseSchema } },
        description: "Product deleted successfully",
      },
      // 404: {
      //   content: { "application/json": { schema: ErrorResponseSchema } },
      //   description: "Product not found",
      // },
      500: {
        content: { "application/json": { schema: ErrorResponseSchema } },
        description: "Internal server error",
      },
    },
  }),
  async (c) => {
    try {
      const { id } = c.req.valid("param");
      // const deletedProduct = await prisma.product.delete({ where: { id } });
      const deletedProduct = await prisma.product.delete({
        where: { id },
        include: { images: true },
      });

      return c.json(deletedProduct, 200);
      // return c.json({
      //   message: `Product with ID ${id} has been deleted`,
      //   data: deletedProduct,
      // });
    } catch (error) {
      return c.json({ error: "Failed to delete product", details: error }, 500);
    }
  }
);
