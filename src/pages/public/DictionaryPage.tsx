import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchBar } from '../../components/dictionary/SearchBar';
import { DirectionToggle } from '../../components/dictionary/DirectionToggle';
import { WordCard } from '../../components/dictionary/WordCard';
import { WordDetailModal } from '../../components/dictionary/WordDetailModal';
import { EmptyState } from '../../components/common/EmptyState';
import { dictionaryService } from '../../services/dictionaryService';
import { Word, SearchDirection, SpeechLevel } from '../../types';
import { Filter, SlidersHorizontal, Lightbulb, ChevronLeft, ChevronRight, X } from 'lucide-react';

export const DictionaryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQuery = searchParams.get('q') || '';
  const initialDir = (searchParams.get('dir') as SearchDirection) || 'm2i';
  const initialLevel = (searchParams.get('level') as SpeechLevel | 'all') || 'all';
  const initialCategory = searchParams.get('cat') || 'all';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [query, setQuery] = useState(initialQuery);
  const [direction, setDirection] = useState<SearchDirection>(initialDir);
  const [speechLevel, setSpeechLevel] = useState<SpeechLevel | 'all'>(initialLevel);
  const [category, setCategory] = useState<string>(initialCategory);
  const [page, setPage] = useState<number>(initialPage);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);

  const categories = useMemo(() => dictionaryService.getCategories(), []);

  // Update query params when state changes
  useEffect(() => {
    const params: Record<string, string> = {};
    if (query) params.q = query;
    if (direction !== 'm2i') params.dir = direction;
    if (speechLevel !== 'all') params.level = speechLevel;
    if (category !== 'all') params.cat = category;
    if (page > 1) params.page = String(page);
    setSearchParams(params, { replace: true });
  }, [query, direction, speechLevel, category, page, setSearchParams]);

  // Reset to page 1 on filter/query changes
  const handleQueryChange = (val: string) => {
    setQuery(val);
    setPage(1);
  };

  const handleDirectionChange = (dir: SearchDirection) => {
    setDirection(dir);
    setPage(1);
  };

  const handleLevelChange = (lvl: SpeechLevel | 'all') => {
    setSpeechLevel(lvl);
    setPage(1);
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setPage(1);
  };

  const handleResetFilters = () => {
    setQuery('');
    setSpeechLevel('all');
    setCategory('all');
    setPage(1);
  };

  // Perform search
  const result = useMemo(() => {
    return dictionaryService.search({
      query,
      direction,
      speechLevel,
      category,
      page,
      limit: 18
    });
  }, [query, direction, speechLevel, category, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Header Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-madura-border shadow-subtle space-y-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-navy">
              Kamus Madura Digital
            </h1>
            <p className="text-xs sm:text-sm text-madura-muted">
              Pencarian kosakata lengkap dengan variasi aksen, tingkatan tutur, dan arti kontekstual.
            </p>
          </div>
          <DirectionToggle direction={direction} onChange={handleDirectionChange} />
        </div>

        {/* Search Input Bar */}
        <div>
          <SearchBar
            value={query}
            onChange={handleQueryChange}
            direction={direction}
            onClear={() => handleQueryChange('')}
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-madura-border/60 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-navy flex items-center gap-1.5 mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-gold-500" />
              <span>Tingkatan:</span>
            </span>
            {(['all', 'netral', 'enja_iya', 'engghi_enten', 'engghi_bhunten'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => handleLevelChange(lvl)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                  speechLevel === lvl
                    ? 'bg-navy text-white shadow-xs font-semibold'
                    : 'bg-ivory hover:bg-ivory-warm text-stone-600 border border-madura-border/60'
                }`}
              >
                {lvl === 'all' ? 'Semua Tingkat' : lvl === 'enja_iya' ? "Enja'-Iya" : lvl === 'engghi_enten' ? 'Engghi-Enten' : lvl === 'engghi_bhunten' ? 'Engghi-Bhunten' : 'Netral'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-navy">Kategori:</span>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-ivory border border-madura-border text-navy text-xs font-medium focus:outline-none focus:ring-1 focus:ring-navy"
            >
              <option value="all">Semua Kategori ({categories.reduce((acc, c) => acc + (c.wordCount || 0), 0)})</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name} ({c.wordCount})
                </option>
              ))}
            </select>

            {(query || speechLevel !== 'all' || category !== 'all') && (
              <button
                onClick={handleResetFilters}
                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors ml-1"
                title="Reset semua filter"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Affix Heuristic Hint if matched */}
      {result.hasAffixSuggestion && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 flex items-start gap-3 shadow-xs">
          <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold">Saran Bentukan Morfologis: </span>
            Kata "<strong>{result.hasAffixSuggestion.original}</strong>" terdeteksi memiliki {result.hasAffixSuggestion.affixType} dari kata dasar "<strong>{result.hasAffixSuggestion.suggestedRoot}</strong>".
            <div className="mt-1 font-semibold text-amber-950">
              Perkiraan arti: {result.hasAffixSuggestion.meaning}
            </div>
          </div>
        </div>
      )}

      {/* Search Stats */}
      <div className="flex items-center justify-between text-xs text-madura-muted px-1">
        <div>
          Menampilkan <strong className="text-navy">{result.items.length}</strong> dari <strong className="text-navy">{result.total}</strong> kosakata
          {query && <span> untuk kata kunci "<strong>{query}</strong>"</span>}
        </div>
        <div>
          Halaman {result.page} dari {result.totalPages || 1}
        </div>
      </div>

      {/* Results Grid */}
      {result.items.length === 0 ? (
        <EmptyState
          title="Kosakata Tidak Ditemukan"
          description={`Tidak ada kata yang sesuai dengan kriteria pencarian "${query}". Periksa kembali ejaan atau coba ganti arah bahasa.`}
          actionLabel="Reset Pencarian"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {result.items.map((word) => (
            <WordCard
              key={word.id}
              word={word}
              onSelect={setSelectedWord}
              highlightQuery={query}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {result.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="flex items-center gap-1 px-3 py-2 rounded-xl border border-madura-border bg-white text-xs font-semibold text-navy hover:bg-ivory-warm disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </button>

          <span className="px-3 py-1.5 text-xs font-mono text-madura-muted">
            {page} / {result.totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(result.totalPages, p + 1))}
            disabled={page >= result.totalPages}
            className="flex items-center gap-1 px-3 py-2 rounded-xl border border-madura-border bg-white text-xs font-semibold text-navy hover:bg-ivory-warm disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
          >
            <span>Selanjutnya</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Word Detail Modal */}
      <WordDetailModal
        word={selectedWord}
        isOpen={Boolean(selectedWord)}
        onClose={() => setSelectedWord(null)}
      />
    </div>
  );
};

