import React, { useState } from 'react';
import { Sparkles, Calendar, Quote, ShieldCheck, Share2, Bookmark } from 'lucide-react';
import { dictionaryService } from '../../services/dictionaryService';
import { SpeechLevelBadge } from '../../components/dictionary/SpeechLevelBadge';
import { getSpeechLevelMeta } from '../../lib/utils';
import { useToast } from '../../components/ui/Toast';

export const DailyWordPage: React.FC = () => {
  const dailyWord = dictionaryService.getDailyWord();
  const popular = dictionaryService.getPopularWords();
  const levelMeta = getSpeechLevelMeta(dailyWord.speech_level);
  const { showToast } = useToast();
  const [isFav, setIsFav] = useState(() => dictionaryService.isFavorite(dailyWord.id));

  const todayStr = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  const handleShare = () => {
    const url = `${window.location.origin}/kamus/${dailyWord.slug}`;
    if (navigator.share) {
      navigator.share({
        title: `Kata Hari Ini: ${dailyWord.word}`,
        text: `Belajar Bahasa Madura hari ini: ${dailyWord.word} artinya ${dailyWord.definition}`,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      showToast('Tautan disalin ke clipboard');
    }
  };

  const handleToggleFavorite = () => {
    const updated = dictionaryService.toggleFavorite(dailyWord.id);
    setIsFav(updated);
    showToast(updated ? 'Disimpan ke Favorit' : 'Dihapus dari Favorit');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-50 border border-gold-200 text-gold-700 text-xs font-semibold uppercase tracking-wider mb-3">
          <Calendar className="w-3.5 h-3.5" />
          <span>{todayStr}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy tracking-tight mb-2">
          Kosakata Pilihan Hari Ini
        </h1>
        <p className="text-sm text-madura-muted">
          Perkaya khazanah perbendaharaan kosakata Madura Anda satu kata setiap hari.
        </p>
      </div>

      {/* Hero Daily Card */}
      <div className="bg-navy rounded-3xl p-8 sm:p-12 text-ivory relative overflow-hidden shadow-elevated border border-navy-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-mono uppercase text-gold-400 tracking-wider">
              KATA HARI INI &bull; KOSAKATA MADURA
            </span>
            <SpeechLevelBadge level={dailyWord.speech_level} />
          </div>

          <div>
            <h2 className="font-serif text-5xl sm:text-6xl font-bold text-white tracking-tight">
              {dailyWord.word}
            </h2>
            {dailyWord.word !== dailyWord.normalized && (
              <p className="text-sm font-mono text-gold-300/80 mt-2">
                Pelafalan / Ejaan pencarian: /{dailyWord.normalized}/
              </p>
            )}
          </div>

          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold-300 mb-1">Arti & Terjemahan</h4>
            <p className="text-xl sm:text-2xl text-white font-serif font-medium leading-relaxed">
              "{dailyWord.definition}"
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-navy-900/60 border border-navy-700 text-xs leading-relaxed space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-gold-400 uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4" />
              <span>Etika Penggunaan: {levelMeta.name}</span>
            </div>
            <p className="text-stone-300">
              {levelMeta.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-navy-700">
            <span className="text-xs text-stone-400">
              Kategori: <strong className="text-stone-200">{dailyWord.category_name || 'Kosakata Umum'}</strong>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Bagikan</span>
              </button>

              <button
                onClick={handleToggleFavorite}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isFav
                    ? 'bg-gold text-navy-950'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                <span>{isFav ? 'Tersimpan' : 'Simpan Favorit'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Words Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-madura-border shadow-subtle space-y-5">
        <h3 className="font-serif text-xl font-bold text-navy">
          Kosakata Terpopuler Lainnya
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {popular.map((p, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-madura-border hover:bg-ivory-warm transition-colors flex items-center justify-between">
              <div>
                <span className="font-serif font-bold text-navy text-base block">{p.word}</span>
                <span className="text-xs text-madura-muted">{p.meaning}</span>
              </div>
              <SpeechLevelBadge level={(p.level as any) || 'netral'} showIcon={false} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
