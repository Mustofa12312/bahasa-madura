import React, { useState } from 'react';
import { 
  UploadCloud, 
  Download, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  FileJson, 
  Table 
} from 'lucide-react';
import { dictionaryService } from '../../services/dictionaryService';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';

export const BulkImportExportPage: React.FC = () => {
  const { showToast } = useToast();
  const [fileContent, setFileContent] = useState<any[] | null>(null);
  const [fileName, setFileName] = useState('');
  const [importReport, setImportReport] = useState<{ success: number; failed: number; errors: string[] } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setImportReport(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) {
            setFileContent(parsed);
            showToast(`File ${file.name} terbaca: ${parsed.length} record`);
          } else {
            showToast('Format JSON harus berupa array of objects atau array of rows', 'error');
          }
        } else if (file.name.endsWith('.csv')) {
          // Parse CSV lines
          const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
          const rows = lines.slice(1).map(l => {
            const parts = l.split(',');
            return {
              word: parts[0]?.replace(/"/g, ''),
              definition: parts[1]?.replace(/"/g, ''),
              speech_level: parts[2]?.replace(/"/g, '') || 'netral'
            };
          });
          setFileContent(rows);
          showToast(`File CSV ${file.name} terbaca: ${rows.length} baris`);
        }
      } catch (err: any) {
        showToast(`Gagal membaca file: ${err.message}`, 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteImport = () => {
    if (!fileContent) return;
    const report = dictionaryService.bulkImportJSON(fileContent);
    setImportReport(report);
    if (report.success > 0) {
      showToast(`Berhasil mengimpor ${report.success} kosakata baru!`);
    }
  };

  const handleExportJSON = () => {
    const jsonStr = dictionaryService.exportToJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kamus-madura-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Database diekspor ke format JSON');
  };

  const handleExportCSV = () => {
    const csvStr = dictionaryService.exportToCSV();
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kamus-madura-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast('Database diekspor ke format CSV');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-navy">
          Bulk Import & Ekspor Data
        </h1>
        <p className="text-xs text-madura-muted">
          Penyimpanan cadangan dan integrasi massal format JSON dan CSV.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bulk Import Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-madura-border shadow-subtle space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-navy">Import Kosakata Massal</h3>
              <p className="text-xs text-madura-muted">Mendukung file format .json atau .csv</p>
            </div>
          </div>

          <div className="border-2 border-dashed border-madura-border rounded-2xl p-6 text-center hover:bg-ivory-warm/40 transition-colors">
            <input
              type="file"
              id="file-upload"
              accept=".json,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center space-y-2"
            >
              <FileText className="w-8 h-8 text-gold-500" />
              <span className="text-xs font-semibold text-navy">
                {fileName ? fileName : 'Pilih file JSON atau CSV untuk diunggah'}
              </span>
              <span className="text-[11px] text-madura-muted">
                Maksimal 10MB per berkas
              </span>
            </label>
          </div>

          {/* Preview if file loaded */}
          {fileContent && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-navy flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-forest" />
                  <span>Preview Data ({fileContent.length} baris)</span>
                </span>
                <span className="text-stone-400 font-mono">Format Terverifikasi</span>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 max-h-40 overflow-y-auto text-xs font-mono space-y-1">
                {fileContent.slice(0, 5).map((row, idx) => (
                  <div key={idx} className="truncate text-stone-700">
                    {JSON.stringify(row)}
                  </div>
                ))}
                {fileContent.length > 5 && (
                  <div className="text-stone-400 italic">
                    ... dan {fileContent.length - 5} baris lainnya
                  </div>
                )}
              </div>

              <Button
                variant="primary"
                onClick={handleExecuteImport}
                className="w-full"
              >
                Eksekusi Import ke Database
              </Button>
            </div>
          )}

          {/* Import Report */}
          {importReport && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
              <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Laporan Hasil Import</span>
              </div>
              <p className="text-emerald-800">
                &bull; Berhasil diimpor: <strong>{importReport.success}</strong> kata<br />
                &bull; Gagal / Lewati: <strong>{importReport.failed}</strong> kata
              </p>
            </div>
          )}
        </div>

        {/* Bulk Export Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-madura-border shadow-subtle space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-navy/10 text-navy flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-navy">Ekspor Database Kosakata</h3>
                <p className="text-xs text-madura-muted">Cadangkan seluruh kosakata dan metadata</p>
              </div>
            </div>

            <p className="text-xs text-madura-muted leading-relaxed">
              Ekspor seluruh database kosakata Kamus Madura Digital lengkap dengan variasi penulisan, tingkatan tutur (*ondhagghâ bhâsa*), definisi, dan kategori.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={handleExportJSON}
              className="w-full justify-between"
            >
              <div className="flex items-center gap-2">
                <FileJson className="w-4 h-4 text-gold-600" />
                <span>Unduh Database Lengkap (.JSON)</span>
              </div>
              <Download className="w-4 h-4 text-stone-400" />
            </Button>

            <Button
              variant="outline"
              onClick={handleExportCSV}
              className="w-full justify-between"
            >
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-forest" />
                <span>Unduh Tabel Spreadsheet (.CSV)</span>
              </div>
              <Download className="w-4 h-4 text-stone-400" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

