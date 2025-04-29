import { exampleProducts } from "../src/modules/product/data";
import { exampleProductImages } from "../src/modules/productImage/data";
import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  for (const productSeed of exampleProducts) {
    const product = await prisma.product.upsert({
      where: { slug: productSeed.slug },
      update: productSeed,
      create: productSeed,
    });
    console.info(`🍪 Product: ${product.name}`);
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
