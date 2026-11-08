import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Globe, BookOpen, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-madura-border bg-white text-madura-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-navy flex items-center justify-center text-gold font-serif font-black text-lg shadow-sm">
                KM
              </div>
              <div>
                <span className="font-serif font-bold text-lg text-navy tracking-tight">Kamus Madura Digital</span>
                <span className="block text-[10px] font-semibold text-gold-600 tracking-widest uppercase">Digital Madurese Language Platform</span>
              </div>
            </div>
            <p className="text-sm text-madura-muted max-w-md leading-relaxed">
              Platform kamus digital interaktif untuk mendokumentasikan, mencari, dan melestarikan kosakata Bahasa Madura. Dilengkapi dukungan tiga tingkat tutur (Enja'-Iya, Engghi-Enten, Engghi-Bhunten) dan ortografi baku beraksen.
            </p>
            <div className="flex items-center gap-2 text-xs text-madura-muted pt-2">
              <Globe className="w-4 h-4 text-forest" />
              <span>Inisiatif Pelestarian Bahasa & Budaya Nusantara</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-sm text-navy mb-3 tracking-wide">Navigasi Utama</h4>
            <ul className="space-y-2 text-sm text-madura-muted">
              <li>
                <Link to="/kamus" className="hover:text-forest transition-colors">Pencarian Kamus</Link>
              </li>
              <li>
                <Link to="/kategori" className="hover:text-forest transition-colors">Daftar Kategori Kata</Link>
              </li>
              <li>
                <Link to="/belajar" className="hover:text-forest transition-colors">Pusat Belajar & Tata Bahasa</Link>
              </li>
              <li>
                <Link to="/kata-hari-ini" className="hover:text-forest transition-colors">Kosakata Hari Ini</Link>
              </li>
              <li>
                <Link to="/kontribusi" className="hover:text-forest transition-colors">Kirim Usulan Kata</Link>
              </li>
            </ul>
          </div>

          {/* Heritage & References */}
          <div>
            <h4 className="font-serif font-bold text-sm text-navy mb-3 tracking-wide">Pustaka & Referensi</h4>
            <ul className="space-y-2 text-sm text-madura-muted">
              <li>
                <Link to="/tentang" className="hover:text-forest transition-colors">Tentang Platform</Link>
              </li>
              <li>
                <a 
                  href="https://github.com/willnode/madura" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-forest transition-colors flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-gold-500" />
                  <span>Dataset Proyek Terbuka</span>
                </a>
              </li>
              <li>
                <Link to="/admin" className="hover:text-forest transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-stone-400" />
                  <span>Dashboard Admin</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-madura-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-madura-muted">
          <div>
            &copy; {new Date().getFullYear()} Kamus Madura Digital. Didedikasikan untuk kelestarian bahasa & sastra Madura.
          </div>
          <div className="flex items-center gap-1">
            <span>Dibangun dengan</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 mx-0.5" />
            <span>untuk generasi penerus bangsa.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
