/*
  Warnings:

  - The values [PAINTING,SCULPTURE,PHOTOGRAPHY,DIGITAL,MIXED_MEDIA,DRAWING,PRINTMAKING,TEXTILE,CERAMIC,OTHER] on the enum `ArtCondition` will be removed. If these variants are still used in the database, this will fail.
  - The values [DIGITAL_ART] on the enum `CategoryName` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ArtCondition_new" AS ENUM ('MINT', 'EXCELLENT', 'GOOD', 'FAIR', 'POOR');
ALTER TABLE "artwork" ALTER COLUMN "condition" TYPE "ArtCondition_new" USING ("condition"::text::"ArtCondition_new");
ALTER TABLE "scheduledUpload" ALTER COLUMN "condition" TYPE "ArtCondition_new" USING ("condition"::text::"ArtCondition_new");
ALTER TYPE "ArtCondition" RENAME TO "ArtCondition_old";
ALTER TYPE "ArtCondition_new" RENAME TO "ArtCondition";
DROP TYPE "ArtCondition_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "CategoryName_new" AS ENUM ('PAINTING', 'SCULPTURE', 'PHOTOGRAPHY', 'DIGITAL', 'MIXED_MEDIA', 'DRAWING', 'PRINTMAKING', 'TEXTILE', 'CERAMIC', 'OTHER');
ALTER TABLE "artwork" ALTER COLUMN "category" TYPE "CategoryName_new" USING ("category"::text::"CategoryName_new");
ALTER TABLE "scheduledUpload" ALTER COLUMN "category" TYPE "CategoryName_new" USING ("category"::text::"CategoryName_new");
ALTER TYPE "CategoryName" RENAME TO "CategoryName_old";
ALTER TYPE "CategoryName_new" RENAME TO "CategoryName";
DROP TYPE "CategoryName_old";
COMMIT;
