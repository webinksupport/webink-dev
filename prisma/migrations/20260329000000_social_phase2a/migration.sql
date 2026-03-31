-- Social Studio Phase 2a: Carousel/Reels, Post Scoring, Content Recycler, CSV Import
ALTER TABLE `SocialPost` ADD COLUMN `carouselSlides` JSON NULL;
ALTER TABLE `SocialPost` ADD COLUMN `postType` VARCHAR(191) NOT NULL DEFAULT 'FEED';
ALTER TABLE `SocialPost` ADD COLUMN `originalPostId` VARCHAR(191) NULL;
