# Laporan Pengujian Mutu (QA & Testing Report) - Fase 7
**Kamus Madura Digital Platform**
*Tanggal Pengujian: 8 November 2026*

---

## 1. Ringkasan Eksekutif QA
Pengujian menyeluruh (*Quality Assurance*) telah dilaksanakan untuk memverifikasi fungsionalitas, performa, ketahanan kesalahan (*fault-tolerance*), kompatibilitas lintas peramban, serta aksesibilitas aplikasi Kamus Madura Digital. Seluruh unit test otomatis (18 tests) lulus 100%, proses build berhasil tanpa galat (*zero-warning compilation*), dan tata letak responsif telah divalidasi pada seluruh ukuran layar standar.

---

## 2. Hasil Eksekusi Unit Test Otomatis (Vitest)
Pustaka pengujian otomatis terkonfigurasi dengan Vitest v2.1.9 dan dijalankan melalui script `npm test`:

```
 RUN  v2.1.9 /mnt/DATA/Projects/bahasa madura

 ✓ src/__tests__/utils.test.ts (3 tests)
 ✓ src/__tests__/dictionary.test.ts (10 tests)
 ✓ src/__tests__/storage.test.ts (5 tests)

 Test Files  3 passed (3)
      Tests  18 passed (18)
   Duration  2.03s
```

### 2.1 Rincian Skenario Pengujian Unit
1. **Normalisasi Ortografi Madura (`normalizeMadurese`)**:
   - Vokal beraksen `â` dan `è` ternormalisasi tepat ke padanan ASCII `a` dan `e`.
   - String dipangkas dari spasi berlebih (*trim*) dan diubah ke huruf kecil (*case-insensitive*).
   - Karakter glottal tanda petik tunggal (`'`) dipertahankan secara utuh untuk menjaga struktur pemenggalan suku kata bahasa Madura (contoh: *enja'*, *bâ'na*).
2. **Mesin Pencarian Inti (`dictionaryService.search`)**:
   - Pencarian kosong mengembalikan daftar terpaginasi (*18 item per halaman*).
   - Pencarian dua arah Madura &rarr; Indonesia (*m2i*) menemukan lema tepat dan kata turunan dengan pembobotan skor relasional.
   - Pencarian dua arah Indonesia &rarr; Madura (*i2m*) menelusuri definisi dan array terjemahan padanan kata.
   - Filter tingkat tutur (*ondhagghâ bhâsa*) menyaring lema secara ketat (*Netral*, *Enja'-Iya*, *Engghi-Enten*, *Engghi-Bhunten*).
   - Pendeteksian afiks morfologis (awalan *a-*, *ta-*, *ma-*, *ka-* dan akhiran *-na*) memberikan saran kata dasar saat pencarian spesifik tidak ditemukan.
   - Navigasi lema sebelumnya (*Previous*) dan lema sesudahnya (*Next*) bekerja konsisten.
3. **Penyimpanan Lokal & Sinkronisasi (`localStorage`)**:
   - Toggle bookmark kata favorit berfungsi idempotent (tambah & hapus).
   - Riwayat pencarian tersimpan teratur tanpa duplikasi kata kunci yang sama.
   - Kapasitas riwayat pencarian dibatasi maksimal 20 entri terbaru (*FIFO eviction*).

---

## 3. Pengujian Responsivitas Lintas Perangkat

| Breakpoint Layar | Resolusi Target | Status | Hasil Verifikasi Visual & UX |
|---|---|---|---|
| **Mobile Ringkas** | 320px – 480px | **LULUS** | Hamburger menu navigasi berfungsi halus, kartu lema satu kolom, tombol arah terjemahan ringkas, modal detail kata adaptif layar penuh (*bottom-sheet style*). |
| **Mobile Lebar / Tablet** | 768px – 1023px | **LULUS** | Grid lema dua kolom, modal pop-up proporsional di tengah layar, tabel admin dengan scroll horizontal aman. |
| **Desktop / Laptop** | 1024px – 1920px | **LULUS** | Grid lema tiga kolom, sidebar navigasi admin permanen di sisi kiri, keyboard shortcut (`/` fokus pencarian, `Esc` tutup modal) aktif. |

---

## 4. Pengujian Aksesibilitas (a11y) & Navigasi Keyboard
- **Keyboard Shortcut `/`**: Menekan tombol slash (`/`) saat berada di Beranda maupun Kamus akan langsung memfokuskan kursor ke dalam *input search bar* tanpa interaksi mouse.
- **Escape Key (`Esc`)**: Menutup semua modal (*WordDetailModal*, *SpeechLevelGuideModal*, modal admin) secara instan.
- **Label Aksesibilitas (`aria-label`)**: Diterapkan pada seluruh tombol berbasis ikon (tombol favorit, tombol putar pelafalan audio, tombol tutup modal, toggle menu hamburger).
- **Kontras Warna**: Kombinasi warna biru tua (*Navy* `#172B3A`) dan putih gading (*Warm Ivory* `#F8F7F2`) menghasilkan kontras teks melebihi standar WCAG AAA (>7:1).

---

## 5. Audit Performa & Analisis Ukuran Berkas (*Bundle Size*)
- **Code Splitting Dinamis**: Semua halaman publik, pengguna, dan panel admin dimuat secara *lazy* menggunakan `React.lazy()` dan `Suspense`.
- **Ukuran Total Gzip**:
  - `dist/assets/index-*.js`: ~302 kB (memuat runtime React, routing dasar, dan cache dataset offline 9.600+ kata).
  - `dist/assets/vendor-*.js`: ~81 kB.
  - `dist/assets/index-*.css`: ~7.3 kB (Tailwind utility terpangkas melalui PurgeCSS).
  - Potongan halaman modular rata-rata berkisar antara 1 kB – 3 kB gzip, menjamin waktu muat pertama (*First Contentful Paint*) sangat cepat (<0.8 detik).

