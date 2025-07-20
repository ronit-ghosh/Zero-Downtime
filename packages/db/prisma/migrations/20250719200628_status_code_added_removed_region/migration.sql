/*
  Warnings:

  - You are about to drop the column `regionId` on the `WebsiteTick` table. All the data in the column will be lost.
  - You are about to drop the `Region` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `statusCode` to the `WebsiteTick` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "WebsiteTick" DROP CONSTRAINT "WebsiteTick_regionId_fkey";

-- AlterTable
ALTER TABLE "WebsiteTick" DROP COLUMN "regionId",
ADD COLUMN     "statusCode" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Region";
