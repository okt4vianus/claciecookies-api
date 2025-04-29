export type ProductImage = {
  name: string; // name of the image
  url: string; // url from google drive
};

export type CreateProductImage = {
  name: string;
  url: string;
  productSlug: string;
};

export type UpdateProductImage = {
  name?: string;
  url?: string;
  productSlug?: string;
};

// single product image
export const exampleProductImage: CreateProductImage = {
  name: "matcha-soft-cookies-1.jpg",
  url: "https://drive.google.com/uc?id=matcha-soft-cookies-1",
  productSlug: "matcha-soft-cookies",
};

// multiple product images
export const exampleProductImages: CreateProductImage[] = [
  {
    name: "matcha-soft-cookies-1.jpg",
    url: "https://drive.google.com/uc?id=matcha-soft-cookies-1",
    productSlug: "matcha-soft-cookies",
  },
  {
    name: "oreo-red-velvet-cookies-1.jpg",
    url: "https://drive.google.com/uc?id=oreo-red-velvet-cookies-1",
    productSlug: "oreo-red-velvet-cookies",
  },
  {
    name: "red-velvet-with-melting-chocolate-1.jpg",
    url: "https://drive.google.com/uc?id=red-velvet-with-melting-chocolate-1",
    productSlug: "red-velvet-with-melting-chocolate",
  },
  {
    name: "soft-cookies-classic-1.jpg",
    url: "https://drive.google.com/uc?id=soft-cookies-classic-1",
    productSlug: "soft-cookies-classic",
  },
  {
    name: "double-coconut-cookies-1.jpg",
    url: "https://drive.google.com/uc?id=double-coconut-cookies-1",
    productSlug: "double-coconut-cookies",
  },
  {
    name: "oreo-ice-cream-cheese-scones-cookies-1.jpg",
    url: "https://drive.google.com/uc?id=oreo-ice-cream-cheese-scones-cookies-1",
    productSlug: "oreo-ice-cream-cheese-scones-cookies",
  },
  {
    name: "brownies-1.jpg",
    url: "https://drive.google.com/uc?id=brownies-1",
    productSlug: "brownies",
  },
  {
    name: "brownie-cookies-1.jpg",
    url: "https://drive.google.com/uc?id=brownie-cookies-1",
    productSlug: "brownie-cookies",
  },
  {
    name: "brownie-bottom-cheesecake-1.jpg",
    url: "https://drive.google.com/uc?id=brownie-bottom-cheesecake-1",
    productSlug: "brownie-bottom-cheesecake",
  },
];
