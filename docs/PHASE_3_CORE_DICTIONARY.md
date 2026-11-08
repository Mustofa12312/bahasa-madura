# Phase 3 — Core Dictionary Deliverable Report: Kamus Madura Digital

**Fase:** Phase 3 — Core Dictionary  
**Status:** Completed & Production Verified  
**Tanggal:** 8 November 2026  
**Lead Engineer:** Senior Full Stack Developer  

---

## 1. Executive Summary

Phase 3 (Core Dictionary) adalah inti fungsional dari platform **Kamus Madura Digital**. Seluruh fitur pencarian kamus dua arah, normalisasi aksen vokal, tingkatan bahasa Madura (*ondhagghâ bhâsa*), kategorisasi kata, navigasi antar-kata (sebelumnya/selanjutnya), serta status hasil pencarian telah selesai dibangun dan diintegrasikan secara penuh.

---

## 2. Fitur Inti yang Telah Diimplementasikan

### 2.1 Homepage & Hero Section ([`src/pages/public/HomePage.tsx`](file:///mnt/DATA/Projects/bahasa%20madura/src/pages/public/HomePage.tsx))
- **Hero Search Bar**: Fokus pencarian utama dengan shortcut keyboard `/` untuk aktivasi instan tanpa mouse.
- **Language Direction Selector**: Beralih mudah antara *Madura → Indonesia* dan *Indonesia → Madura*.
- **Pencarian Terakhir (Recent Words)**: Menampilkan riwayat pencarian pengguna secara reaktif.
- **Kata Populer (Popular Words)**: Akses cepat ke kosakata favorit masyarakat (misal: *mator sakalangkong*, *panjhennengngan*, *abâ'na*, *sèhat*, *kabbhi*).
- **Kosakata Pilihan Hari Ini (Daily Word)**: Menampilkan kata unggulan harian dengan penjelasan makna dan kaidah kesopanan.
- **Kartu Ondhagghâ Bhâsa**: Ringkasan interaktif 3 tingkat tutur.
- **Penjelajah Kategori**: Pratinjau kategori dengan jumlah kata terdaftar.

### 2.2 Mesin Pencarian Kamus ([`src/features/dictionary/useDictionarySearch.ts`](file:///mnt/DATA/Projects/bahasa%20madura/src/features/dictionary/useDictionarySearch.ts) & [`src/services/dictionaryService.ts`](file:///mnt/DATA/Projects/bahasa%20madura/src/services/dictionaryService.ts))
- **Dual-Token Normalization**: Pengguna dapat mencari kata tanpa aksen khusus (misal: mengetik `aba` atau `sehat` akan otomatis menemukan `abâ'` dan `sèhat`).
- **Debounced Search Input**: Menggunakan custom hook [`src/hooks/useDebounce.ts`](file:///mnt/DATA/Projects/bahasa%20madura/src/hooks/useDebounce.ts) (200ms) untuk mencegah re-render berlebihan dan menjaga performa rendering tetap 60 FPS.
- **Relevance Scoring Algorithm**:
  1. *Exact Match* (skor 100): Lemma persis sama dengan kata kunci.
  2. *Prefix Match* (skor 80): Kata diawali kata kunci yang diketik.
  3. *Substring / Contains Match* (skor 50): Kata atau definisi mengandung kata kunci.
  4. *Speech Level Bonus* (skor +5): Kata dengan tingkat tutur halus/spesifik diprioritaskan.
- **Saran Imbuhan Heuristik (*Morphological Affixes*)**:
  - Awalan Madura `a-` ↔ Indonesia `ber-` (misal: *ajhâlân* ↔ *berjalan*)
  - Awalan Madura `ta-` ↔ Indonesia `ter-` (misal: *tabentus* ↔ *terbentur*)
  - Awalan Madura `ma-` ↔ Indonesia `memper-`
  - Awalan Madura `ka-` ↔ Indonesia `ke-`
  - Akhiran Madura `-na` ↔ Indonesia `-nya` (misal: *romana* ↔ *rumahnya*)

### 2.3 Tingkatan Bahasa Madura (*Ondhagghâ Bhâsa*)
Dukungan penuh klasifikasi dan edukasi tata tutur di seluruh aplikasi:
1. **Enja'-Iya (Lomrah / Kasar / Akrab)**: Digunakan saat berbicara dengan teman sebaya atau orang yang lebih muda.
2. **Engghi-Enten (Tengngaan / Menengah)**: Digunakan dalam situasi formal yang setara atau kepada orang yang baru dikenal.
3. **Engghi-Bhunten (Alos / Alos Tengghi)**: Digunakan sebagai bentuk penghormatan tertinggi kepada orang tua, mertua, kiai, guru, atau tokoh adat.
4. **Netral / Umum**: Kosakata dasar yang berlaku untuk semua situasi pergaulan.
- **Modal Panduan Interaktif**: [`src/components/dictionary/SpeechLevelGuideModal.tsx`](file:///mnt/DATA/Projects/bahasa%20madura/src/components/dictionary/SpeechLevelGuideModal.tsx) dengan tabel komparasi kata ganti (*abâ'na* vs *dhika* vs *panjhennengngan*).

### 2.4 Halaman Detail Kata Mandiri ([`src/pages/public/WordDetailPage.tsx`](file:///mnt/DATA/Projects/bahasa%20madura/src/pages/public/WordDetailPage.tsx))
Sesuai PRD Section 4.3:
- **Navigasi Kata Sebelumnya & Selanjutnya**: Tombol *Previous Word* dan *Next Word* di bagian atas dan bawah halaman untuk memudahkan eksplorasi leksikal.
- **Breadcrumbs**: Navigasi hierarki (*Beranda > Kamus > Kategori > Lemma*).
- **Transkripsi Fonetis**: Menampilkan ejaan asli beraksen dan bentuk pencarian fonetis.
- **Aksi Cepat**:
  - Salin Kata ke Clipboard.
  - Salin Terjemahan ke Clipboard.
  - Bagikan tautan ke media sosial / Web Share API.
  - Simpan / Hapus dari daftar Favorit.
- **Contoh Kalimat**: Menampilkan kalimat bahasa Madura beserta arti bahasa Indonesia.
- **Catatan Dialek**: Menampilkan catatan asal daerah atau dialek bila tersedia.

### 2.5 State Tampilan Pencarian (Search Result States)
- **Loading State**: [`DictionaryGridSkeleton`](file:///mnt/DATA/Projects/bahasa%20madura/src/components/common/LoadingSkeleton.tsx) beranimasi saat sistem memproses input.
- **Empty State**: [`EmptyState`](file:///mnt/DATA/Projects/bahasa%20madura/src/components/common/EmptyState.tsx) ramah pengguna dengan tombol *Bersihkan Pencarian*.
- **Success State**: Grid kartu kata responsif dengan badge tingkat tutur, terjemahan jamak, dan kategori.
- **Error State**: [`ErrorBoundary`](file:///mnt/DATA/Projects/bahasa%20madura/src/components/ui/ErrorBoundary.tsx) yang melindungi antarmuka dari crash runtime.

---

## 3. Checklist Kriteria Penerimaan (PRD Section 15)

| Kriteria Penerimaan | Hasil Pengujian |
| :--- | :---: |
| 1. Pengguna dapat mencari kata Madura (M2I) | **LULUS** |
| 2. Pengguna dapat mencari kata Indonesia (I2M) | **LULUS** |
| 3. Hasil pencarian relevan & berbobot tepat | **LULUS** |
| 4. Detail kata dapat ditampilkan lengkap | **LULUS** |
| 5. Tingkatan bahasa ditampilkan & teredukasi | **LULUS** |
| 6. Toleransi ejaan beraksen (â, è, ') | **LULUS** |
| 7. Navigasi Kata Sebelumnya & Selanjutnya | **LULUS** |
| 8. Navigasi keyboard shortcut `/` | **LULUS** |
| 9. Desain responsif mobile, tablet, desktop | **LULUS** |

---

## 4. Kesimpulan

**Phase 3 (Core Dictionary) telah selesai 100% dan terverifikasi.** Aplikasi kamus digital kini dapat digunakan secara optimal dengan kecepatan pencarian instan dan akurasi linguistik tinggi.

