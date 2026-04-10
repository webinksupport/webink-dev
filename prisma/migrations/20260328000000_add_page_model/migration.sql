-- CreateEnum
-- PageStatus enum is handled by Prisma's enum support for MySQL (stored as ENUM column)

-- CreateTable
CREATE TABLE `Page` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `status` ENUM('PUBLISHED', 'DRAFT') NOT NULL DEFAULT 'DRAFT',
    `isCore` BOOLEAN NOT NULL DEFAULT false,
    `template` VARCHAR(191) NOT NULL DEFAULT 'generic',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Page_slug_key`(`slug`),
    INDEX `Page_slug_idx`(`slug`),
    INDEX `Page_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Seed core pages
INSERT INTO `Page` (`id`, `title`, `slug`, `status`, `isCore`, `template`, `createdAt`, `updatedAt`) VALUES
  (REPLACE(UUID(), '-', ''), 'Homepage', 'home', 'PUBLISHED', true, 'generic', NOW(3), NOW(3)),
  (REPLACE(UUID(), '-', ''), 'About', 'about', 'PUBLISHED', true, 'generic', NOW(3), NOW(3)),
  (REPLACE(UUID(), '-', ''), 'Contact', 'contact', 'PUBLISHED', true, 'generic', NOW(3), NOW(3)),
  (REPLACE(UUID(), '-', ''), 'Services Hub', 'services', 'PUBLISHED', true, 'generic', NOW(3), NOW(3)),
  (REPLACE(UUID(), '-', ''), 'Web Design', 'services/web-design', 'PUBLISHED', true, 'generic', NOW(3), NOW(3)),
  (REPLACE(UUID(), '-', ''), 'SEO Services', 'services/seo', 'PUBLISHED', true, 'generic', NOW(3), NOW(3)),
  (REPLACE(UUID(), '-', ''), 'Social Media', 'services/social-media', 'PUBLISHED', true, 'generic', NOW(3), NOW(3)),
  (REPLACE(UUID(), '-', ''), 'Paid Advertising', 'services/paid-advertising', 'PUBLISHED', true, 'generic', NOW(3), NOW(3)),
  (REPLACE(UUID(), '-', ''), 'AI Marketing', 'services/ai-marketing', 'PUBLISHED', true, 'generic', NOW(3), NOW(3)),
  (REPLACE(UUID(), '-', ''), 'Custom CRM', 'services/custom-crm', 'PUBLISHED', true, 'generic', NOW(3), NOW(3)),
  (REPLACE(UUID(), '-', ''), 'Web Hosting', 'services/web-hosting', 'PUBLISHED', true, 'generic', NOW(3), NOW(3)),
  (REPLACE(UUID(), '-', ''), 'Pricing', 'pricing', 'PUBLISHED', true, 'generic', NOW(3), NOW(3));
