/*
  Warnings:

  - Added the required column `condition` to the `artwork` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dimensions` to the `artwork` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock` to the `artwork` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ArtCondition" AS ENUM ('MINT', 'EXCELLENT', 'GOOD', 'FAIR', 'POOR');

-- AlterTable
ALTER TABLE "artwork" ADD COLUMN     "condition" "ArtCondition" NOT NULL,
ADD COLUMN     "dimensions" TEXT NOT NULL,
ADD COLUMN     "stock" INTEGER NOT NULL,
ADD COLUMN     "weight" DOUBLE PRECISION;
