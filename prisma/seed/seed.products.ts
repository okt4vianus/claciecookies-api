import { prisma } from "~/lib/prisma";
import { dataProducts } from "~/modules/product/data";

export async function seedProducts() {
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
}
