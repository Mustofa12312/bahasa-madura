# Data Analysis & Validation: kamus.json

**Document:** Dataset Analysis & Normalization Strategy  
**Source File:** `kamus.json` (254,407 bytes)  
**Total Records:** 9,789 entries  

---

## 1. Dataset Structure

Dataset lama tersusun sebagai array dua dimensi:
```json
[
  ["tingkat", "arti_indonesia", "kata_madura"],
  ["", "ayah", "aba"],
  ["alos tengghi", "siang", "abân"]
]
```

Field:
1. `[0]` - `tingkat` (String): Tingkat tutur / register bahasa Madura.
2. `[1]` - `arti` (String): Terjemahan atau padanan dalam Bahasa Indonesia.
3. `[2]` - `madura` (String): Lemma atau entri kata dalam Bahasa Madura.

---

## 2. Statistical Breakdown

- **Total Entri:** 9,789
- **Kosakata Madura Unik (Lemmas):** 9,668
- **Padanan Kata Indonesia Unik:** 6,050
- **Entri Kosong (Madura):** 0
- **Entri Kosong (Indonesia):** 0
- **Entri Triplet Duplikat Eksak:** 1 (misal `langngoy` - `renang`)
- **Pasangan (Madura, Indonesia) dengan variasi tag tingkat:** 12 entri

### Distribusi Tingkat Tutur (Speech Level):
| Tingkat di Data Asli | Jumlah Record | Persentase | Standar Linguistik Baru |
| :--- | :--- | :--- | :--- |
| `""` (Kosong) | 9,227 | 94.26% | `netral` / `lomrah` (kosakata umum) |
| `lomrah` | 255 | 2.61% | `enja-iya` (Lomrah / Kasar / Akrab) |
| `alos tengghi` | 159 | 1.62% | `engghi-bhunten` (Alos Tengghi / Penghormatan tertinggi) |
| `alos` | 102 | 1.04% | `engghi-bhunten` (Alos / Halus) |
| `tengngaan` | 46 | 0.47% | `engghi-enten` (Tengngaan / Menengah) |

---

## 3. Ortografi dan Karakter Khusus

Ditemukan 2 karakter vokal aksen khusus dan 1 tanda baca glottal:
1. `â` (U+00E2 - Latin Small Letter A with Circumflex): **2,466 kemunculan**
   - Merepresentasikan vokal belakang tertutup atau bulat dalam ortografi Madura baku (misal: *abâ'*, *kalamon*, *jhâjhân*).
2. `è` (U+00E8 - Latin Small Letter E with Grave): **2,808 kemunculan**
   - Merepresentasikan vokal depan setengah terbuka /ɛ/ (taling terbuka), membedakannya dari `e` pepet (misal: *sèhat*, *èntar*, *pèssè*).
3. `'` (U+0027 - Apostrophe / Glottal Stop): **1,047 kemunculan**
   - Merepresentasikan bunyi hamzah atau konsonan letup celah-suara (misal: *abâ'*, *enja'*).
4. `-` (U+002D - Hyphen): **8 kemunculan**
   - Kata ulang reduplikasi (misal: *kole'-kole'*).

---

## 4. Analisis Polisemi & Sinonimitas

### 4.1 Satu Kata Madura Memiliki Banyak Arti (Polisemi/Homofon)
Terdapat 116 entri kata Madura dengan padanan berbeda, contoh:
- `abuh`: 'debu', 'abu-abu'
- `adâ'`: 'muka / depan', 'habis / tidak ada'
- `adâp`: 'sopan santun', 'adzab'
- `aghung`: 'emba', "andi'", 'agung'

### 4.2 Satu Kata Indonesia Memiliki Ragam Tingkat Tutur Madura
Terdapat 1,955 kata Indonesia dengan padanan beragam dalam bahasa Madura.
Contoh paling menonjol pada kata ganti orang kedua (`kamu`):
- `kakèh` / `bâ'na` → Enja'-Iya (Akrab/Biasa)
- `dhika` / `sampèyan` → Engghi-Enten (Menengah/Sopan)
- `ajunan` / `panjhennengngan` → Engghi-Bhunten (Alos Tengghi/Sangat Hormat)

Hal ini membuktikan pentingnya pengelompokan entri leksikal relasional pada skema database baru.

---

## 5. Strategi Migrasi Data ke Skema Baru

1. **Normalisasi Data:**
   - Bersihkan kelebihan spasi di awal/akhir string (*trimming*).
   - Buat slug URL yang ramah SEO (misal: `aba`, `aba-2` jika ada duplikasi).
   - Buat kolom `normalized_word` (mengubah `â` → `a`, `è` → `e`, `’` → `'`) untuk menjamin kecepatan indeks query dan pencarian tanpa aksen.
2. **Standardisasi Tingkat Tutur:**
   - Standarisasi field tingkat tutur menjadi kode enum:
     - `enja_iya` (Lomrah / Kasar)
     - `engghi_enten` (Tengngaan)
     - `engghi_bhunten` (Alos / Alos Tengghi)
     - `netral` (Kata umum yang berlaku untuk semua tingkatan)
3. **Kategorisasi Awal Kosakata:**
   - Kategorisasi berbasis heuristik tata bahasa (kata ganti, kata kerja berawalan `a-`, kata benda umum, ungkapan sapaan, dll.).
4. **Integritas 100% Data Asli:**
   - Tidak ada penghapusan baris kamus asli.
   - Script migrasi `scripts/migrate-dictionary.py` menghasilkan dataset relasional terstruktur yang dapat diimport ke PostgreSQL / Supabase dan disajikan langsung ke web app.

