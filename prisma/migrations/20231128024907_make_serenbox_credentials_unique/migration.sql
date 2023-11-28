/*
  Warnings:

  - A unique constraint covering the columns `[credentials]` on the table `serenbox` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `serenbox_credentials_key` ON `serenbox`(`credentials`);
