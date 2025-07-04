import { PaymentMethod } from "~/generated/prisma";

export type CreatePayment = Pick<
  PaymentMethod,
  "name" | "value" | "description"
>;

// Multiple payment methods for seeding
export const dataPaymentMethods: CreatePayment[] = [
  {
    name: "Bank Transfer",
    value: "bank_transfer",
    description: "BCA, Mandiri, etc",
  },
  {
    name: "QRIS",
    value: "qris",
    description: "Scan static QR code with any supported app",
  },
  {
    name: "E-Wallet",
    value: "e_wallet",
    description: "DANA, OVO, ShopeePay, etc",
  },
];
