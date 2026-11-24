import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { LockScreen } from './components/LockScreen';
import { FileUploader } from './components/FileUploader';
import { StatsOverview } from './components/StatsOverview';
import { FilterBar } from './components/FilterBar';
import { DossierTable } from './components/DossierTable';
import { DossierDetailModal } from './components/DossierDetailModal';
import { ExportModal } from './components/ExportModal';
import { InputPickerModal, PickerType, PickerItem } from './components/InputPickerModal';
import { AdvancedColumnFilterModal } from './components/AdvancedColumnFilterModal';
import { FileManagerModal } from './components/FileManagerModal';
import type { 
  Xml1Record, 
  Xml2Record, 
  Xml3Record, 
  ImportedFileSummary, 
  FilterState, 
  DossierGroup,
  SearchMatchHighlight,
  SummaryStats
} from './types/xml';
import { checkDailyAuth, lockDailyAuth } from './utils/auth';
import type { ParseResult } from './utils/excelParser';
import { buildDossierGroups, filterDossiers, computeSummaryStats } from './utils/searchEngine';
import { exportDossiersToExcel } from './utils/excelExporter';
import { 
  isDesktopMode, 
  getDesktopFilesList, 
  getDesktopStats, 
  getDesktopDistinctValues,
  queryDesktopDossiers,
  getDesktopDossierDetail,
  deleteDesktopFile,
  clearDesktopData,
  exportDesktopStatistic
} from './utils/desktopBridge';
import { 
  Sparkles,
  FolderOpen,
  ShieldCheck,
  HardDrive
} from 'lucide-react';

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  searchColumn: 'ALL',
  exactMatch: false,
  dateCriteria: 'ALL_DATES',
  fromDate: '',
  toDate: '',
  maKhoa: '',
  maLoaiKcb: '',
  hasDrugsOnly: false,
  hasServicesOnly: false,
  pickedIcds: [],
  pickedDrugs: [],
  pickedServices: [],
  pickedGroups: [],
  matchMode: 'OR',
  ketQuaDtri: '',
  maLoaiRv: '',
  gioiTinh: '',
  dauMaThe: '',
  maMay: '',
  duongDung: '',
  minCost: '',
  maxCost: '',
  customRules: []
};

