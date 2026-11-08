import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Share2, BookOpen } from 'lucide-react';
import { INITIAL_ARTICLES } from '../../constants';
import { useToast } from '../../components/ui/Toast';
import { EmptyState } from '../../components/common/EmptyState';

export const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const article = INITIAL_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <EmptyState
          title="Artikel Tidak Ditemukan"
          description="Artikel pembelajaran yang Anda cari tidak tersedia."
          actionLabel="Kembali ke Pusat Belajar"
          onAction={() => navigate('/belajar')}
        />
      </div>
    );
  }

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      showToast('Tautan artikel disalin');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          to="/belajar"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-madura-muted hover:text-navy transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Pusat Belajar</span>
        </Link>
      </div>

      <article className="bg-white rounded-3xl p-6 sm:p-10 border border-madura-border shadow-subtle space-y-8">
        {/* Article Header */}
        <div className="space-y-4 pb-6 border-b border-madura-border">
          <div className="flex flex-wrap items-center gap-3 text-xs text-madura-muted">
            <span className="font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-forest/10 text-forest">
              {article.category}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readTime}</span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{article.publishedAt}</span>
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy tracking-tight leading-tight">
            {article.title}
          </h1>

          <p className="text-base text-madura-muted font-medium italic border-l-2 border-gold pl-4 py-1">
            "{article.excerpt}"
          </p>
        </div>

        {/* Content Body formatted */}
        <div className="prose prose-stone max-w-none text-madura-text leading-relaxed space-y-4 text-sm sm:text-base">
          {article.content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={idx} className="font-serif text-xl font-bold text-navy pt-4 pb-1">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('- ')) {
              return (
                <ul key={idx} className="list-disc list-inside space-y-1.5 pl-2 text-stone-700">
                  {paragraph.split('\n').map((line, liIdx) => (
                    <li key={liIdx}>{line.replace('- ', '')}</li>
                  ))}
                </ul>
              );
            }
            if (paragraph.match(/^\d+\. /)) {
              return (
                <div key={idx} className="p-4 rounded-xl bg-ivory-warm/60 border border-madura-border space-y-1">
                  {paragraph.split('\n').map((line, lIdx) => (
                    <div key={lIdx} className={lIdx === 0 ? "font-bold text-navy" : "text-xs text-madura-muted pl-4"}>
                      {line}
                    </div>
                  ))}
                </div>
              );
            }
            return (
              <p key={idx} className="leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-madura-border flex items-center justify-between">
          <Link
            to="/kamus"
            className="text-xs font-semibold text-forest hover:underline flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Praktekkan di Kamus</span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-madura-border text-xs font-semibold text-navy hover:bg-ivory-warm transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Bagikan Artikel</span>
          </button>
        </div>
      </article>
    </div>
  );
};

