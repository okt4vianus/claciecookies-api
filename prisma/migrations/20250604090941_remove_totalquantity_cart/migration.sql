/*
  Warnings:

  - You are about to drop the column `totalQuantity` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `subtotal` on the `CartItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "totalQuantity",
ALTER COLUMN "totalPrice" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "subtotal",
ADD COLUMN     "subTotalPrice" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "quantity" SET DEFAULT 1;
