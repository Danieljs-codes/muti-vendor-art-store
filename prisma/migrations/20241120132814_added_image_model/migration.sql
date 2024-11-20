/*
  Warnings:

  - You are about to drop the column `imageUrls` on the `artwork` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrls` on the `scheduledUpload` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "artwork" DROP COLUMN "imageUrls";

-- AlterTable
ALTER TABLE "scheduledUpload" DROP COLUMN "imageUrls";

-- CreateTable
CREATE TABLE "image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "blurhash" TEXT NOT NULL,
    "artworkId" TEXT,
    "scheduledUploadId" TEXT,

    CONSTRAINT "image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "image" ADD CONSTRAINT "image_artworkId_fkey" FOREIGN KEY ("artworkId") REFERENCES "artwork"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image" ADD CONSTRAINT "image_scheduledUploadId_fkey" FOREIGN KEY ("scheduledUploadId") REFERENCES "scheduledUpload"("id") ON DELETE CASCADE ON UPDATE CASCADE;
