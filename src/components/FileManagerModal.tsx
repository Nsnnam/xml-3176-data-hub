import React from 'react';
import { 
  X, 
  Trash2, 
  FileSpreadsheet, 
  HardDrive, 
  FileCheck2, 
  Plus, 
  AlertTriangle,
  Calendar,
  Layers
} from 'lucide-react';
import type { ImportedFileSummary, XmlTableType } from '../types/xml';

interface FileManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: ImportedFileSummary[];
  onRemoveFile: (fileId: string) => void;
  onClearAll: () => void;
  onOpenUpload: () => void;
}

export const FileManagerModal: React.FC<FileManagerModalProps> = ({
  isOpen,
  onClose,
  files,
  onRemoveFile,
  onClearAll,
  onOpenUpload
}) => {
  if (!isOpen) return null;

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getTableTypeBadge = (type: XmlTableType) => {
    switch (type) {
      case 'XML1':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">XML1 (Tổng hợp KCB)</span>;
      case 'XML2':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">XML2 (Thuốc & Dược liệu)</span>;
      case 'XML3':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">XML3 (DVKT & VTYT)</span>;
    }
  };

  const totalRows = files.reduce((acc, f) => acc + (f.recordCount || 0), 0);
  const totalBytes = files.reduce((acc, f) => acc + (f.fileSize || 0), 0);

  const handleConfirmRemove = (file: ImportedFileSummary) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa file "${file.fileName}" (${file.recordCount.toLocaleString('vi-VN')} dòng) khỏi hệ thống?`)) {
      onRemoveFile(file.id);
    }
  };

  const handleConfirmClearAll = () => {
    if (window.confirm('CẢNH BÁO: Bạn có chắc chắn muốn XÓA TẤT CẢ các file đầu vào và làm sạch toàn bộ dữ liệu? Thao tác này không thể hoàn tác!')) {
      onClearAll();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Quản Lý Danh Sách File Đầu Vào</span>
                <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-mono">
                  {files.length} file
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Cho phép xóa lần lượt từng file hoặc xóa tất cả các file đã nạp để giải phóng dữ liệu
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats banner */}
        <div className="px-6 py-3 bg-slate-950/50 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-slate-400">
            <span>Tổng cộng: <strong className="text-teal-400">{files.length}</strong> file</span>
            <span>•</span>
            <span>Tổng số dòng: <strong className="text-cyan-400">{totalRows.toLocaleString('vi-VN')}</strong> dòng</span>
            <span>•</span>
            <span>Tổng dung lượng: <strong className="text-slate-200">{formatFileSize(totalBytes)}</strong></span>
          </div>

          {files.length > 0 && (
            <button
              type="button"
              onClick={handleConfirmClearAll}
              className="px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 hover:text-rose-200 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa Tất Cả File Đã Nạp</span>
            </button>
          )}
        </div>

        {/* File Table / List */}
        <div className="flex-1 overflow-y-auto p-6">
          {files.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/30 space-y-3">
              <FileSpreadsheet className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-sm font-semibold text-slate-300">
                Chưa có file Excel XML nào được nạp vào hệ thống
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Bấm vào nút bên dưới để chọn các file XML1, XML2, XML3 định dạng Excel theo chuẩn QĐ 3176/QĐ-BYT.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenUpload();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nạp Thêm File Ngay</span>
              </button>
            </div>
          ) : (
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60 shadow-inner">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                    <th className="py-3 px-4 w-12 text-center">STT</th>
                    <th className="py-3 px-4">Tên File</th>
                    <th className="py-3 px-4">Loại Bảng</th>
                    <th className="py-3 px-4 text-right">Số Dòng</th>
                    <th className="py-3 px-4 text-right">Dung Lượng</th>
                    <th className="py-3 px-4 text-center">Thời Gian Nạp</th>
                    <th className="py-3 px-4 text-center w-20">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {files.map((file, idx) => (
                    <tr key={file.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 text-center text-slate-500 font-mono">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <FileCheck2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                          <span className="font-medium text-slate-200 truncate max-w-xs" title={file.fileName}>
                            {file.fileName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {getTableTypeBadge(file.tableType)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-200">
                        {file.recordCount.toLocaleString('vi-VN')}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-400 font-mono">
                        {formatFileSize(file.fileSize)}
                      </td>
                      <td className="py-3 px-4 text-center text-slate-500 text-[11px]">
                        {typeof file.loadedAt === 'string' ? file.loadedAt : file.loadedAt?.toLocaleString('vi-VN')}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleConfirmRemove(file)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Xóa file này khỏi hệ thống"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenUpload();
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-teal-400" />
            <span>Nạp Thêm File Excel...</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
