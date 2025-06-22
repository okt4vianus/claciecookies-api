import { dataProducts } from "~/modules/product/data";
// import { exampleProductImages } from "~/modules/productImage/data";
import { PrismaClient } from "~/generated/prisma";
import { dataUsers } from "./modules/user/data";
import { createPasswordData } from "./modules/user/createPassSample";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...\n");

  // 1. Seed Users first and collect IDs
  console.log("👤 Seeding Users...");
  const createdUserIds: string[] = [];

  for (const userData of dataUsers) {
    const upsertedUser = await prisma.user.upsert({
      where: { email: userData.email },
      update: userData,
      create: userData,
    });
    createdUserIds.push(upsertedUser.id);
    console.info(`✓ User: ${upsertedUser.fullName} (${upsertedUser.email})`);
  }

  // 2. Seed Passwords using the function
  console.log("🔒 Seeding Passwords...");
  const dataPasswords = createPasswordData(createdUserIds);

  for (const passData of dataPasswords) {
    const upsertedPassword = await prisma.password.upsert({
      where: { userId: passData.userId },
      update: { hash: passData.hash },
      create: passData,
    });
    console.info(`✓ Password created for user ID: ${upsertedPassword.userId}`);
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
