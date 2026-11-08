# Panduan Kontribusi (Contributing Guidelines)

Terima kasih atas minat Anda untuk berkontribusi pada pengembangan **Kamus Madura Digital**! Pelestarian bahasa daerah adalah misi bersama, dan setiap masukan, penambahan kosakata, maupun perbaikan kode sangat berarti bagi komunitas.

---

## 1. Tata Cara Berkontribusi Kosakata & Budaya
Jika Anda adalah penutur bahasa Madura, guru bahasa daerah, atau pegiat budaya:
1. Anda dapat menyumbangkan kosakata baru langsung melalui aplikasi web di halaman **/kontribusi** (`/kontribusi`).
2. Masukkan lema kata beserta tanda aksen ortografi baku (`â`, `è`, `'`).
3. Pilih tingkatan tutur (*Netral*, *Enja'-Iya*, *Engghi-Enten*, atau *Engghi-Bhunten*).
4. Sertakan contoh kalimat percakapan nyata beserta terjemahannya.
5. Tim editor/kurator kamus akan meninjau dan mempublikasikan kata usulan Anda ke kamus publik.

---

## 2. Berkontribusi pada Kode Sumber (Developer)

### Standar Rekayasa Perangkat Lunak
- **TypeScript**: Wajib menggunakan pengetikan ketat (*strict types*). Dilarang keras menggunakan tipe `any` yang tidak perlu.
- **Ikon UI**: Gunakan pustaka ikon resmi `lucide-react`. Jangan menyisipkan karakter emoji kasar di dalam kode antarmuka.
- **Ejaan Ortografi**: Pertahankan karakter khusus vokal `â` (U+00E2) dan `è` (U+00E8) serta tanda petik tunggal (`'`).
- **Komponen**: Pisahkan logika bisnis (services/hooks) dari presentasi komponen antarmuka (*separation of concerns*).

### Alur Kerja Git & Pull Request
1. Fork repositori ini ke akun GitHub Anda.
2. Buat branch fitur baru:
   ```bash
   git checkout -b feature/nama-fitur-anda
   ```
3. Lakukan perubahan kode dan pastikan seluruh pengujian lulus:
   ```bash
   npm test
   npm run build
   ```
4. Buat commit dengan pesan jelas (mengikuti konvensi Conventional Commits):
   ```bash
   git commit -m "feat(dictionary): tambahkan filter dialek kedaerahan"
   ```
5. Push ke branch Anda dan buka *Pull Request* baru dengan penjelasan rinci mengenai perubahan yang dilakukan.

---

## 3. Melaporkan Masalah (*Bug Report*)
Jika Anda menemukan kesalahan aplikasi atau ketidakakuratan padanan kata:
1. Buka tab **Issues** di repositori GitHub.
2. Jelaskan masalah secara spesifik (lampirkan tangkapan layar, pesan error konsol, atau peramban yang digunakan).
3. Berikan langkah-langkah untuk mereproduksi masalah tersebut (*steps to reproduce*).
