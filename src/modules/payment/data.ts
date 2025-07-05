import { PaymentMethod } from "~/generated/prisma";

export type CreatePayment = Pick<
  PaymentMethod,
  "name" | "slug" | "description"
>;

// Multiple payment methods for seeding
export const dataPaymentMethods: CreatePayment[] = [
  {
    name: "Bank Transfer",
    slug: "bank_transfer",
    description: "BCA, Mandiri, etc",
  },
  {
    name: "QRIS",
    slug: "qris",
    description: "Scan static QR code with any supported app",
  },
  {
    name: "E-Wallet",
    slug: "e_wallet",
    description: "DANA, OVO, ShopeePay, etc",
  },
];
