import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { logger } from "hono/logger";
import { cors } from "hono/cors";

import { addressRoute } from "~/modules/address/route";
import { cartRoute } from "~/modules/cart/route";
import { productsRoute } from "~/modules/product/route";
import { searchRoute } from "~/modules/search/route";
import { usersRoute } from "~/modules/user/route";
import { shippingMethodRoute } from "~/modules/shipping-method/route";
import { paymentMethodRoute } from "./modules/payment-method/route";
import { ordersRoute } from "./modules/order/route";
import { auth } from "./auth";

export type Env = {
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
};

const app = new OpenAPIHono<Env>();

app.use(cors());
app.use(logger());

app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

app.route("/products", productsRoute);
app.route("/users", usersRoute);
app.route("/address", addressRoute);
app.route("/search", searchRoute); // model: Products
app.route("/cart", cartRoute);
app.route("/shipping-methods", shippingMethodRoute);
app.route("/payment-methods", paymentMethodRoute);
app.route("/orders", ordersRoute);

app.on(["GET", "POST"], "/api/auth/**", (c) => auth.handler(c.req.raw));

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
