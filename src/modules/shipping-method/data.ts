import { ShippingMethod } from "@/generated/prisma";

export type CreateShippingMethod = Pick<
  ShippingMethod,
  "name" | "slug" | "description" | "price"
>;

// Multiple shipping methods for seeding
export const dataShippingMethods: CreateShippingMethod[] = [
  {
    name: "Same Day (Today)",
    slug: "same_day",
    description: "Manado area only",
    price: 50000,
  },
  {
    name: "Regular (1-2 business days)",
    slug: "regular",
    description: "Standard shipping",
    price: 25000,
  },
  {
    name: "Self-Pickup",
    slug: "self_pickup",
    description: "Pick up your order directly from our store",
    price: 0,
  },
];
