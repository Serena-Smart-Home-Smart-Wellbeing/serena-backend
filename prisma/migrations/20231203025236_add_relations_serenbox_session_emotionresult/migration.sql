-- AlterTable
ALTER TABLE `serenboxsession` ADD COLUMN `slotAId` VARCHAR(191) NULL,
    ADD COLUMN `slotBId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `useremotionresult` ADD COLUMN `serenBoxSessionId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `serenboxsession` ADD CONSTRAINT `serenboxsession_slotAId_fkey` FOREIGN KEY (`slotAId`) REFERENCES `serenboxslot`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `serenboxsession` ADD CONSTRAINT `serenboxsession_slotBId_fkey` FOREIGN KEY (`slotBId`) REFERENCES `serenboxslot`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `useremotionresult` ADD CONSTRAINT `useremotionresult_serenBoxSessionId_fkey` FOREIGN KEY (`serenBoxSessionId`) REFERENCES `serenboxsession`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
