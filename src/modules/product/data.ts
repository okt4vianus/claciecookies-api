import { ProductImage } from "../product-image/data";

export type Product = {
  slug: string; // unique slug for the product
  name: string; // name of the product
  description?: string; // description of the product
  price: number; // price in Rupiah/IDR
  stockQuantity: number; // quantity in stock
  images?: ProductImage[]; // array of product images
};

export type CreateProduct = Product & {
  slug?: string;
};

export type UpdateProduct = Partial<Product>;

export const dataProducts: Product[] = [
  {
    slug: "matcha-soft-cookies",
    name: "Matcha Soft Cookies",
    description: "Matcha soft cookies with a hint of green tea",
    price: 20000,
    stockQuantity: 10,
    images: [
      {
        name: "matcha-soft-cookies-1.jpg",
        url: "https://ucarecdn.com/123/", // unique id for this image
      },
      {
        name: "matcha-soft-cookies-2.jpg",
        url: "https://ucarecdn.com/456/", // unique id for this image
      },
    ],
  },
  {
    slug: "oreo-red-velvet-cookies",
    name: "Oreo Red Velvet Cookies",
    description: "Delicious red velvet cookies with an Oreo surprise inside",
    price: 25000,
    stockQuantity: 15,
    images: [
      {
        name: "oreo-red-velvet-cookies-1.jpg",
        url: "https://ucarecdn.com/789/", // unique id for this image
      },
    ],
  },
  {
    slug: "red-velvet-with-melting-chocolate",
    name: "Red Velvet With Melting Chocolate",
    description: "Red velvet cookies filled with melting chocolate",
    price: 22000,
    stockQuantity: 8,
    images: [
      {
        name: "red-velvet-with-melting-chocolate-1.jpg",
        url: "https://ucarecdn.com/101/", // unique id for this image
      },
    ],
  },
  {
    slug: "soft-cookies-classic",
    name: "Soft Cookies Classic",
    description: "Classic soft cookies with a rich, buttery flavor",
    price: 15000,
    stockQuantity: 12,
    images: [
      {
        name: "soft-cookies-classic-1.jpg",
        url: "https://ucarecdn.com/112/", // unique id for this image
      },
    ],
  },
  {
    slug: "double-coconut-cookies",
    name: "Double Coconut Cookies",
    description: "Coconut cookies with a double dose of coconut goodness",
    price: 18000,
    stockQuantity: 20,
    images: [
      {
        name: "double-coconut-cookies-1.jpg",
        url: "https://ucarecdn.com/113/", // unique id for this image
      },
    ],
  },
  {
    slug: "oreo-ice-cream-cheese-scones-cookies",
    name: "Oreo Ice Cream Cheese Scones Cookies",
    description:
      "Delightful Oreo, ice cream, and cheese scones in a cookie form",
    price: 28000,
    stockQuantity: 5,
    images: [
      {
        name: "oreo-ice-cream-cheese-scones-cookies-1.jpg",
        url: "https://ucarecdn.com/114/", // unique id for this image
      },
    ],
  },
  {
    slug: "brownies",
    name: "Brownies",
    description: "Fudgy and rich brownies made with premium ingredients",
    price: 22000,
    stockQuantity: 25,
    images: [
      {
        name: "brownies-1.jpg",
        url: "https://ucarecdn.com/115/", // unique id for this image
      },
    ],
  },
  {
    slug: "brownie-cookies",
    name: "Brownie Cookies",
    description: "A perfect blend of chewy brownie and cookie texture",
    price: 23000,
    stockQuantity: 18,
    images: [
      {
        name: "brownie-cookies-1.jpg",
        url: "https://ucarecdn.com/116/", // unique id for this image
      },
    ],
  },
  {
    slug: "brownie-bottom-cheesecake",
    name: "Brownie Bottom Cheesecake",
    description: "Cheesecake with a rich brownie bottom and creamy top",
    price: 35000,
    stockQuantity: 7,
    images: [
      {
        name: "brownie-bottom-cheesecake-1.jpg",
        url: "https://ucarecdn.com/117/", // unique id for this image
      },
    ],
  },
];
