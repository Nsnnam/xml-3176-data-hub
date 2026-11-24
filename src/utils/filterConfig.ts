export interface QuickFilterConfigItem {
  id: 'GROUPS' | 'ICD' | 'DRUGS' | 'SERVICES' | 'PATIENTS' | 'DEPARTMENTS' | 'CARDS' | 'DOCTORS' | 'MACHINES';
  fieldKey: string;
  defaultLabel: string;
  customLabel: string;
  enabled: boolean;
  order: number;
  colorClass: string;
}

export const DEFAULT_QUICK_FILTERS: QuickFilterConfigItem[] = [
  {
    id: 'GROUPS',
    fieldKey: 'ma_nhom',
    defaultLabel: 'Mã Nhóm',
    customLabel: 'Mã Nhóm',
    enabled: true,
    order: 1,
    colorClass: 'text-teal-400 bg-teal-500/10 border-teal-500/30 hover:bg-teal-500/20'
  },
  {
    id: 'ICD',
    fieldKey: 'ma_benh_chinh',
    defaultLabel: 'Mã ICD',
    customLabel: 'Mã ICD',
    enabled: true,
    order: 2,
    colorClass: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30 hover:bg-cyan-500/20'
  },
  {
    id: 'DRUGS',
    fieldKey: 'ten_thuoc',
    defaultLabel: 'Thuốc',
    customLabel: 'Thuốc',
    enabled: true,
    order: 3,
    colorClass: 'text-amber-400 bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20'
  },
  {
    id: 'SERVICES',
    fieldKey: 'ten_dich_vu',
    defaultLabel: 'DVKT & VTYT',
    customLabel: 'DVKT & VTYT',
    enabled: true,
    order: 4,
    colorClass: 'text-purple-400 bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20'
  },
  {
    id: 'PATIENTS',
    fieldKey: 'ma_bn',
    defaultLabel: 'Mã BN',
    customLabel: 'Mã BN',
    enabled: true,
    order: 5,
    colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20'
  },
  {
    id: 'DEPARTMENTS',
    fieldKey: 'ma_khoa',
    defaultLabel: 'Mã Khoa',
    customLabel: 'Mã Khoa',
    enabled: false,
    order: 6,
    colorClass: 'text-blue-400 bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20'
  },
  {
    id: 'CARDS',
    fieldKey: 'ma_the_bhyt',
    defaultLabel: 'Mã Thẻ BHYT',
    customLabel: 'Mã Thẻ BHYT',
    enabled: false,
    order: 7,
    colorClass: 'text-pink-400 bg-pink-500/10 border-pink-500/30 hover:bg-pink-500/20'
  },
  {
    id: 'DOCTORS',
    fieldKey: 'nguoi_thuc_hien',
    defaultLabel: 'Người Thực Hiện',
    customLabel: 'Người Thực Hiện',
    enabled: false,
    order: 8,
    colorClass: 'text-orange-400 bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20'
  },
  {
    id: 'MACHINES',
    fieldKey: 'ma_may',
    defaultLabel: 'Mã Máy',
    customLabel: 'Mã Máy',
    enabled: false,
    order: 9,
    colorClass: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30 hover:bg-indigo-500/20'
  }
];

const STORAGE_KEY = 'nsn_quick_filter_config_v2';

export const loadQuickFilterConfig = (): QuickFilterConfigItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as QuickFilterConfigItem[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge with defaults in case new fields were added
        const map = new Map(parsed.map(p => [p.id, p]));
        return DEFAULT_QUICK_FILTERS.map(def => {
          const userItem = map.get(def.id);
          return userItem ? { ...def, ...userItem } : def;
        }).sort((a, b) => a.order - b.order);
      }
    }
  } catch (err) {
    console.error('Error loading quick filter config:', err);
  }
  return [...DEFAULT_QUICK_FILTERS];
};

export const saveQuickFilterConfig = (config: QuickFilterConfigItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Error saving quick filter config:', err);
  }
};
