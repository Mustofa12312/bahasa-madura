import React from 'react';
import { Link } from 'react-router-dom';
import { dictionaryService } from '../../services/dictionaryService';
import { Layers, ArrowRight, BookA, Activity, Box, Sparkles, Users, Landmark, HeartHandshake, MessageCircle } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const categories = dictionaryService.getCategories();

  const getIcon = (slug: string) => {
    switch (slug) {
      case 'kata-kerja': return <Activity className="w-5 h-5 text-forest" />;
      case 'kata-benda': return <Box className="w-5 h-5 text-gold-600" />;
      case 'kata-sifat': return <Sparkles className="w-5 h-5 text-amber-600" />;
      case 'sapaan-dan-ganti': return <Users className="w-5 h-5 text-navy" />;
      case 'budaya-dan-tradisi': return <Landmark className="w-5 h-5 text-forest" />;
      case 'keluarga-dan-kekerabatan': return <HeartHandshake className="w-5 h-5 text-rose-600" />;
      default: return <MessageCircle className="w-5 h-5 text-stone-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-600 uppercase tracking-wider mb-2">
          <Layers className="w-3.5 h-3.5" />
          <span>Struktur Leksikal</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy tracking-tight mb-3">
          Kategori Kosakata Madura
        </h1>
        <p className="text-sm sm:text-base text-madura-muted leading-relaxed">
          Temukan dan pelajari kosakata berdasarkan kelompok tata bahasa, sebutan kekerabatan, istilah budaya, serta percakapan sehari-hari.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            to={`/kategori/${cat.slug}`}
            className="p-6 rounded-3xl bg-white border border-madura-border hover:border-gold/60 shadow-subtle hover:shadow-elevated transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-ivory-warm border border-madura-border flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                {getIcon(cat.slug)}
              </div>
              <h3 className="font-serif font-bold text-xl text-navy group-hover:text-forest transition-colors mb-2">
                {cat.name}
              </h3>
              <p className="text-xs sm:text-sm text-madura-muted leading-relaxed">
                {cat.desc}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-madura-border flex items-center justify-between text-xs">
              <span className="font-bold text-forest">
                {cat.wordCount} kosakata
              </span>
              <span className="font-semibold text-navy flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Jelajahi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
