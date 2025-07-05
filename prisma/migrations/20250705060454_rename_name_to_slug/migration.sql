/*
  Warnings:

  - You are about to drop the column `value` on the `PaymentMethod` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `ShippingMethod` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `PaymentMethod` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `ShippingMethod` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `PaymentMethod` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `ShippingMethod` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PaymentMethod_value_key";

-- DropIndex
DROP INDEX "ShippingMethod_value_key";

-- AlterTable
ALTER TABLE "PaymentMethod" DROP COLUMN "value",
ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ShippingMethod" DROP COLUMN "value",
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethod_slug_key" ON "PaymentMethod"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ShippingMethod_slug_key" ON "ShippingMethod"("slug");
