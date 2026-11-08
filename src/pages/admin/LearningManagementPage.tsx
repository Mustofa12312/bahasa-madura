import React, { useState } from 'react';
import { GraduationCap, Plus, Clock, ExternalLink, CheckCircle } from 'lucide-react';
import { INITIAL_ARTICLES } from '../../constants';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { Link } from 'react-router-dom';

export const LearningManagementPage: React.FC = () => {
  const { showToast } = useToast();
  const [articles, setArticles] = useState(INITIAL_ARTICLES);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-navy">
            Kelola Artikel Pembelajaran
          </h1>
          <p className="text-xs text-madura-muted">
            Materi tata bahasa, ortografi ejaan, dan percakapan budaya Madura.
          </p>
        </div>

        <Button
          onClick={() => showToast('Form artikel baru siap digunakan.')}
          variant="primary"
          size="sm"
        >
          <Plus className="w-4 h-4 text-gold-400" />
          <span>Tulis Artikel Baru</span>
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-madura-border shadow-subtle overflow-hidden divide-y divide-madura-border/60">
        {articles.map((art) => (
          <div key={art.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-ivory-warm/40 transition-colors">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2 text-[11px] text-madura-muted">
                <span className="font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-forest/10 text-forest">
                  {art.category}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{art.readTime}</span>
                </span>
                <span>&bull;</span>
                <span>Dipublikasikan: {art.publishedAt}</span>
              </div>
              <h3 className="font-serif font-bold text-lg text-navy">
                {art.title}
              </h3>
              <p className="text-xs text-madura-muted line-clamp-2">
                {art.excerpt}
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Link
                to={`/belajar/${art.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-madura-border text-xs font-semibold text-navy hover:bg-stone-50"
              >
                <span>Lihat Publik</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

