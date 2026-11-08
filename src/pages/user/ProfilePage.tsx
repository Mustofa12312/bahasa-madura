import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Bookmark, History, PlusCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../app/providers/AuthProvider';
import { Button } from '../../components/ui/Button';
import { dictionaryService } from '../../services/dictionaryService';
import { useToast } from '../../components/ui/Toast';

export const ProfilePage: React.FC = () => {
  const { user, profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const favCount = dictionaryService.getFavorites().length;
  const historyCount = dictionaryService.getSearchHistory().length;
  const contribCount = dictionaryService.getContributions().length;

  const handleSignOut = async () => {
    await signOut();
    showToast('Anda telah keluar dari akun.');
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-madura-border shadow-subtle text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-ivory-warm border border-madura-border flex items-center justify-center text-navy mx-auto">
            <User className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-navy">
            Profil Pengguna
          </h2>
          <p className="text-xs text-madura-muted">
            Anda belum masuk ke akun. Masuk atau daftar akun untuk menyinkronkan data Anda.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
              Masuk
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
              Daftar Akun
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-madura-border shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-navy text-gold flex items-center justify-center font-serif font-black text-2xl shadow-sm">
            {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="font-serif font-bold text-2xl text-navy">
              {profile?.full_name || 'Pengguna Kamus'}
            </h1>
            <p className="text-xs text-madura-muted font-mono">{user.email}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-700 capitalize">
              <ShieldCheck className="w-3.5 h-3.5 text-forest" />
              <span>Role: {profile?.role || 'user'}</span>
            </div>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={handleSignOut} className="text-rose-600 border-rose-200 hover:bg-rose-50 self-start sm:self-auto">
          <LogOut className="w-3.5 h-3.5 mr-1.5" />
          <span>Keluar Akun</span>
        </Button>
      </div>

      {/* User Statistics / Activity Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/favorit"
          className="p-5 rounded-2xl bg-white border border-madura-border hover:border-gold/60 shadow-subtle hover:shadow-elevated transition-all flex items-center justify-between"
        >
          <div>
            <span className="text-xs text-madura-muted">Kosakata Favorit</span>
            <div className="text-2xl font-serif font-bold text-navy mt-1">{favCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Bookmark className="w-5 h-5 fill-current" />
          </div>
        </Link>

        <Link
          to="/riwayat"
          className="p-5 rounded-2xl bg-white border border-madura-border hover:border-navy/60 shadow-subtle hover:shadow-elevated transition-all flex items-center justify-between"
        >
          <div>
            <span className="text-xs text-madura-muted">Riwayat Pencarian</span>
            <div className="text-2xl font-serif font-bold text-navy mt-1">{historyCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy flex items-center justify-center">
            <History className="w-5 h-5" />
          </div>
        </Link>

        <Link
          to="/kontribusi"
          className="p-5 rounded-2xl bg-white border border-madura-border hover:border-forest/60 shadow-subtle hover:shadow-elevated transition-all flex items-center justify-between"
        >
          <div>
            <span className="text-xs text-madura-muted">Usulan Kata</span>
            <div className="text-2xl font-serif font-bold text-navy mt-1">{contribCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center">
            <PlusCircle className="w-5 h-5" />
          </div>
        </Link>
      </div>

      {isAdmin && (
        <div className="p-6 rounded-3xl bg-navy text-ivory flex items-center justify-between shadow-elevated">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-white">Panel Pengelola (Admin)</h3>
            <p className="text-xs text-stone-300">
              Anda memiliki hak akses untuk mengelola kosakata, memoderasi usulan, dan mengimpor data.
            </p>
          </div>
          <Button variant="gold" size="sm" onClick={() => navigate('/admin')}>
            Buka Admin Panel
          </Button>
        </div>
      )}
    </div>
  );
};

