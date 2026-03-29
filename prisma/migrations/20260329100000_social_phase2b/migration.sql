-- Social Studio Phase 2b: Competitor Intelligence, Client Access, AB Testing, Stories Planner

-- AB Testing columns on SocialPost
ALTER TABLE `SocialPost` ADD COLUMN `abVariant` VARCHAR(191) NULL;
ALTER TABLE `SocialPost` ADD COLUMN `abGroupId` VARCHAR(191) NULL;

-- Competitor Tracker
CREATE TABLE `SocialCompetitor` (
  `id` VARCHAR(191) NOT NULL,
  `handle` VARCHAR(191) NOT NULL,
  `displayName` VARCHAR(191) NULL,
  `notes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Client Access / White Label
CREATE TABLE `SocialClient` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `instagramHandle` VARCHAR(191) NULL,
  `facebookPageId` VARCHAR(191) NULL,
  `accessToken` LONGTEXT NULL,
  `brandProfileId` VARCHAR(191) NULL,
  `userId` VARCHAR(191) NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Stories Planner
CREATE TABLE `SocialStory` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `slides` JSON NOT NULL,
  `scheduledAt` DATETIME(3) NULL,
  `publishedAt` DATETIME(3) NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'DRAFT',
  `igStoryId` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
