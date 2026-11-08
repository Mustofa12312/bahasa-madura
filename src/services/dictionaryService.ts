import seedData from '../data/seed-dictionary.json';
import { 
  Word, 
  Category, 
  SearchFilter, 
  SearchResult, 
  SearchHistoryItem, 
  Contribution,
  SpeechLevel,
  AdminStats 
} from '../types';
import { normalizeMadurese, slugify } from '../lib/utils';
export { normalizeMadurese, slugify };
import { MORPHOLOGICAL_AFFIXES, POPULAR_WORDS } from '../constants';

// In-Memory Storage & Indexes
let allWords: Word[] = (seedData.words as unknown as Word[]) || [];
const allCategories: Category[] = (seedData.categories as unknown as Category[]) || [];

// Fast Lookup Maps
const slugIndex = new Map<string, Word>();
const idIndex = new Map<string, Word>();
const normalizedMaduraIndex = new Map<string, Word[]>();

function buildIndexes() {
  slugIndex.clear();
  idIndex.clear();
  normalizedMaduraIndex.clear();

  for (const w of allWords) {
    slugIndex.set(w.slug, w);
    idIndex.set(w.id, w);
    
    const norm = w.normalized || normalizeMadurese(w.word);
    const existing = normalizedMaduraIndex.get(norm) || [];
    existing.push(w);
    normalizedMaduraIndex.set(norm, existing);
  }
}

buildIndexes();

// LocalStorage Keys
const STORAGE_FAVORITES = 'kmd_favorites_v1';
const STORAGE_HISTORY = 'kmd_search_history_v1';
const STORAGE_CONTRIBUTIONS = 'kmd_contributions_v1';
const STORAGE_CUSTOM_WORDS = 'kmd_custom_words_v1';

// Load custom added/edited words from localStorage if present
function loadCustomWords() {
  try {
    const raw = localStorage.getItem(STORAGE_CUSTOM_WORDS);
    if (raw) {
      const custom: Word[] = JSON.parse(raw);
      if (Array.isArray(custom) && custom.length > 0) {
        // Merge or replace
        const customMap = new Map(custom.map(w => [w.id, w]));
        allWords = allWords.map(w => customMap.get(w.id) || w);
        // Add new
        for (const cw of custom) {
          if (!idIndex.has(cw.id)) {
            allWords.unshift(cw);
          }
        }
        buildIndexes();
      }
    }
  } catch (e) {
    console.error('Failed to load custom words from storage', e);
  }
}

if (typeof window !== 'undefined') {
  loadCustomWords();
}

