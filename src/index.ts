import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { productsRoute } from "./modules/product/route";
// import { productImagesRoute } from "./modules/product-image/route";

const app = new OpenAPIHono();

app.route("/products", productsRoute);
// app.route("/product-images", productImagesRoute);

app.doc("/openapi.json", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Clacie Cookies API",
    description: "API Documentation for Clacie Cookies",
  },
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
