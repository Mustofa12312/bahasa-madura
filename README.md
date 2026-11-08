# Kamus Madura Digital (KMD) Platform

<p align="center">
  <strong>Platform Dokumentasi & Kosakata Bahasa Madura Terlengkap Berbasis Web Modern</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue?logo=react" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-5.4-purple?logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-teal?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-Ready-emerald?logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Tests-18%20Passed-brightgreen" alt="Vitest 18 Passed" />
  <img src="https://img.shields.io/badge/Words-9%2C668%20Lemmas-gold" alt="9,668 Lemmas" />
</p>

---

## 📖 Tentang Aplikasi
**Kamus Madura Digital** adalah aplikasi kamus digital modern yang dikembangkan secara profesional untuk merevitalisasi dan melestarikan warisan linguistik bahasa Madura. Aplikasi ini mentransformasikan prototipe legendaris `willnode/madura` (9.789 baris kosakata) menjadi sebuah platform web responsif, cerdas, berkecepatan tinggi, dan offline-ready.

### 🌟 Fitur Unggulan
1. **Pencarian Cerdas Dua Arah**:
   - Madura &rarr; Indonesia (*m2i*) dan Indonesia &rarr; Madura (*i2m*).
   - Toleransi ejaan aksen ortografi baku (`â`, `è`, `'`). Pengguna dapat mencari kata tanpa aksen (misal `roma`, `ba'na`, `engghi`) dan tetap menemukan lema akurat.
   - Saran cerdas afiks morfologis (awalan *a-*, *ta-*, *ma-*, *ka-* dan akhiran *-na*).
2. **Panduan Tingkat Tutur (*Ondhagghâ Bhâsa*)**:
   - Filter dan badge warna khusus untuk tingkatan tutur:
     - 🟠 **Enja'-Iya (Lomrah)**: Bahasa sehari-hari / akrab.
     - 🟢 **Engghi-Enten (Menengah / Tengngaan)**: Bahasa sopan setara.
     - 🔵 **Engghi-Bhunten (Alos / Alos Tengghi)**: Bahasa penghormatan tertinggi (Krama Inggil).
     - ⚪ **Netral**: Kosakata dasar umum.
   - Modal interaktif panduan etika bertutur kata dalam kebudayaan masyarakat Madura.
3. **Katalog Tematik & Dialek Madura**:
   - Eksplorasi berdasarkan kategori tata bahasa (Kata Kerja, Kata Benda, Kata Sifat) serta tematik budaya (Peralatan Rumah, Bagian Tubuh, Alam).
   - Dokumentasi 4 dialek daerah Madura: *Dialek Sumenep*, *Pamekasan*, *Sampang*, dan *Bangkalan*.
4. **Pusat Pembelajaran & Artikel Kebahasaan**:
   - Modul pembelajaran terstruktur mencakup tata bunyi (fonologi vokal berat/ringan), tingkatan bahasa, dan kosakata tematik.
5. **Fitur Pengguna Lengkap**:
   - Bookmark kosakata favorit tersimpan secara lokal dan siap disinkronkan ke cloud.
   - Riwayat pencarian otomatis (*Search History*) dengan batas simpan hingga 20 entri.
   - Formulir partisipasi usul kata baru (*Community Word Contribution*).
   - Otentikasi akun pengguna (Login, Register, Profil Pengguna).
6. **Panel Pengelola & Moderasi (*Admin Dashboard*)**:
   - Metrik statistik realtime dan grafik sebaran tingkat tutur.
   - Manajemen kosakata (CRUD, fonetik, ragam arti, contoh kalimat).
   - Antrean moderasi usulan lema komunitas (*review, edit & approve, reject*).
   - Manajemen kategori dan katalog dialek.
   - Kontrol hak akses RBAC (*super_admin*, *admin*, *editor*, *contributor*, *user*).
   - Bulk import & export format JSON / CSV.

---

## 🛠️ Arsitektur Teknologi

