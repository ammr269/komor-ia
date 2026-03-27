/*
  Warnings:

  - You are about to alter the column `category` on the `articles` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(5))` to `Enum(EnumId(5))`.

*/
-- AlterTable
ALTER TABLE `articles` MODIFY `category` ENUM('actualites', 'litterature', 'education', 'science', 'culture', 'religion', 'histoire', 'autre', 'economie', 'sport', 'sante', 'politique') NOT NULL DEFAULT 'autre';
