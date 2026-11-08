import { LearningArticle } from '../types';

export const MORPHOLOGICAL_AFFIXES = {
  prefixes: [
    { madura: 'a', indo: 'ber', desc: 'Awalan pembentuk kata kerja aktif' },
    { madura: 'ta', indo: 'ter', desc: 'Awalan pembentuk kata kerja pasif/ketidaksengajaan' },
    { madura: 'ma', indo: 'memper', desc: 'Awalan kausatif / membuat jadi' },
    { madura: 'ka', indo: 'ke', desc: 'Awalan pembentuk nomina atau keadaan' },
  ],
  postfixes: [
    { madura: 'na', indo: 'nya', desc: 'Akhiran kepemilikan orang ketiga atau penegas nomina' },
  ]
};

export const POPULAR_WORDS = [
  { word: "mator sakalangkong", meaning: "terima kasih", level: "engghi_bhunten" },
  { word: "panjhennengngan", meaning: "kamu / Anda (sangat hormat)", level: "engghi_bhunten" },
  { word: "abâ'na", meaning: "kamu (akrab)", level: "enja_iya" },
  { word: "sèhat", meaning: "sehat / walafiat", level: "enja_iya" },
  { word: "kabbhi", meaning: "semua / seluruhnya", level: "netral" },
  { word: "ajhâlân", meaning: "berjalan", level: "netral" },
  { word: "dhika", meaning: "kamu / saudara", level: "engghi_enten" },
  { word: "sakera", meaning: "tokoh pahlawan & pejuang Madura", level: "netral" },
];

