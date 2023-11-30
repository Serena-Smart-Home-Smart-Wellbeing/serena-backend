/*
  Warnings:

  - You are about to alter the column `neutral` on the `useremotionresult` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `joy` on the `useremotionresult` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `sadness` on the `useremotionresult` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `disgust` on the `useremotionresult` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `surprise` on the `useremotionresult` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `anger` on the `useremotionresult` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `fear` on the `useremotionresult` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.

*/
-- AlterTable
ALTER TABLE `useremotionresult` MODIFY `neutral` DOUBLE NOT NULL,
    MODIFY `joy` DOUBLE NOT NULL,
    MODIFY `sadness` DOUBLE NOT NULL,
    MODIFY `disgust` DOUBLE NOT NULL,
    MODIFY `surprise` DOUBLE NOT NULL,
    MODIFY `anger` DOUBLE NOT NULL,
    MODIFY `fear` DOUBLE NOT NULL;
