import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";

import { authRoute } from "~/modules/auth/route";
import { productsRoute } from "~/modules/product/route";
import { searchRoute } from "~/modules/search/route";
import { usersRoute } from "~/modules/user/route";
import { cartRoute } from "~/modules/cart/route";

const app = new OpenAPIHono();

app.route("/products", productsRoute);
app.route("/users", usersRoute);
app.route("/auth", authRoute);
app.route("/search", searchRoute);
app.route("/cart", cartRoute);

app
  .doc("/openapi.json", {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Clacie Cookies API",
      description: "API Documentation for Clacie Cookies",
    },
  })
  .openAPIRegistry.registerComponent("securitySchemes", "BearerAuth", {
    type: "http",
    scheme: "bearer",
    in: "header",
    description: "Bearer token for authentication",
  });

// Add API reference page
app.get(
  "/",
  Scalar({
    url: "/openapi.json",
    theme: "dark blue",
    pageTitle: "Clacie Cookies API",
  })
);

export default app;
