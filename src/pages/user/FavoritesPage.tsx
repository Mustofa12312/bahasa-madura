import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, ArrowLeft, Trash2, Search, Cloud, CheckCircle } from 'lucide-react';
import { dictionaryService } from '../../services/dictionaryService';
import { WordCard } from '../../components/dictionary/WordCard';
import { WordDetailModal } from '../../components/dictionary/WordDetailModal';
import { EmptyState } from '../../components/common/EmptyState';
import { Word } from '../../types';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../../app/providers/AuthProvider';

export const FavoritesPage: React.FC = () => {
  const { user } = useAuth();
  const [favoriteWords, setFavoriteWords] = useState<Word[]>([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const { showToast } = useToast();

  const loadFavorites = () => {
    setFavoriteWords(dictionaryService.getFavoriteWords());
  };

  useEffect(() => {
    loadFavorites();
    window.addEventListener('favorites-updated', loadFavorites);
    return () => window.removeEventListener('favorites-updated', loadFavorites);
  }, []);

  const handleClearAll = () => {
    if (confirm('Apakah Anda yakin ingin menghapus seluruh daftar kosakata favorit?')) {
      localStorage.removeItem('kmd_favorites_v1');
      window.dispatchEvent(new Event('favorites-updated'));
      showToast('Seluruh favorit telah dibersihkan');
    }
  };

  const filtered = favoriteWords.filter(
    (w) =>
      w.word.toLowerCase().includes(filterQuery.toLowerCase()) ||
      w.definition.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
            <Bookmark className="w-3.5 h-3.5 fill-amber-500" />
            <span>Koleksi Pribadi</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy">
            Kosakata Favorit
          </h1>
          <p className="text-xs sm:text-sm text-madura-muted">
            Daftar kosakata yang Anda simpan untuk dipelajari kembali kapan saja.
          </p>
        </div>

        {favoriteWords.length > 0 && (
          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Semua</span>
          </button>
        )}
      </div>

      {/* Sync Status Banner */}
      {!user ? (
        <div className="p-4 rounded-2xl bg-ivory-warm border border-madura-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-stone-600">
            <Cloud className="w-4 h-4 text-forest flex-shrink-0" />
            <span>Kata favorit saat ini tersimpan di peramban lokal. Masuk akun untuk menyinkronkan di semua perangkat.</span>
          </div>
          <Link to="/login" className="font-bold text-forest hover:underline flex-shrink-0">
            Masuk / Daftar Akun &rarr;
          </Link>
        </div>
      ) : (
        <div className="p-3 px-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Tersinkronisasi dengan akun <strong>{user.email}</strong></span>
        </div>
      )}

      {favoriteWords.length > 0 && (
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Cari di dalam daftar favorit..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-madura-border bg-white text-xs text-navy focus:outline-none focus:ring-2 focus:ring-navy/5"
          />
        </div>
      )}

      {favoriteWords.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="w-7 h-7 text-amber-500 fill-amber-500" />}
          title="Belum Ada Kosakata Favorit"
          description="Simpan kata-kata yang ingin Anda ingat dengan menekan ikon penanda (bookmark) pada kartu kosakata."
          actionLabel="Jelajahi Kamus"
          onAction={() => window.location.assign('/kamus')}
        />
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-sm text-madura-muted">
          Tidak ada kata favorit yang cocok dengan "{filterQuery}".
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filtered.map((word) => (
            <WordCard
              key={word.id}
              word={word}
              onSelect={setSelectedWord}
            />
          ))}
        </div>
      )}

      <WordDetailModal
        word={selectedWord}
        isOpen={Boolean(selectedWord)}
        onClose={() => setSelectedWord(null)}
      />
    </div>
  );
};

