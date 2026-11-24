// Standard column definitions for Quyết định 3176/QĐ-BYT (XML 1, 2, 3)

export const XML1_COLUMNS = [
  'MA_LK', 'STT', 'MA_BN', 'HO_TEN', 'SO_CCCD', 'NGAY_SINH', 'GIOI_TINH', 'MA_QUOCTICH',
  'MA_DANTOC', 'MA_NGHE_NGHIEP', 'DIA_CHI', 'MATINH_CU_TRU', 'MAHUYEN_CU_TRU', 'MAXA_CU_TRU',
  'DIEN_THOAI', 'MA_THE_BHYT', 'MA_DKBD', 'GT_THE_TU', 'GT_THE_DEN', 'NGAY_MIEN_CCT',
  'LY_DO_VV', 'LY_DO_VNT', 'MA_LY_DO_VNT', 'CHAN_DOAN_VAO', 'CHAN_DOAN_RV', 'MA_BENH_CHINH',
  'MA_BENH_KT', 'MA_BENH_YHCT', 'MA_PTTT_QT', 'MA_DOITUONG_KCB', 'MA_NOI_DI', 'MA_NOI_DEN',
  'MA_TAI_NAN', 'NGAY_VAO', 'NGAY_VAO_NOI_TRU', 'NGAY_RA', 'GIAY_CHUYEN_TUYEN', 'SO_NGAY_DTRI',
  'PP_DIEU_TRI', 'KET_QUA_DTRI', 'MA_LOAI_RV', 'GHI_CHU', 'NGAY_TTOAN', 'T_THUOC',
  'T_VTYT', 'T_TONGCHI_BV', 'T_TONGCHI_BH', 'T_BNTT', 'T_BNCCT', 'T_BHTT',
  'T_NGUONKHAC', 'T_BHTT_GDV', 'NAM_QT', 'THANG_QT', 'MA_LOAI_KCB', 'MA_KHOA',
  'MA_CSKCB', 'MA_KHUVUC', 'CAN_NANG', 'CAN_NANG_CON', 'NAM_NAM_LIEN_TUC', 'NGAY_TAI_KHAM',
  'MA_HSBA', 'MA_TTDV', 'DU_PHONG'
] as const;

export const XML2_COLUMNS = [
  'MA_LK', 'STT', 'MA_THUOC', 'MA_PP_CHEBIEN', 'MA_CSKCB_THUOC', 'MA_NHOM', 'TEN_THUOC',
  'DON_VI_TINH', 'HAM_LUONG', 'DUONG_DUNG', 'DANG_BAO_CHE', 'LIEU_DUNG', 'CACH_DUNG',
  'SO_DANG_KY', 'TT_THAU', 'PHAM_VI', 'TYLE_TT_BH', 'SO_LUONG', 'DON_GIA',
  'THANH_TIEN_BV', 'THANH_TIEN_BH', 'T_NGUONKHAC_NSNN', 'T_NGUONKHAC_VTNN',
  'T_NGUONKHAC_VTTN', 'T_NGUONKHAC_CL', 'T_NGUONKHAC', 'MUC_HUONG', 'T_BNTT',
  'T_BNCCT', 'T_BHTT', 'MA_KHOA', 'MA_BAC_SI', 'MA_DICH_VU', 'NGAY_YL',
  'NGAY_TH_YL', 'MA_PTTT', 'NGUON_CTRA', 'VET_THUONG_TP', 'DU_PHONG',
  'MA_BA', 'HO_TEN', 'MA_THE', 'SOPHIEU'
] as const;

export const XML3_COLUMNS = [
  'MA_LK', 'STT', 'MA_DICH_VU', 'MA_PTTT_QT', 'MA_VAT_TU', 'MA_NHOM', 'GOI_VTYT',
  'TEN_VAT_TU', 'TEN_DICH_VU', 'MA_XANG_DAU', 'DON_VI_TINH', 'PHAM_VI', 'SO_LUONG',
  'DON_GIA_BV', 'DON_GIA_BH', 'TT_THAU', 'TYLE_TT_DV', 'TYLE_TT_BH', 'THANH_TIEN_BV',
  'THANH_TIEN_BH', 'T_TRANTT', 'MUC_HUONG', 'T_NGUONKHAC_NSNN', 'T_NGUONKHAC_VTNN',
  'T_NGUONKHAC_VTTN', 'T_NGUONKHAC_CL', 'T_NGUONKHAC', 'T_BNTT', 'T_BNCCT',
  'T_BHTT', 'MA_KHOA', 'MA_GIUONG', 'MA_BAC_SI', 'NGUOI_THUC_HIEN', 'MA_BENH',
  'MA_BENH_YHCT', 'NGAY_YL', 'NGAY_TH_YL', 'NGAY_KQ', 'MA_PTTT', 'VET_THUONG_TP',
  'PP_VO_CAM', 'VI_TRI_TH_DVKT', 'MA_MAY', 'MA_HIEU_SP', 'TAI_SU_DUNG',
  'DU_PHONG', 'MA_BA', 'HO_TEN', 'MA_THE', 'SOPHIEU'
] as const;

