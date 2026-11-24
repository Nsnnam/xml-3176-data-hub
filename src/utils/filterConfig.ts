export interface QuickFilterConfigItem {
  id: string;
  xmlTable: 'XML1' | 'XML2' | 'XML3';
  fieldKey: string;
  defaultLabel: string;
  customLabel: string;
  enabled: boolean;
  order: number;
  colorClass: string;
  isCustom?: boolean;
}

export interface AvailableColumnDef {
  xmlTable: 'XML1' | 'XML2' | 'XML3';
  fieldKey: string;
  label: string;
  description: string;
}

export const AVAILABLE_XML_COLUMNS: AvailableColumnDef[] = [
  // XML1 - Tổng hợp KCB
  { xmlTable: 'XML1', fieldKey: 'MA_BN', label: 'Mã Bệnh Nhân (MA_BN)', description: 'Mã định danh bệnh nhân tại cơ sở KCB' },
  { xmlTable: 'XML1', fieldKey: 'MA_LK', label: 'Mã Liên Kết (MA_LK)', description: 'Mã liên kết hồ sơ khám chữa bệnh BHYT' },
  { xmlTable: 'XML1', fieldKey: 'HO_TEN', label: 'Họ và Tên (HO_TEN)', description: 'Họ tên đầy đủ của người bệnh' },
  { xmlTable: 'XML1', fieldKey: 'SO_CCCD', label: 'Số CCCD/CMND (SO_CCCD)', description: 'Căn cước công dân hoặc số định danh cá nhân' },
  { xmlTable: 'XML1', fieldKey: 'MA_THE_BHYT', label: 'Mã Thẻ BHYT (MA_THE_BHYT)', description: '10 hoặc 15 ký tự số thẻ BHYT' },
  { xmlTable: 'XML1', fieldKey: 'MA_KHOA', label: 'Khoa Điều Trị (MA_KHOA)', description: 'Mã khoa phòng bệnh nhân vào/ra viện' },
  { xmlTable: 'XML1', fieldKey: 'MA_BENH_CHINH', label: 'Mã Bệnh Chính (MA_BENH_CHINH)', description: 'Mã bệnh ICD-10 chính' },
  { xmlTable: 'XML1', fieldKey: 'MA_BENH_KT', label: 'Mã Bệnh Kèm Theo (MA_BENH_KT)', description: 'Danh sách mã bệnh phụ kèm theo' },
  { xmlTable: 'XML1', fieldKey: 'CHAN_DOAN_RV', label: 'Chẩn Đoán Ra Viện (CHAN_DOAN_RV)', description: 'Mô tả chẩn đoán lâm sàng khi ra viện' },
  { xmlTable: 'XML1', fieldKey: 'MA_HSBA', label: 'Mã Hồ Sơ Bệnh Án (MA_HSBA)', description: 'Mã lưu trữ bệnh án nội trú/ngoại trú' },
  { xmlTable: 'XML1', fieldKey: 'MA_CSKCB', label: 'Mã Cơ Sở KCB (MA_CSKCB)', description: 'Mã 5 ký tự cơ sở tiếp nhận' },
  { xmlTable: 'XML1', fieldKey: 'MA_DKBD', label: 'Nơi ĐK KCB Ban Đầu (MA_DKBD)', description: 'Mã nơi đăng ký khám chữa bệnh ban đầu' },
  { xmlTable: 'XML1', fieldKey: 'KET_QUA_DTRI', label: 'Kết Quả Điều Trị (KET_QUA_DTRI)', description: '1: Khỏi, 2: Đỡ, 3: Không đổi, 4: Nặng, 5: Tử vong' },
  { xmlTable: 'XML1', fieldKey: 'MA_LOAI_RV', label: 'Tình Trạng Ra Viện (MA_LOAI_RV)', description: '1: Ra viện, 2: Chuyển viện, 3: Trốn, 4: Xin về' },
  { xmlTable: 'XML1', fieldKey: 'GIOI_TINH', label: 'Giới Tính (GIOI_TINH)', description: '1: Nam, 2: Nữ' },
  { xmlTable: 'XML1', fieldKey: 'DIA_CHI', label: 'Địa Chỉ Bệnh Nhân (DIA_CHI)', description: 'Nơi cư trú hoặc tạm trú' },
  { xmlTable: 'XML1', fieldKey: 'SO_NGAY_DTRI', label: 'Số Ngày Điều Trị (SO_NGAY_DTRI)', description: 'Tổng số ngày lưu viện điều trị' },

  // XML2 - Thuốc
  { xmlTable: 'XML2', fieldKey: 'MA_THUOC', label: 'Mã Thuốc (MA_THUOC)', description: 'Mã thuốc dùng chung theo danh mục BHYT' },
  { xmlTable: 'XML2', fieldKey: 'TEN_THUOC', label: 'Tên Thuốc / Biệt Dược (TEN_THUOC)', description: 'Tên thương mại hoặc tên hoạt chất' },
  { xmlTable: 'XML2', fieldKey: 'HAM_LUONG', label: 'Hàm Lượng / Hoạt Chất (HAM_LUONG)', description: 'Nồng độ, hàm lượng của thuốc' },
  { xmlTable: 'XML2', fieldKey: 'DUONG_DUNG', label: 'Đường Dùng (DUONG_DUNG)', description: 'Uống, tiêm, truyền, đặt...' },
  { xmlTable: 'XML2', fieldKey: 'SO_DANG_KY', label: 'Số Đăng Ký / GPNK (SO_DANG_KY)', description: 'Số Visa hoặc giấy phép nhập khẩu' },
  { xmlTable: 'XML2', fieldKey: 'TT_THAU', label: 'Thông Tin Thầu Thuốc (TT_THAU)', description: 'Gói thầu, nhóm thầu và năm trúng thầu' },
  { xmlTable: 'XML2', fieldKey: 'MA_BAC_SI', label: 'Bác Sĩ Kê Đơn (MA_BAC_SI)', description: 'Mã chứng chỉ hành nghề hoặc mã BS' },
  { xmlTable: 'XML2', fieldKey: 'MA_NHOM', label: 'Mã Nhóm Thuốc (MA_NHOM)', description: 'Nhóm 4, 5, 6 theo QĐ 3176' },
  { xmlTable: 'XML2', fieldKey: 'MA_KHOA', label: 'Khoa Kê Đơn (MA_KHOA)', description: 'Khoa điều trị phát sinh y lệnh thuốc' },
  { xmlTable: 'XML2', fieldKey: 'DANG_BAO_CHE', label: 'Dạng Bào Chế (DANG_BAO_CHE)', description: 'Viên nén, siro, dung dịch tiêm...' },

  // XML3 - Dịch vụ kỹ thuật & VTYT
  { xmlTable: 'XML3', fieldKey: 'MA_DICH_VU', label: 'Mã Dịch Vụ Kỹ Thuật (MA_DICH_VU)', description: 'Mã DVKT theo danh mục BHYT' },
  { xmlTable: 'XML3', fieldKey: 'TEN_DICH_VU', label: 'Tên Dịch Vụ Kỹ Thuật (TEN_DICH_VU)', description: 'Tên kỹ thuật, phẫu thuật, xét nghiệm, CĐHA' },
  { xmlTable: 'XML3', fieldKey: 'MA_VAT_TU', label: 'Mã Vật Tư Y Tế (MA_VAT_TU)', description: 'Mã danh mục vật tư tiêu hao' },
  { xmlTable: 'XML3', fieldKey: 'TEN_VAT_TU', label: 'Tên Vật Tư Y Tế (TEN_VAT_TU)', description: 'Tên bông băng, chỉ khâu, nẹp vis...' },
  { xmlTable: 'XML3', fieldKey: 'MA_NHOM', label: 'Mã Nhóm DVKT (MA_NHOM)', description: 'Nhóm 1 (Khám), 2 (Giường), 3 (Xét nghiệm)...' },
  { xmlTable: 'XML3', fieldKey: 'MA_MAY', label: 'Mã Máy Thực Hiện (MA_MAY)', description: 'Mã thiết bị y tế thực hiện cận lâm sàng' },
  { xmlTable: 'XML3', fieldKey: 'NGUOI_THUC_HIEN', label: 'Người Thực Hiện (NGUOI_THUC_HIEN)', description: 'Bác sĩ hoặc KTV thực hiện kỹ thuật' },
  { xmlTable: 'XML3', fieldKey: 'MA_GIUONG', label: 'Mã Giường Bệnh (MA_GIUONG)', description: 'Số hiệu giường tại buồng bệnh' },
  { xmlTable: 'XML3', fieldKey: 'MA_KHOA', label: 'Khoa Thực Hiện (MA_KHOA)', description: 'Khoa phòng phát sinh dịch vụ kỹ thuật' },
  { xmlTable: 'XML3', fieldKey: 'MA_BAC_SI', label: 'Bác Sĩ Chỉ Định DVKT (MA_BAC_SI)', description: 'Bác sĩ ra y lệnh dịch vụ kỹ thuật' },
  { xmlTable: 'XML3', fieldKey: 'MA_BENH', label: 'Mã Bệnh Kèm DVKT (MA_BENH)', description: 'Mã chẩn đoán gắn với dịch vụ kỹ thuật' }
];

