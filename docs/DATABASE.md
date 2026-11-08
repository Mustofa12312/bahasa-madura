# Database Design Specification: Kamus Madura Digital

**Target DBMS:** PostgreSQL 15+ (via Supabase)  
**Schema Version:** 1.0.0  

---

## 1. Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    CATEGORIES ||--o{ WORDS : "categorizes"
    WORDS ||--o{ WORD_VARIANTS : "has variants"
    WORDS ||--o{ WORD_TRANSLATIONS : "translated into"
    WORDS ||--o{ WORD_EXAMPLES : "exemplified by"
    WORDS ||--o{ FAVORITES : "saved in"
    
    PROFILES ||--o{ FAVORITES : "owns"
    PROFILES ||--o{ CONTRIBUTIONS : "submits"
    PROFILES ||--o{ SEARCH_LOGS : "logs"
    PROFILES ||--o{ LEARNING_ARTICLES : "authors"
    
    CATEGORIES ||--o{ CONTRIBUTIONS : "classifies"

    WORDS {
        uuid id PK
        string slug UK
        string word "Lemma Madura (beraksen)"
        string normalized_word "Token pencarian (a-z)"
        string speech_level "enja_iya, engghi_enten, engghi_bhunten, netral"
        uuid category_id FK
        text definition "Definisi / arti utama"
        text notes "Catatan etimologi / pemakaian"
        timestamp created_at
        timestamp updated_at
    }

    WORD_TRANSLATIONS {
        uuid id PK
        uuid word_id FK
        string translation "Padanan Bahasa Indonesia"
        string target_language "id"
        string speech_level "enja_iya, engghi_enten, engghi_bhunten, netral"
        text notes
        timestamp created_at
    }

    WORD_EXAMPLES {
        uuid id PK
        uuid word_id FK
        text madurese_sentence "Contoh kalimat Madura"
        text indonesian_translation "Arti kalimat dalam Bahasa Indonesia"
        string speech_level
        timestamp created_at
    }

    CATEGORIES {
        uuid id PK
        string name UK
        string slug UK
        text description
        string icon_name
        timestamp created_at
    }

    PROFILES {
        uuid id PK "Matches auth.users id"
        string full_name
        string email
        string role "super_admin, admin, editor, contributor, user"
        timestamp created_at
    }

    FAVORITES {
        uuid id PK
        uuid user_id FK
        uuid word_id FK
        timestamp created_at
    }

    CONTRIBUTIONS {
        uuid id PK
        uuid user_id FK
        string proposed_word
        string proposed_translation
        string speech_level
        uuid category_id FK
        text example
        text notes
        string status "pending, under_review, approved, rejected"
        uuid reviewed_by FK
        text review_notes
        timestamp created_at
        timestamp updated_at
    }

    SEARCH_LOGS {
        uuid id PK
        uuid user_id FK "nullable"
        string query
        string direction "m2i, i2m"
        int results_count
        timestamp created_at
    }

    LEARNING_ARTICLES {
        uuid id PK
        string title
        string slug UK
        text excerpt
        text content
        string category "grammar, culture, vocabulary, conversational"
        string thumbnail
        string status "draft, published"
        uuid author_id FK
        timestamp published_at
        timestamp created_at
        timestamp updated_at
    }
```

---

## 2. Table Schemas & Column Definitions

### 2.1 `categories`
Menampung klasifikasi kelas kata dan tema kosakata:
- `id` (UUID, PK, `default gen_random_uuid()`)
- `name` (VARCHAR(100), NOT NULL, UNIQUE)
- `slug` (VARCHAR(100), NOT NULL, UNIQUE)
- `description` (TEXT)
- `icon_name` (VARCHAR(50))
- `created_at` (TIMESTAMPTZ, default `now()`)

### 2.2 `words`
Tabel entri utama leksikon Madura:
- `id` (UUID, PK, `default gen_random_uuid()`)
- `slug` (VARCHAR(255), NOT NULL, UNIQUE)
- `word` (VARCHAR(255), NOT NULL) - Entri kata Madura dengan ortografi baku beraksen.
- `normalized_word` (VARCHAR(255), NOT NULL) - Versi huruf kecil tanpa aksen (`a-z`) untuk indeks cepat.
- `speech_level` (VARCHAR(50), NOT NULL, DEFAULT `'netral'`) - Cek constraint: `enja_iya`, `engghi_enten`, `engghi_bhunten`, `netral`.
- `category_id` (UUID, FK ke `categories.id`, ON DELETE SET NULL)
- `definition` (TEXT, NOT NULL)
- `notes` (TEXT)
- `created_at` (TIMESTAMPTZ, default `now()`)
- `updated_at` (TIMESTAMPTZ, default `now()`)

### 2.3 `word_translations`
Dukungan satu kata Madura memiliki padanan jamak:
- `id` (UUID, PK, `default gen_random_uuid()`)
- `word_id` (UUID, NOT NULL, FK ke `words.id`, ON DELETE CASCADE)
- `translation` (VARCHAR(255), NOT NULL)
- `target_language` (VARCHAR(10), NOT NULL, DEFAULT `'id'`)
- `speech_level` (VARCHAR(50), DEFAULT `'netral'`)
- `notes` (TEXT)
- `created_at` (TIMESTAMPTZ, default `now()`)

---

## 3. Indexing & Optimization

```sql
-- Indeks B-Tree untuk query eksak dan slug
CREATE INDEX idx_words_slug ON words(slug);
CREATE INDEX idx_words_speech_level ON words(speech_level);
CREATE INDEX idx_words_category_id ON words(category_id);

-- Indeks Trigram untuk pencarian fuzzy dan wildcard
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_words_normalized_trgm ON words USING gin (normalized_word gin_trgm_ops);
CREATE INDEX idx_translations_trgm ON word_translations USING gin (translation gin_trgm_ops);
```

---

## 4. Row Level Security (RLS) Policies

1. **`words` & `word_translations`:**
   - `SELECT`: `TRUE` (Publik dapat mencari dan membaca tanpa autentikasi).
   - `INSERT`, `UPDATE`, `DELETE`: Hanya `admin` atau `super_admin`.
2. **`favorites`:**
   - `SELECT`, `INSERT`, `DELETE`: `auth.uid() = user_id`.
3. **`contributions`:**
   - `INSERT`: Pengguna terautentikasi (`auth.uid() = user_id`).
   - `SELECT`: Pembuat usulan melihat miliknya, admin melihat semua usulan.
   - `UPDATE`: Hanya admin (untuk mengubah status persetujuan).
