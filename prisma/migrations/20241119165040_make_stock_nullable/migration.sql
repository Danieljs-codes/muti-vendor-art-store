/*
  Warnings:

  - You are about to drop the column `categoryId` on the `artwork` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UploadStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "artwork" DROP COLUMN "categoryId",
ALTER COLUMN "stock" DROP NOT NULL;

-- CreateTable
CREATE TABLE "scheduledUpload" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "imageUrls" TEXT[],
    "dimensions" TEXT NOT NULL,
    "weight" DOUBLE PRECISION,
    "condition" "ArtCondition" NOT NULL,
    "stock" INTEGER NOT NULL,
    "scheduledAt" DATE NOT NULL,
    "status" "UploadStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" DATE NOT NULL,
    "updatedAt" DATE NOT NULL,
    "artistId" TEXT NOT NULL,
    "category" "CategoryName" NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "scheduledUpload_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "scheduledUpload" ADD CONSTRAINT "scheduledUpload_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
