/*
  Warnings:

  - You are about to drop the column `createdAt` on the `PaymentMethod` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `PaymentMethod` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ShippingMethod` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ShippingMethod` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PaymentMethod" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "ShippingMethod" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";
