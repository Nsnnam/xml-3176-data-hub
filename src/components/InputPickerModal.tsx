import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Check, 
  Layers, 
  Pill, 
  Stethoscope, 
  Activity, 
  UserCheck,
  Building2,
  CreditCard,
  User,
  Cpu,
  CheckSquare, 
  Square,
  Sparkles
} from 'lucide-react';

export type PickerType = 
  | 'GROUPS' 
  | 'ICD' 
  | 'DRUGS' 
  | 'SERVICES' 
  | 'PATIENTS' 
  | 'DEPARTMENTS' 
  | 'CARDS' 
  | 'DOCTORS' 
  | 'MACHINES';

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
          icon: <Activity className="w-5 h-5 text-cyan-400" />
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
      case 'PATIENTS':
        return {
          title: 'Nhặt Mã Bệnh Nhân (MA_BN - XML1)',
          desc: 'Chọn một hoặc nhiều mã bệnh nhân phát sinh trong hồ sơ KCB',
          icon: <UserCheck className="w-5 h-5 text-emerald-400" />
        };
      case 'DEPARTMENTS':
        return {
          title: 'Nhặt Mã Khoa Điều Trị (MA_KHOA)',
          desc: 'Chọn khoa phòng điều trị phát sinh trong hồ sơ XML1, XML2, XML3',
          icon: <Building2 className="w-5 h-5 text-blue-400" />
        };
      case 'CARDS':
        return {
          title: 'Nhặt Mã Thẻ BHYT (MA_THE_BHYT)',
          desc: 'Chọn mã thẻ bảo hiểm y tế của người bệnh',
          icon: <CreditCard className="w-5 h-5 text-pink-400" />
        };
      case 'DOCTORS':
        return {
          title: 'Nhặt Bác Sĩ / Người Thực Hiện',
          desc: 'Chọn bác sĩ kê đơn hoặc kỹ thuật viên thực hiện dịch vụ',
          icon: <User className="w-5 h-5 text-orange-400" />
        };
      case 'MACHINES':
        return {
          title: 'Nhặt Mã Máy / Thiết Bị Thực Hiện (MA_MAY)',
          desc: 'Chọn mã máy thực hiện xét nghiệm, chẩn đoán hình ảnh từ XML3',
          icon: <Cpu className="w-5 h-5 text-indigo-400" />
        };
      default:
        return {
          title: 'Nhặt Thông Tin Điều Kiện Lọc',
          desc: 'Chọn các giá trị mong muốn từ dữ liệu',
          icon: <Sparkles className="w-5 h-5 text-teal-400" />
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
    filteredItems.forEach(it => next.add(it.code));
    setSelected(next);
  };

  const handleDeselectAllFiltered = () => {
    const next = new Set(selected);
    filteredItems.forEach(it => next.delete(it.code));
    setSelected(next);
  };

  const handleApply = () => {
    onApply(Array.from(selected));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-6 animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 flex items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center flex-shrink-0">
              {titleInfo.icon}
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{titleInfo.title}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30 font-mono">
                  {selected.size} đã chọn
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {titleInfo.desc}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Bulk actions bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/30 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Gõ để tìm kiếm nhanh mã, tên..."
              autoFocus
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Tìm thấy <strong className="text-teal-400 font-mono">{filteredItems.length}</strong> / {items.length} mục
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectAllFiltered}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 font-medium transition-colors cursor-pointer"
              >
                Chọn tất cả ({filteredItems.length})
              </button>
              <button
                type="button"
                onClick={handleDeselectAllFiltered}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-medium transition-colors cursor-pointer"
              >
                Bỏ chọn tất cả
              </button>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 divide-y divide-slate-800/40">
          {filteredItems.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              Không tìm thấy mục nào phù hợp với từ khóa "{search}".
            </div>
          ) : (
            filteredItems.map((item) => {
              const isChecked = selected.has(item.code);
              const groupDesc = pickerType === 'GROUPS' ? GROUP_NAMES[item.code] : null;

              return (
                <div
                  key={item.code}
                  onClick={() => toggleItem(item.code)}
                  className={`pt-1.5 first:pt-0 flex items-center justify-between gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-teal-500/10 border border-teal-500/40 text-teal-200'
                      : 'hover:bg-slate-800/60 border border-transparent text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="text-teal-400 flex-shrink-0">
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-teal-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-600" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-teal-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700/50">
                          {item.code}
                        </span>
                        <span className="font-medium text-xs truncate text-slate-200" title={item.name}>
                          {item.name}
                        </span>
                      </div>

                      {(groupDesc || item.extra) && (
                        <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                          {groupDesc ? (
                            <span className="text-teal-400/90 font-medium">{groupDesc}</span>
                          ) : (
                            item.extra
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                      {item.count.toLocaleString('vi-VN')}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Đã chọn: <strong className="text-teal-400 font-mono">{selected.size}</strong> điều kiện
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-teal-500/20 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Áp dụng ({selected.size})</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
