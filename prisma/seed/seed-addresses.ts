import { prisma } from "@/lib/prisma";
import { dataAddresses } from "@/modules/user/data";

export async function seedAddresses() {
  console.log("\n🏠 Seeding Addresses...");
  for (const addressData of dataAddresses) {
    const { userEmail, ...address } = addressData;

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (user) {
      const upsertedAddress = await prisma.address.upsert({
        where: {
          userId_label: {
            userId: user.id,
            label: address.label,
          },
        },
        create: {
          ...address,
          userId: user.id,
        },
        update: {
          ...address,
          userId: user.id,
        },
      });
      console.info(`✓ ${upsertedAddress.label} for ${user.name}`);
    }
  }
}
