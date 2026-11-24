import React, { useState, useEffect } from 'react';
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
  Cpu,
  Plus,
  Trash2,
  TableProperties
} from 'lucide-react';
import { 
  QuickFilterConfigItem, 
  DEFAULT_QUICK_FILTERS, 
  AVAILABLE_XML_COLUMNS,
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
  const [items, setItems] = useState<QuickFilterConfigItem[]>([]);
  const [selectedXmlTab, setSelectedXmlTab] = useState<'ALL' | 'XML1' | 'XML2' | 'XML3'>('ALL');
  const [selectedColToAdd, setSelectedColToAdd] = useState<string>('');

  // Sync with prop when modal opens
  useEffect(() => {
    if (isOpen) {
      setItems(config.map(item => ({ ...item })));
    }
  }, [isOpen, config]);

  if (!isOpen) return null;

  const handleToggle = (id: string) => {
    const updated = items.map(item => 
      item.id === id ? { ...item, enabled: !item.enabled } : item
    );
    setItems(updated);
    saveQuickFilterConfig(updated);
    onSave(updated);
  };

  const handleLabelChange = (id: string, newLabel: string) => {
    const updated = items.map(item => 
      item.id === id ? { ...item, customLabel: newLabel } : item
    );
    setItems(updated);
    saveQuickFilterConfig(updated);
    onSave(updated);
  };

  const handleRemoveCustomItem = (id: string) => {
    const updated = items.filter(item => item.id !== id);
    setItems(updated);
    saveQuickFilterConfig(updated);
    onSave(updated);
  };

  const handleAddColumn = () => {
    if (!selectedColToAdd) return;
    const colDef = AVAILABLE_XML_COLUMNS.find(c => c.fieldKey === selectedColToAdd);
    if (!colDef) return;

    // Check if already in items
    const existing = items.find(i => i.fieldKey.toLowerCase() === colDef.fieldKey.toLowerCase());
    if (existing) {
      // Just enable it
      const updated = items.map(i => i.id === existing.id ? { ...i, enabled: true } : i);
      setItems(updated);
      saveQuickFilterConfig(updated);
      onSave(updated);
      setSelectedColToAdd('');
      return;
    }

    const newItem: QuickFilterConfigItem = {
      id: `col_${colDef.xmlTable.toLowerCase()}_${colDef.fieldKey.toLowerCase()}`,
      xmlTable: colDef.xmlTable,
      fieldKey: colDef.fieldKey,
      defaultLabel: colDef.label.split(' (')[0] || colDef.fieldKey,
      customLabel: colDef.label.split(' (')[0] || colDef.fieldKey,
      enabled: true,
      order: items.length + 1,
      colorClass: colDef.xmlTable === 'XML1' 
        ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' 
        : colDef.xmlTable === 'XML2'
        ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
        : 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      isCustom: true
    };

    const updated = [...items, newItem];
    setItems(updated);
    saveQuickFilterConfig(updated);
    onSave(updated);
    setSelectedColToAdd('');
  };

  const handleResetDefaults = () => {
    if (window.confirm('Khôi phục danh sách bộ lọc nhanh về cấu hình mặc định?')) {
      const def = DEFAULT_QUICK_FILTERS.map(d => ({ ...d }));
      setItems(def);
      saveQuickFilterConfig(def);
      onSave(def);
    }
  };

  const handleSaveAndClose = () => {
    saveQuickFilterConfig(items);
    onSave(items);
    onClose();
  };

  const getIcon = (item: QuickFilterConfigItem) => {
    switch (item.id) {
      case 'GROUPS': return <Layers className="w-4 h-4 text-teal-400" />;
      case 'ICD': return <Activity className="w-4 h-4 text-cyan-400" />;
      case 'DRUGS': return <Pill className="w-4 h-4 text-amber-400" />;
      case 'SERVICES': return <Stethoscope className="w-4 h-4 text-purple-400" />;
      case 'PATIENTS': return <UserCheck className="w-4 h-4 text-emerald-400" />;
      case 'DEPARTMENTS': return <Building2 className="w-4 h-4 text-blue-400" />;
      case 'CARDS': return <CreditCard className="w-4 h-4 text-pink-400" />;
      case 'DOCTORS': return <User className="w-4 h-4 text-orange-400" />;
      case 'MACHINES': return <Cpu className="w-4 h-4 text-indigo-400" />;
      default: return <TableProperties className="w-4 h-4 text-teal-400" />;
    }
  };

  // Filter items by XML Tab
  const displayedItems = items.filter(item => {
    if (selectedXmlTab === 'ALL') return true;
    return item.xmlTable === selectedXmlTab;
  });

  // Filter available columns for the add dropdown
  const filteredAvailableCols = AVAILABLE_XML_COLUMNS.filter(c => {
    if (selectedXmlTab !== 'ALL' && c.xmlTable !== selectedXmlTab) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-5 animate-fade-in">
      <div className="w-full max-w-2xl h-[90vh] max-h-[720px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center flex-shrink-0">
              <Settings2 className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Cài Đặt Bộ Lọc Thông Tin Nhanh
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Chọn loại XML, bật/tắt cột hiển thị và đổi tên nút lọc theo ý muốn
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

        {/* XML Table Selector Tabs & Add Column Bar */}
        <div className="p-3.5 bg-slate-950/40 border-b border-slate-800 flex-shrink-0 space-y-3">
          {/* XML Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Phân loại XML:
            </span>
            <button
              type="button"
              onClick={() => setSelectedXmlTab('ALL')}
              className={`px-3 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                selectedXmlTab === 'ALL'
                  ? 'bg-teal-500 text-slate-950 border-teal-400 font-bold shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Tất Cả ({items.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedXmlTab('XML1')}
              className={`px-3 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                selectedXmlTab === 'XML1'
                  ? 'bg-blue-500 text-white border-blue-400 font-bold shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              XML1 (Tổng Hợp)
            </button>
            <button
              type="button"
              onClick={() => setSelectedXmlTab('XML2')}
              className={`px-3 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                selectedXmlTab === 'XML2'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              XML2 (Thuốc)
            </button>
            <button
              type="button"
              onClick={() => setSelectedXmlTab('XML3')}
              className={`px-3 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                selectedXmlTab === 'XML3'
                  ? 'bg-purple-500 text-white border-purple-400 font-bold shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              XML3 (DVKT & VTYT)
            </button>
          </div>

          {/* Add New Column Selector */}
          <div className="flex items-center gap-2 pt-1">
            <div className="relative flex-1">
              <select
                value={selectedColToAdd}
                onChange={(e) => setSelectedColToAdd(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
              >
                <option value="">-- Chọn cột từ {selectedXmlTab === 'ALL' ? 'XML 1, 2, 3' : selectedXmlTab} để thêm vào bộ lọc --</option>
                {filteredAvailableCols.map((c) => (
                  <option key={c.fieldKey} value={c.fieldKey}>
                    [{c.xmlTable}] {c.label} - {c.description}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={handleAddColumn}
              disabled={!selectedColToAdd}
              className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer flex-shrink-0 shadow-md shadow-teal-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm Cột Này</span>
            </button>
          </div>
        </div>

        {/* Scrollable list of configured filter items */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1 min-h-0">
          <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
            <span>Danh sách trường lọc ({displayedItems.length}):</span>
            <span className="text-[11px] text-teal-400 font-medium">Thay đổi được tự động lưu ngay lập tức</span>
          </div>

          {displayedItems.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              Chưa có trường lọc nào trong mục {selectedXmlTab}. Hãy chọn cột ở trên để thêm.
            </div>
          ) : (
            displayedItems.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  item.enabled
                    ? 'bg-slate-950/80 border-slate-700/80 shadow-sm'
                    : 'bg-slate-950/30 border-slate-800/40 opacity-60'
                }`}
              >
                {/* Left: Switch + XML Badge + Icon + Key */}
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={item.enabled}
                    onChange={() => handleToggle(item.id)}
                    id={`chk_${item.id}`}
                    className="w-4 h-4 rounded text-teal-500 focus:ring-teal-400 cursor-pointer accent-teal-500 flex-shrink-0"
                  />

                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${
                    item.xmlTable === 'XML1' ? 'bg-blue-500/20 text-blue-400' :
                    item.xmlTable === 'XML2' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    {item.xmlTable}
                  </span>

                  <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                    {getIcon(item)}
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
                        className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-xs text-teal-300 font-medium focus:outline-none focus:border-teal-500 w-36 sm:w-48 disabled:opacity-40"
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Status badge & Delete custom button */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {item.enabled ? (
                    <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">
                      Đang hiện
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                      Đã ẩn
                    </span>
                  )}

                  {item.isCustom && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomItem(item.id)}
                      className="p-1 rounded text-red-400 hover:bg-red-500/20 transition-colors"
                      title="Xóa cột này khỏi bộ lọc"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sticky Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between gap-3 flex-shrink-0">
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
              onClick={handleSaveAndClose}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-teal-500/20 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Đóng & Áp Dụng Ngay</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
