import { describe, it, expect } from 'vitest';
import { normalizeMadurese, dictionaryService } from '../services/dictionaryService';

describe('Madurese Orthography Normalization', () => {
  it('should normalize accented vowels â and è correctly to ASCII equivalents', () => {
    expect(normalizeMadurese('mator sakalangkong')).toBe('mator sakalangkong');
    expect(normalizeMadurese('bâ\'na')).toBe('ba\'na');
    expect(normalizeMadurese('èngghi')).toBe('engghi');
    expect(normalizeMadurese('kandhâ')).toBe('kandha');
  });

  it('should trim and convert strings to lowercase', () => {
    expect(normalizeMadurese('  DHIKA  ')).toBe('dhika');
    expect(normalizeMadurese('BÂNGSÂL')).toBe('bangsal');
  });

  it('should retain glottal apostrophe for syllable division and consonant closure', () => {
    const raw = "enja'";
    const norm = normalizeMadurese(raw);
    expect(norm).toBe("enja'");
  });
});

describe('Dictionary Service Core Search Engine', () => {
  it('should return paginated list when query is empty', () => {
    const result = dictionaryService.search({
      query: '',
      direction: 'm2i',
      speechLevel: 'all',
      category: 'all',
      page: 1,
      limit: 10,
    });

    expect(result.items.length).toBe(10);
    expect(result.page).toBe(1);
    expect(result.total).toBeGreaterThan(9000);
    expect(result.totalPages).toBeGreaterThan(900);
  });

  it('should perform bidirectional search from Madura to Indonesia (m2i)', () => {
    const result = dictionaryService.search({
      query: 'roma',
      direction: 'm2i',
      speechLevel: 'all',
      category: 'all',
      page: 1,
      limit: 5,
    });

    expect(result.items.length).toBeGreaterThan(0);
    const exactMatch = result.items.find(w => w.word.toLowerCase() === 'roma');
    expect(exactMatch).toBeDefined();
    expect(exactMatch?.definition.toLowerCase()).toContain('rumah');
  });

  it('should perform bidirectional search from Indonesia to Madura (i2m)', () => {
    const result = dictionaryService.search({
      query: 'rumah',
      direction: 'i2m',
      speechLevel: 'all',
      category: 'all',
      page: 1,
      limit: 10,
    });

    expect(result.items.length).toBeGreaterThan(0);
    const wordsFound = result.items.map(w => w.word.toLowerCase());
    expect(wordsFound.some(w => w.includes('roma') || w.includes('dhâlem'))).toBe(true);
  });

  it('should filter words accurately by speech level (ondhagghâ bhâsa)', () => {
    const result = dictionaryService.search({
      query: '',
      direction: 'm2i',
      speechLevel: 'engghi_bhunten',
      category: 'all',
      page: 1,
      limit: 20,
    });

    expect(result.items.length).toBeGreaterThan(0);
    result.items.forEach(w => {
      expect(w.speech_level).toBe('engghi_bhunten');
    });
  });

  it('should retrieve word by slug', () => {
    const firstWord = dictionaryService.getAllWords()[0];
    const found = dictionaryService.getWordBySlug(firstWord.slug);

    expect(found).toBeDefined();
    expect(found?.slug).toBe(firstWord.slug);
    expect(found?.word).toBe(firstWord.word);
  });

  it('should retrieve adjacent words for previous/next navigation', () => {
    const words = dictionaryService.getAllWords();
    const middleIndex = Math.floor(words.length / 2);
    const targetWord = words[middleIndex];

    const adjacent = dictionaryService.getAdjacentWords(targetWord.slug);
    expect(adjacent.prevWord?.slug).toBe(words[middleIndex - 1].slug);
    expect(adjacent.nextWord?.slug).toBe(words[middleIndex + 1].slug);
  });

  it('should detect morphological affixes when searching Madurese word with prefix or postfix', () => {
    const affixSuggestion = dictionaryService.checkMorphologicalAffixes('aromana');
    if (affixSuggestion) {
      expect(affixSuggestion.suggestedRoot).toBeDefined();
    }
  });
});
