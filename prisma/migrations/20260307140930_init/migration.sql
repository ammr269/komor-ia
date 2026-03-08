-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `hash_password` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `role` ENUM('admin', 'user', 'developer', 'journaliste', 'translator') NOT NULL DEFAULT 'user',
    `email_verified` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profils` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bio` TEXT NULL,
    `location` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `status` ENUM('private', 'public') NOT NULL DEFAULT 'private',
    `user_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `profils_user_id_key`(`user_id`),
    INDEX `profils_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `modeles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `domaine` VARCHAR(191) NOT NULL,
    `version` VARCHAR(191) NOT NULL DEFAULT '1.0.0',
    `status` ENUM('development', 'beta', 'production', 'deprecated') NOT NULL DEFAULT 'development',
    `endpoint` VARCHAR(191) NULL,
    `icon` VARCHAR(191) NULL DEFAULT 'Brain',
    `color` VARCHAR(191) NULL DEFAULT 'blue',
    `is_public` BOOLEAN NOT NULL DEFAULT true,
    `features` JSON NULL,
    `pricing` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `modeles_name_key`(`name`),
    UNIQUE INDEX `modeles_slug_key`(`slug`),
    INDEX `modeles_slug_idx`(`slug`),
    INDEX `modeles_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `articles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(500) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `original_text` LONGTEXT NOT NULL,
    `original_lang` ENUM('fr', 'en', 'ar', 'sw', 'zdj', 'other') NOT NULL DEFAULT 'fr',
    `target_lang` ENUM('fr', 'en', 'ar', 'sw', 'zdj', 'other') NOT NULL DEFAULT 'zdj',
    `category` ENUM('news', 'literature', 'education', 'science', 'culture', 'religion', 'history', 'other') NOT NULL DEFAULT 'other',
    `status` ENUM('draft', 'pending', 'in_progress', 'completed', 'verified') NOT NULL DEFAULT 'pending',
    `difficulty` INTEGER NOT NULL DEFAULT 1,
    `estimated_words` INTEGER NOT NULL DEFAULT 0,
    `source` VARCHAR(500) NULL,
    `author` VARCHAR(255) NULL,
    `published_date` DATETIME(3) NULL,
    `tags` JSON NULL,
    `metadata` JSON NULL,
    `priority` INTEGER NOT NULL DEFAULT 0,
    `is_public` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `articles_slug_key`(`slug`),
    INDEX `articles_slug_idx`(`slug`),
    INDEX `articles_status_idx`(`status`),
    INDEX `articles_category_idx`(`category`),
    INDEX `articles_original_lang_target_lang_idx`(`original_lang`, `target_lang`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `translations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `article_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `translated_text` LONGTEXT NOT NULL,
    `progress` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('draft', 'pending', 'in_progress', 'completed', 'verified') NOT NULL DEFAULT 'in_progress',
    `quality` INTEGER NULL,
    `time_spent` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `verified_by` INTEGER NULL,
    `verified_at` DATETIME(3) NULL,
    `notes` TEXT NULL,
    `last_edit_position` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `translations_article_id_idx`(`article_id`),
    INDEX `translations_user_id_idx`(`user_id`),
    INDEX `translations_status_idx`(`status`),
    UNIQUE INDEX `translations_article_id_user_id_is_active_key`(`article_id`, `user_id`, `is_active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `translation_edits` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `translation_id` INTEGER NOT NULL,
    `article_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `edited_text` LONGTEXT NOT NULL,
    `progress` INTEGER NOT NULL DEFAULT 0,
    `session_start` DATETIME(3) NOT NULL,
    `session_end` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `translation_edits_translation_id_idx`(`translation_id`),
    INDEX `translation_edits_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `api_keys` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `modele_id` INTEGER NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `rate_limit` INTEGER NOT NULL DEFAULT 1000,
    `last_used` DATETIME(3) NULL,
    `expires_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `api_keys_key_key`(`key`),
    INDEX `api_keys_user_id_idx`(`user_id`),
    INDEX `api_keys_modele_id_idx`(`modele_id`),
    INDEX `api_keys_key_idx`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usage_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `api_key_id` INTEGER NOT NULL,
    `modele_id` INTEGER NOT NULL,
    `endpoint` VARCHAR(191) NOT NULL,
    `method` VARCHAR(191) NOT NULL DEFAULT 'POST',
    `status_code` INTEGER NOT NULL,
    `response_time` INTEGER NOT NULL,
    `tokens` INTEGER NOT NULL DEFAULT 0,
    `cost` DOUBLE NOT NULL DEFAULT 0,
    `metadata` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `usage_logs_user_id_idx`(`user_id`),
    INDEX `usage_logs_api_key_id_idx`(`api_key_id`),
    INDEX `usage_logs_modele_id_idx`(`modele_id`),
    INDEX `usage_logs_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `provider_account_id` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    INDEX `accounts_user_id_idx`(`user_id`),
    UNIQUE INDEX `accounts_provider_provider_account_id_key`(`provider`, `provider_account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `session_token` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sessions_session_token_key`(`session_token`),
    INDEX `sessions_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
