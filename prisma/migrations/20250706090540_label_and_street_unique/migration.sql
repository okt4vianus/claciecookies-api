/*
  Warnings:

  - A unique constraint covering the columns `[label]` on the table `Address` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[street]` on the table `Address` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Address_label_key" ON "Address"("label");

-- CreateIndex
CREATE UNIQUE INDEX "Address_street_key" ON "Address"("street");
