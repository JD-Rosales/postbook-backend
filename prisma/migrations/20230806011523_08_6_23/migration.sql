/*
  Warnings:

  - The primary key for the `Profile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - Added the required column `postType` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Post` ADD COLUMN `postType` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Profile` DROP PRIMARY KEY,
    DROP COLUMN `id`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`;

-- CreateTable
CREATE TABLE `Follows` (
    `followerId` INTEGER NOT NULL,
    `followingId` INTEGER NOT NULL,

    INDEX `Follows_followingId_idx`(`followingId`),
    INDEX `Follows_followerId_idx`(`followerId`),
    PRIMARY KEY (`followerId`, `followingId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