export type XmlTableType = 'XML1' | 'XML2' | 'XML3' | 'XML_PACKAGE';

export type RawRecord = Record<string, any>;

export interface Xml1Record extends RawRecord {
  MA_LK: string;
  STT?: number | string;
  MA_BN?: string;
  HO_TEN?: string;
  SO_CCCD?: string;
  NGAY_SINH?: number | string;
  GIOI_TINH?: number | string;
  DIA_CHI?: string;
  MA_THE_BHYT?: string;
  MA_DKBD?: string;
  CHAN_DOAN_VAO?: string;
  CHAN_DOAN_RV?: string;
  MA_BENH_CHINH?: string;
  MA_BENH_KT?: string;
  NGAY_VAO?: number | string;
  NGAY_VAO_NOI_TRU?: number | string;
  NGAY_RA?: number | string;
  SO_NGAY_DTRI?: number | string;
  KET_QUA_DTRI?: number | string;
  MA_LOAI_RV?: number | string;
  GHI_CHU?: string;
  NGAY_TTOAN?: number | string;
  T_THUOC?: number | string;
  T_VTYT?: number | string;
  T_TONGCHI_BV?: number | string;
  T_TONGCHI_BH?: number | string;
  T_BNTT?: number | string;
  T_BNCCT?: number | string;
  T_BHTT?: number | string;
  MA_LOAI_KCB?: number | string;
  MA_KHOA?: string;
  MA_CSKCB?: string;
  MA_HSBA?: string;
}

export interface Xml2Record extends RawRecord {
  MA_LK: string;
  STT?: number | string;
  MA_THUOC?: string;
  MA_NHOM?: string | number;
  TEN_THUOC?: string;
  DON_VI_TINH?: string;
  HAM_LUONG?: string;
  DUONG_DUNG?: string;
  DANG_BAO_CHE?: string;
  LIEU_DUNG?: string;
  SO_DANG_KY?: string;
  TT_THAU?: string;
  SO_LUONG?: number | string;
  DON_GIA?: number | string;
  THANH_TIEN_BV?: number | string;
  THANH_TIEN_BH?: number | string;
  T_BNTT?: number | string;
  T_BHTT?: number | string;
  MA_KHOA?: string;
  MA_BAC_SI?: string;
  NGAY_YL?: number | string;
  NGAY_TH_YL?: number | string;
  MA_BA?: string;
  HO_TEN?: string;
  SOPHIEU?: string;
}

export interface Xml3Record extends RawRecord {
  MA_LK: string;
  STT?: number | string;
  MA_DICH_VU?: string;
  MA_VAT_TU?: string;
  MA_NHOM?: string | number;
  TEN_VAT_TU?: string;
  TEN_DICH_VU?: string;
  DON_VI_TINH?: string;
  SO_LUONG?: number | string;
  DON_GIA_BV?: number | string;
  DON_GIA_BH?: number | string;
  TT_THAU?: string;
  THANH_TIEN_BV?: number | string;
  THANH_TIEN_BH?: number | string;
  T_BNTT?: number | string;
  T_BHTT?: number | string;
  MA_KHOA?: string;
  MA_GIUONG?: string;
  MA_BAC_SI?: string;
  NGUOI_THUC_HIEN?: string;
  MA_BENH?: string;
  NGAY_YL?: number | string;
  NGAY_TH_YL?: number | string;
  NGAY_KQ?: number | string;
  MA_MAY?: string;
  MA_BA?: string;
  HO_TEN?: string;
  SOPHIEU?: string;
}

export interface DossierGroup {
  maLk: string;
  xml1?: Xml1Record;
  xml2: Xml2Record[];
  xml3: Xml3Record[];
  
