import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { dictionaryService } from '../services/dictionaryService';

// Mock localStorage for headless Node test environment
const mockStore: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => mockStore[key] || null,
  setItem: (key: string, value: string) => {
    mockStore[key] = value.toString();
  },
  removeItem: (key: string) => {
    delete mockStore[key];
  },
  clear: () => {
    for (const k in mockStore) delete mockStore[k];
  },
};

describe('Local Storage Management (Favorites & Search History)', () => {
  beforeAll(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
    Object.defineProperty(globalThis, 'window', {
      value: {
        dispatchEvent: () => true,
      },
      writable: true,
    });
  });

  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('Favorites Management', () => {
    it('should toggle favorite status for a word id correctly', () => {
      const wordId = 'sample-word-1';
      expect(dictionaryService.isFavorite(wordId)).toBe(false);

      const isNowFav = dictionaryService.toggleFavorite(wordId);
      expect(isNowFav).toBe(true);
      expect(dictionaryService.isFavorite(wordId)).toBe(true);

      const isRemoved = dictionaryService.toggleFavorite(wordId);
      expect(isRemoved).toBe(false);
      expect(dictionaryService.isFavorite(wordId)).toBe(false);
    });

    it('should retrieve list of favorite words', () => {
      const all = dictionaryService.getAllWords();
      const firstWord = all[0];
      const secondWord = all[1];

      dictionaryService.toggleFavorite(firstWord.id);
      dictionaryService.toggleFavorite(secondWord.id);

      const favs = dictionaryService.getFavorites();
      expect(favs).toContain(firstWord.id);
      expect(favs).toContain(secondWord.id);

      const favWords = dictionaryService.getFavoriteWords();
      expect(favWords.length).toBe(2);
      expect(favWords.some(w => w.id === firstWord.id)).toBe(true);
    });
  });

  describe('Search History Management', () => {
    it('should add search queries without creating duplicates', () => {
      dictionaryService.addSearchHistory('roma', 'm2i');
      dictionaryService.addSearchHistory('roma', 'm2i');

      const history = dictionaryService.getSearchHistory();
      expect(history.length).toBe(1);
      expect(history[0].query).toBe('roma');
    });

    it('should cap search history to maximum 20 items', () => {
      for (let i = 1; i <= 25; i++) {
        dictionaryService.addSearchHistory(`kata-${i}`, 'm2i');
      }

      const history = dictionaryService.getSearchHistory();
      expect(history.length).toBe(20);
      expect(history[0].query).toBe('kata-25');
    });

    it('should remove a single search item and clear all', () => {
      dictionaryService.addSearchHistory('kandhâ', 'm2i');
      let history = dictionaryService.getSearchHistory();
      const itemId = history[0].id;

      dictionaryService.removeSearchHistoryItem(itemId);
      expect(dictionaryService.getSearchHistory().length).toBe(0);

      dictionaryService.addSearchHistory('èngghi', 'm2i');
      dictionaryService.clearSearchHistory();
      expect(dictionaryService.getSearchHistory().length).toBe(0);
    });
  });
});
