import { dataProducts } from "~/modules/product/data";
import { PrismaClient } from "~/generated/prisma";
import { dataUsers } from "~/modules/user/data";
import { hashPassword } from "~/lib/password";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...\n");

  // 1. Seed Users first and collect IDs
  console.log("👤 Seeding Users...");
  for (const userData of dataUsers) {
    const { password, ...user } = userData;

    const upsertedUser = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        ...user,
      },
      create: {
        ...user,
        password: { create: { hash: await hashPassword(password) } },
      },
    });

    console.info(`✓ User: ${upsertedUser.fullName} (${upsertedUser.email})`);
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

    const imagesLog = upsertedProduct.images.map((image) => image.name).join("\n \t\t");

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
