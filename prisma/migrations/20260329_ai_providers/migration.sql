-- AI Provider system migration

CREATE TABLE `AiProvider` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `slug` ENUM('OPENAI', 'ANTHROPIC', 'GOOGLE', 'PERPLEXITY', 'STABILITY') NOT NULL,
    `apiKey` TEXT NOT NULL,
    `authMethod` VARCHAR(191) NOT NULL DEFAULT 'api_key',
    `accessToken` TEXT NULL,
    `refreshToken` TEXT NULL,
    `tokenExpiresAt` DATETIME(3) NULL,
    `oauthEmail` VARCHAR(191) NULL,
    `isConnected` BOOLEAN NOT NULL DEFAULT false,
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `models` JSON NULL,
    `modelsRefreshed` DATETIME(3) NULL,
    `rateLimit` INTEGER NOT NULL DEFAULT 100,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `AiProvider_userId_idx`(`userId`),
    UNIQUE INDEX `AiProvider_userId_slug_key`(`userId`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `AiProvider` ADD CONSTRAINT `AiProvider_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
