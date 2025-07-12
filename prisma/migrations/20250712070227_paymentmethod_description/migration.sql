/*
  Warnings:

  - Made the column `description` on table `PaymentMethod` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PaymentMethod" ALTER COLUMN "description" SET NOT NULL;
