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
// {
//   slug?: string;
//   name: string;
//   description?: string;
//   price: number;
//   stockQuantity: number;
//   images?: ProductImage[]; // array of product images
// };

export type UpdateProduct = Partial<Product>;
// {
//   slug?: string;
//   name?: string;
//   description?: string;
//   price?: number;
//   stockQuantity?: number;
//   images?: ProductImage[];
// };

// Single product
export const dataProduct: Product = {
  slug: "matcha-soft-cookies",
  name: "Matcha Soft Cookies",
  description: "Matcha soft cookies with a hint of green tea",
  price: 20000,
  stockQuantity: 10,
  images: [
    {
      name: "matcha-soft-cookies-1.jpg",
      url: "https://ucarecdn.com/ba783126-112d-4ed2-ac77-97cfdfce22da/",
    },
    {
      name: "matcha-soft-cookies-2.jpg",
      url: "https://ucarecdn.com/ef9aed3b-358a-4aa9-9d23-3bca4a03bc14/",
    },
  ],
};

// Multiple products
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
        url: "https://ucarecdn.com/ba783126-112d-4ed2-ac77-97cfdfce22da/",
      },
      {
        name: "matcha-soft-cookies-2.jpg",
        url: "https://ucarecdn.com/ef9aed3b-358a-4aa9-9d23-3bca4a03bc14/",
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
        name: "oreo-red-velvet-cookies-1.jpeg",
        url: "https://ucarecdn.com/7c3c1eaf-50b7-43ff-a8c9-26048e77b215/",
      },
      {
        name: "oreo-red-velvet-cookies-2.jpeg",
        url: "https://ucarecdn.com/3edc4c40-08ce-41ee-a6e3-0beb6af19502/",
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
        url: "https://ucarecdn.com/ea02b0d5-44d9-4f51-aea6-1ca31bc3e6fe/",
      },
      {
        name: "red-velvet-with-melting-chocolate-2.jpg",
        url: "https://ucarecdn.com/1882d0e8-f0e8-489a-96b9-c7a6262f1ee7/",
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
        name: "soft-cookies-classic-1.jpeg",
        url: "https://ucarecdn.com/fb1cfcc9-aa9d-4d02-b304-709b8a1335c0/",
      },
      {
        name: "soft-cookies-classic-2.jpeg",
        url: "https://ucarecdn.com/cf8de9ce-a760-4616-8a2b-c758b318048a/",
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
        name: "double-coconut-cookies-1.jpeg",
        url: "https://ucarecdn.com/66d8a272-1c03-4bc7-84f8-82a7636b4538/",
      },
      {
        name: "double-coconut-cookies-2.jpeg",
        url: "https://ucarecdn.com/c221181f-3549-4a4d-9380-3318a934a929/",
      },
      {
        name: "double-coconut-cookies-3.jpeg",
        url: "https://ucarecdn.com/6d858078-7da0-409f-bdd7-3b70a2115706/",
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
        name: "oreo-ice-cream-cheese-scones-cookies-1.png",
        url: "https://ucarecdn.com/1bc7e495-cb5c-4980-b31c-dcd6cf90a11c/",
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
        name: "brownies-1.jpeg",
        url: "https://ucarecdn.com/06ce6ab2-f08d-43a2-9852-497a148b678a/",
      },
      {
        name: "brownies-2.jpeg",
        url: "https://ucarecdn.com/773a4b87-1715-4185-8a25-e8e5dec2e2a2/",
      },
      {
        name: "brownies-3.jpeg",
        url: "https://ucarecdn.com/4d79da18-7b00-4327-86f2-b3b315b146ac/",
      },
      {
        name: "brownies-4.jpeg",
        url: "https://ucarecdn.com/0d0d3e6b-68fd-48a5-8d40-45226b38252d/",
      },
      {
        name: "brownies-5.jpeg",
        url: "https://ucarecdn.com/adab3864-1baa-460f-b954-23e4f82b2b66/",
      },
      {
        name: "brownies-6.jpeg",
        url: "https://ucarecdn.com/7767da5f-f769-4ee6-8c88-7b2459f982ab/",
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
        name: "brownie-cookies-1.jpeg",
        url: "https://ucarecdn.com/b460c577-9e0e-482f-b072-65ff7d678708/",
      },
      {
        name: "brownie-cookies-2.jpeg",
        url: "https://ucarecdn.com/b6060b67-1079-484a-acce-27a969684bfa/",
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
        url: "https://ucarecdn.com/1fd7cfe8-c307-449d-a396-4a2901651c77/",
      },
      {
        name: "brownie-bottom-cheesecake-2.jpg",
        url: "https://ucarecdn.com/2122246c-4a7f-456b-ab11-132e9488324c/",
      },
    ],
  },
];
