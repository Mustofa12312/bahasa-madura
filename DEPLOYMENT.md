# Panduan Deployment (Deployment Guide)
**Kamus Madura Digital Platform**

Dokumen ini memandu proses rilis dan deployment aplikasi Kamus Madura Digital ke lingkungan produksi (*production environment*).

---

## 1. Pilihan Platform Hosting Frontend

### Opsi A: Vercel (Rekomendasi Utama)
Konfigurasi file [`vercel.json`](file:///mnt/DATA/Projects/bahasa%20madura/vercel.json) telah disediakan di root proyek untuk menangani penulisan ulang rute (*SPA route rewriting*) dan caching aset statis.

1. Hubungkan akun GitHub Anda ke [Vercel](https://vercel.com).
2. Pilih repositori `bahasa-madura`.
3. Tentukan pengaturan build:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Tambahkan *Environment Variables*:
   - `VITE_APP_NAME`: `Kamus Madura Digital`
   - `VITE_SUPABASE_URL`: `https://<id-project>.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `<anon-key-supabase>`
5. Klik **Deploy**. Aplikasi akan online dalam waktu kurang dari 1 menit.

---

### Opsi B: Cloudflare Pages
1. Masuk ke dashboard Cloudflare Pages.
2. Hubungkan ke repositori Git.
3. Masukkan konfigurasi build:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Di bagian **Settings &rarr; Builds & deployments &rarr; Environment variables**, tambahkan variabel Supabase yang sama.
5. Buat file `public/_redirects` dengan konten:
   ```
   /*    /index.html   200
   ```
6. Jalankan deployment.

---

## 2. Pengaturan Backend & Basis Data (Supabase)

1. Buat proyek baru di [Supabase Cloud](https://app.supabase.com).
2. Buka **SQL Editor** pada dashboard Supabase.
3. Jalankan script migrasi skema tabel yang terletak di:
   - [`supabase/migrations/20261108000001_initial_schema.sql`](file:///mnt/DATA/Projects/bahasa%20madura/supabase/migrations/20261108000001_initial_schema.sql)
4. Jalankan script seed populasi 9.668 lema kosakata asli:
   - [`supabase/seed/seed.sql`](file:///mnt/DATA/Projects/bahasa%20madura/supabase/seed/seed.sql)
5. Salin **Project URL** dan **anon public API Key** dari menu **Project Settings &rarr; API** ke dalam *Environment Variables* frontend.

---

## 3. Verifikasi Pasca-Deployment (Post-Deployment Checklist)

- [ ] Halaman Beranda (`/`) memuat kata hari ini dan bar pencarian berfungsi.
- [ ] Navigasi rute langsung (`/kamus`, `/admin`, `/login`, `/kategori`) tidak menghasilkan 404 saat direfresh (*SPA rewrite valid*).
- [ ] Fitur pencarian dua arah menghasilkan lema tepat dengan toleransi ejaan aksen.
- [ ] Filter tingkat tutur (*Ondhagghâ Bhâsa*) menampilkan badge warna yang tepat.
- [ ] Fitur bookmark favorit dan riwayat pencarian dapat menyimpan dan menghapus data pada peramban.
- [ ] Halaman Admin (`/admin`) menampilkan metrik, tabel kosakata, antrean kontribusi, dan manajemen pengguna.
