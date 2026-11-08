import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Layers } from 'lucide-react';
import { dictionaryService } from '../../services/dictionaryService';
import { WordCard } from '../../components/dictionary/WordCard';
import { WordDetailModal } from '../../components/dictionary/WordDetailModal';
import { EmptyState } from '../../components/common/EmptyState';
import { Word } from '../../types';

export const CategoryDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);

  const category = slug ? dictionaryService.getCategoryBySlug(slug) : undefined;

  const result = slug ? dictionaryService.search({
    query: '',
    direction: 'm2i',
    speechLevel: 'all',
    category: slug,
    page: 1,
    limit: 100
  }) : { items: [], total: 0, page: 1, limit: 100, totalPages: 1 };

  if (!category) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <EmptyState
          title="Kategori Tidak Ditemukan"
          description={`Kategori "${slug}" tidak terdaftar.`}
          actionLabel="Kembali ke Kategori"
          onAction={() => navigate('/kategori')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          to="/kategori"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-madura-muted hover:text-navy transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Semua Kategori</span>
        </Link>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-madura-border shadow-subtle">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-600 uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Kategori Kosakata</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy mb-2">
            {category.name}
          </h1>
          <p className="text-sm text-madura-muted max-w-2xl leading-relaxed mb-4">
            {category.desc}
          </p>
          <div className="text-xs font-semibold text-forest">
            Memuat {result.total} kosakata terdaftar
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {result.items.map((word) => (
          <WordCard
            key={word.id}
            word={word}
            onSelect={setSelectedWord}
          />
        ))}
      </div>

      <WordDetailModal
        word={selectedWord}
        isOpen={Boolean(selectedWord)}
        onClose={() => setSelectedWord(null)}
      />
    </div>
  );
};

