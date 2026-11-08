import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookA, 
  Layers, 
  MessageSquare, 
  CheckCircle2, 
  Search, 
  TrendingUp, 
  UploadCloud, 
  Plus, 
  ShieldCheck,
  Activity
} from 'lucide-react';
import { dictionaryService } from '../../services/dictionaryService';

export const AdminDashboardPage: React.FC = () => {
  const stats = dictionaryService.getAdminStats();

  const speechLabels: Record<string, string> = {
    netral: 'Netral / Umum',
    enja_iya: "Enja'-Iya (Lomrah)",
    engghi_enten: 'Engghi-Enten (Menengah)',
    engghi_bhunten: 'Engghi-Bhunten (Alos)'
  };

  return (
    <div className="space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-navy">
            Dashboard Pengelola
          </h1>
          <p className="text-xs sm:text-sm text-madura-muted">
            Ringkasan data, analitik pencarian, dan manajemen kosakata Kamus Madura Digital.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/kamus"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy text-white text-xs font-semibold hover:bg-navy-900 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 text-gold-400" />
            <span>Tambah Kosakata</span>
          </Link>

          <Link
            to="/admin/import"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-madura-border bg-white text-navy text-xs font-semibold hover:bg-ivory-warm transition-colors shadow-xs"
          >
            <UploadCloud className="w-4 h-4 text-forest" />
            <span>Import Data</span>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-madura-border shadow-subtle space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-madura-muted">Total Kosakata</span>
            <div className="w-8 h-8 rounded-lg bg-navy/10 text-navy flex items-center justify-center">
              <BookA className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-navy">{stats.totalWords.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>100% Data Asli Terintegrasi</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-madura-border shadow-subtle space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-madura-muted">Total Kategori</span>
            <div className="w-8 h-8 rounded-lg bg-gold/10 text-gold-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-navy">{stats.totalCategories}</div>
          <div className="text-[11px] text-madura-muted">
            Kelas kata & tematik budaya
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-madura-border shadow-subtle space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-madura-muted">Menunggu Review</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-amber-600">{stats.totalPendingContributions}</div>
          <div className="text-[11px] text-madura-muted">
            Usulan komunitas baru
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-madura-border shadow-subtle space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-madura-muted">Kontribusi Disetujui</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-emerald-700">{stats.totalApprovedContributions}</div>
          <div className="text-[11px] text-emerald-600 font-semibold">
            Dipublikasikan ke kamus
          </div>
        </div>
      </div>

      {/* Grid: Speech Levels Breakdown & Top Searches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Speech Level Breakdown */}
        <div className="p-6 rounded-3xl bg-white border border-madura-border shadow-subtle space-y-5">
          <div className="flex items-center justify-between border-b border-madura-border pb-3">
            <h3 className="font-serif font-bold text-navy text-lg">
              Distribusi Tingkat Tutur (Ondhagghâ Bhâsa)
            </h3>
            <ShieldCheck className="w-4 h-4 text-forest" />
          </div>

          <div className="space-y-4">
            {Object.entries(stats.speechLevelBreakdown).map(([lvl, count]) => {
              const pct = ((count / stats.totalWords) * 100).toFixed(1);
              return (
                <div key={lvl} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-navy font-semibold">{speechLabels[lvl] || lvl}</span>
                    <span className="text-madura-muted font-mono">{count.toLocaleString()} kata ({pct}%)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-stone-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        lvl === 'engghi_bhunten' ? 'bg-gold' : lvl === 'engghi_enten' ? 'bg-forest' : lvl === 'enja_iya' ? 'bg-amber-500' : 'bg-navy'
                      }`}
                      style={{ width: `${Math.max(Number(pct), 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Searched Queries */}
        <div className="p-6 rounded-3xl bg-white border border-madura-border shadow-subtle space-y-5">
          <div className="flex items-center justify-between border-b border-madura-border pb-3">
            <h3 className="font-serif font-bold text-navy text-lg">
              Kata Kunci Paling Banyak Dicari
            </h3>
            <Search className="w-4 h-4 text-gold-500" />
          </div>

          <div className="divide-y divide-madura-border/60">
            {stats.topSearches.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-5 font-mono text-stone-400 font-bold">{idx + 1}.</span>
                  <span className="font-serif font-bold text-navy text-sm">{item.query}</span>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 font-mono font-semibold">
                  {item.count} pencarian
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
