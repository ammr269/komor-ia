-- AlterTable
ALTER TABLE `articles` MODIFY `category` ENUM('actualites', 'litterature', 'education', 'science', 'culture', 'religion', 'histoire', 'autre', 'economie', 'sport', 'sante', 'politique', 'societe') NOT NULL DEFAULT 'autre';
