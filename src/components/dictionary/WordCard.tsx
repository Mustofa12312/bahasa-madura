import React, { useState } from 'react';
import { Bookmark, Copy, Check, ArrowRight, Tag } from 'lucide-react';
import { Word } from '../../types';
import { SpeechLevelBadge } from './SpeechLevelBadge';
import { dictionaryService } from '../../services/dictionaryService';
import { useToast } from '../ui/Toast';

export interface WordCardProps {
  word: Word;
  onSelect?: (word: Word) => void;
  highlightQuery?: string;
}

export const WordCard: React.FC<WordCardProps> = ({ word, onSelect }) => {
  const [copied, setCopied] = useState(false);
  const [isFav, setIsFav] = useState(() => dictionaryService.isFavorite(word.id));
  const { showToast } = useToast();

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `${word.word}: ${word.definition}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    showToast(`Disalin: "${word.word}"`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = dictionaryService.toggleFavorite(word.id);
    setIsFav(updated);
    showToast(updated ? `Ditambahkan ke Favorit: "${word.word}"` : `Dihapus dari Favorit: "${word.word}"`);
  };

  return (
    <div
      onClick={() => onSelect?.(word)}
      className="group relative flex flex-col justify-between rounded-2xl border border-madura-border bg-white p-5 shadow-subtle transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-elevated cursor-pointer"
    >
      <div>
        {/* Header: Lemma and Badges */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="font-serif text-2xl font-bold text-navy group-hover:text-forest transition-colors tracking-tight">
              {word.word}
            </h3>
            {word.word !== word.normalized && (
              <span className="text-xs font-mono text-madura-muted">/{word.normalized}/</span>
            )}
          </div>
          <SpeechLevelBadge level={word.speech_level} />
        </div>

        {/* Definition */}
        <p className="text-sm text-madura-text/90 line-clamp-2 leading-relaxed mb-4">
          {word.definition}
        </p>

        {/* Multiple translations preview */}
        {word.translations && word.translations.length > 1 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {word.translations.slice(0, 3).map((tr, idx) => (
              <span key={idx} className="text-xs px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-medium">
                {tr.translation}
              </span>
            ))}
            {word.translations.length > 3 && (
              <span className="text-xs text-madura-muted self-center">
                +{word.translations.length - 3} lainnya
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Meta & Actions */}
      <div className="flex items-center justify-between pt-3.5 border-t border-madura-border/60 text-xs text-madura-muted">
        <div className="flex items-center gap-1.5 text-stone-500">
          <Tag className="w-3.5 h-3.5 text-gold-500" />
          <span>{word.category_name || 'Kosakata Sehari-hari'}</span>
        </div>

        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleCopy}
            title="Salin kata dan arti"
            className="p-1.5 rounded-lg hover:bg-ivory-warm text-stone-400 hover:text-navy transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleFavorite}
            title={isFav ? "Hapus dari favorit" : "Simpan ke favorit"}
            className={`p-1.5 rounded-lg hover:bg-ivory-warm transition-colors ${
              isFav ? 'text-amber-500 fill-amber-500' : 'text-stone-400 hover:text-amber-500'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={() => onSelect?.(word)}
            title="Lihat detail lengkap"
            className="p-1.5 rounded-lg hover:bg-ivory-warm text-stone-400 hover:text-navy transition-colors ml-1"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
