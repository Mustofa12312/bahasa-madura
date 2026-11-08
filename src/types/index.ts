export type SpeechLevel = 'netral' | 'enja_iya' | 'engghi_enten' | 'engghi_bhunten';

export type SearchDirection = 'm2i' | 'i2m';

export interface Category {
  slug: string;
  name: string;
  desc?: string;
  icon?: string;
  wordCount?: number;
}

export interface WordTranslation {
  translation: string;
  speech_level: SpeechLevel;
  notes?: string;
}

export interface WordExample {
  madurese: string;
  indonesian: string;
  speech_level?: SpeechLevel;
}

export interface Word {
  id: string;
  slug: string;
  word: string;
  normalized: string;
  definition: string;
  speech_level: SpeechLevel;
  category_slug?: string;
  category_name?: string;
  translations: WordTranslation[];
  examples?: WordExample[];
  notes?: string;
  source?: string;
}

export interface SearchFilter {
  query: string;
  direction: SearchDirection;
  speechLevel: SpeechLevel | 'all';
  category: string | 'all';
  page: number;
  limit: number;
}

export interface SearchResult {
  items: Word[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasAffixSuggestion?: {
    original: string;
    suggestedRoot: string;
    affixType: string;
    meaning: string;
  };
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  direction: SearchDirection;
  timestamp: number;
}

export interface Contribution {
  id: string;
  proposed_word: string;
  proposed_translation: string;
  speech_level: SpeechLevel;
  category_slug: string;
  example_madura?: string;
  example_indo?: string;
  notes?: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submitted_at: string;
  review_notes?: string;
}

export interface LearningArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'grammar' | 'culture' | 'conversation' | 'basics';
  readTime: string;
  publishedAt: string;
}

export interface AdminStats {
  totalWords: number;
  totalCategories: number;
  totalPendingContributions: number;
  totalApprovedContributions: number;
  topSearches: { query: string; count: number }[];
  speechLevelBreakdown: Record<SpeechLevel, number>;
}

