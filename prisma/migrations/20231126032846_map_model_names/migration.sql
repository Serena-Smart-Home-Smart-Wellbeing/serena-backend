-- DropForeignKey
ALTER TABLE `musicrecommendation` DROP FOREIGN KEY `MusicRecommendation_userId_fkey`;

-- DropForeignKey
ALTER TABLE `serenbox` DROP FOREIGN KEY `SerenBox_slotAId_fkey`;

-- DropForeignKey
ALTER TABLE `serenbox` DROP FOREIGN KEY `SerenBox_slotBId_fkey`;

-- DropForeignKey
ALTER TABLE `serenbox` DROP FOREIGN KEY `SerenBox_userId_fkey`;

-- DropForeignKey
ALTER TABLE `serenboxsession` DROP FOREIGN KEY `SerenBoxSession_serenBoxId_fkey`;

-- DropForeignKey
ALTER TABLE `useremotionresult` DROP FOREIGN KEY `UserEmotionResult_userId_fkey`;

-- AddForeignKey
ALTER TABLE `serenbox` ADD CONSTRAINT `serenbox_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `serenbox` ADD CONSTRAINT `serenbox_slotAId_fkey` FOREIGN KEY (`slotAId`) REFERENCES `serenboxslot`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `serenbox` ADD CONSTRAINT `serenbox_slotBId_fkey` FOREIGN KEY (`slotBId`) REFERENCES `serenboxslot`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `serenboxsession` ADD CONSTRAINT `serenboxsession_serenBoxId_fkey` FOREIGN KEY (`serenBoxId`) REFERENCES `serenbox`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `useremotionresult` ADD CONSTRAINT `useremotionresult_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `musicrecommendation` ADD CONSTRAINT `musicrecommendation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `serenbox` RENAME INDEX `SerenBox_slotAId_key` TO `serenbox_slotAId_key`;

-- RenameIndex
ALTER TABLE `serenbox` RENAME INDEX `SerenBox_slotBId_key` TO `serenbox_slotBId_key`;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `User_email_key` TO `user_email_key`;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `User_username_key` TO `user_username_key`;
