import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PlusCircle, ShieldCheck, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { dictionaryService } from '../../services/dictionaryService';
import { SpeechLevel } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { formatDate } from '../../lib/utils';

const contributionSchema = z.object({
  proposed_word: z.string().min(2, 'Kata Madura minimal 2 karakter'),
  proposed_translation: z.string().min(2, 'Terjemahan Indonesia wajib diisi'),
  speech_level: z.enum(['netral', 'enja_iya', 'engghi_enten', 'engghi_bhunten']),
  category_slug: z.string().min(1, 'Pilih kategori kata'),
  example_madura: z.string().optional(),
  example_indo: z.string().optional(),
  notes: z.string().optional()
});

type ContributionFormData = z.infer<typeof contributionSchema>;

export const ContributePage: React.FC = () => {
  const { showToast } = useToast();
  const [contributions, setContributions] = useState(() => dictionaryService.getContributions());
  const categories = dictionaryService.getCategories();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContributionFormData>({
    resolver: zodResolver(contributionSchema),
    defaultValues: {
      speech_level: 'netral',
      category_slug: 'sehari-hari',
    }
  });

  const onSubmit = (data: ContributionFormData) => {
    dictionaryService.submitContribution(data);
    setContributions(dictionaryService.getContributions());
    reset();
    showToast('Usulan kosakata berhasil dikirim! Menunggu verifikasi tim admin.');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Disetujui</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" />
            <span>Ditolak</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            <span>Menunggu Verifikasi</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-forest uppercase tracking-wider mb-1">
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Partisipasi Komunitas</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy">
          Usulkan Kosakata Baru
        </h1>
        <p className="text-sm text-madura-muted leading-relaxed">
          Bantu kami mendokumentasikan dan memperkaya database Kamus Madura Digital. Setiap usulan akan diverifikasi oleh tim kurator sebelum dipublikasikan.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-madura-border shadow-subtle">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <Input
                label="Kosakata Bahasa Madura"
                placeholder="Contoh: ajunan, terbhung, becce'"
                {...register('proposed_word')}
                error={errors.proposed_word?.message}
                helperText="Gunakan huruf beraksen (â, è, ') jika diperlukan"
              />
            </div>
            <div>
              <Input
                label="Arti / Terjemahan Bahasa Indonesia"
                placeholder="Contoh: Anda (hormat), rebana"
                {...register('proposed_translation')}
                error={errors.proposed_translation?.message}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-navy-800 tracking-wide uppercase">
                Tingkatan Bahasa (Tingkat Tutur)
              </label>
              <select
                {...register('speech_level')}
                className="w-full rounded-xl border border-madura-border bg-white px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-navy/10"
              >
                <option value="netral">Kosakata Umum (Netral)</option>
                <option value="enja_iya">Enja'-Iya (Lomrah / Kasar / Akrab)</option>
                <option value="engghi_enten">Engghi-Enten (Tengngaan / Menengah)</option>
                <option value="engghi_bhunten">Engghi-Bhunten (Alos / Hormat Tinggi)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-navy-800 tracking-wide uppercase">
                Kategori Kata
              </label>
              <select
                {...register('category_slug')}
                className="w-full rounded-xl border border-madura-border bg-white px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-navy/10"
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-madura-border/60">
            <h4 className="text-xs font-bold text-navy uppercase tracking-wider">
              Contoh Penggunaan Kalimat (Opsional)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <Input
                  label="Kalimat Bahasa Madura"
                  placeholder="Contoh: Panika kasokan ajunan."
                  {...register('example_madura')}
                />
              </div>
              <div>
                <Input
                  label="Terjemahan Kalimat Bahasa Indonesia"
                  placeholder="Contoh: Ini adalah kehendak Anda."
                  {...register('example_indo')}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-navy-800 tracking-wide uppercase">
              Catatan Dialek / Sumber Referensi (Opsional)
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              placeholder="Contoh: Kosakata khas dialek Sumenep timur / dialek Bangkalan..."
              className="w-full rounded-xl border border-madura-border bg-white px-4 py-2.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-navy/10 placeholder:text-madura-muted/70"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-madura-border">
            <div className="flex items-center gap-1.5 text-xs text-madura-muted">
              <ShieldCheck className="w-4 h-4 text-forest" />
              <span>Verifikasi editorial terjaga</span>
            </div>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              <span>Kirim Usulan Kosakata</span>
            </Button>
          </div>
        </form>
      </div>

      {/* Contribution Submissions History */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl font-bold text-navy">
          Daftar Usulan Kosakata Terkirim
        </h3>

        <div className="bg-white rounded-3xl p-6 border border-madura-border shadow-subtle divide-y divide-madura-border/60">
          {contributions.map((c) => (
            <div key={c.id} className="py-4 space-y-2 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-navy text-lg">{c.proposed_word}</span>
                  <span className="text-xs text-madura-muted">&bull; {c.proposed_translation}</span>
                </div>
                {getStatusBadge(c.status)}
              </div>
              {c.example_madura && (
                <p className="text-xs text-madura-muted italic font-serif">
                  "{c.example_madura}"
                </p>
              )}
              {c.review_notes && (
                <div className="text-xs p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-700">
                  <strong>Catatan Kurator:</strong> {c.review_notes}
                </div>
              )}
              <div className="text-[11px] text-stone-400">
                Diajukan pada: {formatDate(c.submitted_at)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
