/*
  Warnings:

  - You are about to drop the column `decription` on the `Modele` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Modele` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Modele` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `KMIA` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Modele` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Modele` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Modele` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Profil` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Article` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `KMIA` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Modele` DROP COLUMN `decription`,
    ADD COLUMN `color` VARCHAR(191) NULL,
    ADD COLUMN `description` TEXT NOT NULL,
    ADD COLUMN `endpoint` VARCHAR(191) NULL,
    ADD COLUMN `features` TEXT NULL,
    ADD COLUMN `icon` VARCHAR(191) NULL,
    ADD COLUMN `isPublic` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `pricing` TEXT NULL,
    ADD COLUMN `slug` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` ENUM('development', 'beta', 'production', 'deprecated') NOT NULL DEFAULT 'beta',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Profil` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('admin', 'user', 'developer', 'journaliste') NOT NULL DEFAULT 'user';

-- CreateTable
CREATE TABLE `ApiKey` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `modeleId` INTEGER NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `rateLimit` INTEGER NOT NULL DEFAULT 1000,
    `lastUsed` DATETIME(3) NULL,
    `expiresAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ApiKey_key_key`(`key`),
    INDEX `ApiKey_userId_idx`(`userId`),
    INDEX `ApiKey_modeleId_idx`(`modeleId`),
    INDEX `ApiKey_key_idx`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsageLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `modeleId` INTEGER NOT NULL,
    `endpoint` VARCHAR(191) NOT NULL,
    `method` VARCHAR(191) NOT NULL,
    `statusCode` INTEGER NOT NULL,
    `responseTime` INTEGER NOT NULL,
    `inputTokens` INTEGER NULL,
    `outputTokens` INTEGER NULL,
    `cost` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `UsageLog_userId_idx`(`userId`),
    INDEX `UsageLog_modeleId_idx`(`modeleId`),
    INDEX `UsageLog_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Article_categorie_idx` ON `Article`(`categorie`);

-- CreateIndex
CREATE UNIQUE INDEX `Modele_name_key` ON `Modele`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Modele_slug_key` ON `Modele`(`slug`);

-- AddForeignKey
ALTER TABLE `ApiKey` ADD CONSTRAINT `ApiKey_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApiKey` ADD CONSTRAINT `ApiKey_modeleId_fkey` FOREIGN KEY (`modeleId`) REFERENCES `Modele`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsageLog` ADD CONSTRAINT `UsageLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsageLog` ADD CONSTRAINT `UsageLog_modeleId_fkey` FOREIGN KEY (`modeleId`) REFERENCES `Modele`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `Article` RENAME INDEX `Article_userId_fkey` TO `Article_userId_idx`;
