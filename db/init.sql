-- Initialize ZEXUS database
-- This script runs automatically when the PostgreSQL container starts for the first time

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
DO $$ BEGIN
    CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'MODERATOR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add comments
COMMENT ON TYPE "Role" IS 'User roles for authorization';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE zexus TO postgres;
