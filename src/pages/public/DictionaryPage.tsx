import React, { useState } from 'react';
import { SearchBar } from '../../components/dictionary/SearchBar';
import { DirectionToggle } from '../../components/dictionary/DirectionToggle';
import { WordCard } from '../../components/dictionary/WordCard';
import { WordDetailModal } from '../../components/dictionary/WordDetailModal';
import { EmptyState } from '../../components/common/EmptyState';
import { DictionaryGridSkeleton } from '../../components/common/LoadingSkeleton';
import { dictionaryService } from '../../services/dictionaryService';
import { Word, SpeechLevel } from '../../types';
import { useDictionarySearch } from '../../features/dictionary/useDictionarySearch';
import { SlidersHorizontal, Lightbulb, ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';

export const DictionaryPage: React.FC = () => {
  const {
    query,
    direction,
    speechLevel,
    category,
    page,
    result,
    isSearching,
    setQuery,
    setDirection,
    setSpeechLevel,
    setCategory,
    setPage,
    resetFilters
  } = useDictionarySearch();

  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const categories = dictionaryService.getCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Header Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-madura-border shadow-subtle space-y-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-navy">
              Pencarian Kamus Madura Digital
            </h1>
            <p className="text-xs sm:text-sm text-madura-muted">
              Pencarian dua arah cerdas dengan toleransi ejaan aksen baku (â, è, ') dan tingkat tutur.
            </p>
          </div>
          <DirectionToggle direction={direction} onChange={setDirection} />
        </div>

        {/* Search Input Bar */}
        <div>
          <SearchBar
            value={query}
            onChange={setQuery}
            direction={direction}
            onClear={() => setQuery('')}
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-madura-border/60 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-navy flex items-center gap-1.5 mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-gold-500" />
              <span>Tingkat Tutur:</span>
            </span>
            {(['all', 'netral', 'enja_iya', 'engghi_enten', 'engghi_bhunten'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSpeechLevel(lvl)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                  speechLevel === lvl
                    ? 'bg-navy text-white shadow-xs font-semibold'
                    : 'bg-ivory hover:bg-ivory-warm text-stone-600 border border-madura-border/60'
                }`}
              >
                {lvl === 'all'
                  ? 'Semua Tingkat'
                  : lvl === 'enja_iya'
                  ? "Enja'-Iya (Lomrah)"
                  : lvl === 'engghi_enten'
                  ? 'Engghi-Enten (Menengah)'
                  : lvl === 'engghi_bhunten'
                  ? 'Engghi-Bhunten (Alos)'
                  : 'Netral'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-navy">Kategori:</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-ivory border border-madura-border text-navy text-xs font-medium focus:outline-none focus:ring-1 focus:ring-navy"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name} ({c.wordCount})
                </option>
              ))}
            </select>

            {(query || speechLevel !== 'all' || category !== 'all') && (
              <button
                onClick={resetFilters}
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

      {/* Search Stats & Status */}
      <div className="flex items-center justify-between text-xs text-madura-muted px-1">
        <div>
          Menampilkan <strong className="text-navy">{result.items.length}</strong> dari <strong className="text-navy">{result.total.toLocaleString()}</strong> kosakata
          {query && <span> untuk pencarian "<strong>{query}</strong>"</span>}
        </div>
        <div>
          Halaman {result.page} dari {result.totalPages || 1}
        </div>
      </div>

      {/* Results Content */}
      {isSearching ? (
        <DictionaryGridSkeleton count={6} />
      ) : result.items.length === 0 ? (
        <EmptyState
          title="Kosakata Tidak Ditemukan"
          description={`Tidak ada kata yang sesuai dengan kriteria pencarian "${query}". Coba periksa ejaan kata atau gunakan kata dasar tanpa imbuhan.`}
          actionLabel="Bersihkan Pencarian"
          onAction={resetFilters}
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
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl border border-madura-border bg-white text-xs font-semibold text-navy hover:bg-ivory-warm disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </button>

          <span className="px-3.5 py-2 rounded-xl bg-white border border-madura-border text-xs font-mono font-bold text-navy shadow-xs">
            {page} / {result.totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(result.totalPages, p + 1))}
            disabled={page >= result.totalPages}
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl border border-madura-border bg-white text-xs font-semibold text-navy hover:bg-ivory-warm disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-colors"
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
