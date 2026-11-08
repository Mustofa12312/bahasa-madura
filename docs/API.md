# API & Data Access Specification: Kamus Madura Digital

**Specification Version:** 1.0.0  
**Data Protocols:** Supabase PostgREST & Local In-Memory Fast Engine  

---

## 1. Search Query Parameters & Types

### 1.1 Search Endpoint (`/api/search` / Supabase RPC `search_dictionary`)
- `q`: String (query pencarian, contoh: `aba`, `ayah`, `sehat`)
- `direction`: `'m2i'` (Madura → Indonesia) atau `'i2m'` (Indonesia → Madura)
- `speech_level`: Filter tingkat tutur (`'all'`, `'enja_iya'`, `'engghi_enten'`, `'engghi_bhunten'`, `'netral'`)
- `category`: Filter kategori slug (contoh: `'kata-kerja'`, `'kata-benda'`, `'sapaan'`)
- `page`: Integer (default 1)
- `limit`: Integer (default 20, max 100)

### 1.2 TypeScript Interfaces
```typescript
export type SpeechLevel = 'netral' | 'enja_iya' | 'engghi_enten' | 'engghi_bhunten';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  wordCount?: number;
}

export interface WordTranslation {
  id: string;
  wordId: string;
  translation: string;
  speechLevel: SpeechLevel;
  notes?: string;
}

export interface WordExample {
  id: string;
  wordId: string;
  madurese: string;
  indonesian: string;
  speechLevel?: SpeechLevel;
}

export interface Word {
  id: string;
  slug: string;
  word: string;
  normalizedWord: string;
  definition: string;
  speechLevel: SpeechLevel;
  category?: Category;
  categoryId?: string;
  translations: WordTranslation[];
  examples?: WordExample[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contribution {
  id: string;
  userId?: string;
  proposedWord: string;
  proposedTranslation: string;
  speechLevel: SpeechLevel;
  categoryName?: string;
  exampleSentence?: string;
  notes?: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedBy?: string;
  reviewNotes?: string;
}
```

---

## 2. Supabase SQL Migration Script

Supabase migrations akan dieksekusi melalui SQL script yang tersimpan di `supabase/migrations/20261108000001_initial_schema.sql`.

Semua query CRUD pada level client dibungkus dengan TanStack Query hooks yang terisolasi (`useDictionarySearch`, `useWordDetail`, `useFavorites`, `useContributions`, `useAdminWords`).

