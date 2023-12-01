/*
  Warnings:

  - Made the column `image_name` on table `serenbox` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image_name` on table `serenplaceproduct` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image_name` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `serenbox` MODIFY `image_name` VARCHAR(191) NOT NULL DEFAULT 'assets/placeholders/serenbox_mockup_transparent.png';

-- AlterTable
ALTER TABLE `serenplaceproduct` MODIFY `image_name` VARCHAR(191) NOT NULL DEFAULT 'assets/placeholders/essential_oil_slot.png';

-- AlterTable
ALTER TABLE `user` MODIFY `image_name` VARCHAR(191) NOT NULL DEFAULT 'assets/placeholders/user_profile_photo.jpeg';
