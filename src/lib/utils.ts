import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { SpeechLevel } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes Madurese text for search indexing and matching:
 * Converts diacritic vowels 'â' -> 'a', 'è' -> 'e', normalizes apostrophes, and strips non-alphanumeric punctuation.
 */
export function normalizeMadurese(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/â/g, 'a')
    .replace(/è/g, 'e')
    .replace(/[’`]/g, "'")
    .replace(/[^a-z0-9'\s-]/g, '')
    .trim();
}

export function slugify(text: string): string {
  const norm = normalizeMadurese(text);
  return norm.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'kata';
}

export interface SpeechLevelMeta {
  code: SpeechLevel;
  name: string;
  traditionalName: string;
  badgeLabel: string;
  badgeClass: string;
  borderClass: string;
  description: string;
  targetAudience: string;
}

export function getSpeechLevelMeta(level: SpeechLevel): SpeechLevelMeta {
  switch (level) {
    case 'enja_iya':
      return {
        code: 'enja_iya',
        name: "Enja'-Iya",
        traditionalName: "Lomrah / Kasar",
        badgeLabel: "Enja'-Iya (Lomrah)",
        badgeClass: "bg-amber-100 text-amber-900 border-amber-300",
        borderClass: "border-amber-400",
        description: "Tingkatan bahasa sehari-hari yang digunakan saat berbicara dengan teman sebaya, anak yang lebih muda, atau dalam suasana akrab dan santai.",
        targetAudience: "Teman sebaya, orang lebih muda, percakapan santai"
      };
    case 'engghi_enten':
      return {
        code: 'engghi_enten',
        name: "Engghi-Enten",
        traditionalName: "Tengngaan (Menengah)",
        badgeLabel: "Engghi-Enten (Menengah)",
        badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300",
        borderClass: "border-emerald-400",
        description: "Tingkat tutur menengah / madya. Digunakan untuk berbicara sopan dengan orang yang sebaya namun belum akrab atau dalam situasi formal seimbang.",
        targetAudience: "Teman baru, rekan kerja setara, percakapan semi-formal"
      };
    case 'engghi_bhunten':
      return {
        code: 'engghi_bhunten',
        name: "Engghi-Bhunten",
        traditionalName: "Alos / Alos Tengghi",
        badgeLabel: "Engghi-Bhunten (Alos)",
        badgeClass: "bg-navy-100 text-navy-900 border-gold/60 font-semibold",
        borderClass: "border-gold",
        description: "Tingkat tutur penghormatan tertinggi (Krama Inggil). Digunakan saat berbicara kepada orang tua, guru, kiai, tokoh masyarakat, atau orang yang sangat dihormati.",
        targetAudience: "Orang tua, kiai, guru, tokoh adat, situasi sangat terhormat"
      };
    case 'netral':
    default:
      return {
        code: 'netral',
        name: "Kosakata Umum",
        traditionalName: "Netral",
        badgeLabel: "Netral",
        badgeClass: "bg-stone-100 text-stone-700 border-stone-300",
        borderClass: "border-stone-300",
        description: "Kosakata dasar yang berlaku umum di semua tingkat tutur dan percakapan harian.",
        targetAudience: "Semua situasi umum"
      };
  }
}

export function formatDate(dateString: string | number): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(d);
  } catch {
    return String(dateString);
  }
}

export function formatRelativeTime(dateString: string | number): string {
  try {
    const now = Date.now();
    const d = new Date(dateString).getTime();
    const diffSec = Math.floor((now - d) / 1000);

    if (diffSec < 60) return 'Baru saja';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} menit lalu`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} jam lalu`;
    if (diffSec < 2592000) return `${Math.floor(diffSec / 86400)} hari lalu`;
    return formatDate(dateString);
  } catch {
    return String(dateString);
  }
}

