# Source Code & Repository Audit: Kamus Madura

**Audit Date:** November 8, 2026  
**Auditor:** Full Stack Lead Engineer  
**Source Repository:** `https://github.com/willnode/madura`  
**License:** ISC License  
**Original Author:** Wildan Mubarok (2019)  

---

## 1. Executive Summary

Proyek awal `willnode/madura` adalah aplikasi web berbasis *client-side static HTML/JS* sederhana yang mengimplementasikan pencarian kamus dua arah (Madura ↔ Indonesia) menggunakan file JSON statis (`kamus.json`). Meskipun fungsional sebagai prototipe, arsitektur lama memiliki keterbatasan skalabilitas, tidak memiliki database terstruktur, tidak ada backend/autentikasi, tidak memiliki manajemen data (CRUD), dan UI/UX masih sangat mendasar tanpa dukungan aksesibilitas atau standar desain modern.

PRD menginstruksikan transformasi menyeluruh menjadi **Kamus Madura Digital**, sebuah platform bahasa dan budaya Madura modern dengan teknologi React, TypeScript, Tailwind CSS, TanStack Query, dan Supabase.

---

## 2. File & Component Breakdown

| File | Size | Lines | Purpose & Technical Evaluation |
| :--- | :--- | :--- | :--- |
| `index.html` | 1.0 KB | 29 | Halaman HTML statis sederhana dengan textarea input, radio button mode, dan elemen div `#result`. Memuat jQuery dari CDN. |
| `main.js` | 3.3 KB | 134 | Logika pencarian utama. Memuat `kamus.json` via `$.getJSON`, memetakan kamus ke objek JS memory (`m2i`, `i2m`), dan menyediakan heuristik imbuhan (*affix replacement*). |
| `util.js` | 8.3 KB | 104 | Pemetaan tabel diakritik unicode (`defaultDiacriticsRemovalMap`) untuk penghapusan aksen. |
| `main.css` | 418 B | 32 | Styling minimalis non-responsif, layout dasar box-model. |
| `scrap.py` | 919 B | 40 | Script web scraper BeautifulSoup4 untuk mengambil kosakata dari situs `http://kamus.madura.web.id/`. |
| `package.json` | 280 B | 15 | Konfigurasi npm minimal dengan 1 dependency (`@types/jquery`). |
| `kamus.json` | 254 KB | 9,789 | Dataset kamus dalam format array of arrays: `[tingkat, indo, madura]`. |

---

## 3. Linguistic & Algorithmic Heuristics in Legacy Code

### 3.1 Affix Rules (Morfologi Dasar)
Kode lama menerapkan deteksi awalan (*prefix*) dan akhiran (*postfix*) sederhana untuk menerjemahkan kata berimbuhan:

- **Awalan (Madura → Indonesia):**
  - `a-` ↔ `ber-` (contoh: *ajhâlân* ↔ *berjalan*)
  - `ta-` ↔ `ter-` (contoh: *tabentus* ↔ *terbentur*)
  - `ma-` ↔ `memper-` (contoh: *maraddhin* ↔ *mempercantik*)
  - `ka-` ↔ `ke-` (contoh: *katondu'* ↔ *ketiduran*)
- **Akhiran:**
  - `-na` ↔ `-nya` (contoh: *romana* ↔ *rumahnya*)

*Rekomendasi Modern:* Tetap mempertahankan aturan heuristik morfologi ini sebagai *fallback suggestion engine* pada pencarian kata kerja dan kata keadaan.

### 3.2 Diacritics Handling
Bahasa Madura memiliki ortografi khas yang menggunakan:
- Aksara vokal beraksen `â` (/ɤ/ atau /ɔ/) dan `è` (/ɛ/).
- Glottal stop `'` (hamzah).
- Konsonan terhembus (*aspirated*): `bh`, `dh`, `gh`, `jh`, `th`.

Algoritma lama di `util.js` menghapus diakritik untuk pencarian bebas aksen. Arsitektur baru harus menerapkan **Dual-Token Normalization**: menyimpan lemma asli beraksen untuk ketepatan leksikal dan token ternormalisasi (`a-z`) untuk pencarian instan dan fuzzy.

---

## 4. License and Legal Audit

- **Lisensi Kode:** ISC License (permisif, mengizinkan penggunaan, modifikasi, dan distribusi ulang dengan atribusi).
- **Atribusi Hak Cipta Asli:** `(C) Wildan Mubarok 2019`.
- **Sumber Data Awal:** Scraped dari `kamus.madura.web.id`.
- **Kepatuhan:** Seluruh data asli dipertahankan tanpa manipulasi arti kata otomatis, dan atribusi sumber awal dicantumkan dalam dokumentasi serta halaman "Tentang" dan referensi aplikasi.

---

## 5. Architectural Gap Analysis

| Aspek | Legacy Prototype | Target PRD (Kamus Madura Digital) |
| :--- | :--- | :--- |
| **Framework** | Plain HTML/jQuery | React + Vite + TypeScript (Strict) |
| **Styling** | Plain CSS (32 baris) | Tailwind CSS + Custom Design Tokens |
| **State Management** | Global JS variables | TanStack Query + Zustand / React Hooks |
| **Database** | File statis `kamus.json` (memory) | Supabase PostgreSQL + RLS + Full-Text Search |
| **Search Engine** | Array filtering linear | Normalisasi diakritik + Fuzzy search + Debounce + Speech level filtering |
| **Fitur Pengguna** | Tidak ada | Riwayat pencarian, Kosakata Favorit, Kontribusi kosakata |
| **Fitur Admin** | Tidak ada | Dashboard analitik, CRUD Kosakata, Bulk Import/Export, Moderasi Kontribusi |
| **Tingkat Tutur** | Tag teks mentah (kebanyakan kosong) | 3 Tingkat Tutur terstruktur (Enja'-Iya, Engghi-Enten, Engghi-Bhunten) |
| **Aksesibilitas** | Tidak ada | Standar WCAG 2.1 AA, keyboard shortcut (`/`), responsif mobile-first |
