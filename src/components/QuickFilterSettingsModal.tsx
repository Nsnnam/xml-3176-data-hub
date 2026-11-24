import React, { useState } from 'react';
import { 
  X, 
  Settings2, 
  Check, 
  RotateCcw, 
  Sliders, 
  Layers, 
  Activity, 
  Pill, 
  Stethoscope, 
  UserCheck, 
  Building2, 
  CreditCard, 
  User, 
  Cpu 
} from 'lucide-react';
import { 
  QuickFilterConfigItem, 
  DEFAULT_QUICK_FILTERS, 
  saveQuickFilterConfig 
} from '../utils/filterConfig';

interface QuickFilterSettingsModalProps {
  isOpen: boolean;
  config: QuickFilterConfigItem[];
  onSave: (newConfig: QuickFilterConfigItem[]) => void;
  onClose: () => void;
}

export const QuickFilterSettingsModal: React.FC<QuickFilterSettingsModalProps> = ({
  isOpen,
  config,
  onSave,
  onClose
}) => {
  const [items, setItems] = useState<QuickFilterConfigItem[]>(() => 
    config.map(item => ({ ...item }))
  );

  if (!isOpen) return null;

  const handleToggle = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, enabled: !item.enabled } : item
    ));
  };

  const handleLabelChange = (id: string, newLabel: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, customLabel: newLabel } : item
    ));
  };

  const handleResetDefaults = () => {
    if (window.confirm('Khôi phục cấu hình bộ lọc nhanh về mặc định ban đầu?')) {
      const def = DEFAULT_QUICK_FILTERS.map(d => ({ ...d }));
      setItems(def);
      saveQuickFilterConfig(def);
      onSave(def);
    }
  };

  const handleSave = () => {
    saveQuickFilterConfig(items);
    onSave(items);
    onClose();
  };

  const getIcon = (id: string) => {
    switch (id) {
      case 'GROUPS': return <Layers className="w-4 h-4 text-teal-400" />;
      case 'ICD': return <Activity className="w-4 h-4 text-cyan-400" />;
      case 'DRUGS': return <Pill className="w-4 h-4 text-amber-400" />;
      case 'SERVICES': return <Stethoscope className="w-4 h-4 text-purple-400" />;
      case 'PATIENTS': return <UserCheck className="w-4 h-4 text-emerald-400" />;
      case 'DEPARTMENTS': return <Building2 className="w-4 h-4 text-blue-400" />;
      case 'CARDS': return <CreditCard className="w-4 h-4 text-pink-400" />;
      case 'DOCTORS': return <User className="w-4 h-4 text-orange-400" />;
      case 'MACHINES': return <Cpu className="w-4 h-4 text-indigo-400" />;
      default: return <Sliders className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center">
              <Settings2 className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Cài Đặt Bộ Lọc Thông Tin Nhanh
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Bật/tắt các nút nhặt thông tin, thêm trường lọc và đổi tên hiển thị theo ý muốn
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

        {/* Content list */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          <div className="text-xs text-slate-400 mb-2">
            Danh sách các trường nhặt thông tin đầu vào từ XML 1, 2, 3:
          </div>

          {items.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                item.enabled
                  ? 'bg-slate-950/80 border-slate-700/80 shadow-sm'
                  : 'bg-slate-950/30 border-slate-800/40 opacity-60'
              }`}
            >
              {/* Left: Switch + Icon + System Key */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={item.enabled}
                  onChange={() => handleToggle(item.id)}
                  id={`chk_${item.id}`}
                  className="w-4 h-4 rounded text-teal-500 focus:ring-teal-400 focus:ring-offset-slate-900 cursor-pointer accent-teal-500"
                />

                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                  {getIcon(item.id)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <label 
                      htmlFor={`chk_${item.id}`} 
                      className="text-xs font-semibold text-slate-200 cursor-pointer select-none"
                    >
                      {item.defaultLabel}
                    </label>
                    <span className="text-[10px] font-mono text-slate-500 px-1.5 py-0.2 rounded bg-slate-800">
                      {item.fieldKey}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">Tên hiển thị:</span>
                    <input
                      type="text"
                      value={item.customLabel}
                      disabled={!item.enabled}
                      onChange={(e) => handleLabelChange(item.id, e.target.value)}
                      placeholder={item.defaultLabel}
                      className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-xs text-teal-300 font-medium focus:outline-none focus:border-teal-500 w-36 sm:w-44 disabled:opacity-40"
                    />
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex-shrink-0">
                {item.enabled ? (
                  <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">
                    Đang hiện
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                    Đã ẩn
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi phục mặc định</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-teal-500/20 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Lưu Cấu Hình</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
