import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { logger } from "hono/logger";

import { addressRoute } from "~/modules/address/route";
import { authRoute } from "~/modules/auth/route";
import { cartRoute } from "~/modules/cart/route";
import { productsRoute } from "~/modules/product/route";
import { searchRoute } from "~/modules/search/route";
import { usersRoute } from "~/modules/user/route";
import { shippingMethodRoute } from "~/modules/shipping-method/route";
import { paymentMethodRoute } from "./modules/payment-method/route";
import { ordersRoute } from "./modules/order/route";

const app = new OpenAPIHono();

app.use(logger());

app.route("/products", productsRoute);
app.route("/users", usersRoute);
app.route("/address", addressRoute);
app.route("/auth", authRoute); // model: User
app.route("/search", searchRoute); // model: Products
app.route("/cart", cartRoute);
app.route("/shipping-methods", shippingMethodRoute);
app.route("/payment-methods", paymentMethodRoute);
app.route("/order", ordersRoute);

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
