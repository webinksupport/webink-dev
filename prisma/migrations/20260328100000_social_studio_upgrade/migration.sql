-- Social Studio Upgrade Migration
-- Adds: SocialBrandProfile, SocialContentPillar models
-- Modifies: SocialPostStatus enum (adds PENDING_REVIEW)

-- Add PENDING_REVIEW to SocialPostStatus enum
ALTER TABLE `SocialPost` MODIFY COLUMN `status` ENUM('DRAFT', 'PENDING_REVIEW', 'SCHEDULED', 'PUBLISHING', 'PUBLISHED', 'FAILED') NOT NULL DEFAULT 'DRAFT';

-- Create SocialBrandProfile table
CREATE TABLE `SocialBrandProfile` (
    `id` VARCHAR(191) NOT NULL,
    `businessName` VARCHAR(191) NOT NULL,
    `tagline` VARCHAR(191) NULL,
    `brandVoice` VARCHAR(191) NULL,
    `primaryColors` JSON NULL,
    `targetAudience` TEXT NULL,
    `keyServices` TEXT NULL,
    `brandKeywords` TEXT NULL,
    `competitorHandles` TEXT NULL,
    `logoPath` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create SocialContentPillar table
CREATE TABLE `SocialContentPillar` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `icon` VARCHAR(191) NULL,
    `color` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
