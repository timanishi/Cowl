-- Enable UUID extension (already done)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT,
    email TEXT UNIQUE,
    "emailVerified" TIMESTAMPTZ,
    image TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Create accounts table for NextAuth
CREATE TABLE "Account" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(provider, "providerAccountId")
);

-- Create sessions table for NextAuth
CREATE TABLE "Session" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "sessionToken" TEXT UNIQUE NOT NULL,
    "userId" TEXT NOT NULL,
    expires TIMESTAMPTZ NOT NULL,
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

-- Create verification tokens table for NextAuth
CREATE TABLE "VerificationToken" (
    identifier TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires TIMESTAMPTZ NOT NULL,
    UNIQUE(identifier, token)
);

-- Create wallets table
CREATE TABLE wallets (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    description TEXT,
    "inviteCode" TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW(),
    "isActive" BOOLEAN DEFAULT true
);

-- Create wallet_members table
CREATE TABLE wallet_members (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    role TEXT DEFAULT 'member',
    "joinedAt" TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY ("walletId") REFERENCES wallets(id) ON DELETE CASCADE,
    UNIQUE("userId", "walletId")
);

-- Create payments table
CREATE TABLE payments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "walletId" TEXT NOT NULL,
    "payerId" TEXT NOT NULL,
    amount INTEGER NOT NULL,
    description TEXT NOT NULL,
    category TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY ("walletId") REFERENCES wallets(id) ON DELETE CASCADE,
    FOREIGN KEY ("payerId") REFERENCES users(id)
);

-- Create payment_participants table
CREATE TABLE payment_participants (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "paymentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    amount INTEGER NOT NULL,
    FOREIGN KEY ("paymentId") REFERENCES payments(id) ON DELETE CASCADE,
    UNIQUE("paymentId", "userId")
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_account_user ON "Account"("userId");
CREATE INDEX idx_session_user ON "Session"("userId");
CREATE INDEX idx_wallet_members_user ON wallet_members("userId");
CREATE INDEX idx_wallet_members_wallet ON wallet_members("walletId");
CREATE INDEX idx_payments_wallet ON payments("walletId");
CREATE INDEX idx_payments_payer ON payments("payerId");
CREATE INDEX idx_payment_participants_payment ON payment_participants("paymentId");