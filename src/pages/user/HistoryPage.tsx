import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Trash2, ArrowRight, Clock, Shield } from 'lucide-react';
import { dictionaryService } from '../../services/dictionaryService';
import { SearchHistoryItem } from '../../types';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDate } from '../../lib/utils';
import { useToast } from '../../components/ui/Toast';

export const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const loadHistory = () => {
    setHistory(dictionaryService.getSearchHistory());
  };

  useEffect(() => {
    loadHistory();
    window.addEventListener('history-updated', loadHistory);
    return () => window.removeEventListener('history-updated', loadHistory);
  }, []);

  const handleClearAll = () => {
    if (confirm('Hapus seluruh riwayat pencarian?')) {
      dictionaryService.clearSearchHistory();
      showToast('Riwayat pencarian telah dibersihkan');
    }
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dictionaryService.removeSearchHistoryItem(id);
    showToast('Item riwayat dihapus');
  };

  const handleRepeatSearch = (item: SearchHistoryItem) => {
    navigate(`/kamus?q=${encodeURIComponent(item.query)}&dir=${item.direction}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-navy uppercase tracking-wider mb-1">
            <History className="w-3.5 h-3.5" />
            <span>Riwayat Aktivitas</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy">
            Riwayat Pencarian
          </h1>
          <p className="text-xs sm:text-sm text-madura-muted">
            Daftar kata kunci yang pernah Anda cari sebelumnya.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Bersihkan Riwayat</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <EmptyState
          icon={<History className="w-7 h-7 text-stone-400" />}
          title="Belum Ada Riwayat Pencarian"
          description="Pencarian kata yang Anda lakukan di kamus akan otomatis tercatat di sini untuk memudahkan pencarian ulang."
          actionLabel="Mulai Mencari"
          onAction={() => navigate('/kamus')}
        />
      ) : (
        <div className="bg-white rounded-3xl p-6 border border-madura-border shadow-subtle divide-y divide-madura-border/60">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => handleRepeatSearch(item)}
              className="py-3.5 px-3 -mx-3 rounded-xl hover:bg-ivory-warm cursor-pointer transition-colors flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500 group-hover:bg-navy group-hover:text-white transition-colors">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-serif font-bold text-navy text-base group-hover:text-forest transition-colors block">
                    {item.query}
                  </span>
                  <div className="text-[11px] text-madura-muted flex items-center gap-2 mt-0.5">
                    <span className="font-semibold text-stone-500">
                      {item.direction === 'm2i' ? 'Madura → Indonesia' : 'Indonesia → Madura'}
                    </span>
                    <span>&bull;</span>
                    <span>{formatDate(item.timestamp)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleDeleteItem(item.id, e)}
                  title="Hapus dari riwayat"
                  className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-white transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="p-1.5 text-stone-400 group-hover:text-navy group-hover:translate-x-1 transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="p-4 rounded-2xl bg-ivory-warm/60 border border-madura-border flex items-start gap-3 text-xs text-madura-muted">
        <Shield className="w-4 h-4 text-forest flex-shrink-0 mt-0.5" />
        <p>
          Privasi Anda terjaga. Riwayat pencarian disimpan secara lokal di peramban (browser) perangkat Anda dan dapat dihapus sewaktu-waktu.
        </p>
      </div>
    </div>
  );
};
