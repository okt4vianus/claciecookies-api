# ClacieCookies API

ClacieCookies REST API with OpenAPI.

Links:

- <https://claciecookies-api.oktavianusrtasak.com>
- <https://claciecookies-api.onrender.com>

## Getting Started

To install dependencies:

```sh
bun install
```

To run:

```sh
bun run dev
```

open http://localhost:3000

## REST API Specification

| Endpoint                 | HTTP     | Description               | Permission | Status |
| ------------------------ | -------- | ------------------------- | ---------- | ------ |
| `/products`              | `GET`    | Get all products          | Public     | Done   |
| `/products/{identifier}` | `GET`    | Get product by identifier | Public     | Done   |
| `/products`              | `POST`   | Add new product           | Admin      | Done   |
| `/products`              | `DELETE` | Delete all products       | Admin      | Done   |
| `/products/{id}`         | `DELETE` | Delete product by id      | Admin      | Done   |
| `/products/{id}`         | `PATCH`  | Update product by id      | Admin      | Done   |
| `/search`                | `GET`    | Search products           | Public     | Done   |

| Endpoint              | HTTP   | Description              | Permission    | Status |
| --------------------- | ------ | ------------------------ | ------------- | ------ |
| `/users`              | `GET`  | Get all users            | Public        | Done   |
| `/users/{identifier}` | `GET`  | Get user by identifier   | Public        | Done   |
| `/auth/register`      | `POST` | Register new user        | Public        | Done   |
| `/auth/login`         | `POST` | Login user               | Public        | Done   |
| `/auth/me`            | `GET`  | Check authenticated user | Authenticated | Done   |
| `/auth/logout`        | `POST` | Logout user              | Authenticated |

| Endpoint           | HTTP     | Description                    | Permission    | Status |
| ------------------ | -------- | ------------------------------ | ------------- | ------ |
| `/cart`            | `GET`    | Get user's cart                | Authenticated | Done   |
| `/cart/items`      | `PUT`    | Add product & quantity to cart | Authenticated | Done   |
| `/cart/items/{id}` | `DELETE` | Delete product from cart       | Authenticated | Done   |
| `/cart/items/{id}` | `PATCH`  | Update product quantity        | Authenticated | Done   |
