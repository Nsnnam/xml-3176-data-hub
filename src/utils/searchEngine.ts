import type { 
  Xml1Record, 
  Xml2Record, 
  Xml3Record, 
  DossierGroup, 
  FilterState, 
  SummaryStats,
  SearchMatchHighlight,
  CustomColumnRule
} from '../types/xml';
import { parseXmlDate, isDateInRange } from './dateUtils';

/**
 * Remove Vietnamese accents/diacritics for flexible search
 */
export function removeVietnameseAccents(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

/**
 * Build consolidated Dossier groups linking XML1, XML2, XML3 by MA_LK
 */
export function buildDossierGroups(
  xml1List: Xml1Record[],
  xml2List: Xml2Record[],
  xml3List: Xml3Record[]
): DossierGroup[] {
  const map = new Map<string, DossierGroup>();

  // 1. Process XML1 records
  for (const x1 of xml1List) {
    const maLk = String(x1.MA_LK || '').trim();
    if (!maLk) continue;

    const parsedVao = parseXmlDate(x1.NGAY_VAO);
    const parsedRa = parseXmlDate(x1.NGAY_RA);
    const parsedTtoan = parseXmlDate(x1.NGAY_TTOAN);

    const group: DossierGroup = {
      maLk,
      xml1: x1,
      xml2: [],
      xml3: [],
      hoTen: String(x1.HO_TEN || '').trim(),
      maBn: String(x1.MA_BN || '').trim(),
      maHsba: String(x1.MA_HSBA || '').trim(),
      maBa: String(x1.MA_BA || '').trim(),
      soCccd: String(x1.SO_CCCD || '').trim(),
      maThe: String(x1.MA_THE_BHYT || x1.MA_THE || '').trim(),
      maBenhChinh: String(x1.MA_BENH_CHINH || '').trim(),
      tenBenhChinh: String(x1.CHAN_DOAN_RV || x1.CHAN_DOAN_VAO || '').trim(),
      ngayVao: parsedVao.displayDateTime || parsedVao.displayDate,
      ngayRa: parsedRa.displayDateTime || parsedRa.displayDate,
      ngayVaoRaw: parsedVao.raw,
      ngayRaRaw: parsedRa.raw,
      tongChiBv: Number(x1.T_TONGCHI_BV) || 0,
      tongBhtt: Number(x1.T_BHTT) || 0,
      tongBntt: Number(x1.T_BNTT) || 0,
      maKhoa: String(x1.MA_KHOA || '').trim(),
      maLoaiKcb: String(x1.MA_LOAI_KCB || '').trim(),
      searchCorpus: '',
      dates: {
        ngayVao: parsedVao.ymd,
        ngayRa: parsedRa.ymd,
        ngayTtoan: parsedTtoan.ymd,
        allNgayYl: [],
        allNgayThYl: [],
        allNgayKq: []
      }
    };

    map.set(maLk, group);
  }

  // 2. Process XML2 records (Drugs)
  for (const x2 of xml2List) {
    const maLk = String(x2.MA_LK || '').trim();
    if (!maLk) continue;

    let group = map.get(maLk);
    if (!group) {
      group = {
        maLk,
        xml2: [],
        xml3: [],
        hoTen: String(x2.HO_TEN || '').trim(),
        maBn: '',
        maHsba: '',
        maBa: String(x2.MA_BA || '').trim(),
        soCccd: '',
        maThe: String(x2.MA_THE || '').trim(),
        maBenhChinh: '',
        tenBenhChinh: '',
        tongChiBv: 0,
        tongBhtt: 0,
        tongBntt: 0,
        maKhoa: String(x2.MA_KHOA || '').trim(),
        maLoaiKcb: '',
        searchCorpus: '',
        dates: {
          allNgayYl: [],
          allNgayThYl: [],
          allNgayKq: []
        }
      };
      map.set(maLk, group);
    }

    group.xml2.push(x2);

    if (x2.NGAY_YL) {
      const p = parseXmlDate(x2.NGAY_YL);
      if (p.ymd && !group.dates.allNgayYl.includes(p.ymd)) {
        group.dates.allNgayYl.push(p.ymd);
      }
    }
    if (x2.NGAY_TH_YL) {
      const p = parseXmlDate(x2.NGAY_TH_YL);
      if (p.ymd && !group.dates.allNgayThYl.includes(p.ymd)) {
        group.dates.allNgayThYl.push(p.ymd);
      }
    }
  }

  // 3. Process XML3 records (Services)
  for (const x3 of xml3List) {
    const maLk = String(x3.MA_LK || '').trim();
    if (!maLk) continue;

    let group = map.get(maLk);
    if (!group) {
      group = {
        maLk,
        xml2: [],
        xml3: [],
        hoTen: String(x3.HO_TEN || '').trim(),
        maBn: '',
        maHsba: '',
        maBa: String(x3.MA_BA || '').trim(),
        soCccd: '',
        maThe: String(x3.MA_THE || '').trim(),
        maBenhChinh: '',
        tenBenhChinh: '',
        tongChiBv: 0,
        tongBhtt: 0,
        tongBntt: 0,
        maKhoa: String(x3.MA_KHOA || '').trim(),
        maLoaiKcb: '',
        searchCorpus: '',
        dates: {
          allNgayYl: [],
          allNgayThYl: [],
          allNgayKq: []
        }
      };
      map.set(maLk, group);
    }

    group.xml3.push(x3);

    if (x3.NGAY_YL) {
      const p = parseXmlDate(x3.NGAY_YL);
      if (p.ymd && !group.dates.allNgayYl.includes(p.ymd)) {
        group.dates.allNgayYl.push(p.ymd);
      }
    }
    if (x3.NGAY_TH_YL) {
      const p = parseXmlDate(x3.NGAY_TH_YL);
      if (p.ymd && !group.dates.allNgayThYl.includes(p.ymd)) {
        group.dates.allNgayThYl.push(p.ymd);
      }
    }
    if (x3.NGAY_KQ) {
      const p = parseXmlDate(x3.NGAY_KQ);
      if (p.ymd && !group.dates.allNgayKq.includes(p.ymd)) {
        group.dates.allNgayKq.push(p.ymd);
      }
    }
  }

  // 4. Build comprehensive search corpus for lightning-fast lookups
  const result: DossierGroup[] = [];

  for (const g of map.values()) {
    const tokens: string[] = [
      g.maLk,
      g.hoTen,
      g.maBn,
      g.soCccd,
      g.maThe,
      g.maHsba,
      g.maBa,
      g.maBenhChinh,
      g.tenBenhChinh,
      g.maKhoa
    ];

    if (g.xml1) {
      tokens.push(
        String(g.xml1.CHAN_DOAN_VAO || ''),
        String(g.xml1.CHAN_DOAN_RV || ''),
        String(g.xml1.MA_BENH_KT || ''),
        String(g.xml1.DIA_CHI || ''),
        String(g.xml1.MA_CSKCB || ''),
        String(g.xml1.MA_DKBD || ''),
        String(g.xml1.GHI_CHU || '')
      );
    }

    for (const dr of g.xml2) {
      tokens.push(
        String(dr.TEN_THUOC || ''),
        String(dr.MA_THUOC || ''),
        String(dr.HAM_LUONG || ''),
        String(dr.SO_DANG_KY || ''),
        String(dr.TT_THAU || ''),
        String(dr.MA_BAC_SI || ''),
        String(dr.DUONG_DUNG || '')
      );
    }

    for (const sv of g.xml3) {
      tokens.push(
        String(sv.TEN_DICH_VU || ''),
        String(sv.MA_DICH_VU || ''),
        String(sv.TEN_VAT_TU || ''),
        String(sv.MA_VAT_TU || ''),
        String(sv.MA_MAY || ''),
        String(sv.NGUOI_THUC_HIEN || ''),
        String(sv.MA_GIUONG || ''),
        String(sv.TT_THAU || '')
      );
    }

    const rawCombined = tokens.join(' ').toLowerCase();
    const unaccented = removeVietnameseAccents(rawCombined);
    g.searchCorpus = `${rawCombined} ${unaccented}`;

    result.push(g);
  }

  return result;
}

function matchRuleValue(targetVal: any, operator: string, ruleVal: string): boolean {
  if (operator === 'NOT_EMPTY') {
    return targetVal !== undefined && targetVal !== null && String(targetVal).trim() !== '';
  }
  const strTarget = String(targetVal || '').trim().toLowerCase();
  const strRule = String(ruleVal || '').trim().toLowerCase();

  switch (operator) {
    case 'EQUALS':
      return strTarget === strRule;
    case 'CONTAINS':
      return strTarget.includes(strRule) || removeVietnameseAccents(strTarget).includes(removeVietnameseAccents(strRule));
    case 'STARTS_WITH':
      return strTarget.startsWith(strRule);
    case 'GREATER_THAN': {
      const numTarget = Number(targetVal);
      const numRule = Number(ruleVal);
      if (!isNaN(numTarget) && !isNaN(numRule)) return numTarget >= numRule;
      return strTarget >= strRule;
    }
    case 'LESS_THAN': {
      const numTarget = Number(targetVal);
      const numRule = Number(ruleVal);
      if (!isNaN(numTarget) && !isNaN(numRule)) return numTarget <= numRule;
      return strTarget <= strRule;
    }
    default:
      return true;
  }
}

/**
 * Filter dossiers based on omni-search, column search, exact-match, picked items, date ranges, and advanced column rules
 */
export function filterDossiers(
  dossiers: DossierGroup[],
  filters: FilterState
): SearchMatchHighlight[] {
  const { 
    searchQuery, 
    searchColumn = 'ALL',
    exactMatch,
    dateCriteria, 
    fromDate, 
    toDate, 
    maKhoa, 
    maLoaiKcb, 
    hasDrugsOnly, 
    hasServicesOnly,
    pickedIcds = [],
    pickedDrugs = [],
    pickedServices = [],
    pickedGroups = [],
    matchMode = 'OR',
    ketQuaDtri,
    maLoaiRv,
    gioiTinh,
    dauMaThe,
    maMay,
    duongDung,
    minCost,
    maxCost,
    customRules = []
  } = filters;

  const rawQuery = (searchQuery || '').trim();
  const lowerQuery = rawQuery.toLowerCase();
  const unaccentQuery = removeVietnameseAccents(rawQuery);
  const searchTerms = unaccentQuery.split(/\s+/).filter(Boolean);

  const matchedResults: SearchMatchHighlight[] = [];

  for (const d of dossiers) {
    const corpus = d.searchCorpus || '';

    // 1. Search Query Check (Omni or Column-Specific)
    let isSearchMatch = true;
    const matchedFields: string[] = [];
    const sampleHighlights: { drugs?: string[]; services?: string[]; icd?: string[] } = {};

    if (rawQuery) {
      if (searchColumn && searchColumn !== 'ALL') {
        // Match on a specific column
        let colMatched = false;

        const checkValue = (val: any) => {
          if (val === undefined || val === null) return false;
          const s = String(val).trim().toLowerCase();
          if (exactMatch) return s === lowerQuery;
          return s.includes(lowerQuery) || removeVietnameseAccents(s).includes(unaccentQuery);
        };

        if (searchColumn === 'MA_LK') colMatched = checkValue(d.maLk);
        else if (searchColumn === 'MA_BN') colMatched = checkValue(d.maBn);
        else if (searchColumn === 'HO_TEN') colMatched = checkValue(d.hoTen);
        else if (searchColumn === 'SO_CCCD') colMatched = checkValue(d.soCccd);
        else if (searchColumn === 'MA_THE_BHYT') colMatched = checkValue(d.maThe);
        else if (searchColumn === 'MA_BENH_CHINH') colMatched = checkValue(d.maBenhChinh);
        else if (searchColumn === 'MA_BENH_KT') colMatched = checkValue(d.xml1?.MA_BENH_KT);
        else if (searchColumn === 'CHAN_DOAN_RV') colMatched = checkValue(d.xml1?.CHAN_DOAN_RV);
        else if (searchColumn === 'MA_KHOA') colMatched = checkValue(d.maKhoa);
        else if (searchColumn === 'MA_DKBD') colMatched = checkValue(d.xml1?.MA_DKBD);
        else if (searchColumn === 'MA_CSKCB') colMatched = checkValue(d.xml1?.MA_CSKCB);
        else if (searchColumn === 'MA_HSBA') colMatched = checkValue(d.xml1?.MA_HSBA);
        else if (searchColumn === 'DIA_CHI') colMatched = checkValue(d.xml1?.DIA_CHI);
        // Drugs
        else if (searchColumn === 'TEN_THUOC') colMatched = d.xml2.some(dr => checkValue(dr.TEN_THUOC));
        else if (searchColumn === 'MA_THUOC') colMatched = d.xml2.some(dr => checkValue(dr.MA_THUOC));
        else if (searchColumn === 'HAM_LUONG') colMatched = d.xml2.some(dr => checkValue(dr.HAM_LUONG));
        else if (searchColumn === 'DUONG_DUNG') colMatched = d.xml2.some(dr => checkValue(dr.DUONG_DUNG));
        else if (searchColumn === 'SO_DANG_KY') colMatched = d.xml2.some(dr => checkValue(dr.SO_DANG_KY));
        else if (searchColumn === 'TT_THAU_XML2') colMatched = d.xml2.some(dr => checkValue(dr.TT_THAU));
        else if (searchColumn === 'MA_BAC_SI_XML2') colMatched = d.xml2.some(dr => checkValue(dr.MA_BAC_SI));
        // Services
        else if (searchColumn === 'TEN_DICH_VU') colMatched = d.xml3.some(sv => checkValue(sv.TEN_DICH_VU));
        else if (searchColumn === 'MA_DICH_VU') colMatched = d.xml3.some(sv => checkValue(sv.MA_DICH_VU));
        else if (searchColumn === 'MA_MAY') colMatched = d.xml3.some(sv => checkValue(sv.MA_MAY));
        else if (searchColumn === 'NGUOI_THUC_HIEN') colMatched = d.xml3.some(sv => checkValue(sv.NGUOI_THUC_HIEN));
        else if (searchColumn === 'TEN_VAT_TU') colMatched = d.xml3.some(sv => checkValue(sv.TEN_VAT_TU));
        else if (searchColumn === 'MA_VAT_TU') colMatched = d.xml3.some(sv => checkValue(sv.MA_VAT_TU));
        else if (searchColumn === 'MA_GIUONG') colMatched = d.xml3.some(sv => checkValue(sv.MA_GIUONG));
        else if (searchColumn === 'TT_THAU_XML3') colMatched = d.xml3.some(sv => checkValue(sv.TT_THAU));
        else if (searchColumn === 'SOPHIEU') colMatched = d.xml2.some(dr => checkValue(dr.SOPHIEU)) || d.xml3.some(sv => checkValue(sv.SOPHIEU));

        if (!colMatched) continue;
        matchedFields.push(`Cột ${searchColumn}`);
      } else {
        // Omni search across all fields
        if (exactMatch) {
          const isExactLk = d.maLk.toLowerCase() === lowerQuery;
          const isExactBn = d.maBn.toLowerCase() === lowerQuery;
          const isExactTen = d.hoTen.toLowerCase() === lowerQuery;
          const isExactCccd = d.soCccd === rawQuery;
          const isExactThe = d.maThe.toLowerCase() === lowerQuery;
          const isExactIcd = d.maBenhChinh.toLowerCase() === lowerQuery;
          const isExactDrug = d.xml2.some(dr => (dr.TEN_THUOC || '').toLowerCase() === lowerQuery || (dr.MA_THUOC || '').toLowerCase() === lowerQuery);
          const isExactSv = d.xml3.some(sv => (sv.TEN_DICH_VU || '').toLowerCase() === lowerQuery || (sv.MA_DICH_VU || '').toLowerCase() === lowerQuery || (sv.MA_MAY || '').toLowerCase() === lowerQuery);

          if (!isExactLk && !isExactBn && !isExactTen && !isExactCccd && !isExactThe && !isExactIcd && !isExactDrug && !isExactSv) {
            continue;
          }

          if (isExactTen) matchedFields.push('Họ tên (Chính xác)');
          if (isExactLk) matchedFields.push('Mã LK (Chính xác)');
          if (isExactIcd) matchedFields.push('ICD (Chính xác)');
          if (isExactDrug) matchedFields.push('Thuốc (Chính xác)');
          if (isExactSv) matchedFields.push('DVKT (Chính xác)');
        } else {
          for (const term of searchTerms) {
            if (!corpus.includes(term)) {
              isSearchMatch = false;
              break;
            }
          }
          if (!isSearchMatch) continue;

          if (d.hoTen && (d.hoTen.toLowerCase().includes(lowerQuery) || removeVietnameseAccents(d.hoTen).includes(unaccentQuery))) {
            matchedFields.push('Họ tên');
          }
          if (d.maLk.toLowerCase().includes(lowerQuery)) matchedFields.push('Mã LK');
          if (d.maBn && d.maBn.toLowerCase().includes(lowerQuery)) matchedFields.push('Mã BN');
          if (d.soCccd && d.soCccd.includes(lowerQuery)) matchedFields.push('CCCD');
          if (d.maThe && d.maThe.toLowerCase().includes(lowerQuery)) matchedFields.push('Mã thẻ');
          if (d.maBenhChinh && (d.maBenhChinh.toLowerCase().includes(lowerQuery) || (d.xml1?.MA_BENH_KT || '').toLowerCase().includes(lowerQuery))) {
            matchedFields.push('Mã ICD');
            sampleHighlights.icd = [d.maBenhChinh, d.xml1?.MA_BENH_KT || ''].filter(Boolean);
          }

          const matchedDrugs = d.xml2.filter(dr => {
            const drugStr = `${dr.TEN_THUOC || ''} ${dr.MA_THUOC || ''} ${dr.HAM_LUONG || ''}`;
            return drugStr.toLowerCase().includes(lowerQuery) || removeVietnameseAccents(drugStr).includes(unaccentQuery);
          }).map(dr => String(dr.TEN_THUOC || dr.MA_THUOC || ''));
          if (matchedDrugs.length > 0) {
            matchedFields.push(`Thuốc (${matchedDrugs.length})`);
            sampleHighlights.drugs = matchedDrugs.slice(0, 3);
          }

          const matchedServices = d.xml3.filter(sv => {
            const svStr = `${sv.TEN_DICH_VU || ''} ${sv.MA_DICH_VU || ''} ${sv.TEN_VAT_TU || ''} ${sv.MA_MAY || ''}`;
            return svStr.toLowerCase().includes(lowerQuery) || removeVietnameseAccents(svStr).includes(unaccentQuery);
          }).map(sv => String(sv.TEN_DICH_VU || sv.MA_DICH_VU || ''));
          if (matchedServices.length > 0) {
            matchedFields.push(`Dịch vụ (${matchedServices.length})`);
            sampleHighlights.services = matchedServices.slice(0, 3);
          }
        }
      }
    }

    // 2. Picked Items Check ('Nhặt' thông tin đầu vào)
    const hasPicked = pickedIcds.length > 0 || pickedDrugs.length > 0 || pickedServices.length > 0 || pickedGroups.length > 0;
    if (hasPicked) {
      const matchIcd = pickedIcds.length > 0 
        ? pickedIcds.includes(d.maBenhChinh) || (d.xml1?.MA_BENH_KT && pickedIcds.some(c => d.xml1!.MA_BENH_KT!.includes(c)))
        : false;

      const matchDrug = pickedDrugs.length > 0
        ? d.xml2.some(dr => pickedDrugs.includes(String(dr.TEN_THUOC || '')) || pickedDrugs.includes(String(dr.MA_THUOC || '')))
        : false;

      const matchService = pickedServices.length > 0
        ? d.xml3.some(sv => pickedServices.includes(String(sv.TEN_DICH_VU || '')) || pickedServices.includes(String(sv.MA_DICH_VU || '')) || pickedServices.includes(String(sv.TEN_VAT_TU || '')))
        : false;

      const matchGroup = pickedGroups.length > 0
        ? d.xml2.some(dr => pickedGroups.includes(String(dr.MA_NHOM || ''))) || d.xml3.some(sv => pickedGroups.includes(String(sv.MA_NHOM || '')))
        : false;

      if (matchMode === 'AND') {
        if (pickedIcds.length > 0 && !matchIcd) continue;
        if (pickedDrugs.length > 0 && !matchDrug) continue;
        if (pickedServices.length > 0 && !matchService) continue;
        if (pickedGroups.length > 0 && !matchGroup) continue;
      } else {
        if (!matchIcd && !matchDrug && !matchService && !matchGroup) continue;
      }
    }

    // 3. Fast Specific Column Checks
    if (ketQuaDtri && String(d.xml1?.KET_QUA_DTRI || '') !== ketQuaDtri) continue;
    if (maLoaiRv && String(d.xml1?.MA_LOAI_RV || '') !== maLoaiRv) continue;
    if (gioiTinh && String(d.xml1?.GIOI_TINH || '') !== gioiTinh) continue;
    if (dauMaThe && !d.maThe.toUpperCase().startsWith(dauMaThe.toUpperCase())) continue;
    if (maMay && !d.xml3.some(sv => (sv.MA_MAY || '').toLowerCase().includes(maMay.toLowerCase()))) continue;
    if (duongDung && !d.xml2.some(dr => (dr.DUONG_DUNG || '').toLowerCase().includes(duongDung.toLowerCase()))) continue;
    if (minCost !== undefined && minCost !== '' && d.tongChiBv < Number(minCost)) continue;
    if (maxCost !== undefined && maxCost !== '' && d.tongChiBv > Number(maxCost)) continue;

    // 4. Dynamic Custom Column Rules
    if (customRules.length > 0) {
      let allRulesPass = true;
      for (const rule of customRules) {
        if (!rule.column) continue;
        let rulePass = false;

        if (rule.table === 'XML1') {
          const val = d.xml1 ? d.xml1[rule.column] : undefined;
          rulePass = matchRuleValue(val, rule.operator, rule.value);
        } else if (rule.table === 'XML2') {
          rulePass = d.xml2.some(dr => matchRuleValue(dr[rule.column], rule.operator, rule.value));
        } else if (rule.table === 'XML3') {
          rulePass = d.xml3.some(sv => matchRuleValue(sv[rule.column], rule.operator, rule.value));
        }

        if (!rulePass) {
          allRulesPass = false;
          break;
        }
      }
      if (!allRulesPass) continue;
    }

    // 5. Date Range Check
    if (fromDate || toDate) {
      let dateMatch = false;
      switch (dateCriteria) {
        case 'NGAY_VAO':
          dateMatch = isDateInRange(d.dates.ngayVao, fromDate, toDate);
          break;
        case 'NGAY_RA':
          dateMatch = isDateInRange(d.dates.ngayRa, fromDate, toDate);
          break;
        case 'NGAY_TTOAN':
          dateMatch = isDateInRange(d.dates.ngayTtoan, fromDate, toDate);
          break;
        case 'NGAY_YL':
          dateMatch = d.dates.allNgayYl.some(dt => isDateInRange(dt, fromDate, toDate));
          break;
        case 'NGAY_TH_YL':
          dateMatch = d.dates.allNgayThYl.some(dt => isDateInRange(dt, fromDate, toDate));
          break;
        case 'NGAY_KQ':
          dateMatch = d.dates.allNgayKq.some(dt => isDateInRange(dt, fromDate, toDate));
          break;
        case 'ALL_DATES':
        default:
          dateMatch = 
            isDateInRange(d.dates.ngayVao, fromDate, toDate) ||
            isDateInRange(d.dates.ngayRa, fromDate, toDate) ||
            isDateInRange(d.dates.ngayTtoan, fromDate, toDate) ||
            d.dates.allNgayYl.some(dt => isDateInRange(dt, fromDate, toDate)) ||
            d.dates.allNgayThYl.some(dt => isDateInRange(dt, fromDate, toDate)) ||
            d.dates.allNgayKq.some(dt => isDateInRange(dt, fromDate, toDate));
          break;
      }
      if (!dateMatch) continue;
    }

    // 6. Department
    if (maKhoa && d.maKhoa !== maKhoa) continue;

    // 7. Treatment Type
    if (maLoaiKcb && d.maLoaiKcb !== maLoaiKcb) continue;

    // 8. Has drugs / services
    if (hasDrugsOnly && d.xml2.length === 0) continue;
    if (hasServicesOnly && d.xml3.length === 0) continue;

    matchedResults.push({
      dossier: d,
      matchedFields,
      sampleMatchedItems: sampleHighlights
    });
  }

  return matchedResults;
}

/**
 * Compute overall statistics and analytics for imported data
 */
export function computeSummaryStats(dossiers: DossierGroup[]): SummaryStats {
  let totalCostBV = 0;
  let totalCostBH = 0;
  let totalCostBN = 0;
  let totalXml2 = 0;
  let totalXml3 = 0;
  let inpatientCount = 0;
  let outpatientCount = 0;

  const departmentCounts: Record<string, number> = {};
  const diseaseMap = new Map<string, { name: string; count: number }>();
  const drugMap = new Map<string, { count: number; cost: number }>();
  const serviceMap = new Map<string, { count: number; cost: number }>();

  for (const d of dossiers) {
    totalCostBV += d.tongChiBv;
    totalCostBH += d.tongBhtt;
    totalCostBN += d.tongBntt;
    totalXml2 += d.xml2.length;
    totalXml3 += d.xml3.length;

    if (d.maLoaiKcb === '3') {
      inpatientCount++;
    } else {
      outpatientCount++;
    }

    if (d.maKhoa) {
      departmentCounts[d.maKhoa] = (departmentCounts[d.maKhoa] || 0) + 1;
    }

    if (d.maBenhChinh) {
      const existing = diseaseMap.get(d.maBenhChinh) || { name: d.tenBenhChinh || d.maBenhChinh, count: 0 };
      existing.count++;
      diseaseMap.set(d.maBenhChinh, existing);
    }

    for (const dr of d.xml2) {
      const name = String(dr.TEN_THUOC || dr.MA_THUOC || 'Thuốc khác');
      const cost = Number(dr.THANH_TIEN_BV) || 0;
      const existing = drugMap.get(name) || { count: 0, cost: 0 };
      existing.count += Number(dr.SO_LUONG) || 1;
      existing.cost += cost;
      drugMap.set(name, existing);
    }

    for (const sv of d.xml3) {
      const name = String(sv.TEN_DICH_VU || sv.TEN_VAT_TU || sv.MA_DICH_VU || 'DVKT khác');
      const cost = Number(sv.THANH_TIEN_BV) || 0;
      const existing = serviceMap.get(name) || { count: 0, cost: 0 };
      existing.count += Number(sv.SO_LUONG) || 1;
      existing.cost += cost;
      serviceMap.set(name, existing);
    }
  }

  const topDiseases = Array.from(diseaseMap.entries())
    .map(([code, val]) => ({ code, name: val.name, count: val.count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const topDrugs = Array.from(drugMap.entries())
    .map(([name, val]) => ({ name, count: val.count, cost: val.cost }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const topServices = Array.from(serviceMap.entries())
    .map(([name, val]) => ({ name, count: val.count, cost: val.cost }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalDossiers: dossiers.length,
    totalXml1: dossiers.filter(d => Boolean(d.xml1)).length,
    totalXml2,
    totalXml3,
    totalCostBV,
    totalCostBH,
    totalCostBN,
    inpatientCount,
    outpatientCount,
    departmentCounts,
    topDiseases,
    topDrugs,
    topServices
  };
}
