import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BookA, 
  Menu, 
  X, 
  Bookmark, 
  Sparkles, 
  Layers, 
  GraduationCap, 
  PlusCircle, 
  ShieldCheck, 
  History,
  User
} from 'lucide-react';
import { dictionaryService } from '../../services/dictionaryService';
import { useAuth } from '../../app/providers/AuthProvider';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const location = useLocation();
  const { user, profile } = useAuth();

  useEffect(() => {
    const updateFavs = () => {
      setFavCount(dictionaryService.getFavorites().length);
    };
    updateFavs();
    window.addEventListener('favorites-updated', updateFavs);
    return () => window.removeEventListener('favorites-updated', updateFavs);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Kamus', href: '/kamus', icon: BookA },
    { label: 'Kategori', href: '/kategori', icon: Layers },
    { label: 'Belajar', href: '/belajar', icon: GraduationCap },
    { label: 'Kata Hari Ini', href: '/kata-hari-ini', icon: Sparkles },
    { label: 'Riwayat', href: '/riwayat', icon: History },
  ];

  const isActive = (path: string) => {
    if (path === '/kamus' && location.pathname.startsWith('/kamus')) return true;
    if (path === '/kategori' && location.pathname.startsWith('/kategori')) return true;
    if (path === '/belajar' && location.pathname.startsWith('/belajar')) return true;
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-madura-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center text-gold shadow-sm group-hover:bg-forest transition-colors">
              <span className="font-serif font-black text-xl tracking-tighter">KM</span>
            </div>
            <div>
              <div className="font-serif font-bold text-lg text-navy tracking-tight group-hover:text-forest transition-colors leading-none">
                Kamus Madura
              </div>
              <div className="text-[10px] font-semibold text-gold-600 tracking-widest uppercase mt-0.5">
                Digital Platform
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-ivory-warm text-navy shadow-xs font-bold'
                      : 'text-madura-muted hover:text-navy hover:bg-stone-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-forest' : 'text-stone-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions: Favorites, Contribute, Admin */}
          <div className="hidden sm:flex items-center gap-2.5">
            <Link
              to="/favorit"
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                location.pathname === '/favorit'
                  ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
                  : 'border-madura-border text-navy hover:bg-ivory-warm'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Favorit</span>
              {favCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold">
                  {favCount}
                </span>
              )}
            </Link>

            <Link
              to="/kontribusi"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                location.pathname === '/kontribusi'
                  ? 'bg-forest text-white'
                  : 'bg-forest/10 text-forest hover:bg-forest/20'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Usul Kata</span>
            </Link>

            <Link
              to="/admin"
              className="p-2 rounded-xl border border-madura-border text-stone-400 hover:text-navy hover:bg-ivory-warm transition-colors"
              title="Dashboard Pengelola"
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>

            {user ? (
              <Link
                to="/profil"
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl bg-ivory-warm border border-madura-border text-xs font-semibold text-navy hover:bg-stone-100 transition-colors"
                title="Profil Saya"
              >
                <div className="w-6 h-6 rounded-lg bg-navy text-gold flex items-center justify-center font-serif font-black text-xs">
                  {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="truncate max-w-[90px]">{profile?.full_name || 'Akun'}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-navy text-white hover:bg-navy-900 transition-colors shadow-xs"
              >
                <User className="w-3.5 h-3.5 text-gold-400" />
                <span>Masuk</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              to="/favorit"
              className="p-2 rounded-xl text-amber-600 bg-amber-50"
              title="Favorit"
            >
              <Bookmark className="w-5 h-5 fill-current" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-navy hover:bg-ivory-warm transition-colors"
              aria-label="Toggle Navigation"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="sm:hidden border-t border-madura-border bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                  active
                    ? 'bg-ivory-warm text-navy font-bold'
                    : 'text-madura-muted hover:text-navy'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-forest' : 'text-stone-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
            <Link
              to="/kontribusi"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-forest text-white"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Usulkan Kosakata Baru</span>
            </Link>
            <Link
              to="/admin"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border border-madura-border text-navy"
            >
              <ShieldCheck className="w-4 h-4 text-stone-400" />
              <span>Dashboard Admin</span>
            </Link>
            {user ? (
              <Link
                to="/profil"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-navy text-white"
              >
                <User className="w-4 h-4 text-gold-400" />
                <span>Profil Akun ({profile?.full_name || 'User'})</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-navy text-white"
              >
                <User className="w-4 h-4 text-gold-400" />
                <span>Masuk Akun</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

