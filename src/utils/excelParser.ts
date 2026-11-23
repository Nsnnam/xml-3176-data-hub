import * as XLSX from 'xlsx';
import { XmlTableType, RawRecord, XML1_COLUMNS, XML2_COLUMNS, XML3_COLUMNS } from '../types/xml';

export interface ParseResult {
  tableType: XmlTableType;
  records: RawRecord[];
  fileName: string;
  fileSize: number;
  rowCount: number;
  detectedHeaders: string[];
}

/**
 * Detect table type based on column headers and file name
 */
export function detectTableType(headers: string[], fileName: string): XmlTableType {
  const normHeaders = new Set(headers.map(h => (h || '').trim().toUpperCase()));
  const upperName = fileName.toUpperCase();

  // Score each type based on characteristic columns
  let xml1Score = 0;
  let xml2Score = 0;
  let xml3Score = 0;

  // XML1 unique/typical columns
  if (normHeaders.has('MA_BENH_CHINH')) xml1Score += 4;
  if (normHeaders.has('NGAY_VAO')) xml1Score += 2;
  if (normHeaders.has('NGAY_RA')) xml1Score += 2;
  if (normHeaders.has('SO_CCCD')) xml1Score += 3;
  if (normHeaders.has('T_TONGCHI_BV')) xml1Score += 3;
  if (normHeaders.has('CHAN_DOAN_RV')) xml1Score += 3;

  // XML2 unique/typical columns
  if (normHeaders.has('MA_THUOC')) xml2Score += 5;
  if (normHeaders.has('TEN_THUOC')) xml2Score += 5;
  if (normHeaders.has('HAM_LUONG')) xml2Score += 4;
  if (normHeaders.has('DUONG_DUNG')) xml2Score += 3;
  if (normHeaders.has('DANG_BAO_CHE')) xml2Score += 3;
  if (normHeaders.has('SO_DANG_KY')) xml2Score += 2;

  // XML3 unique/typical columns
  if (normHeaders.has('MA_DICH_VU') && !normHeaders.has('MA_THUOC')) xml3Score += 4;
  if (normHeaders.has('TEN_DICH_VU')) xml3Score += 5;
  if (normHeaders.has('MA_VAT_TU')) xml3Score += 3;
  if (normHeaders.has('NGAY_KQ')) xml3Score += 4;
  if (normHeaders.has('MA_MAY')) xml3Score += 3;
  if (normHeaders.has('VI_TRI_TH_DVKT')) xml3Score += 3;

  // If header scores are clear, use header score
  if (xml1Score > xml2Score && xml1Score > xml3Score && xml1Score >= 3) return 'XML1';
  if (xml2Score > xml1Score && xml2Score > xml3Score && xml2Score >= 3) return 'XML2';
  if (xml3Score > xml1Score && xml3Score > xml2Score && xml3Score >= 3) return 'XML3';

  // Fallback to filename hints
  if (/XML\s*1|B[ẢA]NG\s*1/i.test(upperName)) return 'XML1';
  if (/XML\s*2|B[ẢA]NG\s*2/i.test(upperName)) return 'XML2';
  if (/XML\s*3|B[ẢA]NG\s*3/i.test(upperName)) return 'XML3';

  // Default fallback based on column counts or first match
  if (normHeaders.has('TEN_THUOC')) return 'XML2';
  if (normHeaders.has('TEN_DICH_VU')) return 'XML3';
  return 'XML1';
}

/**
 * Parse an Excel file (.xlsx / .xls) into normalized records
 */
export async function parseExcelFile(file: File): Promise<ParseResult> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: false });

  if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
    throw new Error(`File ${file.name} không chứa sheet dữ liệu nào.`);
  }

  // Pick the best sheet (first sheet or sheet containing XML)
  let sheetName = workbook.SheetNames[0];
  for (const s of workbook.SheetNames) {
    if (/xml[123]|b[aả]ng\s*[123]/i.test(s)) {
      sheetName = s;
      break;
    }
  }

  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) {
    throw new Error(`Không đọc được nội dung sheet trong file ${file.name}`);
  }

  // Convert to array of arrays to inspect header row
  const rawData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
  if (rawData.length === 0) {
    throw new Error(`File ${file.name} trống.`);
  }

  // Find header row (usually row 0, but check first 5 rows for MA_LK)
  let headerRowIndex = 0;
  for (let i = 0; i < Math.min(rawData.length, 5); i++) {
    const row = rawData[i];
    if (row && Array.isArray(row)) {
      const rowUpper = row.map(c => String(c || '').trim().toUpperCase());
      if (rowUpper.includes('MA_LK')) {
        headerRowIndex = i;
        break;
      }
    }
  }

  const rawHeaders = (rawData[headerRowIndex] || []).map(h => String(h || '').trim());
  const detectedHeaders = rawHeaders.map(h => h.toUpperCase());
  const tableType = detectTableType(detectedHeaders, file.name);

  // Parse remaining rows into objects
  const records: RawRecord[] = [];
  for (let r = headerRowIndex + 1; r < rawData.length; r++) {
    const row = rawData[r];
    if (!row || row.length === 0) continue;

    const record: RawRecord = {};
    let hasData = false;

    for (let c = 0; c < rawHeaders.length; c++) {
      const header = detectedHeaders[c] || `COL_${c}`;
      const val = row[c];
      if (val !== undefined && val !== null && String(val).trim() !== '') {
        hasData = true;
        // Clean MA_LK to string always
        if (header === 'MA_LK' || header === 'MA_BN' || header === 'SO_CCCD' || header === 'MA_THE_BHYT') {
          record[header] = String(val).trim();
        } else {
          record[header] = val;
        }
      } else {
        record[header] = '';
      }
    }

    // Only include rows that have at least some data and a MA_LK or patient info
    if (hasData && (record.MA_LK || record.HO_TEN || record.STT)) {
      if (!record.MA_LK) record.MA_LK = `UNKNOWN_${r}`;
      records.push(record);
    }
  }

  return {
    tableType,
    records,
    fileName: file.name,
    fileSize: file.size,
    rowCount: records.length,
    detectedHeaders
  };
}
