import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { dictionaryService } from '../../services/dictionaryService';
import { Word, SearchDirection, SpeechLevel, SearchResult } from '../../types';
import { useDebounce } from '../../hooks/useDebounce';

export interface UseDictionarySearchOptions {
  limit?: number;
  initialQuery?: string;
  initialDirection?: SearchDirection;
  initialSpeechLevel?: SpeechLevel | 'all';
  initialCategory?: string;
}

export function useDictionarySearch(options: UseDictionarySearchOptions = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryFromUrl = searchParams.get('q') || options.initialQuery || '';
  const dirFromUrl = (searchParams.get('dir') as SearchDirection) || options.initialDirection || 'm2i';
  const levelFromUrl = (searchParams.get('level') as SpeechLevel | 'all') || options.initialSpeechLevel || 'all';
  const catFromUrl = searchParams.get('cat') || options.initialCategory || 'all';
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);

  const [query, setQuery] = useState(queryFromUrl);
  const [direction, setDirection] = useState<SearchDirection>(dirFromUrl);
  const [speechLevel, setSpeechLevel] = useState<SpeechLevel | 'all'>(levelFromUrl);
  const [category, setCategory] = useState<string>(catFromUrl);
  const [page, setPage] = useState<number>(pageFromUrl);

  const limit = options.limit || 18;
  const debouncedQuery = useDebounce(query, 200);

  // Synchronize to URL query parameters
  useEffect(() => {
    const params: Record<string, string> = {};
    if (query.trim()) params.q = query.trim();
    if (direction !== 'm2i') params.dir = direction;
    if (speechLevel !== 'all') params.level = speechLevel;
    if (category !== 'all') params.cat = category;
    if (page > 1) params.page = String(page);
    setSearchParams(params, { replace: true });
  }, [query, direction, speechLevel, category, page, setSearchParams]);

  // Execute Search
  const result: SearchResult = useMemo(() => {
    return dictionaryService.search({
      query: debouncedQuery,
      direction,
      speechLevel,
      category,
      page,
      limit,
    });
  }, [debouncedQuery, direction, speechLevel, category, page, limit]);

  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  }, []);

  const handleDirectionChange = useCallback((newDir: SearchDirection) => {
    setDirection(newDir);
    setPage(1);
  }, []);

  const handleSpeechLevelChange = useCallback((newLevel: SpeechLevel | 'all') => {
    setSpeechLevel(newLevel);
    setPage(1);
  }, []);

  const handleCategoryChange = useCallback((newCat: string) => {
    setCategory(newCat);
    setPage(1);
  }, []);

  const handleReset = useCallback(() => {
    setQuery('');
    setSpeechLevel('all');
    setCategory('all');
    setPage(1);
  }, []);

  return {
    query,
    debouncedQuery,
    direction,
    speechLevel,
    category,
    page,
    result,
    isSearching: query !== debouncedQuery,
    setQuery: handleQueryChange,
    setDirection: handleDirectionChange,
    setSpeechLevel: handleSpeechLevelChange,
    setCategory: handleCategoryChange,
    setPage,
    resetFilters: handleReset,
  };
}
