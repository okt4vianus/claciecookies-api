import { prisma } from "~/lib/prisma";
import { dataShippingMethods } from "~/modules/shipping-method/data";

export async function seedShippingMethods() {
  console.log("\n🚚 Seeding Shipping Methods...");
  for (const shippingMethodData of dataShippingMethods) {
    const { slug, ...shipping } = shippingMethodData;
    const upsertedShippingMethod = await prisma.shippingMethod.upsert({
      where: { slug },
      update: { ...shipping },
      create: { slug, ...shipping },
    });
    console.info(`✓ Shipping Method: ${upsertedShippingMethod.name}`);
  }
}
