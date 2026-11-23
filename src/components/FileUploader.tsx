import React, { useRef, useState, useEffect } from 'react';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  Trash2, 
  FileCheck2, 
  Sparkles,
  FolderOpen,
  HardDrive,
  AlertCircle
} from 'lucide-react';
import type { ImportedFileSummary, XmlTableType } from '../types/xml';
import { parseExcelFile, ParseResult } from '../utils/excelParser';
import { 
  isDesktopMode, 
  openNativeFileDialog, 
  startDesktopImport, 
  getDesktopImportProgress 
} from '../utils/desktopBridge';

interface FileUploaderProps {
  onFilesParsed: (results: ParseResult[]) => void;
  importedFiles: ImportedFileSummary[];
  onRemoveFile: (fileId: string) => void;
  onClearAllFiles?: () => void;
  onRefreshDesktop?: () => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesParsed,
  importedFiles,
  onRemoveFile,
  onClearAllFiles,
  onRefreshDesktop
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [progressMsg, setProgressMsg] = useState('');
  const [desktopProgress, setDesktopProgress] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const desktop = isDesktopMode();

  // Poll desktop import progress
  useEffect(() => {
    let interval: any = null;
    if (isLoading && desktop) {
      interval = setInterval(async () => {
        try {
          const prog = await getDesktopImportProgress();
          setDesktopProgress(prog);
          if (!prog.is_importing) {
            setIsLoading(false);
            if (prog.error) {
              setErrorMsg(prog.error);
            } else if (onRefreshDesktop) {
              onRefreshDesktop();
            }
          }
        } catch (e) {
          console.error(e);
        }
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isLoading, desktop, onRefreshDesktop]);

  const handleNativeOpen = async () => {
    try {
      setErrorMsg('');
      const paths = await openNativeFileDialog();
      if (!paths || paths.length === 0) return;

      setIsLoading(true);
      setProgressMsg(`Đang bắt đầu nạp ${paths.length} file vào cơ sở dữ liệu SQLite...`);
      await startDesktopImport(paths);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Lỗi mở file: ' + (err.message || 'Vui lòng thử lại.'));
      setIsLoading(false);
    }
  };

  const processFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsLoading(true);
    setErrorMsg('');

    const results: ParseResult[] = [];
    const fileArray = Array.from(files).filter(f => f.name.endsWith('.xlsx') || f.name.endsWith('.xls'));

    if (fileArray.length === 0) {
      setErrorMsg('Vui lòng chọn file Excel có định dạng .xlsx hoặc .xls');
      setIsLoading(false);
      return;
    }

    try {
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        setProgressMsg(`Đang phân tích file ${i + 1}/${fileArray.length}: ${file.name}...`);
        await new Promise(r => setTimeout(r, 10));
        const parsed = await parseExcelFile(file);
        results.push(parsed);
      }

      onFilesParsed(results);
      setProgressMsg('');
    } catch (err: any) {
      console.error('File parsing error:', err);
      setErrorMsg(err.message || 'Lỗi khi đọc file Excel. Vui lòng kiểm tra lại file.');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getTableTypeBadge = (type: XmlTableType) => {
    switch (type) {
      case 'XML1':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">XML1 (Tổng hợp)</span>;
      case 'XML2':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">XML2 (Thuốc)</span>;
      case 'XML3':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">XML3 (DVKT & VTYT)</span>;
    }
  };

  const handleRemoveSingle = (f: ImportedFileSummary) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa file "${f.fileName}"?`)) {
      onRemoveFile(f.id);
    }
  };

  const handleClearAll = () => {
    if (onClearAllFiles) {
      if (window.confirm('CẢNH BÁO: Bạn có chắc muốn xóa TẤT CẢ các file đầu vào đã nạp?')) {
        onClearAllFiles();
      }
    }
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-4">
      {/* Header text */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-teal-400" />
            <span>Nạp Dữ Liệu XML 1, 2, 3 (Định dạng Excel 3176)</span>
            {desktop && (
              <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-400 border border-teal-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                <HardDrive className="w-3 h-3" />
                <span>Desktop SQLite Engine</span>
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Tự động nhận diện bảng XML1, XML2, XML3 — <strong>không cần file mẫu</strong>. Xử lý dữ liệu lớn không tràn RAM.</span>
          </p>
        </div>

        {importedFiles.length > 0 && (
          <div className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            Đã nạp <strong className="text-teal-400">{importedFiles.length}</strong> file
          </div>
        )}
      </div>

      {/* Desktop Native Button (when running in Desktop mode) */}
      {desktop && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-teal-950/40 via-slate-900 to-cyan-950/40 border border-teal-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
              <FolderOpen className="w-4 h-4 text-teal-400" />
              <span>Nạp File Trực Tiếp Bằng Hộp Thoại Windows</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Hỗ trợ chọn hàng chục file Excel cùng lúc. Dữ liệu được ghi thẳng vào SQLite ổ cứng, hoàn toàn không bị tràn RAM.
            </p>
          </div>

          <button
            type="button"
            onClick={handleNativeOpen}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-500/25 transition-all cursor-pointer disabled:opacity-50 flex-shrink-0"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Chọn File Excel Từ Ổ Đĩa...</span>
          </button>
        </div>
      )}

      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && (!desktop ? fileInputRef.current?.click() : handleNativeOpen())}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-teal-400 bg-teal-500/10 scale-[1.005]'
            : 'border-slate-700/80 hover:border-teal-500/50 bg-slate-950/40 hover:bg-slate-950/70'
        } ${isLoading ? 'opacity-60 cursor-wait' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="hidden"
          disabled={isLoading}
        />

        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shadow-inner">
            <UploadCloud className="w-7 h-7" />
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              Kéo thả các file Excel XML1, XML2, XML3 vào đây, hoặc <span className="text-teal-400 underline underline-offset-2">bấm để chọn file</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Hỗ trợ nạp cùng lúc nhiều file .xlsx / .xls theo chuẩn QĐ 3176/QĐ-BYT
            </p>
          </div>

          {isLoading && (
            <div className="mt-2 flex items-center gap-2 text-xs text-teal-400 font-medium bg-teal-500/10 px-4 py-2 rounded-full border border-teal-500/30">
              <div className="w-3.5 h-3.5 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
              <span>
                {desktopProgress
                  ? `Đang nạp file ${desktopProgress.completed_files + 1}/${desktopProgress.total_files}: ${desktopProgress.current_file} (${desktopProgress.current_rows.toLocaleString()} dòng)...`
                  : progressMsg || 'Đang xử lý dữ liệu...'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Error message */}
      {errorMsg && (
        <div className="flex items-center gap-2 text-rose-400 text-xs bg-rose-500/10 py-2.5 px-3.5 rounded-xl border border-rose-500/20">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* List of imported files (Xóa lần lượt hoặc xóa tất cả) */}
      {importedFiles.length > 0 && (
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span>Danh sách file đã nạp ({importedFiles.length})</span>
            </h3>

            {onClearAllFiles && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors cursor-pointer"
                title="Xóa toàn bộ các file đã nạp"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa Tất Cả File</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-52 overflow-y-auto pr-1">
            {importedFiles.map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileCheck2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-slate-200 font-medium truncate" title={f.fileName}>
                      {f.fileName}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                      <span>{f.recordCount.toLocaleString('vi-VN')} dòng</span>
                      <span>•</span>
                      <span>{formatFileSize(f.fileSize)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {getTableTypeBadge(f.tableType)}
                  <button
                    onClick={() => handleRemoveSingle(f)}
                    title="Xóa file này"
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/15 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