  // Quick display summary
  hoTen: string;
  maBn: string;
  maHsba: string;
  maBa: string;
  soCccd: string;
  maThe: string;
  maBenhChinh: string;
  tenBenhChinh: string;
  ngayVao?: string;
  ngayRa?: string;
  ngayVaoRaw?: string;
  ngayRaRaw?: string;
  tongChiBv: number;
  tongBhtt: number;
  tongBntt: number;
  maKhoa: string;
  maLoaiKcb: string;
  
  // Precomputed index for lightning-fast search
  searchCorpus?: string;
  
  dates: {
    ngayVao?: string;
    ngayRa?: string;
    ngayTtoan?: string;
    allNgayYl: string[];
    allNgayThYl: string[];
    allNgayKq: string[];
  };
}

export type DateCriteriaType = 
  | 'ALL_DATES'
  | 'NGAY_VAO'
  | 'NGAY_RA'
  | 'NGAY_YL'
  | 'NGAY_TH_YL'
  | 'NGAY_KQ'
  | 'NGAY_TTOAN';

export interface CustomColumnRule {
  id: string;
  table: 'XML1' | 'XML2' | 'XML3';
  column: string;
  operator: 'CONTAINS' | 'EQUALS' | 'STARTS_WITH' | 'GREATER_THAN' | 'LESS_THAN' | 'NOT_EMPTY';
  value: string;
}

export interface QuickSearchColumnOption {
  key: string;
  label: string;
  table: 'ALL' | 'XML1' | 'XML2' | 'XML3';
  field: string;
}

export const QUICK_SEARCH_COLUMNS: QuickSearchColumnOption[] = [
  { key: 'ALL', label: '🔍 Tất cả các cột (Toàn văn)', table: 'ALL', field: 'ALL' },
  // XML1
  { key: 'MA_LK', label: '[XML1] Mã liên kết (MA_LK)', table: 'XML1', field: 'MA_LK' },
  { key: 'MA_BN', label: '[XML1] Mã bệnh nhân (MA_BN)', table: 'XML1', field: 'MA_BN' },
  { key: 'HO_TEN', label: '[XML1] Họ và tên (HO_TEN)', table: 'XML1', field: 'HO_TEN' },
  { key: 'SO_CCCD', label: '[XML1] Số CCCD / Định danh (SO_CCCD)', table: 'XML1', field: 'SO_CCCD' },
  { key: 'MA_THE_BHYT', label: '[XML1] Mã thẻ BHYT (MA_THE_BHYT)', table: 'XML1', field: 'MA_THE_BHYT' },
  { key: 'MA_BENH_CHINH', label: '[XML1] Mã bệnh chính ICD-10 (MA_BENH_CHINH)', table: 'XML1', field: 'MA_BENH_CHINH' },
  { key: 'MA_BENH_KT', label: '[XML1] Mã bệnh kèm theo (MA_BENH_KT)', table: 'XML1', field: 'MA_BENH_KT' },
  { key: 'CHAN_DOAN_RV', label: '[XML1] Chẩn đoán ra viện (CHAN_DOAN_RV)', table: 'XML1', field: 'CHAN_DOAN_RV' },
  { key: 'MA_KHOA', label: '[XML1] Khoa điều trị (MA_KHOA)', table: 'XML1', field: 'MA_KHOA' },
  { key: 'MA_DKBD', label: '[XML1] Mã ĐKBD ban đầu (MA_DKBD)', table: 'XML1', field: 'MA_DKBD' },
  { key: 'MA_CSKCB', label: '[XML1] Cơ sở KCB (MA_CSKCB)', table: 'XML1', field: 'MA_CSKCB' },
  { key: 'MA_HSBA', label: '[XML1] Mã hồ sơ bệnh án (MA_HSBA)', table: 'XML1', field: 'MA_HSBA' },
  { key: 'DIA_CHI', label: '[XML1] Địa chỉ cư trú (DIA_CHI)', table: 'XML1', field: 'DIA_CHI' },
  // XML2
  { key: 'TEN_THUOC', label: '[XML2] Tên thuốc (TEN_THUOC)', table: 'XML2', field: 'TEN_THUOC' },
  { key: 'MA_THUOC', label: '[XML2] Mã thuốc (MA_THUOC)', table: 'XML2', field: 'MA_THUOC' },
  { key: 'HAM_LUONG', label: '[XML2] Hàm lượng thuốc (HAM_LUONG)', table: 'XML2', field: 'HAM_LUONG' },
  { key: 'DUONG_DUNG', label: '[XML2] Đường dùng thuốc (DUONG_DUNG)', table: 'XML2', field: 'DUONG_DUNG' },
  { key: 'SO_DANG_KY', label: '[XML2] Số đăng ký thuốc (SO_DANG_KY)', table: 'XML2', field: 'SO_DANG_KY' },
  { key: 'TT_THAU_XML2', label: '[XML2] Thông tin thầu thuốc (TT_THAU)', table: 'XML2', field: 'TT_THAU' },
  { key: 'MA_BAC_SI_XML2', label: '[XML2] Bác sĩ kê đơn (MA_BAC_SI)', table: 'XML2', field: 'MA_BAC_SI' },
  // XML3
  { key: 'TEN_DICH_VU', label: '[XML3] Tên dịch vụ kỹ thuật (TEN_DICH_VU)', table: 'XML3', field: 'TEN_DICH_VU' },
  { key: 'MA_DICH_VU', label: '[XML3] Mã dịch vụ kỹ thuật (MA_DICH_VU)', table: 'XML3', field: 'MA_DICH_VU' },
  { key: 'MA_MAY', label: '[XML3] Mã máy thực hiện (MA_MAY)', table: 'XML3', field: 'MA_MAY' },
  { key: 'NGUOI_THUC_HIEN', label: '[XML3] Người thực hiện (NGUOI_THUC_HIEN)', table: 'XML3', field: 'NGUOI_THUC_HIEN' },
  { key: 'TEN_VAT_TU', label: '[XML3] Tên vật tư y tế (TEN_VAT_TU)', table: 'XML3', field: 'TEN_VAT_TU' },
  { key: 'MA_VAT_TU', label: '[XML3] Mã vật tư y tế (MA_VAT_TU)', table: 'XML3', field: 'MA_VAT_TU' },
  { key: 'MA_GIUONG', label: '[XML3] Mã giường (MA_GIUONG)', table: 'XML3', field: 'MA_GIUONG' },
  { key: 'TT_THAU_XML3', label: '[XML3] Thông tin thầu DVKT (TT_THAU)', table: 'XML3', field: 'TT_THAU' },
  { key: 'SOPHIEU', label: '[XML2/3] Số phiếu (SOPHIEU)', table: 'XML3', field: 'SOPHIEU' }
];

