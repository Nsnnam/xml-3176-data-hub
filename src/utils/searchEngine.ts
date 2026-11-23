import type { 
  Xml1Record, 
  Xml2Record, 
  Xml3Record, 
  DossierGroup, 
  FilterState, 
  SummaryStats,
  SearchMatchHighlight 
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
        maBenhChinh: String(x3.MA_BENH || '').trim(),
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

  // 4. Precompute searchCorpus for each dossier
  const result: DossierGroup[] = [];
  for (const g of map.values()) {
    const tokens: string[] = [
      g.maLk,
      g.hoTen,
      g.maBn,
      g.maHsba,
      g.maBa,
      g.soCccd,
      g.maThe,
      g.maBenhChinh,
      g.tenBenhChinh,
      g.maKhoa,
      g.xml1?.CHAN_DOAN_VAO || '',
      g.xml1?.CHAN_DOAN_RV || '',
      g.xml1?.MA_BENH_KT || '',
      g.xml1?.DIA_CHI || '',
      g.xml1?.MA_DKBD || '',
      g.xml1?.GHI_CHU || '',
      g.xml1?.PP_DIEU_TRI || ''
    ];

    for (const d of g.xml2) {
      if (d.TEN_THUOC) tokens.push(String(d.TEN_THUOC));
      if (d.MA_THUOC) tokens.push(String(d.MA_THUOC));
      if (d.HAM_LUONG) tokens.push(String(d.HAM_LUONG));
      if (d.SO_DANG_KY) tokens.push(String(d.SO_DANG_KY));
      if (d.TT_THAU) tokens.push(String(d.TT_THAU));
      if (d.MA_BAC_SI) tokens.push(String(d.MA_BAC_SI));
      if (d.SOPHIEU) tokens.push(String(d.SOPHIEU));
    }

    for (const s of g.xml3) {
      if (s.TEN_DICH_VU) tokens.push(String(s.TEN_DICH_VU));
      if (s.MA_DICH_VU) tokens.push(String(s.MA_DICH_VU));
      if (s.TEN_VAT_TU) tokens.push(String(s.TEN_VAT_TU));
      if (s.MA_VAT_TU) tokens.push(String(s.MA_VAT_TU));
      if (s.MA_MAY) tokens.push(String(s.MA_MAY));
      if (s.MA_BENH) tokens.push(String(s.MA_BENH));
      if (s.NGUOI_THUC_HIEN) tokens.push(String(s.NGUOI_THUC_HIEN));
      if (s.SOPHIEU) tokens.push(String(s.SOPHIEU));
    }

    const rawCombined = tokens.join(' ').toLowerCase();
    const unaccented = removeVietnameseAccents(rawCombined);
    g.searchCorpus = `${rawCombined} ${unaccented}`;

    result.push(g);
  }

  return result;
}

/**
 * Filter dossiers based on omni-search, exact-match, picked items, date ranges, and category criteria
 */
export function filterDossiers(
  dossiers: DossierGroup[],
  filters: FilterState
): SearchMatchHighlight[] {
  const { 
    searchQuery, 
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
    matchMode = 'OR'
  } = filters;

  const rawQuery = (searchQuery || '').trim();
  const lowerQuery = rawQuery.toLowerCase();
  const unaccentQuery = removeVietnameseAccents(rawQuery);
  const searchTerms = unaccentQuery.split(/\s+/).filter(Boolean);

  const matchedResults: SearchMatchHighlight[] = [];

  for (const d of dossiers) {
    const corpus = d.searchCorpus || '';

    // 1. Search Query Check
    let isSearchMatch = true;
    const matchedFields: string[] = [];
    const sampleHighlights: { drugs?: string[]; services?: string[]; icd?: string[] } = {};

    if (rawQuery) {
      if (exactMatch) {
        // Exact matching
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
        // Substring & multi-token matching
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
        // OR mode
        if (!matchIcd && !matchDrug && !matchService && !matchGroup) continue;
      }
    }

    // 3. Date Range Check
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

    // 4. Department
    if (maKhoa && d.maKhoa !== maKhoa) continue;

    // 5. Treatment Type
    if (maLoaiKcb && d.maLoaiKcb !== maLoaiKcb) continue;

    // 6. Has drugs / services
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
