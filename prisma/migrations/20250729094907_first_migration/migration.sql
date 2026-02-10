-- CreateTable
CREATE TABLE `KMIA` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `secteur` VARCHAR(191) NOT NULL,
    `siteWeb` VARCHAR(191) NULL,
    `emailContact` VARCHAR(191) NULL,
    `pays` VARCHAR(191) NOT NULL,
    `ville` VARCHAR(191) NULL,
    `fondateurs` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Modele` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `decription` TEXT NOT NULL,
    `domaine` VARCHAR(191) NOT NULL,
    `version` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Article` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contenu` TEXT NOT NULL,
    `resume` TEXT NULL,
    `categorie` VARCHAR(191) NOT NULL,
    `userId` INTEGER NULL,

    INDEX `Article_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `emailVerified` DATETIME(3) NULL,
    `image` VARCHAR(191) NULL,
    `role` ENUM('admin', 'user', 'journaliste') NOT NULL DEFAULT 'user',
    `hashPassword` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Profil` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` TEXT NULL,
    `email` VARCHAR(191) NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `linkedin` VARCHAR(191) NULL,
    `twitter` VARCHAR(191) NULL,
    `bio` TEXT NULL,
    `skills` VARCHAR(191) NULL,
    `experience` INTEGER NULL,
    `education` VARCHAR(191) NULL,
    `userId` INTEGER NOT NULL,
    `status` ENUM('private', 'public') NOT NULL DEFAULT 'private',

    UNIQUE INDEX `Profil_phoneNumber_key`(`phoneNumber`),
    UNIQUE INDEX `Profil_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Article` ADD CONSTRAINT `Article_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Profil` ADD CONSTRAINT `Profil_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
