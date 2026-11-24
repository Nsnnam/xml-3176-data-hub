import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Download, 
  Lock, 
  Trash2, 
  Activity,
  Layers,
  FolderOpen,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';
import { lockDailyAuth } from '../utils/auth';
import { getStoredTheme, applyAppTheme, AppTheme } from '../utils/theme';

interface NavbarProps {
  totalDossiers: number;
  xml1Count: number;
  xml2Count: number;
  xml3Count: number;
  importedFilesCount?: number;
  onOpenUpload: () => void;
  onOpenFileManager?: () => void;
  onOpenExport: () => void;
  onClearData: () => void;
  onLock: () => void;
  filteredCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  totalDossiers,
  xml1Count,
  xml2Count,
  xml3Count,
  importedFilesCount = 0,
  onOpenUpload,
  onOpenFileManager,
  onOpenExport,
  onClearData,
  onLock,
  filteredCount
}) => {
  const [theme, setTheme] = useState<AppTheme>(getStoredTheme);

  useEffect(() => {
    applyAppTheme(theme);
  }, [theme]);

  const handleThemeChange = (newTheme: AppTheme) => {
    setTheme(newTheme);
    applyAppTheme(newTheme);
  };

  const handleLockClick = () => {
    lockDailyAuth();
    onLock();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center shadow-md shadow-teal-500/20 flex-shrink-0">
              <Activity className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                  NsN XML DataHub
                  <span className="text-teal-400 font-mono text-xs px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30">
                    3176
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                  v1.1.3
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Tra cứu, tìm kiếm đa năng & lọc xuất XML 1-2-3 • QĐ 3176/QĐ-BYT
              </p>
            </div>
          </div>

          {/* Mobile Lock / Menu */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={handleLockClick}
              title="Khóa bảo mật trang"
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status badges */}
        {totalDossiers > 0 && (
          <div className="flex items-center flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <Layers className="w-3.5 h-3.5 text-teal-400" />
              <span>Hồ sơ:</span>
              <strong className="text-teal-400 font-mono">{filteredCount.toLocaleString('vi-VN')}</strong>
              {filteredCount !== totalDossiers && (
                <span className="text-slate-500 font-mono">/ {totalDossiers.toLocaleString('vi-VN')}</span>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>XML1:</span>
              <span className="text-blue-400 font-mono">{xml1Count.toLocaleString('vi-VN')}</span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>XML2 (Thuốc):</span>
              <span className="text-emerald-400 font-mono">{xml2Count.toLocaleString('vi-VN')}</span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span>XML3 (DVKT):</span>
              <span className="text-purple-400 font-mono">{xml3Count.toLocaleString('vi-VN')}</span>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all cursor-pointer shadow-sm"
          >
            <Upload className="w-3.5 h-3.5 text-teal-400" />
            <span>Nạp Excel</span>
          </button>

          {importedFilesCount > 0 && onOpenFileManager && (
            <button
              onClick={onOpenFileManager}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 hover:border-cyan-500/50 transition-all cursor-pointer shadow-sm"
              title="Quản lý danh sách file đã nạp (xóa từng file hoặc xóa tất cả)"
            >
              <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>File ({importedFilesCount})</span>
            </button>
          )}

          {totalDossiers > 0 && (
            <button
              onClick={onOpenExport}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 transition-all cursor-pointer shadow-md shadow-teal-500/20"
            >
              <Download className="w-3.5 h-3.5 text-slate-950 font-bold" />
              <span>Xuất Excel ({filteredCount})</span>
            </button>
          )}

          {totalDossiers > 0 && (
            <button
              onClick={onClearData}
              title="Xóa toàn bộ dữ liệu đang nạp"
              className="p-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <div className="h-4 w-[1px] bg-slate-800 hidden md:block mx-1" />

          {/* Theme Switcher: Y tế / Đen / Trắng */}
          <div className="flex items-center p-0.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => handleThemeChange('medical')}
              title="Giao diện Y tế (Xanh Navy & Cyan lâm sàng)"
              className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                theme === 'medical'
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden lg:inline">Y tế</span>
            </button>
            <button
              type="button"
              onClick={() => handleThemeChange('dark')}
              title="Giao diện Đen (Midnight pitch black)"
              className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-zinc-300" />
              <span className="hidden lg:inline">Đen</span>
            </button>
            <button
              type="button"
              onClick={() => handleThemeChange('light')}
              title="Giao diện Trắng (Medical clean hospital white)"
              className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-white text-slate-900 border border-slate-300 shadow-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden lg:inline">Trắng</span>
            </button>
          </div>

          <button
            onClick={handleLockClick}
            title="Khóa màn hình (yêu cầu mã namns để mở lại)"
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Khóa</span>
          </button>

          <a
            href="https://github.com/Nsnnam/xml-3176-data-hub"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub Repository"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
};
