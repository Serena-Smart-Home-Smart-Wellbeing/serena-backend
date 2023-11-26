-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `image_name` VARCHAR(191) NULL DEFAULT '',

    UNIQUE INDEX `user_email_key`(`email`),
    UNIQUE INDEX `user_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `serenbox` (
    `id` VARCHAR(191) NOT NULL,
    `credentials` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `image_name` VARCHAR(191) NULL DEFAULT '',
    `added` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `slotAId` VARCHAR(191) NOT NULL,
    `slotBId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `serenbox_slotAId_key`(`slotAId`),
    UNIQUE INDEX `serenbox_slotBId_key`(`slotBId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `serenboxslot` (
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
CREATE TABLE `serenboxsession` (
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
CREATE TABLE `useremotionresult` (
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
CREATE TABLE `serenplaceproduct` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `price_idr` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `stock` INTEGER NOT NULL,
    `image_name` VARCHAR(191) NULL DEFAULT '',
    `type` ENUM('OIL', 'DEVICE') NOT NULL DEFAULT 'OIL',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `musicrecommendation` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `artist` VARCHAR(191) NOT NULL,
    `album` VARCHAR(191) NOT NULL,
    `release_year` INTEGER NOT NULL,
    `cover_image` VARCHAR(191) NULL,
    `preview_link` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
