import React, { useState } from 'react';
import { 
  MessageSquare, 
  Check, 
  X, 
  Clock, 
  CheckCircle2, 
  XCircle,
  ShieldCheck 
} from 'lucide-react';
import { dictionaryService } from '../../services/dictionaryService';
import { Contribution } from '../../types';
import { SpeechLevelBadge } from '../../components/dictionary/SpeechLevelBadge';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { formatDate } from '../../lib/utils';
import { EmptyState } from '../../components/common/EmptyState';

export const ContributionManagementPage: React.FC = () => {
  const { showToast } = useToast();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [reviewNote, setReviewNote] = useState<Record<string, string>>({});
  const [refreshKey, setRefreshKey] = useState(0);

  const contributions = dictionaryService.getContributions();

  const filtered = contributions.filter(c => filter === 'all' || c.status === filter);

  const handleApprove = (item: Contribution) => {
    const note = reviewNote[item.id] || 'Disetujui dan ditambahkan ke database publik.';
    dictionaryService.updateContributionStatus(item.id, 'approved', note);
    showToast(`Usulan "${item.proposed_word}" telah disetujui & otomatis masuk ke kamus!`);
    setRefreshKey(k => k + 1);
  };

  const handleReject = (item: Contribution) => {
    const note = reviewNote[item.id] || 'Belum memenuhi kaidah ortografi / duplikasi.';
    dictionaryService.updateContributionStatus(item.id, 'rejected', note);
    showToast(`Usulan "${item.proposed_word}" ditolak.`);
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-navy">
            Moderasi Usulan Kosakata
          </h1>
          <p className="text-xs text-madura-muted">
            Tinjau, verifikasi, dan publikasikan kontribusi kosakata dari masyarakat.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-madura-border text-xs">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition-all ${
                filter === tab
                  ? 'bg-navy text-white shadow-xs'
                  : 'text-madura-muted hover:text-navy hover:bg-stone-50'
              }`}
            >
              {tab === 'all' ? 'Semua' : tab === 'pending' ? 'Menunggu' : tab === 'approved' ? 'Disetujui' : 'Ditolak'}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<MessageSquareCheck className="w-7 h-7 text-stone-400" />}
          title="Tidak Ada Usulan"
          description="Tidak ada usulan kosakata pada status ini."
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-white border border-madura-border shadow-subtle space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-serif font-bold text-2xl text-navy">
                      {item.proposed_word}
                    </h3>
                    <SpeechLevelBadge level={item.speech_level} />
                  </div>
                  <p className="text-sm font-medium text-forest mt-1">
                    Arti: {item.proposed_translation}
                  </p>
                </div>

                <span className="text-[11px] text-madura-muted font-mono">
                  Diajukan: {formatDate(item.submitted_at)}
                </span>
              </div>

              {item.example_madura && (
                <div className="p-3 rounded-xl bg-ivory-warm text-xs space-y-1">
                  <span className="font-semibold text-navy">Contoh Kalimat:</span>
                  <p className="italic text-stone-700">"{item.example_madura}"</p>
                  {item.example_indo && (
                    <p className="text-madura-muted">Artinya: {item.example_indo}</p>
                  )}
                </div>
              )}

              {item.notes && (
                <p className="text-xs text-stone-500">
                  <strong>Catatan Pengusul:</strong> {item.notes}
                </p>
              )}

              {item.status === 'pending' ? (
                <div className="pt-3 border-t border-madura-border/60 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <input
                    type="text"
                    placeholder="Tulis catatan peninjauan (opsional)..."
                    value={reviewNote[item.id] || ''}
                    onChange={(e) => setReviewNote({ ...reviewNote, [item.id]: e.target.value })}
                    className="w-full sm:w-80 px-3 py-1.5 rounded-xl border border-madura-border bg-stone-50 text-xs focus:outline-none"
                  />

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReject(item)}
                      className="text-rose-600 border-rose-200 hover:bg-rose-50"
                    >
                      <X className="w-3.5 h-3.5 mr-1" />
                      <span>Tolak</span>
                    </Button>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApprove(item)}
                      className="bg-emerald-700 hover:bg-emerald-800"
                    >
                      <Check className="w-3.5 h-3.5 mr-1" />
                      <span>Setujui & Publikasikan</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="pt-3 border-t border-madura-border/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    {item.status === 'approved' ? (
                      <span className="font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Telah disetujui & ditambahkan ke kamus</span>
                      </span>
                    ) : (
                      <span className="font-semibold text-rose-700 flex items-center gap-1">
                        <XCircle className="w-4 h-4" />
                        <span>Usulan ditolak</span>
                      </span>
                    )}
                  </div>
                  {item.review_notes && (
                    <span className="text-stone-500 italic">"{item.review_notes}"</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
