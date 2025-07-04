/*
  Warnings:

  - Made the column `description` on table `ShippingMethod` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ShippingMethod" ALTER COLUMN "description" SET NOT NULL;
