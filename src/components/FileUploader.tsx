import React, { useRef, useState } from 'react';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertCircle, 
  X, 
  FileCheck2, 
  Sparkles,
  Info
} from 'lucide-react';
import { ImportedFileSummary, XmlTableType } from '../types/xml';
import { parseExcelFile, ParseResult } from '../utils/excelParser';

interface FileUploaderProps {
  onFilesParsed: (results: ParseResult[]) => void;
  importedFiles: ImportedFileSummary[];
  onRemoveFile: (fileId: string) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesParsed,
  importedFiles,
  onRemoveFile
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [progressMsg, setProgressMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        
        // Give UI a chance to render progress
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

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      {/* Header text */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-teal-400" />
            <span>Nạp Dữ liệu XML 1, 2, 3 (Định dạng Excel 3176)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Tự động nhận diện bảng XML1 (Tổng hợp), XML2 (Thuốc), XML3 (DVKT) qua cấu trúc cột mà <strong>không cần file mẫu</strong>.</span>
          </p>
        </div>

        {importedFiles.length > 0 && (
          <div className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            Đã nạp <strong className="text-teal-400">{importedFiles.length}</strong> file
          </div>
        )}
      </div>

      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
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
              Hỗ trợ nạp cùng lúc nhiều file .xlsx / .xls theo chuẩn QĐ 3176/QĐ-BYT • Xử lý hoàn toàn trong máy (Client-Side)
            </p>
          </div>

          {isLoading && (
            <div className="mt-2 flex items-center gap-2 text-xs text-teal-400 font-medium bg-teal-500/10 px-3 py-1.5 rounded-full border border-teal-500/30">
              <div className="w-3.5 h-3.5 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
              <span>{progressMsg || 'Đang xử lý dữ liệu...'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Error message */}
      {errorMsg && (
        <div className="mt-3 flex items-center gap-2 text-rose-400 text-xs bg-rose-500/10 py-2.5 px-3.5 rounded-xl border border-rose-500/20">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* List of imported files */}
      {importedFiles.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-800">
          <h3 className="text-xs font-semibold text-slate-400 mb-2.5 uppercase tracking-wider flex items-center justify-between">
            <span>Danh sách file đã nạp ({importedFiles.length})</span>
            <span className="text-[11px] font-normal text-slate-500">Bấm dấu × để bỏ file nếu cần</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
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
                    onClick={() => onRemoveFile(f.id)}
                    title="Bỏ file này"
                    className="p-1 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
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
