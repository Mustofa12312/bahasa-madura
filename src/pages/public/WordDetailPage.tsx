import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bookmark, 
  Copy, 
  Check, 
  Share2, 
  BookOpen, 
  Info, 
  Tag, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  PlusCircle
} from 'lucide-react';
import { dictionaryService } from '../../services/dictionaryService';
import { SpeechLevelBadge } from '../../components/dictionary/SpeechLevelBadge';
import { getSpeechLevelMeta } from '../../lib/utils';
import { useToast } from '../../components/ui/Toast';
import { EmptyState } from '../../components/common/EmptyState';

export const WordDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [copiedWord, setCopiedWord] = useState(false);
  const [copiedMeaning, setCopiedMeaning] = useState(false);

  const word = slug ? dictionaryService.getWordBySlug(slug) : undefined;

  if (!word) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <EmptyState
          title="Entri Kata Tidak Ditemukan"
          description={`Kosakata dengan tautan "${slug}" tidak ada dalam database kami.`}
          actionLabel="Kembali ke Kamus"
          onAction={() => navigate('/kamus')}
        />
      </div>
    );
  }

  const isFav = dictionaryService.isFavorite(word.id);
  const levelMeta = getSpeechLevelMeta(word.speech_level);

  const handleCopyWord = () => {
    navigator.clipboard.writeText(word.word);
    setCopiedWord(true);
    showToast(`Kata "${word.word}" disalin ke clipboard`);
    setTimeout(() => setCopiedWord(false), 2000);
  };

  const handleCopyMeaning = () => {
    navigator.clipboard.writeText(word.definition);
    setCopiedMeaning(true);
    showToast('Arti kata disalin ke clipboard');
    setTimeout(() => setCopiedMeaning(false), 2000);
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `Kamus Madura: ${word.word}`,
        text: `${word.word} artinya: ${word.definition}`,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      showToast('Tautan halaman disalin');
    }
  };

  const handleToggleFavorite = () => {
    const updated = dictionaryService.toggleFavorite(word.id);
    showToast(updated ? `Disimpan ke Favorit: "${word.word}"` : `Dihapus dari Favorit`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/kamus"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-madura-muted hover:text-navy transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Pencarian</span>
        </Link>
      </div>

      {/* Main Word Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-madura-border shadow-subtle space-y-8">
        {/* Lemma Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-madura-border">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-navy tracking-tight">
                {word.word}
              </h1>
              <button
                onClick={handleCopyWord}
                title="Salin kata"
                className="p-2 rounded-xl hover:bg-ivory-warm text-stone-400 hover:text-navy transition-colors"
              >
                {copiedWord ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            {word.word !== word.normalized && (
              <p className="text-sm font-mono text-madura-muted mt-1.5">
                Ortografi baku: <span className="text-navy font-semibold">{word.word}</span> &bull; Bentuk fonetis: <span className="text-forest font-semibold">/{word.normalized}/</span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <SpeechLevelBadge level={word.speech_level} />
          </div>
        </div>

        {/* Definition Card */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-madura-muted">Arti Bahasa Indonesia</h3>
            <button
              onClick={handleCopyMeaning}
              className="text-xs text-forest hover:underline font-semibold flex items-center gap-1"
            >
              {copiedMeaning ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Salin Terjemahan</span>
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-ivory border border-madura-border text-lg font-medium text-navy leading-relaxed">
            {word.definition}
          </div>
        </div>

        {/* Multi-translations breakdown if available */}
        {word.translations && word.translations.length > 1 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-madura-muted">
              Rincian Terjemahan ({word.translations.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {word.translations.map((t, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-madura-border bg-white flex items-center justify-between">
                  <span className="font-semibold text-navy text-sm">{t.translation}</span>
                  <SpeechLevelBadge level={t.speech_level} showIcon={false} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Speech Level Etiquette Guide */}
        <div className={`p-5 rounded-2xl border ${levelMeta.badgeClass} bg-opacity-25 space-y-2`}>
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wide">
            <ShieldCheck className="w-4 h-4" />
            <span>Kaidah Kesopanan: {levelMeta.name} ({levelMeta.traditionalName})</span>
          </div>
          <p className="text-sm leading-relaxed text-madura-text/90">
            {levelMeta.description}
          </p>
          <div className="text-xs font-semibold text-madura-muted pt-1">
            Penggunaan lazim: <strong>{levelMeta.targetAudience}</strong>
          </div>
        </div>

        {/* Examples Section */}
        {word.examples && word.examples.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-madura-muted flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-gold-500" />
              <span>Contoh Kalimat</span>
            </h3>
            <div className="space-y-2.5">
              {word.examples.map((ex, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-ivory-warm border border-madura-border space-y-1">
                  <p className="font-serif text-base font-semibold text-navy italic">
                    "{ex.madurese}"
                  </p>
                  <p className="text-xs text-madura-muted">
                    {ex.indonesian}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div className="pt-6 border-t border-madura-border flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-madura-muted">
            <Tag className="w-3.5 h-3.5 text-gold-500" />
            <span>Kategori: <strong>{word.category_name || 'Kosakata Sehari-hari'}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-madura-border text-xs font-semibold text-navy hover:bg-ivory-warm transition-colors shadow-xs"
            >
              <Share2 className="w-4 h-4" />
              <span>Bagikan</span>
            </button>

            <button
              onClick={handleToggleFavorite}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all shadow-xs ${
                isFav
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-white border-madura-border text-navy hover:bg-ivory-warm'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isFav ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>{isFav ? 'Tersimpan di Favorit' : 'Tambah ke Favorit'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

