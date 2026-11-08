-- ==============================================================================
-- Kamus Madura Digital - Initial Database Migration
-- PostgreSQL 15+ / Supabase
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. Create Speech Level and Role Types
DO $$ BEGIN
    CREATE TYPE speech_level_type AS ENUM ('netral', 'enja_iya', 'engghi_enten', 'engghi_bhunten');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('super_admin', 'admin', 'editor', 'contributor', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE contribution_status_type AS ENUM ('pending', 'under_review', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_name VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Words Table
CREATE TABLE IF NOT EXISTS words (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) NOT NULL UNIQUE,
    word VARCHAR(255) NOT NULL,
    normalized_word VARCHAR(255) NOT NULL,
    definition TEXT NOT NULL,
    speech_level speech_level_type NOT NULL DEFAULT 'netral',
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Word Translations Table
CREATE TABLE IF NOT EXISTS word_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    word_id UUID NOT NULL REFERENCES words(id) ON DELETE CASCADE,
    translation VARCHAR(255) NOT NULL,
    target_language VARCHAR(10) NOT NULL DEFAULT 'id',
    speech_level speech_level_type NOT NULL DEFAULT 'netral',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Word Examples Table
CREATE TABLE IF NOT EXISTS word_examples (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    word_id UUID NOT NULL REFERENCES words(id) ON DELETE CASCADE,
    madurese_sentence TEXT NOT NULL,
    indonesian_translation TEXT NOT NULL,
    speech_level speech_level_type DEFAULT 'netral',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. User Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(150),
    email VARCHAR(255),
    role user_role_type NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Favorites Table
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    word_id UUID NOT NULL REFERENCES words(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, word_id)
);

-- 9. Contributions Table
CREATE TABLE IF NOT EXISTS contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    proposed_word VARCHAR(255) NOT NULL,
    proposed_translation VARCHAR(255) NOT NULL,
    speech_level speech_level_type NOT NULL DEFAULT 'netral',
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    example TEXT,
    notes TEXT,
    status contribution_status_type NOT NULL DEFAULT 'pending',
    reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    review_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Search Logs Table
CREATE TABLE IF NOT EXISTS search_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    query VARCHAR(255) NOT NULL,
    direction VARCHAR(10) NOT NULL DEFAULT 'm2i',
    results_count INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. Learning Articles Table
CREATE TABLE IF NOT EXISTS learning_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'tata_bahasa',
    thumbnail VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'published',
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    published_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for maximum query performance
CREATE INDEX IF NOT EXISTS idx_words_slug ON words(slug);
CREATE INDEX IF NOT EXISTS idx_words_speech_level ON words(speech_level);
CREATE INDEX IF NOT EXISTS idx_words_category_id ON words(category_id);
CREATE INDEX IF NOT EXISTS idx_words_norm_trgm ON words USING gin (normalized_word gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_translations_word_id ON word_translations(word_id);
CREATE INDEX IF NOT EXISTS idx_translations_trgm ON word_translations USING gin (translation gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_contributions_status ON contributions(status);

-- Automatic updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS set_words_updated_at ON words;
CREATE TRIGGER set_words_updated_at
    BEFORE UPDATE ON words
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_contributions_updated_at ON contributions;
CREATE TRIGGER set_contributions_updated_at
    BEFORE UPDATE ON contributions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE words ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_examples ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_articles ENABLE ROW LEVEL SECURITY;

-- 1. Words & Categories: Public read
CREATE POLICY "Public read words" ON words FOR SELECT USING (true);
CREATE POLICY "Public read translations" ON word_translations FOR SELECT USING (true);
CREATE POLICY "Public read examples" ON word_examples FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read articles" ON learning_articles FOR SELECT USING (status = 'published');

-- 2. Favorites: User specific
CREATE POLICY "Users can manage own favorites" ON favorites
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 3. Contributions: Any authenticated user can submit, admin can manage
CREATE POLICY "Users can insert contributions" ON contributions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can view own contributions" ON contributions
    FOR SELECT
    USING (auth.uid() = user_id);

