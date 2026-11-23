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

export type XmlTableType = 'XML1' | 'XML2' | 'XML3';

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
  searchCorpus: string;
  
  // Date ranges in YYYY-MM-DD format for fast interval checks
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

export interface FilterState {
  searchQuery: string;
  dateCriteria: DateCriteriaType;
  fromDate: string; // YYYY-MM-DD
  toDate: string;   // YYYY-MM-DD
  maKhoa: string;
  maLoaiKcb: string;
  hasDrugsOnly: boolean;
  hasServicesOnly: boolean;
}

export interface ImportedFileSummary {
  id: string;
  fileName: string;
  fileSize: number;
  tableType: XmlTableType;
  recordCount: number;
  loadedAt: Date;
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
  topDrugs: { name: string; count: number; cost: number }[];
  topServices: { name: string; count: number; cost: number }[];
}