export const App: React.FC = () => {
  // 1. Security Lock State
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => checkDailyAuth());

  // 2. Desktop Mode detection
  const desktop = useMemo(() => isDesktopMode(), []);

  // 3. Browser Mode Data Stores
  const [importedFiles, setImportedFiles] = useState<ImportedFileSummary[]>([]);
  const [fileRecordMap, setFileRecordMap] = useState<Record<string, { type: string; records: any[] }>>({});

  // 4. Desktop Mode Data Stores
  const [desktopStats, setDesktopStats] = useState<SummaryStats | null>(null);
  const [desktopDistinct, setDesktopDistinct] = useState<any>(null);
  const [desktopQueryResult, setDesktopQueryResult] = useState<any>(null);

  // 5. UI State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isFileManagerModalOpen, setIsFileManagerModalOpen] = useState(false);
  const [isColumnFilterModalOpen, setIsColumnFilterModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState<DossierGroup | null>(null);
  const [pickerModal, setPickerModal] = useState<{ isOpen: boolean; type: PickerType }>({
    isOpen: false,
    type: 'ICD'
  });

  // 6. Filtering State
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Desktop data refresher
  const refreshDesktopData = useCallback(async () => {
    if (!desktop) return;
    try {
      const [files, statsData, distinctData] = await Promise.all([
        getDesktopFilesList(),
        getDesktopStats(),
        getDesktopDistinctValues()
      ]);

      setImportedFiles(files.map((f: any) => ({
        id: f.id,
        fileName: f.file_name,
        fileSize: f.file_size,
        tableType: f.table_type,
        recordCount: f.record_count,
        loadedAt: f.loaded_at
      })));

      setDesktopStats(statsData);
      setDesktopDistinct(distinctData);

      const qRes = await queryDesktopDossiers(filters, 1, 100);
      setDesktopQueryResult(qRes);
    } catch (err) {
      console.error('Desktop refresh error:', err);
    }
  }, [desktop, filters]);

  // Initial load for desktop mode
  useEffect(() => {
    if (desktop && isUnlocked) {
      refreshDesktopData();
    }
  }, [desktop, isUnlocked, refreshDesktopData]);

  // In Browser Mode: rebuild lists
  const { xml1List, xml2List, xml3List } = useMemo(() => {
    if (desktop) return { xml1List: [], xml2List: [], xml3List: [] };
    const x1: Xml1Record[] = [];
    const x2: Xml2Record[] = [];
    const x3: Xml3Record[] = [];

    for (const item of Object.values(fileRecordMap)) {
      if (item.type === 'XML1') x1.push(...item.records);
      else if (item.type === 'XML2') x2.push(...item.records);
      else if (item.type === 'XML3') x3.push(...item.records);
    }

    return { xml1List: x1, xml2List: x2, xml3List: x3 };
  }, [fileRecordMap, desktop]);

  // Consolidated dossiers in browser mode
  const browserDossiers = useMemo(() => {
    if (desktop) return [];
    return buildDossierGroups(xml1List, xml2List, xml3List);
  }, [xml1List, xml2List, xml3List, desktop]);

  // Filtered highlights in browser mode
  const browserFilteredHighlights = useMemo(() => {
    if (desktop) return [];
    return filterDossiers(browserDossiers, filters);
  }, [browserDossiers, filters, desktop]);

  // Final display items
  const displayItems: SearchMatchHighlight[] = useMemo(() => {
    if (desktop) {
      return desktopQueryResult?.items || [];
    }
    return browserFilteredHighlights;
  }, [desktop, desktopQueryResult, browserFilteredHighlights]);

  // Final stats
  const currentStats: SummaryStats = useMemo(() => {
    if (desktop && desktopStats) {
      return desktopStats;
    }
    return computeSummaryStats(browserFilteredHighlights.map(h => h.dossier));
  }, [desktop, desktopStats, browserFilteredHighlights]);

  // Available departments
  const availableDepartments = useMemo(() => {
    if (desktop && desktopDistinct?.departments) {
      return desktopDistinct.departments;
    }
    const depts = new Set<string>();
    for (const d of browserDossiers) {
      if (d.maKhoa) depts.add(d.maKhoa);
    }
    return Array.from(depts).sort();
  }, [desktop, desktopDistinct, browserDossiers]);

  // Distinct items for Picker Modals
  const pickerItems: PickerItem[] = useMemo(() => {
    const type = pickerModal.type;

    if (desktop && desktopDistinct) {
      if (type === 'GROUPS') {
        return (desktopDistinct.groups || []).map((g: any) => ({
          code: String(g.ma_nhom),
          name: '',
          count: g.count,
          extra: g.source
        }));
      } else if (type === 'ICD') {
        return (desktopDistinct.icds || []).map((d: any) => ({
          code: d.code,
          name: d.name || '',
          count: d.count
        }));
      } else if (type === 'DRUGS') {
        return (desktopDistinct.drugs || []).map((dr: any) => ({
          code: dr.code || dr.name,
          name: dr.name,
          count: dr.count,
          extra: dr.ham_luong
        }));
      } else if (type === 'SERVICES') {
        return (desktopDistinct.services || []).map((s: any) => ({
          code: s.code || s.name,
          name: s.name,
          count: s.count,
          extra: s.ma_nhom ? `Nhóm: ${s.ma_nhom}` : ''
        }));
      } else if (type === 'PATIENTS') {
        return (desktopDistinct.patients || []).map((p: any) => ({
          code: p.code,
          name: p.name || '',
          count: p.count
        }));
      } else if (type === 'DEPARTMENTS') {
        return (desktopDistinct.departments || []).map((d: any) => ({
          code: typeof d === 'string' ? d : d.code,
          name: typeof d === 'string' ? d : d.name,
          count: typeof d === 'string' ? 1 : d.count || 1
        }));
      } else if (type === 'CARDS') {
        return (desktopDistinct.cards || []).map((c: any) => ({
          code: c.code,
          name: c.name || '',
          count: c.count
        }));
      } else if (type === 'DOCTORS') {
        return (desktopDistinct.doctors || []).map((doc: any) => ({
          code: doc.code,
          name: doc.name || '',
          count: doc.count
        }));
      } else if (type === 'MACHINES') {
        return (desktopDistinct.machines || []).map((m: any) => ({
          code: m.code,
          name: m.name || '',
          count: m.count
        }));
      }
    }

    // In-browser fallback extraction
    if (type === 'GROUPS') {
      const gMap = new Map<string, number>();
      for (const d of browserDossiers) {
        for (const dr of d.xml2) if (dr.MA_NHOM) gMap.set(String(dr.MA_NHOM), (gMap.get(String(dr.MA_NHOM)) || 0) + 1);
        for (const sv of d.xml3) if (sv.MA_NHOM) gMap.set(String(sv.MA_NHOM), (gMap.get(String(sv.MA_NHOM)) || 0) + 1);
      }
      return Array.from(gMap.entries()).map(([code, count]) => ({ code, name: '', count }));
    } else if (type === 'ICD') {
      const icdMap = new Map<string, { name: string; count: number }>();
      for (const d of browserDossiers) {
        if (d.maBenhChinh) {
          const ex = icdMap.get(d.maBenhChinh) || { name: d.tenBenhChinh || '', count: 0 };
          ex.count++;
          icdMap.set(d.maBenhChinh, ex);
        }
      }
      return Array.from(icdMap.entries()).map(([code, val]) => ({ code, name: val.name, count: val.count }));
    } else if (type === 'DRUGS') {
      const drMap = new Map<string, { code: string; count: number; extra?: string }>();
      for (const d of browserDossiers) {
        for (const dr of d.xml2) {
          const name = String(dr.TEN_THUOC || dr.MA_THUOC || '');
          if (name) {
            const ex = drMap.get(name) || { code: String(dr.MA_THUOC || ''), count: 0, extra: String(dr.HAM_LUONG || '') };
            ex.count++;
            drMap.set(name, ex);
          }
        }
      }
      return Array.from(drMap.entries()).map(([name, val]) => ({ code: val.code || name, name, count: val.count, extra: val.extra }));
    } else if (type === 'SERVICES') {
      const svMap = new Map<string, { code: string; count: number; extra?: string }>();
      for (const d of browserDossiers) {
        for (const sv of d.xml3) {
          const name = String(sv.TEN_DICH_VU || sv.TEN_VAT_TU || sv.MA_DICH_VU || '');
          if (name) {
            const ex = svMap.get(name) || { code: String(sv.MA_DICH_VU || sv.MA_VAT_TU || ''), count: 0, extra: sv.MA_NHOM ? `Nhóm ${sv.MA_NHOM}` : '' };
            ex.count++;
            svMap.set(name, ex);
          }
        }
      }
      return Array.from(svMap.entries()).map(([name, val]) => ({ code: val.code || name, name, count: val.count, extra: val.extra }));
    } else if (type === 'PATIENTS') {
      const pMap = new Map<string, { name: string; count: number }>();
      for (const d of browserDossiers) {
        if (d.maBn) {
          const ex = pMap.get(d.maBn) || { name: d.hoTen || '', count: 0 };
          ex.count++;
          pMap.set(d.maBn, ex);
        }
      }
      return Array.from(pMap.entries()).map(([code, val]) => ({ code, name: val.name, count: val.count }));
    } else if (type === 'DEPARTMENTS') {
      const dMap = new Map<string, number>();
      for (const d of browserDossiers) {
        const k = d.xml1?.MA_KHOA || d.maKhoa;
        if (k) dMap.set(k, (dMap.get(k) || 0) + 1);
      }
      return Array.from(dMap.entries()).map(([code, count]) => ({ code, name: code, count }));
    } else if (type === 'CARDS') {
      const cMap = new Map<string, { name: string; count: number }>();
      for (const d of browserDossiers) {
        if (d.maThe) {
          const ex = cMap.get(d.maThe) || { name: d.hoTen || '', count: 0 };
          ex.count++;
          cMap.set(d.maThe, ex);
        }
      }
      return Array.from(cMap.entries()).map(([code, val]) => ({ code, name: val.name, count: val.count }));
    } else if (type === 'DOCTORS') {
      const docMap = new Map<string, number>();
      for (const d of browserDossiers) {
        for (const s of d.xml3) if (s.NGUOI_THUC_HIEN) docMap.set(s.NGUOI_THUC_HIEN, (docMap.get(s.NGUOI_THUC_HIEN) || 0) + 1);
      }
      return Array.from(docMap.entries()).map(([code, count]) => ({ code, name: code, count }));
    } else if (type === 'MACHINES') {
      const mMap = new Map<string, { name: string; count: number }>();
      for (const d of browserDossiers) {
        for (const s of d.xml3) {
          if (s.MA_MAY) {
            const ex = mMap.get(s.MA_MAY) || { name: s.TEN_DICH_VU || '', count: 0 };
            ex.count++;
            mMap.set(s.MA_MAY, ex);
          }
        }
      }
      return Array.from(mMap.entries()).map(([code, val]) => ({ code, name: val.name, count: val.count }));
    }

    return [];
  }, [pickerModal.type, desktop, desktopDistinct, browserDossiers]);

  // Handler for applying selected codes from Picker Modal
  const handleApplyPicked = (selectedCodes: string[]) => {
    switch (pickerModal.type) {
      case 'GROUPS':
        setFilters(f => ({ ...f, pickedGroups: selectedCodes }));
        break;
      case 'ICD':
        setFilters(f => ({ ...f, pickedIcds: selectedCodes }));
        break;
      case 'DRUGS':
        setFilters(f => ({ ...f, pickedDrugs: selectedCodes }));
        break;
      case 'SERVICES':
        setFilters(f => ({ ...f, pickedServices: selectedCodes }));
        break;
      case 'PATIENTS':
        setFilters(f => ({ ...f, pickedPatients: selectedCodes }));
        break;
      case 'DEPARTMENTS':
        setFilters(f => ({ ...f, pickedDepartments: selectedCodes }));
        break;
      case 'CARDS':
        setFilters(f => ({ ...f, pickedCards: selectedCodes }));
        break;
      case 'DOCTORS':
        setFilters(f => ({ ...f, pickedDoctors: selectedCodes }));
        break;
      case 'MACHINES':
        setFilters(f => ({ ...f, pickedMachines: selectedCodes }));
        break;
    }
  };

  // Currently selected codes for the open picker
  const currentSelectedCodes = useMemo(() => {
    switch (pickerModal.type) {
      case 'GROUPS': return filters.pickedGroups || [];
      case 'ICD': return filters.pickedIcds || [];
      case 'DRUGS': return filters.pickedDrugs || [];
      case 'SERVICES': return filters.pickedServices || [];
      case 'PATIENTS': return filters.pickedPatients || [];
      case 'DEPARTMENTS': return filters.pickedDepartments || [];
      case 'CARDS': return filters.pickedCards || [];
      case 'DOCTORS': return filters.pickedDoctors || [];
      case 'MACHINES': return filters.pickedMachines || [];
      default: return [];
    }
  }, [pickerModal.type, filters]);

  // 1-Click Excel Export from Statistics item
  const handleExportStatItem = async (statType: 'ICD' | 'DRUG' | 'SERVICE' | 'DEPARTMENT', keyValue: string) => {
    if (desktop) {
      const res = await exportDesktopStatistic(statType, keyValue);
      alert(`Đã xuất thành công ${res.rowCount} dòng vào file: ${res.fileName} (Thư mục Downloads)!`);
    } else {
      if (statType === 'ICD') {
        const matches = browserDossiers.filter(d => d.maBenhChinh === keyValue || (d.xml1?.MA_BENH_KT || '').includes(keyValue));
        exportDossiersToExcel(matches, { tableChoice: 'XML1' });
      } else if (statType === 'DRUG') {
        const matches = browserDossiers.filter(d => d.xml2.some(dr => dr.TEN_THUOC === keyValue || dr.MA_THUOC === keyValue));
        exportDossiersToExcel(matches, { tableChoice: 'XML2' });
      } else if (statType === 'SERVICE') {
        const matches = browserDossiers.filter(d => d.xml3.some(sv => sv.TEN_DICH_VU === keyValue || sv.MA_DICH_VU === keyValue || sv.TEN_VAT_TU === keyValue));
        exportDossiersToExcel(matches, { tableChoice: 'XML3' });
      } else if (statType === 'DEPARTMENT') {
        const matches = browserDossiers.filter(d => d.maKhoa === keyValue);
        exportDossiersToExcel(matches, { tableChoice: 'ALL_THREE' });
      }
    }
  };

  // Inspect dossier details
  const handleSelectDossier = async (dossier: DossierGroup) => {
    if (desktop) {
      const fullDetail = await getDesktopDossierDetail(dossier.maLk);
      setSelectedDossier(fullDetail || dossier);
    } else {
      setSelectedDossier(dossier);
    }
  };

  // Browser Mode File Parsed Handler
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

  // Remove individual file (Xóa lần lượt)
  const handleRemoveFile = async (fileId: string) => {
    if (desktop) {
      await deleteDesktopFile(fileId);
      refreshDesktopData();
    } else {
      setImportedFiles(prev => prev.filter(f => f.id !== fileId));
      setFileRecordMap(prev => {
        const updated = { ...prev };
        delete updated[fileId];
        return updated;
      });
    }
  };

  // Clear all files (Xóa tất cả file)
  const handleClearAllFiles = async () => {
    if (desktop) {
      await clearDesktopData();
      refreshDesktopData();
    } else {
      setImportedFiles([]);
      setFileRecordMap({});
    }
    setFilters(DEFAULT_FILTERS);
  };

  const handleClearData = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ dữ liệu đang nạp trong cơ sở dữ liệu?')) {
      await handleClearAllFiles();
    }
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleLock = () => {
    lockDailyAuth();
    setIsUnlocked(false);
  };

  if (!isUnlocked) {
    return <LockScreen onUnlock={() => setIsUnlocked(true)} />;
  }

  const totalDossiersCount = desktop 
    ? (desktopStats?.totalDossiers || 0) 
    : browserDossiers.length;

  const totalFilteredCount = desktop 
    ? (desktopQueryResult?.totalMatched || 0) 
    : displayItems.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950">
      {/* Navbar */}
      <Navbar
        totalDossiers={totalDossiersCount}
        filteredCount={totalFilteredCount}
        xml1Count={currentStats.totalXml1}
        xml2Count={currentStats.totalXml2}
        xml3Count={currentStats.totalXml3}
        importedFilesCount={importedFiles.length}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onOpenFileManager={() => setIsFileManagerModalOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onClearData={handleClearData}
        onLock={handleLock}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {totalDossiersCount === 0 ? (
          <div className="max-w-4xl mx-auto space-y-6 py-6">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>{desktop ? 'Bản Cài Đặt Desktop Pro • SQLite Disk Engine' : 'Hệ Thống Phân Tích & Lọc Xuất XML 3176'}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Quản Trị Dữ Liệu BHYT XML 1 - 2 - 3 <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-teal-200">
                  Chuẩn Quyết Định 3176/QĐ-BYT
                </span>
              </h1>
              <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Nạp trực tiếp các file Excel XML1, XML2 và XML3. Hệ thống lưu trữ vào cơ sở dữ liệu SQLite tốc độ cao, xử lý mượt mà dữ liệu lớn, hỗ trợ tìm chính xác, nhặt thông tin đa lựa chọn và lọc chuyên sâu theo từng cột XML.
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
                  {desktop 
                    ? 'Bấm nút "Chọn File Excel Từ Ổ Đĩa..." bên dưới để chọn cùng lúc nhiều file mà không lo tràn RAM.'
                    : 'Bạn chỉ cần kéo thả các file XML1, XML2, XML3 vào khung bên dưới.'
                  }
                </p>
              </div>
            </div>

            <FileUploader
              onFilesParsed={handleFilesParsed}
              importedFiles={importedFiles}
              onRemoveFile={handleRemoveFile}
              onClearAllFiles={handleClearData}
              onRefreshDesktop={refreshDesktopData}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Overview with 1-click Excel download */}
            <StatsOverview
              stats={currentStats}
              onExportStatItem={handleExportStatItem}
            />

            {/* Filter Bar with Column-Specific Search, Exact-Match, Pickers, and Active Chips */}
            <FilterBar
              filters={filters}
              onFilterChange={setFilters}
              onResetFilters={handleResetFilters}
              availableDepartments={availableDepartments}
              totalMatched={totalFilteredCount}
              totalRecords={totalDossiersCount}
              onOpenPicker={(type) => setPickerModal({ isOpen: true, type })}
              onOpenColumnFilters={() => setIsColumnFilterModalOpen(true)}
            />

            {/* Dossier Table */}
            <DossierTable
              items={displayItems}
              onSelectDossier={handleSelectDossier}
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
            <span>{desktop ? 'Bản Cài Đặt Desktop EXE • Không Giới Hạn Dung Lượng' : 'Bản Trực Tuyến GitHub Pages'}</span>
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

      {/* Modal: Uploader */}
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
              onClearAllFiles={handleClearData}
              onRefreshDesktop={refreshDesktopData}
            />
          </div>
        </div>
      )}

      {/* Modal: File Manager (Xóa lần lượt hoặc xóa tất cả file) */}
      <FileManagerModal
        isOpen={isFileManagerModalOpen}
        onClose={() => setIsFileManagerModalOpen(false)}
        files={importedFiles}
        onRemoveFile={handleRemoveFile}
        onClearAll={handleClearAllFiles}
        onOpenUpload={() => setIsUploadModalOpen(true)}
      />

      {/* Modal: Advanced Column Filter */}
      <AdvancedColumnFilterModal
        isOpen={isColumnFilterModalOpen}
        onClose={() => setIsColumnFilterModalOpen(false)}
        filters={filters}
        onApply={(updated) => setFilters(f => ({ ...f, ...updated }))}
        onReset={() => setFilters(f => ({
          ...f,
          ketQuaDtri: '',
          maLoaiRv: '',
          gioiTinh: '',
          dauMaThe: '',
          maMay: '',
          duongDung: '',
          minCost: '',
          maxCost: '',
          customRules: []
        }))}
      />

      {/* Modal: Input Picker ('Nhặt' thông tin đầu vào) */}
      {pickerModal.isOpen && (
        <InputPickerModal
          pickerType={pickerModal.type}
          items={pickerItems}
          selectedCodes={currentSelectedCodes}
          onApply={handleApplyPicked}
          onClose={() => setPickerModal(p => ({ ...p, isOpen: false }))}
        />
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
          dossiers={displayItems.map(h => h.dossier)}
          filters={filters}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
