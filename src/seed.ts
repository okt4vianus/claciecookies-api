import { dataProducts } from "~/modules/product/data";
import { PrismaClient } from "~/generated/prisma";
import { dataAddresses, dataUsers } from "~/modules/user/data";
import { hashPassword } from "~/lib/password";
import { dataShippingMethods } from "~/modules/shipping/data";
import { dataPaymentMethods } from "./modules/payment/data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...\n");

  // 1. Seed Users first and collect IDs
  console.log("👤 Seeding Users...");

  for (const userData of dataUsers) {
    const { password, ...user } = userData;
    const upsertedUser = await prisma.user.upsert({
      where: { email: userData.email },
      update: { ...user },
      create: {
        ...user,
        password: { create: { hash: await hashPassword(password) } },
      },
    });
    console.info(`✓ User: ${upsertedUser.fullName} (${upsertedUser.email})`);
  }

  // 2. Seed Addresses
  console.log("\n🏠 Seeding Addresses...");
  for (const addressData of dataAddresses) {
    const { userEmail, ...address } = addressData;

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (user) {
      const newAddress = await prisma.address.create({
        data: {
          ...address,
          userId: user.id,
        },
      });
      console.info(`✓ ${newAddress.label} for ${user.fullName}`);
    }
  }

  // 3. Seed Shipping Methods
  console.log("\n🚚 Seeding Shipping Methods...");
  for (const shippingMethodData of dataShippingMethods) {
    const { value, ...shipping } = shippingMethodData;
    const upsertedShippingMethod = await prisma.shippingMethod.upsert({
      where: { value },
      update: { ...shipping },
      create: { value, ...shipping },
    });
    console.info(`✓ Shipping Method: ${upsertedShippingMethod.name}`);
  }

  // 4. Seed Payment Methods
  console.log("\n💳 Seeding Payment Methods...");
  for (const paymentMethodData of dataPaymentMethods) {
    const { value, ...payment } = paymentMethodData;
    const upsertedPaymentMethod = await prisma.paymentMethod.upsert({
      where: { value },
      update: { ...payment },
      create: { value, ...payment },
    });
    console.info(`✓ Payment Method: ${upsertedPaymentMethod.name}`);
  }

  // Seed Product
  for (const dataProduct of dataProducts) {
    const upsertedProduct = await prisma.product.upsert({
      where: { slug: dataProduct.slug },
      update: {
        ...dataProduct,
        images: { connect: dataProduct.images },
      },
      create: {
        ...dataProduct,
        images: { create: dataProduct.images },
      },
      include: { images: true },
    });

    const imagesLog = upsertedProduct.images
      .map((image) => image.name)
      .join("\n \t\t");

    console.info(`
      🍪 Product: ${upsertedProduct.name} (${upsertedProduct.slug})
      🖼️  Images: ${imagesLog}`);
  }

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
