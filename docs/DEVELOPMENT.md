# Development Guide: Kamus Madura Digital

Panduan pengembangan, build, dan deployment untuk tim engineering.

---

## 1. Quick Start

### 1.1 Prasyarat
- Node.js >= 18 (direkomendasikan v20+)
- npm >= 9
- Python >= 3.10 (untuk script audit dan migrasi data)

### 1.2 Instalasi Dependensi
```bash
npm install
```

### 1.3 Menjalankan Mode Development
```bash
npm run dev
```
Aplikasi web akan berjalan pada `http://localhost:5173`.

### 1.4 Menjalankan Build Produksi & Type-Check
```bash
npm run build
```
Menjalankan `tsc` untuk validasi tipe TypeScript dan `vite build` untuk bundling aset statis teroptimasi di direktori `dist/`.

---

## 2. Environment Variables

Buat file `.env` di root direktori dengan menyalin dari `.env.example`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_APP_TITLE=Kamus Madura Digital
```
*Catatan:* Aplikasi memiliki *offline-first fallback engine* sehingga tetap berjalan 100% fungsional dengan dataset leksikal internal bahkan sebelum Supabase dikonfigurasi.

---

## 3. Data Migration Workflow

1. **Audit Data Asli:**
   ```bash
   python3 scripts/inspect-source.py
   ```
2. **Validasi & Verifikasi Ortografi:**
   ```bash
   python3 scripts/validate-data.py
   ```
3. **Generate Dataset Migrasi & Seed SQL:**
   ```bash
   python3 scripts/migrate-dictionary.py
   ```
   Script ini akan membaca `kamus.json` dan menghasilkan:
   - `src/data/seed-dictionary.json` (Dataset terstruktur untuk in-browser search engine)
   - `supabase/seed/seed.sql` (Script SQL untuk mengimport ke database PostgreSQL / Supabase)
