import { PaymentMethodSchema as BasePaymentMethodSchema } from "@/generated/zod";

export const PaymentMethodSchema = BasePaymentMethodSchema;

export const PaymentMethodsSchema = BasePaymentMethodSchema.array();