export interface FilterState {
  searchQuery: string;
  searchColumn?: string;
  exactMatch?: boolean;
  dateCriteria: DateCriteriaType;
  fromDate: string; // YYYY-MM-DD
  toDate: string;   // YYYY-MM-DD
  maKhoa: string;
  maLoaiKcb: string;
  hasDrugsOnly: boolean;
  hasServicesOnly: boolean;
  pickedIcds?: string[];
  pickedDrugs?: string[];
  pickedServices?: string[];
  pickedGroups?: string[];
  pickedPatients?: string[];
  pickedDepartments?: string[];
  pickedCards?: string[];
  pickedDoctors?: string[];
  pickedMachines?: string[];
  matchMode?: 'AND' | 'OR';
  
  // Specific column criteria
  ketQuaDtri?: string;
  maLoaiRv?: string;
  gioiTinh?: string;
  dauMaThe?: string;
  maMay?: string;
  duongDung?: string;
  minCost?: number | '';
  maxCost?: number | '';
  customRules?: CustomColumnRule[];
}

export interface ImportedFileSummary {
  id: string;
  fileName: string;
  fileSize: number;
  tableType: XmlTableType;
  recordCount: number;
  loadedAt: Date | string;
}

export interface SearchMatchHighlight {
  dossier: DossierGroup;
  matchedFields: string[];
  sampleMatchedItems?: {
    drugs?: string[];
    services?: string[];
    icd?: string[];
  };
}

export interface SummaryStats {
  totalDossiers: number;
  totalXml1: number;
  totalXml2: number;
  totalXml3: number;
  totalCostBV: number;
  totalCostBH: number;
  totalCostBN: number;
  inpatientCount: number;
  outpatientCount: number;
  departmentCounts: Record<string, number>;
  topDiseases: { code: string; name: string; count: number }[];
  topDrugs: { name: string; code?: string; count: number; cost: number }[];
  topServices: { name: string; code?: string; count: number; cost: number }[];
}