- **Frontend**: React 18, TypeScript (Strict Mode), Vite 5, React Router v6.
- **Styling & Desain**: Tailwind CSS 3.4 dengan palet identitas budaya Madura:
  - *Navy Blue* (`#172B3A`)
  - *Forest Green* (`#1F5145`)
  - *Madura Gold* (`#C5A66A`)
  - *Warm Ivory* (`#F8F7F2`)
- **State & Data Fetching**: TanStack React Query v5, Axios, LocalStorage Synchronizer.
- **Backend & Database**: Supabase (PostgreSQL 15, Supabase Auth, Row Level Security).
- **Pengujian**: Vitest v2, TypeScript Type-checking.
- **Hosting Target**: Vercel / Cloudflare Pages (Frontend SPA), Supabase Cloud (Database).

---

## 🚀 Memulai Pengembangan Lokal

### Prasyarat
- [Node.js](https://nodejs.org/) v18.0.0 atau v20+
- [npm](https://www.npmjs.com/) v9+ atau yarn / pnpm

### Langkah Instalasi
```bash
# 1. Clone repositori
git clone https://github.com/your-username/bahasa-madura.git
cd bahasa-madura

# 2. Instalasi dependensi proyek
npm install

# 3. Konfigurasi Environment Variables
cp .env.example .env
# Sesuaikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY (opsional, aplikasi memiliki mode offline bawaan)

# 4. Jalankan Dev Server
npm run dev
```
Akses aplikasi melalui peramban di: `http://localhost:5173`

---

## 🧪 Pengujian & Build

```bash
# Menjalankan pengujian otomatis (Unit Test Vitest)
npm test

# Menjalankan type-check TypeScript tanpa emit
npx tsc --noEmit

# Membuat berkas build produksi
npm run build

# Meninjau berkas produksi lokal
npm run preview
```

---

## 📁 Struktur Direktori Proyek

```
bahasa-madura/
├── docs/                       # Dokumentasi arsitektur, API, audit data & laporan fase
├── public/                     # Aset statis & favicon
├── scripts/                    # Skrip Python (inspeksi, migrasi, validasi)
├── src/
│   ├── app/
│   │   ├── layouts/            # PublicLayout & AdminLayout
│   │   ├── providers/          # AuthProvider & QueryProvider
│   │   └── router/             # Konfigurasi code-split rute aplikasi
│   ├── components/
│   │   ├── common/             # Navbar, Footer, EmptyState, LoadingSkeleton
│   │   ├── dictionary/         # SearchBar, WordCard, WordDetailModal, SpeechLevelBadge
│   │   └── ui/                 # Design System (Button, Card, Input, Modal, Toast, dll)
│   ├── data/                   # Bundel seed offline-first (seed-dictionary.json)
│   ├── features/               # Hooks bisnis logika terisolasi (useDictionarySearch)
│   ├── hooks/                  # useDebounce, useLocalStorage
│   ├── lib/                    # Supabase client, Axios instance, utility helper
│   ├── pages/
│   │   ├── admin/              # Dashboard, Dictionary, Contribution, Users, Categories, Import
│   │   ├── public/             # Home, Dictionary, Categories, Learn, DailyWord, About
│   │   └── user/               # Favorites, History, Contribute, Login, Register, Profile
│   ├── services/               # dictionaryService (mesin pencarian & penyimpanan)
│   ├── types/                  # Definisi TypeScript & Supabase database types
│   └── __tests__/              # Unit test suites (Vitest)
├── supabase/
│   ├── migrations/             # Skema tabel PostgreSQL & RLS policies
│   └── seed/                   # SQL seed file (1.86 MB, 9.668 lema & 9.776 terjemahan)
├── vercel.json                 # Konfigurasi routing rewrite SPA
└── package.json
```

---

## 📄 Lisensi & Kontribusi
Aplikasi ini dikembangkan di bawah lisensi terbuka [MIT](LICENSE). Kontribusi komunitas sangat diapresiasi! Silakan baca panduan berkontribusi di [`CONTRIBUTING.md`](CONTRIBUTING.md).

