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

| Endpoint           | HTTP     | Description          | Permission |
| ------------------ | -------- | -------------------- | ---------- |
| `/products`        | `GET`    | Get all products     | Public     |
| `/products/{slug}` | `GET`    | Get product by slug  | Public     |
| `/products`        | `POST`   | Add new product      | Admin      |
| `/products`        | `DELETE` | Delete all products  | Admin      |
| `/products/{id}`   | `DELETE` | Delete product by id | Admin      |
| `/products/{id}`   | `PATCH`  | Update product by id | Admin      |

| Endpoint         | HTTP   | Description              | Permission    |
| ---------------- | ------ | ------------------------ | ------------- |
| `/users`         | `GET`  | Get all users            | Public        |
| `/users/{id}`    | `GET`  | Get user by id           | Public        |
| `/auth/register` | `POST` | Register new user        | Public        |
| `/auth/login`    | `POST` | Login user               | Public        |
| `/auth/me`       | `GET`  | Check authenticated user | Authenticated |
| `/auth/logout`   | `POST` | Logout user              | Authenticated |

| Endpoint           | HTTP     | Description                    | Permission    |
| ------------------ | -------- | ------------------------------ | ------------- |
| `/cart`            | `GET`    | Get user's cart                | Authenticated |
| `/cart/items`      | `PUT`    | Add product & quantity to cart | Authenticated |
| `/cart/items/{id}` | `DELETE` | Delete product from cart       | Authenticated |
| `/cart/items/{id}` | `PATCH`  | Update product quantity        | Authenticated |
