import React, { useState } from 'react';
import { 
  X, 
  SlidersHorizontal, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Check, 
  Sparkles,
  Info
} from 'lucide-react';
import { 
  XML1_COLUMNS, 
  XML2_COLUMNS, 
  XML3_COLUMNS, 
  FilterState, 
  CustomColumnRule 
} from '../types/xml';

interface AdvancedColumnFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApply: (updatedFilters: Partial<FilterState>) => void;
  onReset: () => void;
}

const COMMON_BHYT_PREFIXES = [
  { code: 'TE', label: 'TE - Trẻ em dưới 6 tuổi' },
  { code: 'GD', label: 'GD - Hộ gia đình' },
  { code: 'DN', label: 'DN - Doanh nghiệp' },
  { code: 'CA', label: 'CA - Công an nhân dân' },
  { code: 'QN', label: 'QN - Sĩ quan, quân nhân' },
  { code: 'HT', label: 'HT - Hưu trí' },
  { code: 'CN', label: 'CN - Hộ cận nghèo' },
  { code: 'HN', label: 'HN - Hộ nghèo' },
  { code: 'CC', label: 'CC - Người có công' },
  { code: 'BT', label: 'BT - Bảo trợ xã hội' },
  { code: 'HS', label: 'HS - Học sinh sinh viên' }
];

