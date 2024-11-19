/*
  Warnings:

  - You are about to drop the `category` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `artwork` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "artwork" DROP CONSTRAINT "artwork_categoryId_fkey";

-- AlterTable
ALTER TABLE "artwork" ADD COLUMN     "category" "CategoryName" NOT NULL;

-- DropTable
DROP TABLE "category";
