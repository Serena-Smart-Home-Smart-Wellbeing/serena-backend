-- DropForeignKey
ALTER TABLE `serenbox` DROP FOREIGN KEY `serenbox_slotAId_fkey`;

-- DropForeignKey
ALTER TABLE `serenbox` DROP FOREIGN KEY `serenbox_slotBId_fkey`;

-- DropForeignKey
ALTER TABLE `serenbox` DROP FOREIGN KEY `serenbox_userId_fkey`;

-- DropForeignKey
ALTER TABLE `serenboxsession` DROP FOREIGN KEY `serenboxsession_serenBoxId_fkey`;

-- DropForeignKey
ALTER TABLE `useremotionresult` DROP FOREIGN KEY `useremotionresult_userId_fkey`;

-- AlterTable
ALTER TABLE `serenbox` MODIFY `slotAId` VARCHAR(191) NULL,
    MODIFY `slotBId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `serenbox` ADD CONSTRAINT `serenbox_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `serenbox` ADD CONSTRAINT `serenbox_slotAId_fkey` FOREIGN KEY (`slotAId`) REFERENCES `serenboxslot`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `serenbox` ADD CONSTRAINT `serenbox_slotBId_fkey` FOREIGN KEY (`slotBId`) REFERENCES `serenboxslot`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `serenboxsession` ADD CONSTRAINT `serenboxsession_serenBoxId_fkey` FOREIGN KEY (`serenBoxId`) REFERENCES `serenbox`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `useremotionresult` ADD CONSTRAINT `useremotionresult_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
