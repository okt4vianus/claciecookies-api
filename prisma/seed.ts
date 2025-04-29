import { dataProducts } from "../src/modules/product/data";
import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
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
      include: {
        images: true,
      },
    });

    const imagesLog = upsertedProduct.images
      .map((image) => image.name)
      .join(" | ");

    console.info(`
🍪 Product: ${upsertedProduct.name} (${upsertedProduct.slug})
🖼️ Images: ${imagesLog}`);
  }
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
