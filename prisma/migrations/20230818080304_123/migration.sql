/*
  Warnings:

  - You are about to drop the `_sharedPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `Post` ADD COLUMN `likesCount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `photoPublicId` VARCHAR(191) NULL,
    ADD COLUMN `sharedPostId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Profile` ADD COLUMN `coverPublicId` VARCHAR(191) NULL,
    ADD COLUMN `photoPublicId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `_sharedPost`;

-- CreateTable
CREATE TABLE `PostLike` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `postId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PostLike_userId_idx`(`userId`),
    INDEX `PostLike_postId_idx`(`postId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Post_sharedPostId_idx` ON `Post`(`sharedPostId`);
