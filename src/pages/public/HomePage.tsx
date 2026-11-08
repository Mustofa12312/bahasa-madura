import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Compass, 
  ShieldCheck, 
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { SearchBar } from '../../components/dictionary/SearchBar';
import { DirectionToggle } from '../../components/dictionary/DirectionToggle';
import { WordCard } from '../../components/dictionary/WordCard';
import { WordDetailModal } from '../../components/dictionary/WordDetailModal';
import { SpeechLevelBadge } from '../../components/dictionary/SpeechLevelBadge';
import { dictionaryService } from '../../services/dictionaryService';
import { Word, SearchDirection } from '../../types';
import { INITIAL_ARTICLES } from '../../constants';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [direction, setDirection] = useState<SearchDirection>('m2i');
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);

  const dailyWord = dictionaryService.getDailyWord();
  const popularWords = dictionaryService.getPopularWords();
  const categories = dictionaryService.getCategories();

  // Live search result for hero
  const liveResults = query.trim()
    ? dictionaryService.search({
        query,
        direction,
        speechLevel: 'all',
        category: 'all',
        page: 1,
        limit: 6
      })
    : null;

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim()) {
      navigate(`/kamus?q=${encodeURIComponent(query)}&dir=${direction}`);
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden border-b border-madura-border/60 bg-gradient-to-b from-white to-ivory">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-forest/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-50 border border-navy-100 text-navy-800 text-xs font-semibold uppercase tracking-wider mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-gold-500" />
            <span>Dokumentasi & Kosakata Bahasa Madura Terlengkap</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-navy tracking-tight leading-tight sm:leading-none mb-6">
            Temukan Arti Kata <br className="hidden sm:inline" />
            <span className="text-forest underline decoration-gold/60 decoration-wavy decoration-2">
              Bahasa Madura
            </span>
          </h1>

          <p className="text-base sm:text-lg text-madura-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            Kamus digital dua arah dengan pencarian cerdas beraksen baku, panduan tingkatan tutur bahasa (*ondhagghâ bhâsa*), dan contoh percakapan nyata.
          </p>

          {/* Search Card Container */}
          <div className="bg-white/80 backdrop-blur-md p-3 sm:p-4 rounded-3xl border border-madura-border shadow-elevated max-w-2xl mx-auto">
            <div className="flex justify-center mb-3">
              <DirectionToggle direction={direction} onChange={setDirection} />
            </div>

            <form onSubmit={handleSearchSubmit}>
              <SearchBar
                value={query}
                onChange={setQuery}
                direction={direction}
                autoFocus={true}
              />
            </form>

            {/* Popular quick clicks */}
            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 text-xs">
              <span className="text-madura-muted font-medium">Kata populer:</span>
              {popularWords.slice(0, 5).map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setQuery(p.word);
                    setDirection('m2i');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-ivory-warm text-navy hover:bg-gold/20 hover:text-navy-950 font-medium transition-colors"
                >
                  {p.word}
                </button>
              ))}
            </div>
          </div>

          {/* Live Search Results Dropdown Overlay if typing in Hero */}
          {liveResults && (
            <div className="mt-6 max-w-2xl mx-auto text-left bg-white rounded-2xl p-5 border border-madura-border shadow-2xl animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-madura-border/60 mb-3 text-xs font-semibold text-madura-muted">
                <span>HASIL PENCARIAN CEPAT ({liveResults.total} DITEMUKAN)</span>
                <Link
                  to={`/kamus?q=${encodeURIComponent(query)}&dir=${direction}`}
                  className="text-forest hover:underline flex items-center gap-1 font-bold"
                >
                  <span>Buka Semua Hasil</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {liveResults.items.length === 0 ? (
                <div className="py-6 text-center text-sm text-madura-muted">
                  Kata "{query}" tidak ditemukan. Coba periksa ejaan atau usulkan kosakata baru.
                </div>
              ) : (
                <div className="space-y-2">
                  {liveResults.items.map((word) => (
                    <div
                      key={word.id}
                      onClick={() => setSelectedWord(word)}
                      className="p-3 rounded-xl hover:bg-ivory-warm cursor-pointer transition-colors flex items-center justify-between gap-3 border border-transparent hover:border-madura-border"
                    >
                      <div>
                        <div className="font-serif font-bold text-navy text-base">
                          {word.word}
                        </div>
                        <div className="text-xs text-madura-text/80 line-clamp-1">
                          {word.definition}
                        </div>
                      </div>
                      <SpeechLevelBadge level={word.speech_level} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Featured Word of the Day & Quick Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Word Banner (2 cols on large) */}
          <div className="lg:col-span-2 rounded-3xl bg-navy text-ivory p-6 sm:p-8 relative overflow-hidden shadow-elevated flex flex-col justify-between border border-navy-800">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/20 text-gold-300 text-xs font-semibold tracking-wider uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Kosakata Pilihan Hari Ini</span>
                </span>
                <SpeechLevelBadge level={dailyWord.speech_level} />
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-2">
                {dailyWord.word}
              </h2>
              {dailyWord.word !== dailyWord.normalized && (
                <p className="text-xs text-gold-300/80 font-mono mb-4">
                  Ejaan baku: {dailyWord.word} &bull; Transkripsi: /{dailyWord.normalized}/
                </p>
              )}

              <p className="text-base sm:text-lg text-stone-200 font-medium mb-6 leading-relaxed max-w-xl">
                "{dailyWord.definition}"
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-navy-700/80 text-xs">
              <span className="text-stone-400">
                Kategori: <strong className="text-stone-200">{dailyWord.category_name || 'Kosakata Umum'}</strong>
              </span>
              <button
                onClick={() => setSelectedWord(dailyWord)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold text-navy-950 font-bold hover:bg-gold-500 transition-colors shadow-sm"
              >
                <span>Pelajari Selengkapnya</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Educational Quick Card */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 border border-madura-border shadow-subtle flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-navy mb-2">
                Ondhagghâ Bhâsa
              </h3>
              <p className="text-xs text-madura-muted leading-relaxed mb-4">
                Bahasa Madura memiliki 3 tingkat tutur utama yang mencerminkan rasa hormat dan etika sopan santun dalam bermasyarakat:
              </p>

              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/60 flex items-center justify-between">
                  <span className="font-bold text-amber-900">Enja'-Iya</span>
                  <span className="text-amber-700">Teman sebaya & akrab</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/60 flex items-center justify-between">
                  <span className="font-bold text-emerald-900">Engghi-Enten</span>
                  <span className="text-emerald-700">Tingkat menengah sopan</span>
                </div>
                <div className="p-2.5 rounded-xl bg-navy-50/80 border border-gold/40 flex items-center justify-between">
                  <span className="font-bold text-navy-950">Engghi-Bhunten</span>
                  <span className="text-navy-700">Orang tua, kiai, guru</span>
                </div>
              </div>
            </div>

            <Link
              to="/belajar/pengenalan-tingkatan-bahasa-madura"
              className="mt-6 text-xs text-forest hover:underline font-bold flex items-center gap-1"
            >
              <span>Pelajari Kaidah Tata Bahasa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Explorer Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-gold-600 uppercase tracking-wider mb-1">
              <Compass className="w-3.5 h-3.5" />
              <span>Jelajahi Berdasarkan Tema</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy">
              Kategori Kosakata
            </h2>
          </div>
          <Link
            to="/kategori"
            className="text-xs font-bold text-forest hover:underline flex items-center gap-1"
          >
            <span>Lihat Semua Kategori</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.slice(0, 4).map((cat) => (
            <Link
              key={cat.slug}
              to={`/kategori/${cat.slug}`}
              className="p-5 rounded-2xl bg-white border border-madura-border hover:border-gold/60 shadow-subtle hover:shadow-elevated transition-all group flex flex-col justify-between"
            >
              <div>
                <h3 className="font-serif font-bold text-lg text-navy group-hover:text-forest transition-colors mb-1">
                  {cat.name}
                </h3>
                <p className="text-xs text-madura-muted line-clamp-2 leading-relaxed">
                  {cat.desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-madura-border/60 flex items-center justify-between text-xs">
                <span className="font-semibold text-gold-600">{cat.wordCount} kata</span>
                <span className="text-madura-muted group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Learning Center Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="rounded-3xl bg-ivory-warm border border-madura-border/80 p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-forest uppercase tracking-wider mb-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Pusat Pembelajaran & Artikel Budaya</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy">
                Pelajari Bahasa & Adab Madura
              </h2>
            </div>
            <Link
              to="/belajar"
              className="text-xs font-bold text-navy hover:underline flex items-center gap-1"
            >
              <span>Semua Materi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {INITIAL_ARTICLES.map((article) => (
              <Link
                key={article.id}
                to={`/belajar/${article.slug}`}
                className="bg-white rounded-2xl p-6 border border-madura-border hover:border-navy transition-all shadow-subtle hover:shadow-elevated flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 mb-3 inline-block">
                    {article.category} &bull; {article.readTime}
                  </span>
                  <h3 className="font-serif font-bold text-base text-navy group-hover:text-forest transition-colors mb-2 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-madura-muted line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100 text-xs font-semibold text-forest flex items-center gap-1">
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Word Detail Modal */}
      <WordDetailModal
        word={selectedWord}
        isOpen={Boolean(selectedWord)}
        onClose={() => setSelectedWord(null)}
      />
    </div>
  );
};
