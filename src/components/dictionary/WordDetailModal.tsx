import React, { useState } from 'react';
import { Word } from '../../types';
import { Modal } from '../ui/Modal';
import { SpeechLevelBadge } from './SpeechLevelBadge';
import { getSpeechLevelMeta } from '../../lib/utils';
import { Bookmark, Copy, Check, Share2, BookOpen, Quote, Info } from 'lucide-react';
import { dictionaryService } from '../../services/dictionaryService';
import { useToast } from '../ui/Toast';

export interface WordDetailModalProps {
  word: Word | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WordDetailModal: React.FC<WordDetailModalProps> = ({ word, isOpen, onClose }) => {
  const [copiedWord, setCopiedWord] = useState(false);
  const [copiedMeaning, setCopiedMeaning] = useState(false);
  const { showToast } = useToast();

  if (!word) return null;

  const isFav = dictionaryService.isFavorite(word.id);
  const levelMeta = getSpeechLevelMeta(word.speech_level);

  const handleCopyWord = () => {
    navigator.clipboard.writeText(word.word);
    setCopiedWord(true);
    showToast(`Kata "${word.word}" berhasil disalin`);
    setTimeout(() => setCopiedWord(false), 2000);
  };

  const handleCopyMeaning = () => {
    navigator.clipboard.writeText(word.definition);
    setCopiedMeaning(true);
    showToast('Arti kata berhasil disalin');
    setTimeout(() => setCopiedMeaning(false), 2000);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/kamus/${word.slug}`;
    if (navigator.share) {
      navigator.share({
        title: `Kamus Madura: ${word.word}`,
        text: `${word.word} (${levelMeta.name}) artinya: ${word.definition}`,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      showToast('Tautan kata disalin ke clipboard');
    }
  };

  const handleToggleFavorite = () => {
    const updated = dictionaryService.toggleFavorite(word.id);
    showToast(updated ? `Ditambahkan ke Favorit: "${word.word}"` : `Dihapus dari Favorit: "${word.word}"`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={
        <div className="flex items-center gap-2 text-stone-500 text-xs font-mono font-medium">
          <BookOpen className="w-4 h-4 text-gold-500" />
          <span>ENTRI KOSAKATA MADURA</span>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Lemma Hero */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-madura-border/60">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy tracking-tight">
                {word.word}
              </h1>
              <button
                onClick={handleCopyWord}
                title="Salin kata"
                className="p-1.5 rounded-lg hover:bg-ivory-warm text-stone-400 hover:text-navy transition-colors"
              >
                {copiedWord ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {word.word !== word.normalized && (
              <p className="text-xs text-madura-muted font-mono mt-1">
                Ejaan pencarian bebas aksen: <span className="text-navy-700 font-semibold">{word.normalized}</span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <SpeechLevelBadge level={word.speech_level} />
          </div>
        </div>

        {/* Translation & Definition */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-madura-muted">Arti Bahasa Indonesia</h4>
            <button
              onClick={handleCopyMeaning}
              className="text-xs text-forest hover:underline flex items-center gap-1 font-medium"
            >
              {copiedMeaning ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Salin Arti</span>
            </button>
          </div>
          <div className="p-4 rounded-xl bg-ivory border border-madura-border text-base text-navy font-medium leading-relaxed">
            {word.definition}
          </div>
        </div>

        {/* Multiple translations breakdown */}
        {word.translations && word.translations.length > 1 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-madura-muted mb-2">
              Daftar Padanan Makna ({word.translations.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {word.translations.map((t, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-madura-border/70 bg-white flex items-center justify-between text-sm">
                  <span className="font-medium text-navy">{t.translation}</span>
                  <SpeechLevelBadge level={t.speech_level} showIcon={false} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Speech Level Educational Card */}
        <div className={`p-4 rounded-xl border ${levelMeta.badgeClass} bg-opacity-30 space-y-1.5`}>
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wide">
            <Info className="w-4 h-4" />
            <span>Kaidah Penggunaan: {levelMeta.name} ({levelMeta.traditionalName})</span>
          </div>
          <p className="text-xs leading-relaxed text-madura-text/90">
            {levelMeta.description}
          </p>
          <div className="text-[11px] font-semibold text-madura-muted pt-1">
            Ditujukan kepada: {levelMeta.targetAudience}
          </div>
        </div>

        {/* Example Sentence Section */}
        {word.examples && word.examples.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-madura-muted mb-2 flex items-center gap-1.5">
              <Quote className="w-3.5 h-3.5 text-gold-500" />
              <span>Contoh Penggunaan Kalimat</span>
            </h4>
            <div className="space-y-2.5">
              {word.examples.map((ex, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white border border-madura-border space-y-1">
                  <p className="font-serif text-sm font-semibold text-navy italic">
                    "{ex.madurese}"
                  </p>
                  <p className="text-xs text-madura-muted">
                    Artinya: {ex.indonesian}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-madura-border">
          <div className="text-xs text-madura-muted">
            Sumber: <span className="font-semibold">{word.source || 'Kamus Madura Digital'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-navy hover:bg-ivory-warm border border-madura-border transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Bagikan</span>
            </button>

            <button
              onClick={handleToggleFavorite}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isFav
                  ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
                  : 'bg-white border-madura-border text-navy hover:bg-ivory-warm'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>{isFav ? 'Tersimpan' : 'Favorit'}</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
