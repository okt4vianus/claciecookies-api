import { z } from "@hono/zod-openapi";
import { ShippingMethodsSchema } from "@/modules//shipping-method/schema";
import { AddressSchema } from "@/modules/address/schema";
import { CartSchema } from "@/modules/cart/schema";
import { PaymentMethodsSchema } from "@/modules/payment-method/schema";
import { PrivateUserProfileSchema as UserProfileSchema } from "@/modules/user/schema";

export const CheckoutResponseSchema = z.object({
  profile: UserProfileSchema,
  cart: CartSchema,
  address: AddressSchema,
  shippingMethods: ShippingMethodsSchema,
  paymentMethods: PaymentMethodsSchema,
});
