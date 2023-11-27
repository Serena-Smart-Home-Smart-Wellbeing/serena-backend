/*
  Warnings:

  - You are about to drop the `musicrecommendation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `musicrecommendation` DROP FOREIGN KEY `musicrecommendation_userId_fkey`;

-- DropTable
DROP TABLE `musicrecommendation`;
