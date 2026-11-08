import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Edit2, 
  Trash2, 
  Compass, 
  MapPin, 
  BookA, 
  Activity, 
  Box, 
  Sparkles, 
  Users, 
  Landmark, 
  HeartHandshake, 
  MessageCircle 
} from 'lucide-react';
import { dictionaryService } from '../../services/dictionaryService';
import { Category } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';

export interface DialectItem {
  id: string;
  name: string;
  region: string;
  description: string;
  sampleDistinctWords: string[];
}

const INITIAL_DIALECTS: DialectItem[] = [
  {
    id: 'dia-1',
    name: 'Dialek Sumenep (Bhâsa Songennep)',
    region: 'Kabupaten Sumenep & Kepulauan',
    description: 'Baku acuan standar bahasa halus (Engghi-Bhunten) dengan intonasi lemah lembut dan pelafalan vokal bersih.',
    sampleDistinctWords: ['ajunan', 'kèlem', 'neddha', 'pèssè'],
  },
  {
    id: 'dia-2',
    name: 'Dialek Pamekasan (Bhâsa Mekkasân)',
    region: 'Kabupaten Pamekasan',
    description: 'Dialek transisi tengah yang memiliki kekayaan kosakata sastra dan pergaulan santai terstruktur.',
    sampleDistinctWords: ['dhika', 'panjhennengngan', 'roma'],
  },
  {
    id: 'dia-3',
    name: 'Dialek Sampang',
    region: 'Kabupaten Sampang',
    description: 'Dialek tengah-barat dengan ciri intonasi vokal tegas dan akhiran glottal lugas.',
    sampleDistinctWords: ['bâ\'na', 'ngakan', 'abâk'],
  },
  {
    id: 'dia-4',
    name: 'Dialek Bangkalan',
    region: 'Kabupaten Bangkalan & Tapal Kuda Barat',
    description: 'Dialek dengan konsonan beraspirasi kuat (bh, dh, gh) dan pengaruh pergaulan pesisir barat.',
    sampleDistinctWords: ['kakèh', 'engko\'', 'kabbhi'],
  },
];

export const CategoryManagementPage: React.FC = () => {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>(() => dictionaryService.getCategories());
  const [dialects, setDialects] = useState<DialectItem[]>(INITIAL_DIALECTS);

  // Modal State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDesc, setCatDesc] = useState('');

  const handleOpenAddCat = () => {
    setEditingCategory(null);
    setCatName('');
    setCatSlug('');
    setCatDesc('');
    setIsCatModalOpen(true);
  };

  const handleOpenEditCat = (cat: Category) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatDesc(cat.desc || '');
    setIsCatModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim() || !catSlug.trim()) {
      showToast('Nama dan slug kategori wajib diisi', 'error');
      return;
    }

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.slug === editingCategory.slug
            ? { ...c, name: catName.trim(), desc: catDesc.trim() }
            : c
        )
      );
      showToast(`Kategori "${catName}" diperbarui`);
    } else {
      const newCat: Category = {
        name: catName.trim(),
        slug: catSlug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        desc: catDesc.trim(),
        wordCount: 0,
      };
      setCategories((prev) => [...prev, newCat]);
      showToast(`Kategori "${catName}" berhasil ditambahkan`);
    }
    setIsCatModalOpen(false);
  };

  return (
    <div className="space-y-10">
      {/* Category Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-navy">
              Kelola Kategori Kosakata
            </h1>
            <p className="text-xs text-madura-muted">
              Struktur klasifikasi tematik kata untuk mempermudah pencarian dan pembelajaran.
            </p>
          </div>

          <Button onClick={handleOpenAddCat} variant="primary" size="sm">
            <Plus className="w-4 h-4 text-gold-400" />
            <span>Tambah Kategori</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.slug}
              className="p-5 rounded-2xl bg-white border border-madura-border shadow-subtle flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-semibold text-gold-600 bg-gold-50 px-2 py-0.5 rounded-md">
                    /{cat.slug}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditCat(cat)}
                      className="p-1 rounded-lg text-stone-400 hover:text-navy hover:bg-stone-100 transition-colors"
                      title="Edit Kategori"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <h3 className="font-serif font-bold text-lg text-navy">{cat.name}</h3>
                <p className="text-xs text-madura-muted line-clamp-2 mt-1 leading-relaxed">
                  {cat.desc || 'Tidak ada deskripsi'}
                </p>
              </div>

              <div className="pt-3 border-t border-madura-border/60 flex items-center justify-between text-xs font-semibold text-forest">
                <span>{cat.wordCount || 0} kosakata terdaftar</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dialects Section */}
      <div className="space-y-6 pt-6 border-t border-madura-border">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-navy flex items-center gap-2">
            <Compass className="w-5 h-5 text-gold-500" />
            <span>Dokumentasi Ragam Dialek Bahasa Madura</span>
          </h2>
          <p className="text-xs text-madura-muted mt-1">
            Referensi persebaran dialek regional di Pulau Madura dan kawasan Tapal Kuda Jawa Timur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dialects.map((d) => (
            <div
              key={d.id}
              className="p-5 rounded-2xl bg-white border border-madura-border shadow-subtle space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-serif font-bold text-base text-navy">{d.name}</h3>
                  <div className="text-[11px] font-semibold text-forest flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span>{d.region}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-madura-muted leading-relaxed">
                {d.description}
              </p>

              <div className="pt-2 border-t border-madura-border/60">
                <span className="text-[11px] font-bold text-navy uppercase tracking-wider block mb-1">
                  Contoh Kosakata Khas:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {d.sampleDistinctWords.map((word, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-ivory-warm text-stone-700 text-xs font-serif font-medium"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
        title={editingCategory ? `Edit Kategori: ${editingCategory.name}` : 'Tambah Kategori Baru'}
      >
        <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
          <Input
            label="Nama Kategori"
            placeholder="Contoh: Kata Bilangan (Numeralia)"
            value={catName}
            onChange={(e) => {
              setCatName(e.target.value);
              if (!editingCategory) {
                setCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
              }
            }}
            required
          />

          <Input
            label="Slug URL"
            placeholder="contoh: kata-bilangan"
            value={catSlug}
            onChange={(e) => setCatSlug(e.target.value)}
            disabled={Boolean(editingCategory)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-navy-800 tracking-wide uppercase">
              Deskripsi Kategori
            </label>
            <textarea
              rows={3}
              value={catDesc}
              onChange={(e) => setCatDesc(e.target.value)}
              placeholder="Jelaskan jenis kata yang masuk dalam kategori ini..."
              className="w-full rounded-xl border border-madura-border bg-white px-3 py-2 text-xs text-navy focus:outline-none focus:ring-1 focus:ring-navy"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-madura-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCatModalOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Simpan Kategori
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
