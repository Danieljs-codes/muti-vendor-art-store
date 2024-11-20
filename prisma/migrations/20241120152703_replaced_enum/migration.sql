/*
  Warnings:

  - The values [MINT,EXCELLENT,GOOD,FAIR,POOR] on the enum `ArtCondition` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ArtCondition_new" AS ENUM ('PAINTING', 'SCULPTURE', 'PHOTOGRAPHY', 'DIGITAL', 'MIXED_MEDIA', 'DRAWING', 'PRINTMAKING', 'TEXTILE', 'CERAMIC', 'OTHER');
ALTER TABLE "artwork" ALTER COLUMN "condition" TYPE "ArtCondition_new" USING ("condition"::text::"ArtCondition_new");
ALTER TABLE "scheduledUpload" ALTER COLUMN "condition" TYPE "ArtCondition_new" USING ("condition"::text::"ArtCondition_new");
ALTER TYPE "ArtCondition" RENAME TO "ArtCondition_old";
ALTER TYPE "ArtCondition_new" RENAME TO "ArtCondition";
DROP TYPE "ArtCondition_old";
COMMIT;
