import React from 'react';
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
  Filter
} from 'lucide-react';
import type { DateCriteriaType, FilterState } from '../types/xml';
import { getDatePresets } from '../utils/dateUtils';
import type { PickerType } from './InputPickerModal';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  availableDepartments: string[];
  totalMatched: number;
  totalRecords: number;
  onOpenPicker: (type: PickerType) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  availableDepartments,
  totalMatched,
  totalRecords,
  onOpenPicker
}) => {
  const presets = getDatePresets();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchQuery: e.target.value });
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
  const handleRemovePicked = (category: 'pickedIcds' | 'pickedDrugs' | 'pickedServices' | 'pickedGroups', val: string) => {
    const list = (filters[category] || []).filter(x => x !== val);
    onFilterChange({ ...filters, [category]: list });
  };

  const totalPickedCount = (filters.pickedIcds?.length || 0) + 
                           (filters.pickedDrugs?.length || 0) + 
                           (filters.pickedServices?.length || 0) + 
                           (filters.pickedGroups?.length || 0);

  const hasActiveFilters = Boolean(
    filters.searchQuery ||
    filters.fromDate ||
    filters.toDate ||
    filters.maKhoa ||
    filters.maLoaiKcb ||
    filters.hasDrugsOnly ||
    filters.hasServicesOnly ||
    totalPickedCount > 0
  );

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 backdrop-blur-md">
      {/* 1. Omni Search Input + Exact Match Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5 text-teal-400" />
          </div>

          <input
            type="text"
            value={filters.searchQuery}
            onChange={handleSearchChange}
            placeholder={filters.exactMatch 
              ? "Tìm kiếm CHÍNH XÁC: Nhập chính xác Mã LK, Mã BN, CCCD, Mã bệnh ICD, Tên thuốc..." 
              : "Tìm kiếm mọi thứ: Tên bệnh nhân, Mã LK, Mã BN, Mã HSBA, CCCD, Mã thẻ, ICD-10, Tên thuốc, Dịch vụ..."
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

        {/* Exact Match Toggle Button */}
        <button
          type="button"
          onClick={() => onFilterChange({ ...filters, exactMatch: !filters.exactMatch })}
          className={`flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex-shrink-0 ${
            filters.exactMatch
              ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-md shadow-teal-500/20 font-bold'
              : 'bg-slate-950 border-slate-700 text-slate-300 hover:border-slate-600 hover:text-white'
          }`}
          title="Bật/Tắt chế độ tìm kiếm chính xác từng ký tự"
        >
          <Target className="w-4 h-4" />
          <span>Tìm chính xác</span>
        </button>
      </div>

      {/* 2. Pickers Toolbar ('Nhặt' thông tin đầu vào) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-800/80 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-teal-400" />
            <span>Nhặt thông tin lọc:</span>
          </span>

          {/* Pick Groups */}
          <button
            type="button"
            onClick={() => onOpenPicker('GROUPS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              (filters.pickedGroups?.length || 0) > 0
                ? 'bg-teal-500/20 border-teal-500 text-teal-300 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-teal-500/50 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            <span>Mã Nhóm {filters.pickedGroups?.length ? `(${filters.pickedGroups.length})` : ''}</span>
            <Plus className="w-3 h-3 text-slate-500" />
          </button>

          {/* Pick ICD */}
          <button
            type="button"
            onClick={() => onOpenPicker('ICD')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              (filters.pickedIcds?.length || 0) > 0
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-cyan-500/50 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Mã ICD {filters.pickedIcds?.length ? `(${filters.pickedIcds.length})` : ''}</span>
            <Plus className="w-3 h-3 text-slate-500" />
          </button>

          {/* Pick Drugs */}
          <button
            type="button"
            onClick={() => onOpenPicker('DRUGS')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              (filters.pickedDrugs?.length || 0) > 0
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-amber-500/50 hover:text-white'
            }`}
          >
            <Pill className="w-3.5 h-3.5 text-amber-400" />
            <span>Thuốc {filters.pickedDrugs?.length ? `(${filters.pickedDrugs.length})` : ''}</span>
            <Plus className="w-3 h-3 text-slate-500" />
          </button>

          {/* Pick Services */}
          <button
            type="button"
            onClick={() => onOpenPicker('SERVICES')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              (filters.pickedServices?.length || 0) > 0
                ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-purple-500/50 hover:text-white'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-purple-400" />
            <span>DVKT & VTYT {filters.pickedServices?.length ? `(${filters.pickedServices.length})` : ''}</span>
            <Plus className="w-3 h-3 text-slate-500" />
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

      {/* 3. Picked Items Chips Display */}
      {totalPickedCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-[11px] text-slate-400 font-semibold mr-1">Điều kiện đã nhặt:</span>

          {/* Groups Chips */}
          {filters.pickedGroups?.map(g => (
            <span key={g} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono">
              <span>Nhóm {g}</span>
              <button onClick={() => handleRemovePicked('pickedGroups', g)} className="hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* ICD Chips */}
          {filters.pickedIcds?.map(c => (
            <span key={c} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <span>ICD: {c}</span>
              <button onClick={() => handleRemovePicked('pickedIcds', c)} className="hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* Drug Chips */}
          {filters.pickedDrugs?.map(d => (
            <span key={d} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-sans max-w-[200px] truncate">
              <span className="truncate">Thuốc: {d}</span>
              <button onClick={() => handleRemovePicked('pickedDrugs', d)} className="hover:text-white flex-shrink-0">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* Service Chips */}
          {filters.pickedServices?.map(s => (
            <span key={s} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-sans max-w-[200px] truncate">
              <span className="truncate">DVKT: {s}</span>
              <button onClick={() => handleRemovePicked('pickedServices', s)} className="hover:text-white flex-shrink-0">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          <button
            onClick={() => onFilterChange({
              ...filters,
              pickedIcds: [],
              pickedDrugs: [],
              pickedServices: [],
              pickedGroups: []
            })}
            className="text-[11px] text-rose-400 hover:underline ml-auto"
          >
            Xóa tất cả mục đã nhặt
          </button>
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

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Đặt lại bộ lọc</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
