import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Check, 
  Plus, 
  Layers, 
  Pill, 
  Stethoscope, 
  Activity, 
  CheckSquare, 
  Square,
  Sparkles
} from 'lucide-react';

export type PickerType = 'GROUPS' | 'ICD' | 'DRUGS' | 'SERVICES';

export interface PickerItem {
  code: string;
  name: string;
  count: number;
  extra?: string;
}

interface InputPickerModalProps {
  pickerType: PickerType;
  items: PickerItem[];
  selectedCodes: string[];
  onApply: (selectedCodes: string[]) => void;
  onClose: () => void;
}

const GROUP_NAMES: Record<string, string> = {
  '1': 'Thuốc trong danh mục BHYT',
  '2': 'Thuốc thanh toán theo tỷ lệ',
  '3': 'Thuốc ung thư, điều trị theo phác đồ',
  '4': 'Máu và chế phẩm máu toàn phần',
  '5': 'Phẫu thuật, thủ thuật',
  '6': 'Dịch vụ kỹ thuật thanh toán theo tỷ lệ',
  '7': 'Xét nghiệm, hóa sinh, huyết học',
  '8': 'Chẩn đoán hình ảnh (X-quang, CT, MRI)',
  '9': 'Thăm dò chức năng (Điện tim, nội soi)',
  '10': 'Vật tư y tế trong danh mục',
  '11': 'Vật tư y tế thanh toán theo tỷ lệ',
  '12': 'Vận chuyển người bệnh',
  '13': 'Khám bệnh',
  '14': 'Giường điều trị nội trú',
  '15': 'Giường điều trị ngoại trú',
  '16': 'Chi phí ngoài danh mục',
};

export const InputPickerModal: React.FC<InputPickerModalProps> = ({
  pickerType,
  items,
  selectedCodes,
  onApply,
  onClose
}) => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(() => new Set(selectedCodes));

  const titleInfo = useMemo(() => {
    switch (pickerType) {
      case 'GROUPS':
        return {
          title: 'Nhặt Mã Nhóm Chi Phí (XML2 & XML3)',
          desc: 'Chọn một hoặc nhiều mã nhóm chi phí thuốc, DVKT, VTYT làm điều kiện tìm kiếm',
          icon: <Layers className="w-5 h-5 text-teal-400" />
        };
      case 'ICD':
        return {
          title: 'Nhặt Mã Bệnh ICD-10 (XML1 & XML3)',
          desc: 'Chọn các mã chẩn đoán ICD-10 phát sinh trong hồ sơ để làm điều kiện tìm kiếm',
          icon: <Activity className="w-5 h-5 text-teal-400" />
        };
      case 'DRUGS':
        return {
          title: 'Nhặt Thuốc & Dược Liệu (XML2)',
          desc: 'Chọn tên thuốc hoặc mã thuốc phát sinh trong đơn để làm điều kiện tìm kiếm',
          icon: <Pill className="w-5 h-5 text-amber-400" />
        };
      case 'SERVICES':
        return {
          title: 'Nhặt Dịch Vụ Kỹ Thuật & VTYT (XML3)',
          desc: 'Chọn danh mục dịch vụ kỹ thuật, xét nghiệm, chẩn đoán hình ảnh đã thực hiện',
          icon: <Stethoscope className="w-5 h-5 text-purple-400" />
        };
    }
  }, [pickerType]);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(it => 
      it.code.toLowerCase().includes(q) || 
      it.name.toLowerCase().includes(q) ||
      (it.extra && it.extra.toLowerCase().includes(q))
    );
  }, [items, search]);

  const toggleItem = (code: string) => {
    const next = new Set(selected);
    if (next.has(code)) {
      next.delete(code);
    } else {
      next.add(code);
    }
    setSelected(next);
  };

  const handleSelectAllFiltered = () => {
    const next = new Set(selected);
    for (const it of filteredItems) {
      next.add(it.code);
    }
    setSelected(next);
  };

  const handleClearAll = () => {
    setSelected(new Set());
  };

  const handleConfirm = () => {
    onApply(Array.from(selected));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-5">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
              {titleInfo.icon}
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>{titleInfo.title}</span>
                <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 text-xs font-mono font-semibold">
                  Đã chọn {selected.size}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{titleInfo.desc}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Action Buttons */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/30 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Gõ để tìm kiếm thông tin cần nhặt..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-2.5 text-slate-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleSelectAllFiltered}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              Chọn tất cả
            </button>
            <button
              onClick={handleClearAll}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 hover:text-rose-300 text-xs font-medium transition-colors cursor-pointer"
            >
              Bỏ chọn
            </button>
          </div>
        </div>

        {/* Items List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-1.5">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              Không tìm thấy mục nào khớp với từ khóa "{search}"
            </div>
          ) : (
            filteredItems.map((it) => {
              const isChecked = selected.has(it.code);
              const groupLabel = pickerType === 'GROUPS' ? GROUP_NAMES[it.code] : null;

              return (
                <div
                  key={it.code}
                  onClick={() => toggleItem(it.code)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-teal-500/10 border-teal-500/50 text-white'
                      : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950/80'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <div className="flex-shrink-0 text-teal-400">
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-teal-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-teal-400 text-xs">
                          {it.code}
                        </span>
                        {groupLabel && (
                          <span className="text-slate-400 font-medium truncate">
                            • {groupLabel}
                          </span>
                        )}
                        {!groupLabel && it.name && (
                          <span className="text-slate-200 font-medium truncate">
                            {it.name}
                          </span>
                        )}
                      </div>
                      {it.extra && (
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {it.extra}
                        </p>
                      )}
                    </div>
                  </div>

                  {it.count > 0 && (
                    <span className="font-mono text-slate-500 text-[11px] flex-shrink-0">
                      {it.count.toLocaleString('vi-VN')} {pickerType === 'ICD' ? 'hs' : 'lượt'}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Đã chọn: <strong className="text-teal-400 font-mono font-bold">{selected.size}</strong> mục
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs font-semibold cursor-pointer"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirm}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-teal-500/20 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Áp Dụng Bộ Lọc ({selected.size})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
