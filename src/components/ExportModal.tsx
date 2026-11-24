import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Layers, 
  CheckCircle,
  FolderOpen,
  FolderCog,
  Check,
  AlertCircle
} from 'lucide-react';
import { DossierGroup, FilterState } from '../types/xml';
import { exportDossiersToExcel, ExportOptions, ExportResult } from '../utils/excelExporter';
import { 
  isDesktopMode, 
  getDesktopExportConfig, 
  saveDesktopExportConfig, 
  chooseDesktopExportDir, 
  openDesktopFileLocation,
  exportDesktopFilteredExcel,
  DesktopExportConfig 
} from '../utils/desktopBridge';

interface ExportModalProps {
  dossiers: DossierGroup[];
  filters: FilterState;
  onClose: () => void;
  totalCount?: number;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  dossiers,
  filters,
  onClose,
  totalCount = 0
}) => {
  const [tableChoice, setTableChoice] = useState<'XML1' | 'XML2' | 'XML3' | 'ALL_THREE'>('ALL_THREE');
  const [onlyItemsInDateRange, setOnlyItemsInDateRange] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportResult, setExportResult] = useState<ExportResult | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  // Desktop export settings
  const [isDesktop, setIsDesktop] = useState(false);
  const [desktopConfig, setDesktopConfig] = useState<DesktopExportConfig>({
    askEveryTime: true,
    defaultDir: '',
    autoOpenFolder: false
  });
  const [showConfigSettings, setShowConfigSettings] = useState(false);

  useEffect(() => {
    const desktopEnv = isDesktopMode();
    setIsDesktop(desktopEnv);
    if (desktopEnv) {
      getDesktopExportConfig().then(cfg => {
        setDesktopConfig(cfg);
      });
    }
  }, []);

  const totalXml1 = dossiers.length;
  const totalXml2 = dossiers.reduce((acc, d) => acc + d.xml2.length, 0);
  const totalXml3 = dossiers.reduce((acc, d) => acc + d.xml3.length, 0);

  // In desktop mode, totalCount is passed from backend filtered count
  const effectiveCount = isDesktop ? (totalCount > 0 ? totalCount : dossiers.length) : dossiers.length;

  const handleToggleAskEveryTime = async (val: boolean) => {
    const newCfg = { ...desktopConfig, askEveryTime: val };
    setDesktopConfig(newCfg);
    await saveDesktopExportConfig(newCfg);
  };

  const handleToggleAutoOpen = async (val: boolean) => {
    const newCfg = { ...desktopConfig, autoOpenFolder: val };
    setDesktopConfig(newCfg);
    await saveDesktopExportConfig(newCfg);
  };

  const handleChooseFolder = async () => {
    const res = await chooseDesktopExportDir();
    if (res.success && res.chosenDir) {
      setDesktopConfig(prev => ({ ...prev, defaultDir: res.chosenDir }));
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportResult(null);
    setExportError(null);

    try {
      await new Promise(r => setTimeout(r, 60));

      if (isDesktop) {
        // Native Desktop Export from SQLite directly (100% synchronized by MA_LK)
        const res = await exportDesktopFilteredExcel(filters, tableChoice, onlyItemsInDateRange);
        if (res.cancelled) {
          setIsExporting(false);
          return;
        }
        if (!res.success) {
          throw new Error('Không thể xuất dữ liệu từ cơ sở dữ liệu Desktop.');
        }
        setExportResult({
          totalExported: res.rowCount,
          fileName: res.fileName,
          filePath: res.filePath
        });
      } else {
        const options: ExportOptions = {
          tableChoice,
          onlyItemsInDateRange,
          fromDate: filters.fromDate,
          toDate: filters.toDate,
          dateField: filters.dateCriteria
        };

        const result = await exportDossiersToExcel(dossiers, options);
        if (result.cancelled) {
          setIsExporting(false);
          return;
        }
        setExportResult(result);
      }
    } catch (err: any) {
      console.error('Export error:', err);
      setExportError(err.message || 'Lỗi khi xuất file Excel. Vui lòng thử lại.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleOpenFileLocation = () => {
    if (exportResult?.filePath) {
      openDesktopFileLocation(exportResult.filePath);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 flex-shrink-0">
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
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Choices */}
        <div className="py-4 space-y-4 text-xs overflow-y-auto flex-1 min-h-0">
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
                    ? 'bg-teal-500/15 border-teal-500 text-white shadow-sm ring-1 ring-teal-500/30'
                    : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
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
                  {isDesktop ? `${effectiveCount.toLocaleString('vi-VN')} hồ sơ (Đồng bộ 3 bảng)` : `${(totalXml1 + totalXml2 + totalXml3).toLocaleString('vi-VN')} dòng`}
                </span>
              </label>

              {/* Option XML1 */}
              <label
                onClick={() => setTableChoice('XML1')}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  tableChoice === 'XML1'
                    ? 'bg-blue-500/15 border-blue-500 text-white shadow-sm ring-1 ring-blue-500/30'
                    : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
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
                  {isDesktop ? `${effectiveCount.toLocaleString('vi-VN')} hồ sơ` : `${totalXml1.toLocaleString('vi-VN')} hồ sơ`}
                </span>
              </label>

              {/* Option XML2 */}
              <label
                onClick={() => setTableChoice('XML2')}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  tableChoice === 'XML2'
                    ? 'bg-amber-500/15 border-amber-500 text-white shadow-sm ring-1 ring-amber-500/30'
                    : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
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
                  {isDesktop ? `Theo ${effectiveCount.toLocaleString('vi-VN')} hồ sơ` : `${totalXml2.toLocaleString('vi-VN')} dòng`}
                </span>
              </label>

              {/* Option XML3 */}
              <label
                onClick={() => setTableChoice('XML3')}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  tableChoice === 'XML3'
                    ? 'bg-purple-500/15 border-purple-500 text-white shadow-sm ring-1 ring-purple-500/30'
                    : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
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
                  {isDesktop ? `Theo ${effectiveCount.toLocaleString('vi-VN')} hồ sơ` : `${totalXml3.toLocaleString('vi-VN')} dòng`}
                </span>
              </label>
            </div>
          </div>

          {/* Filtering option checkbox */}
          {(filters.fromDate || filters.toDate) && (
            <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-xl">
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

          {/* Desktop Save Location Settings Box */}
          {isDesktop && (
            <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200 flex items-center gap-1.5 text-xs">
                  <FolderCog className="w-4 h-4 text-teal-400" />
                  <span>Cài Đặt Nơi Lưu File Excel (Bản Windows):</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowConfigSettings(!showConfigSettings)}
                  className="text-[11px] text-teal-400 hover:underline cursor-pointer"
                >
                  {showConfigSettings ? 'Thu gọn' : 'Tùy chỉnh nơi lưu'}
                </button>
              </div>

              {/* Mode switch */}
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={desktopConfig.askEveryTime}
                  onChange={(e) => handleToggleAskEveryTime(e.target.checked)}
                  className="rounded text-teal-500 focus:ring-teal-400 accent-teal-500 cursor-pointer"
                />
                <span className="text-xs font-medium">
                  Luôn hỏi vị trí lưu mỗi khi bấm xuất (Hộp thoại Save As của Windows)
                </span>
              </label>

              {(!desktopConfig.askEveryTime || showConfigSettings) && (
                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400 flex-shrink-0">Thư mục mặc định:</span>
                    <button
                      type="button"
                      onClick={handleChooseFolder}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>Đổi thư mục...</span>
                    </button>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 break-all select-all">
                    {desktopConfig.defaultDir || 'Thư mục Downloads của người dùng'}
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-300 pt-1">
                    <input
                      type="checkbox"
                      checked={desktopConfig.autoOpenFolder}
                      onChange={(e) => handleToggleAutoOpen(e.target.checked)}
                      className="rounded text-teal-500 focus:ring-teal-400 accent-teal-500 cursor-pointer"
                    />
                    <span className="text-xs text-slate-400">
                      Tự động mở thư mục chứa file ngay sau khi xuất xong
                    </span>
                  </label>
                </div>
              )}
            </div>
          )}

          {/* Export Success Result Box */}
          {exportResult && (
            <div className="p-3.5 bg-teal-500/10 border border-teal-500/30 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center gap-2 text-teal-300 font-bold">
                <CheckCircle className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span>Xuất file Excel thành công! ({exportResult.totalExported.toLocaleString('vi-VN')} dòng)</span>
              </div>

              {exportResult.filePath ? (
                <div className="space-y-2 pt-1">
                  <div className="text-[11px] text-slate-300 font-mono break-all bg-slate-950/60 p-2 rounded-lg border border-teal-500/20">
                    <span className="text-slate-400 block text-[10px]">Đã lưu tại đường dẫn:</span>
                    {exportResult.filePath}
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenFileLocation}
                    className="w-full py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-teal-500/40 transition-colors cursor-pointer"
                  >
                    <FolderOpen className="w-4 h-4 text-teal-400" />
                    <span>Mở Thư Mục Chứa File Trong Windows Explorer</span>
                  </button>
                </div>
              ) : (
                <div className="text-[11px] text-slate-300">
                  Tệp: <strong className="font-mono text-teal-400">{exportResult.fileName}</strong> đã được lưu vào máy.
                </div>
              )}
            </div>
          )}

          {exportError && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{exportError}</span>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs font-semibold cursor-pointer"
          >
            Đóng
          </button>

          <button
            onClick={handleExport}
            disabled={isExporting || effectiveCount === 0}
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
                <span>{exportResult ? 'Xuất Lại File Khác' : `Tiến Hành Xuất File Excel (${effectiveCount.toLocaleString('vi-VN')} hồ sơ)`}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
