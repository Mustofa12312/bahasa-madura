import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, BookOpen, Clock, Calendar } from 'lucide-react';
import { INITIAL_ARTICLES } from '../../constants';

export const LearningPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-forest uppercase tracking-wider mb-2">
          <GraduationCap className="w-4 h-4" />
          <span>Pusat Pembelajaran Digital</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy tracking-tight mb-3">
          Belajar Bahasa & Budaya Madura
        </h1>
        <p className="text-sm sm:text-base text-madura-muted leading-relaxed">
          Panduan komprehensif tata bahasa (*ondhagghâ bhâsa*), kaidah ejaan ortografi vokal, percakapan sehari-hari, serta filosofi kearifan lokal masyarakat Madura.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INITIAL_ARTICLES.map((art) => (
          <Link
            key={art.id}
            to={`/belajar/${art.slug}`}
            className="p-6 rounded-3xl bg-white border border-madura-border hover:border-navy shadow-subtle hover:shadow-elevated transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 text-xs text-madura-muted mb-4">
                <span className="font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-ivory-warm text-navy">
                  {art.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>{art.readTime}</span>
                </span>
              </div>

              <h3 className="font-serif font-bold text-xl text-navy group-hover:text-forest transition-colors mb-3 leading-snug">
                {art.title}
              </h3>
              <p className="text-sm text-madura-muted leading-relaxed line-clamp-3">
                {art.excerpt}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-madura-border flex items-center justify-between text-xs font-semibold text-forest">
              <span>Pelajari Artikel</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

