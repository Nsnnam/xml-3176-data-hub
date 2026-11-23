import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LockScreen } from './components/LockScreen';
import { FileUploader } from './components/FileUploader';
import { StatsOverview } from './components/StatsOverview';
import { FilterBar } from './components/FilterBar';
import { DossierTable } from './components/DossierTable';
import { DossierDetailModal } from './components/DossierDetailModal';
import { ExportModal } from './components/ExportModal';
import { 
  Xml1Record, 
  Xml2Record, 
  Xml3Record, 
  ImportedFileSummary, 
  FilterState, 
  DossierGroup 
} from './types/xml';
import { checkDailyAuth, lockDailyAuth } from './utils/auth';
import { ParseResult } from './utils/excelParser';
import { buildDossierGroups, filterDossiers, computeSummaryStats } from './utils/searchEngine';
import { 
  Upload, 
  FileSpreadsheet, 
  Layers, 
  FolderOpen, 
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export const App: React.FC = () => {
  // 1. Daily Security Lock State
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => checkDailyAuth());

  // 2. Data Stores
  const [importedFiles, setImportedFiles] = useState<ImportedFileSummary[]>([]);
  const [fileRecordMap, setFileRecordMap] = useState<Record<string, { type: string; records: any[] }>>({});
  
  // 3. UI State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState<DossierGroup | null>(null);

  // 4. Filtering State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    dateCriteria: 'ALL_DATES',
    fromDate: '',
    toDate: '',
    maKhoa: '',
    maLoaiKcb: '',
    hasDrugsOnly: false,
    hasServicesOnly: false
  });

  // Rebuild consolidated lists from fileRecordMap
  const { xml1List, xml2List, xml3List } = useMemo(() => {
    const x1: Xml1Record[] = [];
    const x2: Xml2Record[] = [];
    const x3: Xml3Record[] = [];

    for (const item of Object.values(fileRecordMap)) {
      if (item.type === 'XML1') x1.push(...item.records);
      else if (item.type === 'XML2') x2.push(...item.records);
      else if (item.type === 'XML3') x3.push(...item.records);
    }

    return { xml1List: x1, xml2List: x2, xml3List: x3 };
  }, [fileRecordMap]);

  // Consolidated dossiers linked by MA_LK
  const allDossiers = useMemo(() => {
    return buildDossierGroups(xml1List, xml2List, xml3List);
  }, [xml1List, xml2List, xml3List]);

  // Unique departments for filter dropdown
  const availableDepartments = useMemo(() => {
    const depts = new Set<string>();
    for (const d of allDossiers) {
      if (d.maKhoa) depts.add(d.maKhoa);
    }
    return Array.from(depts).sort();
  }, [allDossiers]);

  // Filtered results
  const filteredHighlights = useMemo(() => {
    return filterDossiers(allDossiers, filters);
  }, [allDossiers, filters]);

  const filteredDossiers = useMemo(() => {
    return filteredHighlights.map(h => h.dossier);
  }, [filteredHighlights]);

  // Analytics stats
  const stats = useMemo(() => {
    return computeSummaryStats(filteredDossiers);
  }, [filteredDossiers]);

  // Handler for parsing new files
  const handleFilesParsed = (results: ParseResult[]) => {
    const newSummaryList: ImportedFileSummary[] = [];
    const newMap = { ...fileRecordMap };

    for (const res of results) {
      const fileId = `${res.fileName}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      
      newSummaryList.push({
        id: fileId,
        fileName: res.fileName,
        fileSize: res.fileSize,
        tableType: res.tableType,
        recordCount: res.rowCount,
        loadedAt: new Date()
      });

      newMap[fileId] = {
        type: res.tableType,
        records: res.records
      };
    }

    setImportedFiles(prev => [...prev, ...newSummaryList]);
    setFileRecordMap(newMap);
    setIsUploadModalOpen(false);
  };

  // Remove individual file
  const handleRemoveFile = (fileId: string) => {
    setImportedFiles(prev => prev.filter(f => f.id !== fileId));
    setFileRecordMap(prev => {
      const updated = { ...prev };
      delete updated[fileId];
      return updated;
    });
  };

  // Clear all data
  const handleClearData = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ dữ liệu đang nạp trong phiên làm việc này?')) {
      setImportedFiles([]);
      setFileRecordMap({});
      setFilters({
        searchQuery: '',
        dateCriteria: 'ALL_DATES',
        fromDate: '',
        toDate: '',
        maKhoa: '',
        maLoaiKcb: '',
        hasDrugsOnly: false,
        hasServicesOnly: false
      });
    }
  };

  // Lock system
  const handleLock = () => {
    lockDailyAuth();
    setIsUnlocked(false);
  };

  // If daily auth is locked, show lock screen
  if (!isUnlocked) {
    return <LockScreen onUnlock={() => setIsUnlocked(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        totalDossiers={allDossiers.length}
        filteredCount={filteredDossiers.length}
        xml1Count={xml1List.length}
        xml2Count={xml2List.length}
        xml3Count={xml3List.length}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onClearData={handleClearData}
        onLock={handleLock}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* If no files imported yet: Welcome Hero & Uploader */}
        {allDossiers.length === 0 ? (
          <div className="max-w-4xl mx-auto space-y-6 py-6">
            {/* Hero Welcome */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Hệ Thống Phân Tích & Lọc Xuất XML 3176 Thông Minh</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Tra Cứu Dữ Liệu BHYT XML 1 - 2 - 3 <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-teal-200">
                  Chuẩn Quyết Định 3176/QĐ-BYT
                </span>
              </h1>
              <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Nạp trực tiếp các file Excel XML1 (Tổng hợp), XML2 (Thuốc) và XML3 (DVKT & VTYT).
                Hệ thống tự động liên kết hồ sơ theo <strong>Mã LK</strong>, hỗ trợ tìm kiếm toàn diện mọi thông tin, lọc thời gian và xuất file Excel chuẩn.
              </p>
            </div>

            {/* Test data reminder tip card */}
            <div className="p-4 rounded-2xl bg-teal-950/30 border border-teal-500/30 text-xs text-teal-300 flex items-start gap-3 shadow-lg shadow-teal-950/20">
              <FolderOpen className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-teal-200 text-sm font-semibold mb-1">
                  Đã có sẵn dữ liệu test thử tại máy của bạn:
                </strong>
                <code className="px-2 py-1 rounded bg-slate-900 border border-teal-500/30 text-teal-300 font-mono text-[11px] block sm:inline-block break-all">
                  C:\Users\Admin\Downloads\XML chuẩn đã check cổng\XML chuẩn đã check cổng
                </code>
                <p className="mt-1.5 text-slate-400">
                  Bạn chỉ cần mở thư mục trên rồi kéo thả các file <code>XML1_*.xlsx</code>, <code>XML2_*.xlsx</code>, <code>XML3_*.xlsx</code> trực tiếp vào khung bên dưới!
                </p>
              </div>
            </div>

            {/* Primary Uploader */}
            <FileUploader
              onFilesParsed={handleFilesParsed}
              importedFiles={importedFiles}
              onRemoveFile={handleRemoveFile}
            />
          </div>
        ) : (
          /* When files are loaded: Full Dashboard View */
          <div className="space-y-6">
            {/* KPI Statistics */}
            <StatsOverview stats={stats} />

            {/* Filter Bar (Omni Search & Date Pickers) */}
            <FilterBar
              filters={filters}
              onFilterChange={setFilters}
              onResetFilters={() => setFilters({
                searchQuery: '',
                dateCriteria: 'ALL_DATES',
                fromDate: '',
                toDate: '',
                maKhoa: '',
                maLoaiKcb: '',
                hasDrugsOnly: false,
                hasServicesOnly: false
              })}
              availableDepartments={availableDepartments}
              totalMatched={filteredDossiers.length}
              totalRecords={allDossiers.length}
            />

            {/* Data Table */}
            <DossierTable
              items={filteredHighlights}
              onSelectDossier={(d) => setSelectedDossier(d)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-4 py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>
              NsN XML DataHub 3176 • Tác giả: <strong className="text-slate-300">Nguyễn Sơn Nam (Nsnnam)</strong>
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Client-Side Data Processing • Tuyệt đối không gửi dữ liệu ra máy chủ</span>
            <span>•</span>
            <a
              href="https://github.com/Nsnnam/xml-3176-data-hub"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 hover:underline"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>

      {/* Modal: Uploader popup (when clicked "Nạp Excel" in navbar) */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="w-full max-w-2xl relative">
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <FileUploader
              onFilesParsed={handleFilesParsed}
              importedFiles={importedFiles}
              onRemoveFile={handleRemoveFile}
            />
          </div>
        </div>
      )}

      {/* Modal: Dossier Details */}
      {selectedDossier && (
        <DossierDetailModal
          dossier={selectedDossier}
          onClose={() => setSelectedDossier(null)}
        />
      )}

      {/* Modal: Export to Excel */}
      {isExportModalOpen && (
        <ExportModal
          dossiers={filteredDossiers}
          filters={filters}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
