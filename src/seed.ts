import { dataProducts } from "~/modules/product/data";
import { PrismaClient } from "~/generated/prisma";
import { dataAddresses, dataUsers } from "~/modules/user/data";
import { hashPassword } from "~/lib/password";
import { dataShippingMethods } from "~/modules/shipping-method/data";
import { dataPaymentMethods } from "./modules/payment-method/data";
import { seedUsers } from "../prisma/seed/seed-users";
import { seedAddresses } from "../prisma/seed/seed-addresses";
import { seedShippingMethods } from "../prisma/seed/seed-shipping-methods";
import { seedProducts } from "../prisma/seed/seed.products";
import { seedPaymentMethods } from "../prisma/seed/seed-payment-methods";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...\n");

  /**
   * TODO: Refactor each for loop to be functions
   *
   * async function main() {
   *   await seedUsers();
   *   await seedAddresses();
   *   ...
   * }
   */

  await seedUsers();
  await seedAddresses();
  await seedShippingMethods();
  await seedPaymentMethods();
  await seedProducts();

  // for (const productImageSeed of exampleProductImages) {
  //   const { productSlug, ...productImageData } = productImageSeed;

  //   const productImage = await prisma.productImage.upsert({
  //     where: { name: productImageSeed.name },
  //     update: {
  //       ...productImageData,
  //       product: { connect: { slug: productSlug } },
  //     },
  //     create: {
  //       ...productImageData,
  //       product: { connect: { slug: productSlug } },
  //     },
  //   });
  //   console.info(`🍪 productImage: ${productImage.name}`);
  // }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
