-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `image_name` VARCHAR(191) NULL DEFAULT '',

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SerenBox` (
    `id` VARCHAR(191) NOT NULL,
    `credentials` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `image_name` VARCHAR(191) NULL DEFAULT '',
    `added` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `slotAId` VARCHAR(191) NOT NULL,
    `slotBId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SerenBox_slotAId_key`(`slotAId`),
    UNIQUE INDEX `SerenBox_slotBId_key`(`slotBId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SerenBoxSlot` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slot` ENUM('A', 'B') NOT NULL,
    `label` ENUM('ENERGETIC', 'RELAX') NOT NULL,
    `capacity_ml` INTEGER NOT NULL,
    `current_capacity_ml` DOUBLE NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SerenBoxSession` (
    `id` VARCHAR(191) NOT NULL,
    `serenBoxId` VARCHAR(191) NOT NULL,
    `duration_minutes` INTEGER NULL DEFAULT 10,
    `detection_mode` ENUM('INTERVAL', 'ONCE') NULL DEFAULT 'INTERVAL',
    `diffusion_option` ENUM('MATCH_MOOD', 'OPPOSITE_MOOD', 'AUTO') NULL DEFAULT 'MATCH_MOOD',
    `start_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `end_time` DATETIME(3) NULL,
    `is_running` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserEmotionResult` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `created_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `neutral` DECIMAL(65, 30) NOT NULL,
    `joy` DECIMAL(65, 30) NOT NULL,
    `sadness` DECIMAL(65, 30) NOT NULL,
    `disgust` DECIMAL(65, 30) NOT NULL,
    `surprise` DECIMAL(65, 30) NOT NULL,
    `anger` DECIMAL(65, 30) NOT NULL,
    `fear` DECIMAL(65, 30) NOT NULL,
    `user_photo` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SerenPlaceProduct` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `price_idr` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `stock` INTEGER NOT NULL,
    `image_name` VARCHAR(191) NULL DEFAULT '',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SerenBox` ADD CONSTRAINT `SerenBox_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SerenBox` ADD CONSTRAINT `SerenBox_slotAId_fkey` FOREIGN KEY (`slotAId`) REFERENCES `SerenBoxSlot`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SerenBox` ADD CONSTRAINT `SerenBox_slotBId_fkey` FOREIGN KEY (`slotBId`) REFERENCES `SerenBoxSlot`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SerenBoxSession` ADD CONSTRAINT `SerenBoxSession_serenBoxId_fkey` FOREIGN KEY (`serenBoxId`) REFERENCES `SerenBox`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserEmotionResult` ADD CONSTRAINT `UserEmotionResult_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
