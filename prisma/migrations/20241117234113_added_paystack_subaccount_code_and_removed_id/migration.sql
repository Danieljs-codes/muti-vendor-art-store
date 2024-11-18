/*
  Warnings:

  - You are about to drop the column `paystackSubAccountId` on the `artist` table. All the data in the column will be lost.
  - Added the required column `paystackSubAccountCode` to the `artist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "artist" DROP COLUMN "paystackSubAccountId",
ADD COLUMN     "paystackSubAccountCode" TEXT NOT NULL;
