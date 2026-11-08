import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, Heart, Award, Sparkles, ExternalLink } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-50 border border-navy-100 text-navy-800 text-xs font-semibold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5 text-gold-500" />
          <span>Tentang Platform</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-navy tracking-tight">
          Kamus Madura Digital
        </h1>
        <p className="text-base text-madura-muted leading-relaxed">
          Menjembatani warisan luhur bahasa daerah Madura ke era digital dengan teknologi modern dan akurasi ortografis terpercaya.
        </p>
      </div>

      {/* Main Philosophy Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-madura-border shadow-subtle space-y-8">
        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-bold text-navy">
            Visi & Latar Belakang
          </h2>
          <p className="text-sm sm:text-base text-madura-text/90 leading-relaxed">
            Bahasa Madura adalah salah satu bahasa daerah terbesar di Indonesia dengan penutur lebih dari belasan juta jiwa yang tersebar di Pulau Madura, kawasan Tapal Kuda Jawa Timur, hingga penjuru kepulauan Nusantara.
          </p>
          <p className="text-sm sm:text-base text-madura-text/90 leading-relaxed">
            Kamus Madura Digital hadir sebagai inisiatif modern untuk mendokumentasikan, mencari, dan memelihara perbendaharaan kosakata Bahasa Madura. Platform ini dirancang tidak hanya sebagai alat penerjemah kata per kata, melainkan juga wadah edukasi budaya dan tata krama berbahasa (*ondhagghâ bhâsa*).
          </p>
        </div>

        {/* Heritage & Attribution */}
        <div className="p-6 rounded-2xl bg-ivory-warm border border-madura-border space-y-3">
          <div className="flex items-center gap-2 font-bold text-navy text-sm">
            <Award className="w-4 h-4 text-gold-600" />
            <span>Penghormatan Sumber Terbuka (Open-Source Heritage)</span>
          </div>
          <p className="text-xs sm:text-sm text-madura-muted leading-relaxed">
            Proyek ini bertransformasi dari pondasi database dan kode sumber terbuka yang diinisiasi oleh <strong>Wildan Mubarok (2019)</strong> melalui repositori publik:
          </p>
          <a
            href="https://github.com/willnode/madura"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:underline"
          >
            <span>github.com/willnode/madura</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <p className="text-xs text-madura-muted leading-relaxed pt-1">
            Seluruh 9.789 entri leksikal awal dipertahankan secara utuh tanpa pengurangan record, lalu ditransformasikan ke dalam skema basis data relasional modern dengan pengayaan kategori, indeks bebas aksen, dan sistem moderasi kontribusi.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-madura-border">
          <div className="space-y-1.5">
            <h4 className="font-serif font-bold text-navy text-sm">Pencarian Cerdas</h4>
            <p className="text-xs text-madura-muted">
              Pencarian dua arah bebas aksen diakritik dengan toleransi ejaan fonetis.
            </p>
          </div>
          <div className="space-y-1.5">
            <h4 className="font-serif font-bold text-navy text-sm">3 Tingkat Tutur</h4>
            <p className="text-xs text-madura-muted">
              Dukungan klasifikasi Enja'-Iya, Engghi-Enten, dan Engghi-Bhunten.
            </p>
          </div>
          <div className="space-y-1.5">
            <h4 className="font-serif font-bold text-navy text-sm">Sistem Kontribusi</h4>
            <p className="text-xs text-madura-muted">
              Wadah terbuka bagi penutur dan budayawan untuk mengusulkan kosakata baru.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

