import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  X, 
  RotateCcw, 
  Clock,
  Target,
  Plus,
  Layers,
  Activity,
  Pill,
  Stethoscope,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  Settings2,
  UserCheck,
  Building2,
  CreditCard,
  User,
  Cpu
} from 'lucide-react';
import { 
  DateCriteriaType, 
  FilterState, 
  QUICK_SEARCH_COLUMNS 
} from '../types/xml';
import { getDatePresets } from '../utils/dateUtils';
import type { PickerType } from './InputPickerModal';
import { loadQuickFilterConfig, QuickFilterConfigItem } from '../utils/filterConfig';
import { QuickFilterSettingsModal } from './QuickFilterSettingsModal';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  availableDepartments: string[];
  totalMatched: number;
  totalRecords: number;
  onOpenPicker: (type: PickerType) => void;
  onOpenColumnFilters: () => void;
}

const KET_QUA_DTRI_MAP: Record<string, string> = {
  '1': 'Khỏi bệnh',
  '2': 'Đỡ, giảm',
  '3': 'Không đổi',
  '4': 'Nặng hơn',
  '5': 'Tử vong'
};

const MA_LOAI_RV_MAP: Record<string, string> = {
  '1': 'Ra viện',
  '2': 'Chuyển viện',
  '3': 'Trốn viện',
  '4': 'Xin về'
};

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  availableDepartments,
  totalMatched,
  totalRecords,
  onOpenPicker,
  onOpenColumnFilters
}) => {
  const presets = getDatePresets();
  const [quickFilterConfigs, setQuickFilterConfigs] = useState<QuickFilterConfigItem[]>(loadQuickFilterConfig);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchQuery: e.target.value });
  };

  const handleSearchColumnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, searchColumn: e.target.value });
  };

  const handleDateCriteriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, dateCriteria: e.target.value as DateCriteriaType });
  };

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, fromDate: e.target.value });
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, toDate: e.target.value });
  };

  const handleApplyPreset = (from: string, to: string) => {
    onFilterChange({ ...filters, fromDate: from, toDate: to });
  };

  const handleClearDateRange = () => {
    onFilterChange({ ...filters, fromDate: '', toDate: '' });
  };

  // Remove picked item
  const handleRemovePicked = (
    category: 
      | 'pickedIcds' 
      | 'pickedDrugs' 
      | 'pickedServices' 
      | 'pickedGroups'
      | 'pickedPatients'
      | 'pickedDepartments'
      | 'pickedCards'
      | 'pickedDoctors'
      | 'pickedMachines', 
    val: string
  ) => {
    const list = (filters[category] || []).filter(x => x !== val);
    onFilterChange({ ...filters, [category]: list });
  };

  // Remove custom rule
  const handleRemoveCustomRule = (ruleId: string) => {
    const updated = (filters.customRules || []).filter(r => r.id !== ruleId);
    onFilterChange({ ...filters, customRules: updated });
  };

  const getFilterCount = (id: string) => {
    switch (id) {
      case 'GROUPS': return filters.pickedGroups?.length || 0;
      case 'ICD': return filters.pickedIcds?.length || 0;
      case 'DRUGS': return filters.pickedDrugs?.length || 0;
      case 'SERVICES': return filters.pickedServices?.length || 0;
      case 'PATIENTS': return filters.pickedPatients?.length || 0;
      case 'DEPARTMENTS': return filters.pickedDepartments?.length || 0;
      case 'CARDS': return filters.pickedCards?.length || 0;
      case 'DOCTORS': return filters.pickedDoctors?.length || 0;
      case 'MACHINES': return filters.pickedMachines?.length || 0;
      default: return 0;
    }
  };

  const renderPickerIcon = (id: string) => {
    switch (id) {
      case 'GROUPS': return <Layers className="w-3.5 h-3.5 text-teal-400" />;
      case 'ICD': return <Activity className="w-3.5 h-3.5 text-cyan-400" />;
      case 'DRUGS': return <Pill className="w-3.5 h-3.5 text-amber-400" />;
      case 'SERVICES': return <Stethoscope className="w-3.5 h-3.5 text-purple-400" />;
      case 'PATIENTS': return <UserCheck className="w-3.5 h-3.5 text-emerald-400" />;
      case 'DEPARTMENTS': return <Building2 className="w-3.5 h-3.5 text-blue-400" />;
      case 'CARDS': return <CreditCard className="w-3.5 h-3.5 text-pink-400" />;
      case 'DOCTORS': return <User className="w-3.5 h-3.5 text-orange-400" />;
      case 'MACHINES': return <Cpu className="w-3.5 h-3.5 text-indigo-400" />;
      default: return <Filter className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const totalPickedCount = (filters.pickedIcds?.length || 0) + 
                           (filters.pickedDrugs?.length || 0) + 
                           (filters.pickedServices?.length || 0) + 
                           (filters.pickedGroups?.length || 0) +
                           (filters.pickedPatients?.length || 0) +
                           (filters.pickedDepartments?.length || 0) +
                           (filters.pickedCards?.length || 0) +
                           (filters.pickedDoctors?.length || 0) +
                           (filters.pickedMachines?.length || 0);

  // Count active specific column filters
  const activeColumnFilterCount = (filters.ketQuaDtri ? 1 : 0) +
                                  (filters.maLoaiRv ? 1 : 0) +
                                  (filters.gioiTinh ? 1 : 0) +
                                  (filters.dauMaThe ? 1 : 0) +
                                  (filters.maMay ? 1 : 0) +
                                  (filters.duongDung ? 1 : 0) +
                                  (filters.minCost !== undefined && filters.minCost !== '' ? 1 : 0) +
                                  (filters.maxCost !== undefined && filters.maxCost !== '' ? 1 : 0) +
                                  (filters.customRules?.length || 0);

  const hasActiveFilters = Boolean(
    filters.searchQuery ||
    (filters.searchColumn && filters.searchColumn !== 'ALL') ||
    filters.fromDate ||
    filters.toDate ||
    filters.maKhoa ||
    filters.maLoaiKcb ||
    filters.hasDrugsOnly ||
    filters.hasServicesOnly ||
    totalPickedCount > 0 ||
    activeColumnFilterCount > 0
  );

  const selectedColObj = QUICK_SEARCH_COLUMNS.find(c => c.key === (filters.searchColumn || 'ALL'));

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 backdrop-blur-md">
      {/* 1. Search Bar with Column Dropdown + Exact Match + Advanced Column Filter Button */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2.5">
        {/* Column Dropdown Selector */}
        <div className="relative flex-shrink-0 w-full lg:w-64">
          <select
            value={filters.searchColumn || 'ALL'}
            onChange={handleSearchColumnChange}
            className="w-full pl-3.5 pr-8 py-3.5 bg-slate-950 border border-slate-700/90 rounded-xl text-teal-300 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer shadow-inner appearance-none truncate"
            title="Chọn cột dữ liệu XML cụ thể để tìm kiếm nhanh"
          >
            {QUICK_SEARCH_COLUMNS.map((col) => (
              <option key={col.key} value={col.key}>
                {col.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Input box */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5 text-teal-400" />
          </div>

          <input
            type="text"
            value={filters.searchQuery}
            onChange={handleSearchChange}
            placeholder={
              filters.searchColumn && filters.searchColumn !== 'ALL'
                ? `Tìm kiếm trên cột ${selectedColObj?.label || filters.searchColumn}...`
                : (filters.exactMatch 
                    ? "Tìm kiếm CHÍNH XÁC: Nhập chính xác Mã LK, Mã BN, CCCD, Mã bệnh ICD, Tên thuốc..." 
                    : "Tìm kiếm mọi thứ: Tên bệnh nhân, Mã LK, Mã BN, Mã HSBA, CCCD, Mã thẻ, ICD-10, Tên thuốc, Dịch vụ..."
                  )
            }
            className={`w-full pl-12 pr-12 py-3.5 bg-slate-950 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 text-sm font-medium shadow-inner transition-all ${
              filters.exactMatch 
                ? 'border-teal-500/80 focus:ring-teal-400 bg-teal-950/10' 
                : 'border-slate-700/80 focus:ring-teal-500'
            }`}
          />

          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white cursor-pointer"
              title="Xóa từ khóa tìm kiếm"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Exact Match Toggle Button */}
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, exactMatch: !filters.exactMatch })}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-3.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              filters.exactMatch
                ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md shadow-teal-500/20 font-bold'
                : 'bg-slate-950 border-slate-700 text-slate-300 hover:border-slate-600 hover:text-white'
            }`}
            title="Bật/Tắt chế độ tìm kiếm chính xác từng ký tự"
          >
            <Target className="w-4 h-4" />
            <span>Tìm chính xác</span>
          </button>

          {/* Advanced Column Filters Button */}
          <button
            type="button"
            onClick={onOpenColumnFilters}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-3.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              activeColumnFilterCount > 0
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-md font-bold'
                : 'bg-slate-950 border-slate-700 text-slate-300 hover:border-cyan-500/60 hover:text-white'
            }`}
            title="Mở bảng lọc chi tiết từng cột XML1, XML2, XML3"
          >
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
            <span>Lọc Cột XML</span>
            {activeColumnFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 font-mono text-[10px] font-extrabold flex items-center justify-center ml-0.5">
                {activeColumnFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 2. Pickers Toolbar ('Nhặt' thông tin đầu vào) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-800/80 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-teal-400" />
            <span>Nhặt thông tin lọc:</span>
          </span>

          {/* Dynamic pickers configured by user */}
          {quickFilterConfigs.filter(cfg => cfg.enabled).map(cfg => {
            const count = getFilterCount(cfg.id);
            const isPicked = count > 0;
            return (
              <button
                key={cfg.id}
                type="button"
                onClick={() => onOpenPicker(cfg.id as PickerType)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                  isPicked
                    ? 'bg-teal-500/20 border-teal-500 text-teal-300 font-bold shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-teal-500/50 hover:text-white'
                }`}
                title={`Nhặt danh sách ${cfg.customLabel || cfg.defaultLabel}`}
              >
                {renderPickerIcon(cfg.id)}
                <span>
                  {cfg.customLabel || cfg.defaultLabel} {count > 0 ? `(${count})` : ''}
                </span>
                <Plus className="w-3 h-3 text-slate-500" />
              </button>
            );
          })}

          {/* Quick Filter Configuration Modal Trigger */}
          <button
            type="button"
            onClick={() => setIsSettingsModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-950/80 text-slate-400 hover:text-teal-300 hover:border-teal-500/40 transition-colors cursor-pointer text-xs"
            title="Cài đặt cấu hình hiển thị bộ lọc nhanh (thêm trường, đổi tên hiển thị)"
          >
            <Settings2 className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Cài đặt</span>
          </button>
        </div>

        {/* Match Mode Toggle (OR / AND) */}
        {totalPickedCount > 1 && (
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400 px-1">Logic:</span>
            <button
              type="button"
              onClick={() => onFilterChange({ ...filters, matchMode: 'OR' })}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                filters.matchMode !== 'AND'
                  ? 'bg-teal-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Khớp BẤT KỲ (OR)
            </button>
            <button
              type="button"
              onClick={() => onFilterChange({ ...filters, matchMode: 'AND' })}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                filters.matchMode === 'AND'
                  ? 'bg-teal-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Khớp TẤT CẢ (AND)
            </button>
          </div>
        )}
      </div>

      {/* 3. ACTIVE FILTERS TAGS BAR (Cho phép xóa lần lượt từng điều kiện hoặc xóa tất cả) */}
      {hasActiveFilters && (
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-teal-400" />
              <span>Các điều kiện đang lọc (Bấm × để xóa từng mục):</span>
            </span>

            {/* Clear All Filters Button */}
            <button
              type="button"
              onClick={onResetFilters}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors cursor-pointer"
              title="Xóa toàn bộ các điều kiện lọc đang áp dụng"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xóa Tất Cả Bộ Lọc</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {/* Search query chip */}
            {filters.searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs">
                <span>
                  {filters.searchColumn && filters.searchColumn !== 'ALL' 
                    ? `Cột [${filters.searchColumn}]: "${filters.searchQuery}"`
                    : `Từ khóa: "${filters.searchQuery}"`}
                </span>
                <button
                  type="button"
                  onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
                  className="hover:text-white cursor-pointer"
                  title="Xóa từ khóa tìm kiếm"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Specific search column chip (if set without query) */}
            {filters.searchColumn && filters.searchColumn !== 'ALL' && !filters.searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono">
                <span>Cột tìm kiếm: {filters.searchColumn}</span>
                <button
                  type="button"
                  onClick={() => onFilterChange({ ...filters, searchColumn: 'ALL' })}
                  className="hover:text-white cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Date range chip */}
            {(filters.fromDate || filters.toDate) && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs">
                <Calendar className="w-3 h-3" />
                <span>
                  {filters.dateCriteria !== 'ALL_DATES' ? `[${filters.dateCriteria}] ` : ''}
                  {filters.fromDate || '...'} → {filters.toDate || '...'}
                </span>
                <button
                  type="button"
                  onClick={handleClearDateRange}
                  className="hover:text-white cursor-pointer"
                  title="Xóa khoảng thời gian"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Department chip */}
            {filters.maKhoa && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs">
                <span>Khoa: {filters.maKhoa}</span>
                <button
                  type="button"
                  onClick={() => onFilterChange({ ...filters, maKhoa: '' })}
                  className="hover:text-white cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Treatment type chip */}
            {filters.maLoaiKcb && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs">
                <span>Loại KCB: {filters.maLoaiKcb === '1' ? 'Khám bệnh' : filters.maLoaiKcb === '2' ? 'Ngoại trú' : 'Nội trú'}</span>
                <button
                  type="button"
                  onClick={() => onFilterChange({ ...filters, maLoaiKcb: '' })}
                  className="hover:text-white cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Has drugs only chip */}
            {filters.hasDrugsOnly && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs">
                <Pill className="w-3 h-3" />
                <span>Chỉ lấy hồ sơ có thuốc</span>
                <button
                  type="button"
                  onClick={() => onFilterChange({ ...filters, hasDrugsOnly: false })}
                  className="hover:text-white cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Has services only chip */}
            {filters.hasServicesOnly && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs">
                <Stethoscope className="w-3 h-3" />
                <span>Chỉ lấy hồ sơ có DVKT</span>
                <button
                  type="button"
                  onClick={() => onFilterChange({ ...filters, hasServicesOnly: false })}
                  className="hover:text-white cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Groups Chips (Xóa lần lượt) */}
            {filters.pickedGroups?.map(g => (
              <span key={g} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-mono">
                <span>Nhóm {g}</span>
                <button onClick={() => handleRemovePicked('pickedGroups', g)} className="hover:text-white cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {/* ICD Chips (Xóa lần lượt) */}
            {filters.pickedIcds?.map(c => (
              <span key={c} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                <span>ICD: {c}</span>
                <button onClick={() => handleRemovePicked('pickedIcds', c)} className="hover:text-white cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {/* Drug Chips (Xóa lần lượt) */}
            {filters.pickedDrugs?.map(d => (
              <span key={d} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs max-w-[200px] truncate">
                <span className="truncate">Thuốc: {d}</span>
                <button onClick={() => handleRemovePicked('pickedDrugs', d)} className="hover:text-white flex-shrink-0 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {/* Service Chips (Xóa lần lượt) */}
            {filters.pickedServices?.map(s => (
              <span key={s} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs max-w-[200px] truncate">
                <span className="truncate">DVKT: {s}</span>
                <button onClick={() => handleRemovePicked('pickedServices', s)} className="hover:text-white flex-shrink-0 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {/* Patient Code Chips (MA_BN) */}
            {filters.pickedPatients?.map(p => (
              <span key={p} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                <span>Mã BN: {p}</span>
                <button onClick={() => handleRemovePicked('pickedPatients', p)} className="hover:text-white cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {/* Department Chips (MA_KHOA) */}
            {filters.pickedDepartments?.map(d => (
              <span key={d} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-mono">
                <span>Khoa: {d}</span>
                <button onClick={() => handleRemovePicked('pickedDepartments', d)} className="hover:text-white cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {/* Card Chips (MA_THE_BHYT) */}
            {filters.pickedCards?.map(c => (
              <span key={c} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-mono">
                <span>Thẻ: {c}</span>
                <button onClick={() => handleRemovePicked('pickedCards', c)} className="hover:text-white cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {/* Doctor Chips (NGUOI_THUC_HIEN) */}
            {filters.pickedDoctors?.map(doc => (
              <span key={doc} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-500/15 border border-orange-500/30 text-orange-300 text-xs">
                <span>BS/Người TH: {doc}</span>
                <button onClick={() => handleRemovePicked('pickedDoctors', doc)} className="hover:text-white cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {/* Machine Chips (MA_MAY) */}
            {filters.pickedMachines?.map(m => (
              <span key={m} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
                <span>Máy: {m}</span>
                <button onClick={() => handleRemovePicked('pickedMachines', m)} className="hover:text-white cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {/* Fast Column Filter Chips */}
            {filters.ketQuaDtri && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs">
                <span>KQ điều trị: {KET_QUA_DTRI_MAP[filters.ketQuaDtri] || filters.ketQuaDtri}</span>
                <button onClick={() => onFilterChange({ ...filters, ketQuaDtri: '' })} className="hover:text-white cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.maLoaiRv && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs">
                <span>Ra viện: {MA_LOAI_RV_MAP[filters.maLoaiRv] || filters.maLoaiRv}</span>
                <button onClick={() => onFilterChange({ ...filters, maLoaiRv: '' })} className="hover:text-white cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.gioiTinh && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs">
                <span>Giới tính: {filters.gioiTinh === '1' ? 'Nam' : 'Nữ'}</span>
                <button onClick={() => onFilterChange({ ...filters, gioiTinh: '' })} className="hover:text-white cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.dauMaThe && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs font-mono">
                <span>Đầu thẻ: {filters.dauMaThe}</span>
                <button onClick={() => onFilterChange({ ...filters, dauMaThe: '' })} className="hover:text-white cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.maMay && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-mono">
                <span>Mã máy: {filters.maMay}</span>
                <button onClick={() => onFilterChange({ ...filters, maMay: '' })} className="hover:text-white cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {filters.duongDung && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-500/15 border border-orange-500/30 text-orange-300 text-xs">
                <span>Đường dùng: {filters.duongDung}</span>
                <button onClick={() => onFilterChange({ ...filters, duongDung: '' })} className="hover:text-white cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {(filters.minCost !== undefined && filters.minCost !== '') || (filters.maxCost !== undefined && filters.maxCost !== '') ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs">
                <span>Chi phí: {filters.minCost || 0} → {filters.maxCost || '∞'} đ</span>
                <button onClick={() => onFilterChange({ ...filters, minCost: '', maxCost: '' })} className="hover:text-white cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ) : null}

            {/* Custom Rules Chips (Xóa từng quy tắc) */}
            {filters.customRules?.map((rule) => (
              <span key={rule.id} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                <span>
                  {rule.table}.{rule.column} {rule.operator === 'EQUALS' ? '=' : rule.operator === 'CONTAINS' ? 'chứa' : rule.operator === 'GREATER_THAN' ? '>=' : rule.operator === 'LESS_THAN' ? '<=' : rule.operator === 'NOT_EMPTY' ? '≠ rỗng' : 'bắt đầu'} {rule.operator !== 'NOT_EMPTY' ? `"${rule.value}"` : ''}
                </span>
                <button onClick={() => handleRemoveCustomRule(rule.id)} className="hover:text-white cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 4. Date Filtering Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center pt-1 border-t border-slate-800/60">
        {/* Date criteria selector */}
        <div className="md:col-span-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-teal-400 flex-shrink-0" />
          <div className="w-full">
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Mốc thời gian lọc
            </label>
            <select
              value={filters.dateCriteria}
              onChange={handleDateCriteriaChange}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
            >
              <option value="ALL_DATES">Bất kỳ mốc thời gian nào (Khớp bất kỳ)</option>
              <option value="NGAY_VAO">Ngày vào viện (XML1.NGAY_VAO)</option>
              <option value="NGAY_RA">Ngày ra viện (XML1.NGAY_RA)</option>
              <option value="NGAY_YL">Ngày y lệnh (XML2/3.NGAY_YL)</option>
              <option value="NGAY_TH_YL">Ngày thực hiện y lệnh (XML2/3.NGAY_TH_YL)</option>
              <option value="NGAY_KQ">Ngày kết quả (XML3.NGAY_KQ)</option>
              <option value="NGAY_TTOAN">Ngày thanh toán (XML1.NGAY_TTOAN)</option>
            </select>
          </div>
        </div>

        {/* From Date */}
        <div className="md:col-span-3">
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Từ ngày
          </label>
          <div className="relative">
            <input
              type="date"
              value={filters.fromDate}
              onChange={handleFromDateChange}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 [color-scheme:dark]"
            />
          </div>
        </div>

        {/* To Date */}
        <div className="md:col-span-3">
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Đến ngày
          </label>
          <div className="relative">
            <input
              type="date"
              value={filters.toDate}
              onChange={handleToDateChange}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Department / Category */}
        <div className="md:col-span-2">
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Khoa điều trị
          </label>
          <select
            value={filters.maKhoa}
            onChange={(e) => onFilterChange({ ...filters, maKhoa: e.target.value })}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
          >
            <option value="">Tất cả khoa ({availableDepartments.length})</option>
            {availableDepartments.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 5. Quick Presets & Category Chips */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
        {/* Preset date buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-teal-400" />
            <span>Nhanh:</span>
          </span>
          {presets.map((p) => {
            const isActive = filters.fromDate === p.from && filters.toDate === p.to;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => handleApplyPreset(p.from, p.to)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            );
          })}
          {(filters.fromDate || filters.toDate) && (
            <button
              onClick={handleClearDateRange}
              className="px-2 py-1 text-[11px] text-rose-400 hover:text-rose-300 underline cursor-pointer ml-1"
            >
              Xóa ngày
            </button>
          )}
        </div>

        {/* Right side toggles & reset */}
        <div className="flex items-center gap-2">
          {/* Quick toggle: Has drugs */}
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, hasDrugsOnly: !filters.hasDrugsOnly })}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
              filters.hasDrugsOnly
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-white'
            }`}
          >
            <Pill className="w-3 h-3 text-amber-400" />
            <span>Có thuốc</span>
          </button>

          {/* Quick toggle: Has services */}
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, hasServicesOnly: !filters.hasServicesOnly })}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors cursor-pointer ${
              filters.hasServicesOnly
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-white'
            }`}
          >
            <Stethoscope className="w-3 h-3 text-purple-400" />
            <span>Có DVKT</span>
          </button>
        </div>
      </div>

      {/* Quick Filter Configuration Modal */}
      <QuickFilterSettingsModal
        isOpen={isSettingsModalOpen}
        config={quickFilterConfigs}
        onSave={(newCfg) => setQuickFilterConfigs(newCfg)}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
};
