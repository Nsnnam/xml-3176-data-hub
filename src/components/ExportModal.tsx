import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileSpreadsheet, 
  Layers, 
  Pill, 
  Stethoscope, 
  Calendar, 
  CheckCircle,
  FileCheck2
} from 'lucide-react';
import { DossierGroup, FilterState } from '../types/xml';
import { exportDossiersToExcel, ExportOptions } from '../utils/excelExporter';

interface ExportModalProps {
  dossiers: DossierGroup[];
  filters: FilterState;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  dossiers,
  filters,
  onClose
}) => {
  const [tableChoice, setTableChoice] = useState<'XML1' | 'XML2' | 'XML3' | 'ALL_THREE'>('ALL_THREE');
  const [onlyItemsInDateRange, setOnlyItemsInDateRange] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  const totalXml1 = dossiers.length;
  const totalXml2 = dossiers.reduce((acc, d) => acc + d.xml2.length, 0);
  const totalXml3 = dossiers.reduce((acc, d) => acc + d.xml3.length, 0);

  const handleExport = async () => {
    setIsExporting(true);
    setExportSuccess(null);

    try {
      // Allow UI to update
      await new Promise(r => setTimeout(r, 80));

      const options: ExportOptions = {
        tableChoice,
        onlyItemsInDateRange,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
        dateField: filters.dateCriteria
      };

      const result = exportDossiersToExcel(dossiers, options);
      setExportSuccess(`Đã xuất thành công ${result.totalExported.toLocaleString('vi-VN')} dòng dữ liệu vào file ${result.fileName}!`);
    } catch (err: any) {
      console.error('Export error:', err);
      alert('Lỗi khi xuất file Excel: ' + (err.message || 'Vui lòng thử lại.'));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Xuất Dữ Liệu Ra Excel</h3>
              <p className="text-xs text-slate-400">Định dạng file mẫu chuẩn 3176/QĐ-BYT</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Choices */}
        <div className="py-5 space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Chọn định dạng bảng cần xuất:
            </label>

            <div className="grid grid-cols-1 gap-2.5">
              {/* Option All 3 */}
              <label
                onClick={() => setTableChoice('ALL_THREE')}
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  tableChoice === 'ALL_THREE'
                    ? 'bg-teal-500/10 border-teal-500/50 text-white shadow-sm'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-sm text-slate-200">Trọn Bộ 3 Bảng (1 File Excel 3 Sheets)</strong>
                    <span className="text-[11px] text-slate-400">Gồm sheet XML1, XML2, XML3 liên kết theo hồ sơ</span>
                  </div>
                </div>
                <span className="font-mono text-teal-400 font-bold">
                  {(totalXml1 + totalXml2 + totalXml3).toLocaleString('vi-VN')} dòng
                </span>
              </label>

              {/* Option XML1 */}
              <label
                onClick={() => setTableChoice('XML1')}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  tableChoice === 'XML1'
                    ? 'bg-blue-500/10 border-blue-500/50 text-white shadow-sm'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div>
                    <strong className="block text-slate-200">Bảng 1 (XML1 - Tổng hợp KCB)</strong>
                    <span className="text-[11px] text-slate-400">Đúng chuẩn 65 cột thông tin hồ sơ bệnh nhân</span>
                  </div>
                </div>
                <span className="font-mono text-blue-400 font-bold">
                  {totalXml1.toLocaleString('vi-VN')} hồ sơ
                </span>
              </label>

              {/* Option XML2 */}
              <label
                onClick={() => setTableChoice('XML2')}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  tableChoice === 'XML2'
                    ? 'bg-amber-500/10 border-amber-500/50 text-white shadow-sm'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div>
                    <strong className="block text-slate-200">Bảng 2 (XML2 - Danh mục Thuốc)</strong>
                    <span className="text-[11px] text-slate-400">Đúng chuẩn 43 cột chi tiết thuốc đã sử dụng</span>
                  </div>
                </div>
                <span className="font-mono text-amber-400 font-bold">
                  {totalXml2.toLocaleString('vi-VN')} dòng
                </span>
              </label>

              {/* Option XML3 */}
              <label
                onClick={() => setTableChoice('XML3')}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  tableChoice === 'XML3'
                    ? 'bg-purple-500/10 border-purple-500/50 text-white shadow-sm'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <div>
                    <strong className="block text-slate-200">Bảng 3 (XML3 - DVKT & VTYT)</strong>
                    <span className="text-[11px] text-slate-400">Đúng chuẩn 51 cột dịch vụ kỹ thuật, thời gian, mã máy</span>
                  </div>
                </div>
                <span className="font-mono text-purple-400 font-bold">
                  {totalXml3.toLocaleString('vi-VN')} dòng
                </span>
              </label>
            </div>
          </div>

          {/* Filtering option checkbox */}
          {(filters.fromDate || filters.toDate) && (
            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
              <label className="flex items-start gap-2.5 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={onlyItemsInDateRange}
                  onChange={(e) => setOnlyItemsInDateRange(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-teal-500 focus:ring-teal-500"
                />
                <span className="text-xs leading-relaxed">
                  Chỉ xuất các dòng Thuốc / DVKT có mốc ngày phát sinh nằm trong khoảng{' '}
                  <strong className="text-teal-400">{filters.fromDate || '...'}</strong> đến{' '}
                  <strong className="text-teal-400">{filters.toDate || '...'}</strong>
                </span>
              </label>
            </div>
          )}

          {exportSuccess && (
            <div className="flex items-center gap-2 p-3 bg-teal-500/10 border border-teal-500/30 rounded-xl text-teal-400 text-xs">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{exportSuccess}</span>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs font-semibold cursor-pointer"
          >
            Đóng
          </button>

          <button
            onClick={handleExport}
            disabled={isExporting || dossiers.length === 0}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isExporting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Đang xuất file...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Tải File Excel Xuống</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
