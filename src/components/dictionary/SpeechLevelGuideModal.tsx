import React from 'react';
import { Modal } from '../ui/Modal';
import { ShieldCheck, MessageCircle, Sparkles, BookOpen } from 'lucide-react';
import { SpeechLevelBadge } from './SpeechLevelBadge';

export interface SpeechLevelGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpeechLevelGuideModal: React.FC<SpeechLevelGuideModalProps> = ({ isOpen, onClose }) => {
  const comparisonExamples = [
    {
      concept: 'Kamu / Anda',
      enja_iya: "abâ'na / bâ'na / kakèh",
      engghi_enten: 'dhika / sampèyan',
      engghi_bhunten: 'panjhennengngan / ajunan',
    },
    {
      concept: 'Saya / Aku',
      enja_iya: "engko'",
      engghi_enten: 'kula',
      engghi_bhunten: 'abdhina / bula',
    },
    {
      concept: 'Makan',
      enja_iya: 'ngakan',
      engghi_enten: 'ngakan',
      engghi_bhunten: 'neddha / dhâ\'âr',
    },
    {
      concept: 'Tidur',
      enja_iya: 'tèdung',
      engghi_enten: 'tèdung',
      engghi_bhunten: 'kèlem / sarè',
    },
    {
      concept: 'Rumah',
      enja_iya: 'roma',
      engghi_enten: 'roma',
      engghi_bhunten: 'dhalem',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="xl"
      title={
        <div className="flex items-center gap-2 text-navy">
          <BookOpen className="w-5 h-5 text-gold-500" />
          <span>Panduan Tingkatan Bahasa Madura (Ondhagghâ Bhâsa)</span>
        </div>
      }
    >
      <div className="space-y-6 text-sm">
        <p className="text-madura-muted leading-relaxed">
          Dalam sosiolinguistik Madura, variasi bahasa (*ondhagghâ bhâsa*) digunakan untuk mencerminkan etika pergaulan dan penghormatan kepada lawan bicara.
        </p>

        {/* 3 Speech Levels Detail */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Enja'-Iya */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-base text-amber-950">Enja'-Iya</span>
              <MessageCircle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-[11px] font-semibold text-amber-800">
              Lomrah / Kasar / Akrab
            </div>
            <p className="text-xs text-amber-900/80 leading-relaxed">
              Bahasa harian tanpa jarak sosial. Digunakan untuk berbicara dengan teman sebaya, sahabat karib, atau kepada orang yang usianya lebih muda.
            </p>
          </div>

          {/* Engghi-Enten */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-base text-emerald-950">Engghi-Enten</span>
              <Sparkles className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-[11px] font-semibold text-emerald-800">
              Tengngaan (Menengah)
            </div>
            <p className="text-xs text-emerald-900/80 leading-relaxed">
              Bahasa madya / menengah yang sopan. Digunakan terhadap orang yang belum terlalu akrab, kenalan baru, atau relasi sejajar secara formal.
            </p>
          </div>

          {/* Engghi-Bhunten */}
          <div className="p-4 rounded-2xl bg-navy-50/70 border border-gold/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-base text-navy">Engghi-Bhunten</span>
              <ShieldCheck className="w-4 h-4 text-gold-600" />
            </div>
            <div className="text-[11px] font-semibold text-gold-700">
              Alos / Alos Tengghi (Hormat)
            </div>
            <p className="text-xs text-navy/80 leading-relaxed">
              Tingkatan penghormatan tertinggi (*krama inggil*). Ditujukan khusus saat bertutur kata kepada orang tua, mertua, kiai, guru, atau tokoh adat.
            </p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-navy text-base">
            Tabel Contoh Komparasi Tingkat Tutur
          </h4>
          <div className="overflow-x-auto rounded-2xl border border-madura-border bg-white">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 border-b border-madura-border text-navy font-bold">
                <tr>
                  <th className="py-2.5 px-3">Konsep Arti</th>
                  <th className="py-2.5 px-3 text-amber-900">Enja'-Iya (Lomrah)</th>
                  <th className="py-2.5 px-3 text-emerald-900">Engghi-Enten</th>
                  <th className="py-2.5 px-3 text-navy">Engghi-Bhunten (Alos)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-madura-border/60">
                {comparisonExamples.map((ex, i) => (
                  <tr key={i} className="hover:bg-ivory-warm/40">
                    <td className="py-2.5 px-3 font-semibold text-navy">{ex.concept}</td>
                    <td className="py-2.5 px-3 font-serif font-medium text-amber-950">{ex.enja_iya}</td>
                    <td className="py-2.5 px-3 font-serif font-medium text-emerald-950">{ex.engghi_enten}</td>
                    <td className="py-2.5 px-3 font-serif font-bold text-navy">{ex.engghi_bhunten}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-ivory-warm border border-madura-border text-xs text-madura-muted">
          <strong>Catatan Linguistik:</strong> Tidak semua kata dalam bahasa Madura memiliki padanan di ketiga tingkatan bahasa. Kosakata umum yang tidak memiliki bentuk khusus digolongkan sebagai <em>Netral</em>.
        </div>
      </div>
    </Modal>
  );
};
