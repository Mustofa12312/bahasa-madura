import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Check, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  BookA 
} from 'lucide-react';
import { dictionaryService } from '../../services/dictionaryService';
import { Word, SpeechLevel } from '../../types';
import { SpeechLevelBadge } from '../../components/dictionary/SpeechLevelBadge';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';

export const DictionaryManagementPage: React.FC = () => {
  const { showToast } = useToast();
  const [query, setQuery] = useState('');
  const [speechLevel, setSpeechLevel] = useState<SpeechLevel | 'all'>('all');
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | null>(null);

  // Form State
  const [formWord, setFormWord] = useState('');
  const [formDef, setFormDef] = useState('');
  const [formLevel, setFormLevel] = useState<SpeechLevel>('netral');
  const [formCat, setFormCat] = useState('sehari-hari');
  const [formExampleMadura, setFormExampleMadura] = useState('');
  const [formExampleIndo, setFormExampleIndo] = useState('');

  const categories = dictionaryService.getCategories();

  const searchResult = useMemo(() => {
    return dictionaryService.search({
      query,
      direction: 'm2i',
      speechLevel,
      category: 'all',
      page,
      limit: 15
    });
  }, [query, speechLevel, page, refreshKey]);

  const handleOpenAdd = () => {
    setFormWord('');
    setFormDef('');
    setFormLevel('netral');
    setFormCat('sehari-hari');
    setFormExampleMadura('');
    setFormExampleIndo('');
    setIsAddOpen(true);
  };

  const handleOpenEdit = (w: Word) => {
    setEditingWord(w);
    setFormWord(w.word);
    setFormDef(w.definition);
    setFormLevel(w.speech_level);
    setFormCat(w.category_slug || 'sehari-hari');
    setFormExampleMadura(w.examples?.[0]?.madurese || '');
    setFormExampleIndo(w.examples?.[0]?.indonesian || '');
  };

  const handleSaveWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formWord.trim() || !formDef.trim()) {
      showToast('Kata Madura dan arti wajib diisi', 'error');
      return;
    }

    const examples = formExampleMadura.trim() 
      ? [{ madurese: formExampleMadura.trim(), indonesian: formExampleIndo.trim() }] 
      : [];

    if (editingWord) {
      dictionaryService.updateWord(editingWord.id, {
        word: formWord.trim(),
        definition: formDef.trim(),
        speech_level: formLevel,
        category_slug: formCat,
        examples
      });
      showToast(`Kata "${formWord}" berhasil diperbarui!`);
      setEditingWord(null);
    } else {
      dictionaryService.addWord({
        word: formWord.trim(),
        definition: formDef.trim(),
        speech_level: formLevel,
        category_slug: formCat,
        examples
      });
      showToast(`Kata "${formWord}" berhasil ditambahkan ke kamus!`);
      setIsAddOpen(false);
    }

    setRefreshKey(k => k + 1);
  };

  const handleDelete = (w: Word) => {
    if (confirm(`Hapus kata "${w.word}" dari database?`)) {
      dictionaryService.deleteWord(w.id);
      showToast(`Kata "${w.word}" berhasil dihapus.`);
      setRefreshKey(k => k + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-navy">
            Kelola Database Kosakata
          </h1>
          <p className="text-xs text-madura-muted">
            Total {searchResult.total.toLocaleString()} kosakata aktif dalam sistem.
          </p>
        </div>

        <Button onClick={handleOpenAdd} variant="primary" size="sm">
          <Plus className="w-4 h-4 text-gold-400" />
          <span>Tambah Kata Baru</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-madura-border shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Cari kata Madura..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-madura-border bg-ivory text-xs text-navy focus:outline-none focus:ring-1 focus:ring-navy"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <span className="font-semibold text-navy">Filter Tingkat:</span>
          <select
            value={speechLevel}
            onChange={(e) => {
              setSpeechLevel(e.target.value as any);
              setPage(1);
            }}
            className="px-3 py-1.5 rounded-xl border border-madura-border bg-ivory text-xs text-navy focus:outline-none"
          >
            <option value="all">Semua Tingkat</option>
            <option value="netral">Netral</option>
            <option value="enja_iya">Enja'-Iya</option>
            <option value="engghi_enten">Engghi-Enten</option>
            <option value="engghi_bhunten">Engghi-Bhunten</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-madura-border shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-madura-border text-navy font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Kata Madura</th>
                <th className="py-3.5 px-4">Arti Bahasa Indonesia</th>
                <th className="py-3.5 px-4">Tingkat Tutur</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-madura-border/60">
              {searchResult.items.map((word) => (
                <tr key={word.id} className="hover:bg-ivory-warm/50 transition-colors">
                  <td className="py-3.5 px-4 font-serif font-bold text-navy text-sm">
                    {word.word}
                  </td>
                  <td className="py-3.5 px-4 text-madura-text max-w-xs truncate">
                    {word.definition}
                  </td>
                  <td className="py-3.5 px-4">
                    <SpeechLevelBadge level={word.speech_level} />
                  </td>
                  <td className="py-3.5 px-4 text-stone-500 font-medium">
                    {word.category_name || 'Sehari-hari'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(word)}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-navy hover:bg-stone-100 transition-colors"
                        title="Edit Kata"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(word)}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Hapus Kata"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-madura-border flex items-center justify-between text-xs text-madura-muted">
          <span>
            Halaman {page} dari {searchResult.totalPages || 1}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg border border-madura-border bg-white text-navy font-medium disabled:opacity-40"
            >
              Sebelumnya
            </button>
            <button
              onClick={() => setPage(p => Math.min(searchResult.totalPages, p + 1))}
              disabled={page >= searchResult.totalPages}
              className="px-3 py-1.5 rounded-lg border border-madura-border bg-white text-navy font-medium disabled:opacity-40"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isAddOpen || Boolean(editingWord)}
        onClose={() => {
          setIsAddOpen(false);
          setEditingWord(null);
        }}
        title={editingWord ? `Edit Kosakata: ${editingWord.word}` : 'Tambah Kosakata Baru'}
      >
        <form onSubmit={handleSaveWord} className="space-y-4">
          <Input
            label="Kata Bahasa Madura"
            placeholder="Contoh: abâ'na"
            value={formWord}
            onChange={(e) => setFormWord(e.target.value)}
            required
          />

          <Input
            label="Arti Bahasa Indonesia"
            placeholder="Contoh: kamu, badan"
            value={formDef}
            onChange={(e) => setFormDef(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-navy-800 tracking-wide uppercase">
                Tingkatan Bahasa
              </label>
              <select
                value={formLevel}
                onChange={(e) => setFormLevel(e.target.value as any)}
                className="w-full rounded-xl border border-madura-border bg-white px-3 py-2 text-xs text-navy focus:outline-none"
              >
                <option value="netral">Netral (Umum)</option>
                <option value="enja_iya">Enja'-Iya (Lomrah)</option>
                <option value="engghi_enten">Engghi-Enten (Menengah)</option>
                <option value="engghi_bhunten">Engghi-Bhunten (Alos)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-navy-800 tracking-wide uppercase">
                Kategori
              </label>
              <select
                value={formCat}
                onChange={(e) => setFormCat(e.target.value)}
                className="w-full rounded-xl border border-madura-border bg-white px-3 py-2 text-xs text-navy focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-stone-200">
            <label className="block text-xs font-semibold text-navy-800 tracking-wide uppercase">
              Contoh Kalimat (Opsional)
            </label>
            <Input
              placeholder="Contoh Madura: ..."
              value={formExampleMadura}
              onChange={(e) => setFormExampleMadura(e.target.value)}
            />
            <Input
              placeholder="Arti Terjemahan: ..."
              value={formExampleIndo}
              onChange={(e) => setFormExampleIndo(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-200">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAddOpen(false);
                setEditingWord(null);
              }}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Simpan Data
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