export const AdvancedColumnFilterModal: React.FC<AdvancedColumnFilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onApply,
  onReset
}) => {
  // Local state for fast column filters
  const [ketQuaDtri, setKetQuaDtri] = useState<string>(filters.ketQuaDtri || '');
  const [maLoaiRv, setMaLoaiRv] = useState<string>(filters.maLoaiRv || '');
  const [gioiTinh, setGioiTinh] = useState<string>(filters.gioiTinh || '');
  const [dauMaThe, setDauMaThe] = useState<string>(filters.dauMaThe || '');
  const [maMay, setMaMay] = useState<string>(filters.maMay || '');
  const [duongDung, setDuongDung] = useState<string>(filters.duongDung || '');
  const [minCost, setMinCost] = useState<string>(filters.minCost !== undefined && filters.minCost !== '' ? String(filters.minCost) : '');
  const [maxCost, setMaxCost] = useState<string>(filters.maxCost !== undefined && filters.maxCost !== '' ? String(filters.maxCost) : '');

  // Local state for dynamic custom rules
  const [customRules, setCustomRules] = useState<CustomColumnRule[]>(filters.customRules || []);

  if (!isOpen) return null;

  const handleAddRule = () => {
    const newRule: CustomColumnRule = {
      id: 'rule_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      table: 'XML1',
      column: 'MA_BENH_KT',
      operator: 'CONTAINS',
      value: ''
    };
    setCustomRules([...customRules, newRule]);
  };

  const handleRemoveRule = (id: string) => {
    setCustomRules(customRules.filter(r => r.id !== id));
  };

  const handleUpdateRule = (id: string, updates: Partial<CustomColumnRule>) => {
    setCustomRules(customRules.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const handleApplyChanges = () => {
    onApply({
      ketQuaDtri,
      maLoaiRv,
      gioiTinh,
      dauMaThe,
      maMay,
      duongDung,
      minCost: minCost ? Number(minCost) : '',
      maxCost: maxCost ? Number(maxCost) : '',
      customRules: customRules.filter(r => r.column && (r.operator === 'NOT_EMPTY' || r.value.trim() !== ''))
    });
    onClose();
  };

  const handleResetLocal = () => {
    setKetQuaDtri('');
    setMaLoaiRv('');
    setGioiTinh('');
    setDauMaThe('');
    setMaMay('');
    setDuongDung('');
    setMinCost('');
    setMaxCost('');
    setCustomRules([]);
    onReset();
    onClose();
  };

  const getColumnsForTable = (table: 'XML1' | 'XML2' | 'XML3') => {
    switch (table) {
      case 'XML1': return XML1_COLUMNS;
      case 'XML2': return XML2_COLUMNS;
      case 'XML3': return XML3_COLUMNS;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Bộ Lọc Chuyên Sâu Theo Từng Cột XML</span>
                <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-mono">
                  XML1 • XML2 • XML3
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Cấu hình chi tiết điều kiện lọc cho các trường dữ liệu đặc thù theo chuẩn QĐ 3176
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Fast Column Filters */}
          <div>
            <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>1. Điều Kiện Lọc Nhanh Đặc Thù Hồ Sơ</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Kết quả điều trị */}
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300">
                  Kết quả điều trị (KET_QUA_DTRI)
                </label>
                <select
                  value={ketQuaDtri}
                  onChange={(e) => setKetQuaDtri(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                >
                  <option value="">-- Tất cả kết quả --</option>
                  <option value="1">1 - Khỏi bệnh</option>
                  <option value="2">2 - Đỡ, giảm</option>
                  <option value="3">3 - Không thay đổi</option>
                  <option value="4">4 - Nặng hơn</option>
                  <option value="5">5 - Tử vong</option>
                </select>
              </div>

              {/* Loại ra viện */}
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300">
                  Tình trạng ra viện (MA_LOAI_RV)
                </label>
                <select
                  value={maLoaiRv}
                  onChange={(e) => setMaLoaiRv(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                >
                  <option value="">-- Tất cả tình trạng --</option>
                  <option value="1">1 - Ra viện</option>
                  <option value="2">2 - Chuyển viện</option>
                  <option value="3">3 - Trốn viện</option>
                  <option value="4">4 - Xin về</option>
                </select>
              </div>

              {/* Giới tính */}
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300">
                  Giới tính (GIOI_TINH)
                </label>
                <select
                  value={gioiTinh}
                  onChange={(e) => setGioiTinh(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                >
                  <option value="">-- Tất cả giới tính --</option>
                  <option value="1">1 - Nam</option>
                  <option value="2">2 - Nữ</option>
                </select>
              </div>

              {/* Đầu mã thẻ BHYT */}
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300">
                  Đầu mã thẻ BHYT (Đối tượng)
                </label>
                <div className="flex gap-2">
                  <select
                    value={dauMaThe}
                    onChange={(e) => setDauMaThe(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                  >
                    <option value="">-- Chọn hoặc gõ bên cạnh --</option>
                    {COMMON_BHYT_PREFIXES.map(p => (
                      <option key={p.code} value={p.code}>{p.label}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={dauMaThe}
                    onChange={(e) => setDauMaThe(e.target.value.toUpperCase())}
                    placeholder="Mã..."
                    className="w-20 px-2 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-center font-mono text-teal-300 focus:outline-none focus:ring-1 focus:ring-teal-500 uppercase"
                  />
                </div>
              </div>

              {/* Mã máy thực hiện (XML3) */}
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300">
                  Mã máy thực hiện (XML3.MA_MAY)
                </label>
                <input
                  type="text"
                  value={maMay}
                  onChange={(e) => setMaMay(e.target.value)}
                  placeholder="Ví dụ: XQ01, CT01, SA02..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                />
              </div>

              {/* Đường dùng thuốc (XML2) */}
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300">
                  Đường dùng thuốc (XML2.DUONG_DUNG)
                </label>
                <input
                  type="text"
                  value={duongDung}
                  onChange={(e) => setDuongDung(e.target.value)}
                  placeholder="Ví dụ: Uống, Tiêm bắp, Truyền..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              {/* Khoảng viện phí */}
              <div className="sm:col-span-2 lg:col-span-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-2">
                <label className="text-[11px] font-semibold text-slate-300">
                  Khoảng Tổng Viện Phí KCB (T_TONGCHI_BV tính bằng VNĐ)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <input
                      type="number"
                      value={minCost}
                      onChange={(e) => setMinCost(e.target.value)}
                      placeholder="Từ số tiền (VNĐ)..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={maxCost}
                      onChange={(e) => setMaxCost(e.target.value)}
                      placeholder="Đến số tiền (VNĐ)..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Dynamic Custom Column Filter Rules */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>2. Quy Tắc Lọc Cột Tùy Ý (Custom Column Rules)</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Thêm không giới hạn điều kiện lọc trên toàn bộ 65 cột XML1, 43 cột XML2 và 51 cột XML3
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddRule}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Quy Tắc Cột</span>
              </button>
            </div>

            {customRules.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-slate-800 bg-slate-950/30 text-center space-y-2">
                <Info className="w-6 h-6 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">
                  Chưa có quy tắc lọc cột tùy biến nào được tạo.
                </p>
                <p className="text-[11px] text-slate-500">
                  Bấm nút <strong>"Thêm Quy Tắc Cột"</strong> ở trên để lọc theo bất kỳ cột nào bạn muốn (Ví dụ: TT_THAU, MA_BAC_SI, SO_NGAY_DTRI, MA_TAI_NAN...).
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {customRules.map((rule, idx) => (
                  <div 
                    key={rule.id}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center gap-2.5 text-xs"
                  >
                    <span className="text-slate-500 font-mono text-[11px] w-6 flex-shrink-0">
                      #{idx + 1}
                    </span>

                    {/* Table selection */}
                    <div className="w-28 flex-shrink-0">
                      <select
                        value={rule.table}
                        onChange={(e) => {
                          const tbl = e.target.value as 'XML1' | 'XML2' | 'XML3';
                          const defaultCol = tbl === 'XML1' ? 'MA_BENH_KT' : tbl === 'XML2' ? 'TEN_THUOC' : 'TEN_DICH_VU';
                          handleUpdateRule(rule.id, { table: tbl, column: defaultCol });
                        }}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-teal-300 font-bold focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                      >
                        <option value="XML1">XML1 (KCB)</option>
                        <option value="XML2">XML2 (Thuốc)</option>
                        <option value="XML3">XML3 (DVKT)</option>
                      </select>
                    </div>

                    {/* Column selection */}
                    <div className="flex-1 min-w-[180px]">
                      <select
                        value={rule.column}
                        onChange={(e) => handleUpdateRule(rule.id, { column: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono cursor-pointer"
                      >
                        {getColumnsForTable(rule.table).map((col) => (
                          <option key={col} value={col}>
                            {col}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Operator */}
                    <div className="w-36 flex-shrink-0">
                      <select
                        value={rule.operator}
                        onChange={(e) => handleUpdateRule(rule.id, { operator: e.target.value as any })}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                      >
                        <option value="CONTAINS">Chứa (Contains)</option>
                        <option value="EQUALS">Bằng chính xác (=)</option>
                        <option value="STARTS_WITH">Bắt đầu bằng</option>
                        <option value="GREATER_THAN">Lớn hơn hoặc bằng (&gt;=)</option>
                        <option value="LESS_THAN">Nhỏ hơn hoặc bằng (&lt;=)</option>
                        <option value="NOT_EMPTY">Có dữ liệu (Không rỗng)</option>
                      </select>
                    </div>

                    {/* Value */}
                    {rule.operator !== 'NOT_EMPTY' && (
                      <div className="flex-1 min-w-[150px]">
                        <input
                          type="text"
                          value={rule.value}
                          onChange={(e) => handleUpdateRule(rule.id, { value: e.target.value })}
                          placeholder="Nhập giá trị cần lọc..."
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                      </div>
                    )}

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveRule(rule.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer flex-shrink-0 self-end md:self-center"
                      title="Xóa quy tắc này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer controls */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleResetLocal}
            className="px-3.5 py-2 rounded-xl border border-slate-700 hover:border-rose-500/50 text-slate-300 hover:text-rose-400 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt Lại Bộ Lọc Cột</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-medium cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={handleApplyChanges}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-500/25 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Áp Dụng Bộ Lọc</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
