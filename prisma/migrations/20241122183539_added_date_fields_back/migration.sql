/*
  Warnings:

  - Added the required column `endDate` to the `discount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `discount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "discount" ADD COLUMN     "endDate" DATE NOT NULL,
ADD COLUMN     "startDate" DATE NOT NULL;