export const dictionaryService = {
  // Retrieve all categories
  getCategories(): Category[] {
    return allCategories.map(cat => ({
      ...cat,
      wordCount: allWords.filter(w => w.category_slug === cat.slug).length
    }));
  },

  getCategoryBySlug(slug: string): Category | undefined {
    const cat = allCategories.find(c => c.slug === slug);
    if (!cat) return undefined;
    return {
      ...cat,
      wordCount: allWords.filter(w => w.category_slug === slug).length
    };
  },

  // Get all words
  getAllWords(): Word[] {
    return allWords;
  },

  // Get word by slug
  getWordBySlug(slug: string): Word | undefined {
    return slugIndex.get(slug);
  },

  // Get word by ID
  getWordById(id: string): Word | undefined {
    return idIndex.get(id);
  },

  // Get adjacent words for Previous/Next navigation
  getAdjacentWords(currentSlug: string): { prevWord?: Word; nextWord?: Word } {
    const currentIndex = allWords.findIndex(w => w.slug === currentSlug);
    if (currentIndex === -1) return {};
    return {
      prevWord: currentIndex > 0 ? allWords[currentIndex - 1] : undefined,
      nextWord: currentIndex < allWords.length - 1 ? allWords[currentIndex + 1] : undefined,
    };
  },

  // Heuristic Morphological Search
  checkMorphologicalAffixes(queryNorm: string): { original: string; suggestedRoot: string; affixType: string; meaning: string } | undefined {
    // Madurese prefixes
    for (const p of MORPHOLOGICAL_AFFIXES.prefixes) {
      if (queryNorm.startsWith(p.madura) && queryNorm.length > p.madura.length + 2) {
        const root = queryNorm.slice(p.madura.length);
        if (normalizedMaduraIndex.has(root)) {
          const rootWord = normalizedMaduraIndex.get(root)![0];
          return {
            original: queryNorm,
            suggestedRoot: rootWord.word,
            affixType: `Awalan '${p.madura}-' (padanan: '${p.indo}-')`,
            meaning: `${p.indo}${rootWord.definition}`
          };
        }
      }
    }

    // Postfix -na
    for (const post of MORPHOLOGICAL_AFFIXES.postfixes) {
      if (queryNorm.endsWith(post.madura) && queryNorm.length > post.madura.length + 2) {
        const root = queryNorm.slice(0, -post.madura.length);
        if (normalizedMaduraIndex.has(root)) {
          const rootWord = normalizedMaduraIndex.get(root)![0];
          return {
            original: queryNorm,
            suggestedRoot: rootWord.word,
            affixType: `Akhiran '-${post.madura}' (padanan: '-${post.indo}')`,
            meaning: `${rootWord.definition} (${post.desc})`
          };
        }
      }
    }

    return undefined;
  },

  // Bidirectional Search Engine
  search(filter: SearchFilter): SearchResult {
    const rawQuery = filter.query.trim();
    const queryNorm = normalizeMadurese(rawQuery);
    const direction = filter.direction;
    const speechLevel = filter.speechLevel;
    const category = filter.category;
    const page = Math.max(1, filter.page || 1);
    const limit = Math.max(1, filter.limit || 20);

    // If query is empty, return paginated list based on filters
    if (!queryNorm) {
      let filtered = allWords;
      if (speechLevel && speechLevel !== 'all') {
        filtered = filtered.filter(w => w.speech_level === speechLevel);
      }
      if (category && category !== 'all') {
        filtered = filtered.filter(w => w.category_slug === category);
      }
      const total = filtered.length;
      const start = (page - 1) * limit;
      return {
        items: filtered.slice(start, start + limit),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    }

    // Scored matching
    type Scored = { word: Word; score: number };
    const matches: Scored[] = [];

    for (const w of allWords) {
      // Apply filters first
      if (speechLevel && speechLevel !== 'all' && w.speech_level !== speechLevel) {
        continue;
      }
      if (category && category !== 'all' && w.category_slug !== category) {
        continue;
      }

      let score = 0;
      const wNorm = w.normalized || normalizeMadurese(w.word);

      if (direction === 'm2i') {
        // Search Madura -> Indonesia
        if (wNorm === queryNorm) {
          score = 100;
        } else if (wNorm.startsWith(queryNorm)) {
          score = 80;
        } else if (wNorm.includes(queryNorm)) {
          score = 50;
        } else if (normalizeMadurese(w.definition).includes(queryNorm)) {
          score = 30;
        }
      } else {
        // Search Indonesia -> Madura
        const defNorm = normalizeMadurese(w.definition);
        const translations = w.translations.map(t => normalizeMadurese(t.translation));

        if (translations.some(t => t === queryNorm) || defNorm === queryNorm) {
          score = 100;
        } else if (translations.some(t => t.startsWith(queryNorm)) || defNorm.startsWith(queryNorm)) {
          score = 80;
        } else if (translations.some(t => t.includes(queryNorm)) || defNorm.includes(queryNorm)) {
          score = 50;
        } else if (wNorm.includes(queryNorm)) {
          score = 25;
        }
      }

      if (score > 0) {
        // Bonus for higher speech level matching if specifically tagged
        if (w.speech_level !== 'netral') score += 5;
        matches.push({ word: w, score });
      }
    }

    // Sort descending by score, then alphabetically
    matches.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.word.word.localeCompare(b.word.word);
    });

    const items = matches.map(m => m.word);
    const total = items.length;
    const start = (page - 1) * limit;

    // Morphological suggestion if 0 results in m2i mode
    let hasAffixSuggestion;
    if (total === 0 && direction === 'm2i') {
      hasAffixSuggestion = this.checkMorphologicalAffixes(queryNorm);
    }

    return {
      items: items.slice(start, start + limit),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      hasAffixSuggestion
    };
  },

  // Daily Vocabulary
  getDailyWord(): Word {
    const today = new Date();
    // Deterministic day index
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
    );
    // Pick words with rich content or speech level
    const candidates = allWords.filter(w => w.speech_level !== 'netral' || w.definition.length > 5);
    const chosen = candidates[dayOfYear % candidates.length] || allWords[0];
    return chosen;
  },

  // Popular Words
  getPopularWords(): { word: string; meaning: string; level: string; wordObj?: Word }[] {
    return POPULAR_WORDS.map(p => {
      const match = allWords.find(w => w.word.toLowerCase() === p.word.toLowerCase());
      return {
        ...p,
        wordObj: match
      };
    });
  },

  // Favorites Management
  getFavorites(): string[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  isFavorite(wordId: string): boolean {
    return this.getFavorites().includes(wordId);
  },

  toggleFavorite(wordId: string): boolean {
    const current = this.getFavorites();
    const index = current.indexOf(wordId);
    let isFav = false;
    if (index > -1) {
      current.splice(index, 1);
      isFav = false;
    } else {
      current.unshift(wordId);
      isFav = true;
    }
    localStorage.setItem(STORAGE_FAVORITES, JSON.stringify(current));
    window.dispatchEvent(new Event('favorites-updated'));
    return isFav;
  },

  getFavoriteWords(): Word[] {
    const favIds = this.getFavorites();
    return favIds.map(id => idIndex.get(id)).filter(Boolean) as Word[];
  },

  // Search History Management
  getSearchHistory(): SearchHistoryItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addSearchHistory(query: string, direction: 'm2i' | 'i2m') {
    if (!query.trim()) return;
    try {
      let history = this.getSearchHistory();
      // Remove duplicate of same query
      history = history.filter(h => h.query.toLowerCase() !== query.toLowerCase() || h.direction !== direction);
      history.unshift({
        id: Math.random().toString(36).substring(2, 9),
        query: query.trim(),
        direction,
        timestamp: Date.now()
      });
      // Cap at 20
      history = history.slice(0, 20);
      localStorage.setItem(STORAGE_HISTORY, JSON.stringify(history));
      window.dispatchEvent(new Event('history-updated'));
    } catch (e) {
      console.error(e);
    }
  },

  removeSearchHistoryItem(id: string) {
    let history = this.getSearchHistory().filter(h => h.id !== id);
    localStorage.setItem(STORAGE_HISTORY, JSON.stringify(history));
    window.dispatchEvent(new Event('history-updated'));
  },

  clearSearchHistory() {
    localStorage.removeItem(STORAGE_HISTORY);
    window.dispatchEvent(new Event('history-updated'));
  },

  // Contributions Management
  getContributions(): Contribution[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_CONTRIBUTIONS);
      if (data) return JSON.parse(data);
      // Seed sample contributions
      const initial: Contribution[] = [
        {
          id: 'contrib-1',
          proposed_word: 'terbhung',
          proposed_translation: 'rebana / alat musik tabung khas Madura',
          speech_level: 'netral',
          category_slug: 'budaya-dan-tradisi',
          example_madura: 'Oreng Madhura biasa nabbhu terbhung e ar-kamantiyen.',
          example_indo: 'Orang Madura biasa menabuh rebana di pesta pernikahan.',
          status: 'pending',
          submitted_at: new Date(Date.now() - 86400000 * 2).toISOString(),
          notes: 'Usulan istilah kesenian tradisional'
        },
        {
          id: 'contrib-2',
          proposed_word: 'ajunan',
          proposed_translation: 'Anda / Paduka (sangat terhormat)',
          speech_level: 'engghi_bhunten',
          category_slug: 'sapaan-dan-ganti',
          example_madura: 'Panika kasokan ajunan.',
          example_indo: 'Ini adalah kehendak Anda.',
          status: 'approved',
          submitted_at: new Date(Date.now() - 86400000 * 5).toISOString(),
          review_notes: 'Diverifikasi sesuai kaidah bahasa halus.'
        }
      ];
      localStorage.setItem(STORAGE_CONTRIBUTIONS, JSON.stringify(initial));
      return initial;
    } catch {
      return [];
    }
  },

  submitContribution(data: Omit<Contribution, 'id' | 'status' | 'submitted_at'>): Contribution {
    const list = this.getContributions();
    const newContrib: Contribution = {
      ...data,
      id: 'contrib-' + Date.now(),
      status: 'pending',
      submitted_at: new Date().toISOString()
    };
    list.unshift(newContrib);
    localStorage.setItem(STORAGE_CONTRIBUTIONS, JSON.stringify(list));
    window.dispatchEvent(new Event('contributions-updated'));
    return newContrib;
  },

  updateContributionStatus(id: string, status: 'approved' | 'rejected' | 'under_review', reviewNotes?: string) {
    const list = this.getContributions();
    const item = list.find(c => c.id === id);
    if (item) {
      item.status = status;
      if (reviewNotes !== undefined) item.review_notes = reviewNotes;
      localStorage.setItem(STORAGE_CONTRIBUTIONS, JSON.stringify(list));
      window.dispatchEvent(new Event('contributions-updated'));

      // If approved, automatically add word to the dictionary!
      if (status === 'approved') {
        this.addWord({
          word: item.proposed_word,
          definition: item.proposed_translation,
          speech_level: item.speech_level,
          category_slug: item.category_slug,
          translations: [{ translation: item.proposed_translation, speech_level: item.speech_level }],
          examples: item.example_madura ? [{ madurese: item.example_madura, indonesian: item.example_indo || '' }] : []
        });
      }
    }
  },

  // Admin Word CRUD
  addWord(data: {
    word: string;
    definition: string;
    speech_level: SpeechLevel;
    category_slug?: string;
    translations?: { translation: string; speech_level: SpeechLevel }[];
    examples?: { madurese: string; indonesian: string }[];
    notes?: string;
  }): Word {
    const slug = slugify(data.word) + '-' + Math.random().toString(36).substring(2, 6);
    const newWord: Word = {
      id: 'w_custom_' + Date.now(),
      slug,
      word: data.word.trim(),
      normalized: normalizeMadurese(data.word),
      definition: data.definition.trim(),
      speech_level: data.speech_level,
      category_slug: data.category_slug || 'sehari-hari',
      category_name: allCategories.find(c => c.slug === data.category_slug)?.name || 'Kosakata Sehari-hari',
      translations: data.translations && data.translations.length > 0 
        ? data.translations 
        : [{ translation: data.definition.trim(), speech_level: data.speech_level }],
      examples: data.examples || [],
      notes: data.notes || '',
      source: 'Admin Input'
    };

    allWords.unshift(newWord);
    buildIndexes();
    this.persistCustomWords();
    return newWord;
  },

  updateWord(id: string, data: Partial<Word>): Word | undefined {
    const index = allWords.findIndex(w => w.id === id);
    if (index === -1) return undefined;

    const updated = {
      ...allWords[index],
      ...data,
      normalized: data.word ? normalizeMadurese(data.word) : allWords[index].normalized
    };
    allWords[index] = updated;
    buildIndexes();
    this.persistCustomWords();
    return updated;
  },

  deleteWord(id: string): boolean {
    const index = allWords.findIndex(w => w.id === id);
    if (index === -1) return false;
    allWords.splice(index, 1);
    buildIndexes();
    this.persistCustomWords();
    return true;
  },

  persistCustomWords() {
    if (typeof window === 'undefined') return;
    try {
      const custom = allWords.filter(w => w.id.startsWith('w_custom_'));
      localStorage.setItem(STORAGE_CUSTOM_WORDS, JSON.stringify(custom));
    } catch (e) {
      console.error(e);
    }
  },

  // Admin Metrics
  getAdminStats(): AdminStats {
    const speechCount: Record<SpeechLevel, number> = {
      netral: 0,
      enja_iya: 0,
      engghi_enten: 0,
      engghi_bhunten: 0
    };

    for (const w of allWords) {
      if (speechCount[w.speech_level] !== undefined) {
        speechCount[w.speech_level]++;
      }
    }

    const contribs = this.getContributions();

    return {
      totalWords: allWords.length,
      totalCategories: allCategories.length,
      totalPendingContributions: contribs.filter(c => c.status === 'pending').length,
      totalApprovedContributions: contribs.filter(c => c.status === 'approved').length,
      speechLevelBreakdown: speechCount,
      topSearches: [
        { query: "abâ'na", count: 1240 },
        { query: "mator sakalangkong", count: 980 },
        { query: "sèhat", count: 740 },
        { query: "kabbhi", count: 620 },
        { query: "kamu", count: 580 },
        { query: "makan", count: 490 },
      ]
    };
  },

  // Bulk Import
  bulkImportJSON(jsonData: any[]): { success: number; failed: number; errors: string[] } {
    let success = 0;
    let failed = 0;
    const errors: string[] = [];

    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      try {
        let word = '';
        let def = '';
        let level: SpeechLevel = 'netral';

        if (Array.isArray(row) && row.length >= 2) {
          level = (row[0] in { 'lomrah': 1, 'alos': 1, 'alos tengghi': 1, 'tengngaan': 1 } 
            ? (row[0] === 'lomrah' ? 'enja_iya' : row[0] === 'tengngaan' ? 'engghi_enten' : 'engghi_bhunten') 
            : 'netral');
          def = String(row[1] || '').trim();
          word = String(row[2] || row[0] || '').trim();
        } else if (typeof row === 'object' && row !== null) {
          word = row.word || row.madura || '';
          def = row.definition || row.arti || row.indo || '';
          level = row.speech_level || row.tingkat || 'netral';
        }

        if (!word || !def) {
          failed++;
          errors.push(`Baris #${i + 1}: Kata atau definisi kosong.`);
          continue;
        }

        this.addWord({
          word,
          definition: def,
          speech_level: level
        });
        success++;
      } catch (err: any) {
        failed++;
        errors.push(`Baris #${i + 1}: ${err.message}`);
      }
    }

    return { success, failed, errors };
  },

  // Export
  exportToJSON(): string {
    return JSON.stringify(allWords, null, 2);
  },

  exportToCSV(): string {
    const headers = ['ID', 'Slug', 'Kata Madura', 'Definisi', 'Tingkat Tutur', 'Kategori'];
    const rows = allWords.map(w => [
      w.id,
      w.slug,
      `"${w.word.replace(/"/g, '""')}"`,
      `"${w.definition.replace(/"/g, '""')}"`,
      w.speech_level,
      `"${(w.category_name || '').replace(/"/g, '""')}"`
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
};