export const DEFAULT_QUICK_FILTERS: QuickFilterConfigItem[] = [
  {
    id: 'GROUPS',
    xmlTable: 'XML3',
    fieldKey: 'MA_NHOM',
    defaultLabel: 'Mã Nhóm',
    customLabel: 'Mã Nhóm',
    enabled: true,
    order: 1,
    colorClass: 'text-teal-400 bg-teal-500/10 border-teal-500/30 hover:bg-teal-500/20'
  },
  {
    id: 'ICD',
    xmlTable: 'XML1',
    fieldKey: 'MA_BENH_CHINH',
    defaultLabel: 'Mã ICD',
    customLabel: 'Mã ICD',
    enabled: true,
    order: 2,
    colorClass: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30 hover:bg-cyan-500/20'
  },
  {
    id: 'DRUGS',
    xmlTable: 'XML2',
    fieldKey: 'TEN_THUOC',
    defaultLabel: 'Thuốc',
    customLabel: 'Thuốc',
    enabled: true,
    order: 3,
    colorClass: 'text-amber-400 bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20'
  },
  {
    id: 'SERVICES',
    xmlTable: 'XML3',
    fieldKey: 'TEN_DICH_VU',
    defaultLabel: 'DVKT & VTYT',
    customLabel: 'DVKT & VTYT',
    enabled: true,
    order: 4,
    colorClass: 'text-purple-400 bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20'
  },
  {
    id: 'PATIENTS',
    xmlTable: 'XML1',
    fieldKey: 'MA_BN',
    defaultLabel: 'Mã BN',
    customLabel: 'Mã BN',
    enabled: true,
    order: 5,
    colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20'
  },
  {
    id: 'DEPARTMENTS',
    xmlTable: 'XML1',
    fieldKey: 'MA_KHOA',
    defaultLabel: 'Mã Khoa',
    customLabel: 'Mã Khoa',
    enabled: true,
    order: 6,
    colorClass: 'text-blue-400 bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20'
  },
  {
    id: 'CARDS',
    xmlTable: 'XML1',
    fieldKey: 'MA_THE_BHYT',
    defaultLabel: 'Mã Thẻ BHYT',
    customLabel: 'Mã Thẻ BHYT',
    enabled: true,
    order: 7,
    colorClass: 'text-pink-400 bg-pink-500/10 border-pink-500/30 hover:bg-pink-500/20'
  },
  {
    id: 'DOCTORS',
    xmlTable: 'XML3',
    fieldKey: 'NGUOI_THUC_HIEN',
    defaultLabel: 'Người Thực Hiện',
    customLabel: 'Người Thực Hiện',
    enabled: true,
    order: 8,
    colorClass: 'text-orange-400 bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20'
  },
  {
    id: 'MACHINES',
    xmlTable: 'XML3',
    fieldKey: 'MA_MAY',
    defaultLabel: 'Mã Máy',
    customLabel: 'Mã Máy',
    enabled: true,
    order: 9,
    colorClass: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30 hover:bg-indigo-500/20'
  }
];

const STORAGE_KEY = 'nsn_quick_filter_config_v3';

export const loadQuickFilterConfig = (): QuickFilterConfigItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.sort((a, b) => (a.order || 0) - (b.order || 0));
      }
    }
  } catch (err) {
    console.error('Error loading quick filter config:', err);
  }
  return DEFAULT_QUICK_FILTERS.map(d => ({ ...d }));
};

export const saveQuickFilterConfig = (config: QuickFilterConfigItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Error saving quick filter config:', err);
  }
};