export const INITIAL_ARTICLES: LearningArticle[] = [
  {
    id: "art-1",
    slug: "pengenalan-tingkatan-bahasa-madura",
    title: "Memahami 3 Tingkatan Bahasa Madura (Ondhagghâ Bhâsa)",
    excerpt: "Panduan komprehensif mengenai tingkat tutur Enja'-Iya, Engghi-Enten, dan Engghi-Bhunten dalam etika pergaulan masyarakat Madura.",
    category: "grammar",
    readTime: "5 menit",
    publishedAt: "2026-11-01",
    content: `Dalam kebudayaan Madura, bahasa bukan sekadar sarana komunikasi, melainkan cerminan adab dan rasa hormat (*tata krama*). Masyarakat Madura membagi register bahasanya ke dalam tiga tingkatan utama (ondhagghâ bhâsa):

### 1. Enja'-Iya (Bhâsa Lomrah)
Tingkatan ini adalah bahasa sehari-hari atau bahasa dasar. Digunakan untuk berkomunikasi dengan:
- Teman sebaya atau sahabat karib.
- Orang yang usianya lebih muda (anak-anak, adik).
- Digunakan dalam suasana santai tanpa batas formalitas.

Contoh kosakata:
- Kamu = *abâ'na* / *bâ'na* / *kakèh*
- Saya = *engko'*
- Makan = *ngakan*
- Tidur = *tèdung*

### 2. Engghi-Enten (Bhâsa Tengngaan)
Tingkatan menengah atau madya. Digunakan untuk:
- Berbicara dengan orang sebaya yang belum terlalu akrab.
- Situasi semi-formal dalam pergaulan yang membutuhkan kesopanan seimbang.

Contoh kosakata:
- Kamu = *dhika* / *sampèyan*
- Saya = *kula*
- Makan = *ngakan*
- Tidur = *tèdung*

### 3. Engghi-Bhunten (Bhâsa Alos / Alos Tengghi)
Tingkatan tertinggi dan paling halus dalam bahasa Madura. Memiliki nilai penghormatan tinggi (*krama inggil*). Digunakan untuk:
- Berbicara kepada orang tua, mertua, kakek-nenek.
- Kepada para guru, kiai, alim ulama, dan tokoh adat (*sesepuh*).

Contoh kosakata:
- Kamu = *panjhennengngan* / *ajunan*
- Saya = *abdhina*
- Makan = *neddha* / *dhâ'âr*
- Tidur = *kèlem* / *sarè*

Mengetahui tingkat tutur ini sangat penting agar tidak salah dalam menerapkan rasa hormat (*ngargai oreng se lebbi towa*).`
  },
  {
    id: "art-2",
    slug: "panduan-ortografi-dan-aksen-vokal-madura",
    title: "Mengenal Ortografi Huruf Vokal Beraksen: Perbedaan 'â' dan 'è'",
    excerpt: "Mengapa ada huruf â dan è dalam tulisan Madura? Simak penjelasan fonologi dan cara pelafalan yang benar sesuai EYD Bahasa Madura.",
    category: "basics",
    readTime: "4 menit",
    publishedAt: "2026-11-03",
    content: `Bahasa Madura memiliki sistem fonem vokal yang kaya dan khas dibandingkan bahasa Indonesia. Untuk membedakan bunyi yang berbeda maknanya, ejaan resmi Bahasa Madura menggunakan tanda diakritik:

### 1. Vokal 'â' (A-Sirkumfleks)
Huruf **â** dilafalkan sebagai vokal belakang bundar atau mendekati bunyi vokal /ɔ/ (seperti bunyi huruf 'o' terbuka atau vokal belakang /ɤ/).
- **abâ'** (/abɔʔ/) = badan / diri / kamu
- **jhâjhân** (/ɟhɔɟhɔn/) = jajan / kue
- Perbedaan: Bandingkan *aba* (ayah) dengan *abâ'* (badan). Tanpa diakritik, artinya bisa tertukar.

### 2. Vokal 'è' (E-Grave / Taling Terbuka)
Huruf **è** melambangkan vokal depan setengah terbuka /ɛ/ (seperti huruf 'e' pada kata *bebek* atau *merah*). Berbeda dengan huruf **e** tanpa aksen yang melambangkan vokal pepet /ə/ (seperti huruf 'e' pada kata *enam* atau *emas*).
- **sèhat** (/sɛhat/) = sehat
- **èntar** (/ɛntar/) = pergi
- **pèssè** (/pɛssɛ/) = uang
- Bandingkan dengan **becce'** di mana 'e' adalah pepet.

### 3. Hamzah / Glottal Stop (')
Tanda apostrof **'** melambangkan bunyi hamzah tajam di akhir suku kata:
- **enja'** = tidak
- **to'ot** = lutut

Pada Kamus Madura Digital, Anda dapat mencari kata baik dengan mengetikkan aksen aslinya (*abâ'*, *sèhat*) maupun huruf biasa (*aba*, *sehat*). Sistem pencarian cerdas kami akan otomatis menormalkan input pencarian Anda!`
  },
  {
    id: "art-3",
    slug: "salam-sapaan-dan-ungkapan-sopan-madura",
    title: "Salam, Sapaan Hormat, dan Ungkapan Sehari-hari yang Wajib Diketahui",
    excerpt: "Kumpulan ungkapan etika kesopanan masyarakat Madura: mulai dari ucapan terima kasih, permisi, hingga permohonan maaf.",
    category: "conversation",
    readTime: "3 menit",
    publishedAt: "2026-11-05",
    content: `Masyarakat Madura terkenal menjunjung tinggi adab dan tata krama. Berikut adalah ungkapan-ungkapan yang sering digunakan dalam pergaulan:

1. **Mator Sakalangkong**
   - Arti: Terima kasih banyak.
   - Jawaban: *Sami-sami* (sama-sama).
   - Bentuk sangat halus: *Mator sakalangkong saèpon*.

2. **Nyo'on Sapora**
   - Arti: Minta maaf / mohon ampun.
   - Digunakan saat berbuat kekeliruan atau ingin merendahkan hati.

3. **Ngereng / Mabi**
   - Arti: Silakan / mari.
   - Digunakan saat mempersilakan tamu masuk atau mencicipi hidangan.

4. **Korang Adhep**
   - Arti: Kurang ajar / tidak beretika. Merupakan nasihat budaya untuk selalu menjaga rasa malu dan tata krama (*tako' neng daddi oreng se korang adhep*).

5. **Tanean Lanjang**
   - Filosofi arsitektur pemukiman tradisional Madura yang mencerminkan ikatan erat kekeluargaan dan musyawarah.`
  }
];
