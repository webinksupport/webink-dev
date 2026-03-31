-- CreateTable
CREATE TABLE PasswordResetToken (
    id VARCHAR(191) NOT NULL,
    email VARCHAR(191) NOT NULL,
    	oken VARCHAR(191) NOT NULL,
    expiresAt DATETIME(3) NOT NULL,
    used BOOLEAN NOT NULL DEFAULT false,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX PasswordResetToken_token_key(	oken),
    INDEX PasswordResetToken_email_idx(email),
    INDEX PasswordResetToken_token_idx(	oken),
    PRIMARY KEY (id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
