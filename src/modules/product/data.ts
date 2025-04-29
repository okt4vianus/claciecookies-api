export type Product = {
  slug: string; // unique slug for the product
  name: string; // name of the product
  description?: string; // description of the product
  price: number; // price in Rupiah/IDR
  stockQuantity: number; // quantity in stock
  //   images: ProductImage[]; // array of product images
};

export type CreateProduct = {
  slug?: string;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  // images: ProductImage[]; // array of product images
};

export type UpdateProduct = {
  slug?: string;
  name?: string;
  description?: string;
  price?: number;
  stockQuantity?: number;
  // images: ProductImage[]; // array of product images
};

// Single product
export const exampleProduct: Product = {
  slug: "matcha-soft-cookies",
  name: "Matcha Soft Cookies",
  description: "Matcha soft cookies with a hint of green tea",
  price: 20000,
  stockQuantity: 10,
  // images: [exampleProductImage],
};

// Multiple products
export const exampleProducts: Product[] = [
  {
    slug: "matcha-soft-cookies",
    name: "Matcha Soft Cookies",
    description: "Matcha soft cookies with a hint of green tea",
    price: 20000,
    stockQuantity: 10,
  },
  {
    slug: "oreo-red-velvet-cookies",
    name: "Oreo Red Velvet Cookies",
    description: "Delicious red velvet cookies with an Oreo surprise inside",
    price: 25000,
    stockQuantity: 15,
  },
  {
    slug: "red-velvet-with-melting-chocolate",
    name: "Red Velvet With Melting Chocolate",
    description: "Red velvet cookies filled with melting chocolate",
    price: 22000,
    stockQuantity: 8,
  },
  {
    slug: "soft-cookies-classic",
    name: "Soft Cookies Classic",
    description: "Classic soft cookies with a rich, buttery flavor",
    price: 15000,
    stockQuantity: 12,
  },
  {
    slug: "double-coconut-cookies",
    name: "Double Coconut Cookies",
    description: "Coconut cookies with a double dose of coconut goodness",
    price: 18000,
    stockQuantity: 20,
  },
  {
    slug: "oreo-ice-cream-cheese-scones-cookies",
    name: "Oreo Ice Cream Cheese Scones Cookies",
    description:
      "Delightful Oreo, ice cream, and cheese scones in a cookie form",
    price: 28000,
    stockQuantity: 5,
  },
  {
    slug: "brownies",
    name: "Brownies",
    description: "Fudgy and rich brownies made with premium ingredients",
    price: 22000,
    stockQuantity: 25,
  },
  {
    slug: "brownie-cookies",
    name: "Brownie Cookies",
    description: "A perfect blend of chewy brownie and cookie texture",
    price: 23000,
    stockQuantity: 18,
  },
  {
    slug: "brownie-bottom-cheesecake",
    name: "Brownie Bottom Cheesecake",
    description: "Cheesecake with a rich brownie bottom and creamy top",
    price: 35000,
    stockQuantity: 7,
  },
];
