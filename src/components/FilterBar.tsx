import React from 'react';
import { 
  Search, 
  Calendar, 
  Filter, 
  X, 
  RotateCcw, 
  Sparkles,
  Building2,
  Stethoscope,
  Pill,
  Clock
} from 'lucide-react';
import { DateCriteriaType, FilterState } from '../types/xml';
import { getDatePresets } from '../utils/dateUtils';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  availableDepartments: string[];
  totalMatched: number;
  totalRecords: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  availableDepartments,
  totalMatched,
  totalRecords
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

  const hasActiveFilters = Boolean(
    filters.searchQuery ||
    filters.fromDate ||
    filters.toDate ||
    filters.maKhoa ||
    filters.maLoaiKcb ||
    filters.hasDrugsOnly ||
    filters.hasServicesOnly
  );

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 backdrop-blur-md">
      {/* 1. Omni Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5 text-teal-400" />
        </div>

        <input
          type="text"
          value={filters.searchQuery}
          onChange={handleSearchChange}
          placeholder="Tìm kiếm bất cứ thông tin gì: Tên bệnh nhân, Mã LK, Mã BN, Mã HSBA, CCCD, Mã thẻ, ICD-10, Tên thuốc, Tên dịch vụ..."
          className="w-full pl-12 pr-12 py-3.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm font-medium shadow-inner transition-all"
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

      {/* 2. Date Filtering Row */}
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

      {/* 3. Quick Presets & Filters Chips */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs">
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
