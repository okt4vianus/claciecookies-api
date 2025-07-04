import { ShippingMethod } from "~/generated/prisma";

export type CreateShippingMethod = Pick<
  ShippingMethod,
  "name" | "value" | "description" | "price"
>;

// Multiple shipping methods for seeding
export const dataShippingMethods: CreateShippingMethod[] = [
  {
    name: "Same Day (Today)",
    value: "same_day",
    description: "Manado area only",
    price: 50000,
  },
  {
    name: "Express (1-2 business days)",
    value: "express",
    description: "Fast shipping",
    price: 25000,
  },
  {
    name: "Regular (3-5 business days)",
    value: "regular",
    description: "Standard shipping",
    price: 15000,
  },
];
