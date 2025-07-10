import { prisma } from "~/lib/prisma";
import { dataPaymentMethods } from "~/modules/payment-method/data";

export async function seedPaymentMethods() {
  console.log("\n💳 Seeding Payment Methods...");
  for (const paymentMethodData of dataPaymentMethods) {
    const { slug, ...payment } = paymentMethodData;
    const upsertedPaymentMethod = await prisma.paymentMethod.upsert({
      where: { slug },
      update: { ...payment },
      create: { slug, ...payment },
    });
    console.info(`✓ Payment Method: ${upsertedPaymentMethod.name}`);
  }
}
