import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { 
  DossierGroup, 
  XML1_COLUMNS, 
  XML2_COLUMNS, 
  XML3_COLUMNS, 
  Xml1Record, 
  Xml2Record, 
  Xml3Record 
} from '../types/xml';
import { isDateInRange, parseXmlDate } from './dateUtils';

export interface ExportOptions {
  tableChoice: 'XML1' | 'XML2' | 'XML3' | 'ALL_THREE';
  onlyItemsInDateRange?: boolean;
  fromDate?: string;
  toDate?: string;
  dateField?: string;
}

/**
 * Format a row array from an object given the target column sequence
 */
function createRowFromHeaders(record: Record<string, any>, headers: readonly string[]): any[] {
  return headers.map(header => {
    const val = record[header];
    return val !== undefined && val !== null ? val : '';
  });
}

/**
 * Auto-calculate column widths for sheet
 */
function getColumnWidths(rows: any[][], headers: readonly string[]) {
  return headers.map((h, colIndex) => {
    let maxLen = h.length;
    for (let r = 0; r < Math.min(rows.length, 50); r++) {
      const cellVal = rows[r]?.[colIndex];
      if (cellVal !== undefined && cellVal !== null) {
        const strLen = String(cellVal).length;
        if (strLen > maxLen) maxLen = Math.min(strLen, 40);
      }
    }
    return { wch: Math.max(maxLen + 3, 10) };
  });
}

/**
 * Export filtered dossiers to standard Excel file(s)
 */
export function exportDossiersToExcel(
  dossiers: DossierGroup[],
  options: ExportOptions
): { totalExported: number; fileName: string } {
  const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);

  // 1. Prepare XML1 records
  const xml1Rows: any[][] = [Array.from(XML1_COLUMNS)];
  for (const d of dossiers) {
    if (d.xml1) {
      xml1Rows.push(createRowFromHeaders(d.xml1, XML1_COLUMNS));
    } else {
      // Build mock XML1 if only XML2/3 was loaded
      const mockX1: Record<string, any> = {
        MA_LK: d.maLk,
        HO_TEN: d.hoTen,
        MA_BN: d.maBn,
        MA_BA: d.maBa,
        SO_CCCD: d.soCccd,
        MA_THE_BHYT: d.maThe,
        MA_BENH_CHINH: d.maBenhChinh,
        CHAN_DOAN_RV: d.tenBenhChinh,
        NGAY_VAO: d.ngayVaoRaw || '',
        NGAY_RA: d.ngayRaRaw || '',
        T_TONGCHI_BV: d.tongChiBv,
        T_BHTT: d.tongBhtt,
        T_BNTT: d.tongBntt,
        MA_KHOA: d.maKhoa,
        MA_LOAI_KCB: d.maLoaiKcb
      };
      xml1Rows.push(createRowFromHeaders(mockX1, XML1_COLUMNS));
    }
  }

  // 2. Prepare XML2 records
  const xml2Rows: any[][] = [Array.from(XML2_COLUMNS)];
  for (const d of dossiers) {
    for (const dr of d.xml2) {
      if (options.onlyItemsInDateRange && options.fromDate && options.toDate) {
        const parsedYl = parseXmlDate(dr.NGAY_YL).ymd;
        const parsedThYl = parseXmlDate(dr.NGAY_TH_YL).ymd;
        const inRange = isDateInRange(parsedYl, options.fromDate, options.toDate) ||
                        isDateInRange(parsedThYl, options.fromDate, options.toDate);
        if (!inRange) continue;
      }
      xml2Rows.push(createRowFromHeaders(dr, XML2_COLUMNS));
    }
  }

  // 3. Prepare XML3 records
  const xml3Rows: any[][] = [Array.from(XML3_COLUMNS)];
  for (const d of dossiers) {
    for (const sv of d.xml3) {
      if (options.onlyItemsInDateRange && options.fromDate && options.toDate) {
        const parsedYl = parseXmlDate(sv.NGAY_YL).ymd;
        const parsedThYl = parseXmlDate(sv.NGAY_TH_YL).ymd;
        const parsedKq = parseXmlDate(sv.NGAY_KQ).ymd;
        const inRange = isDateInRange(parsedYl, options.fromDate, options.toDate) ||
                        isDateInRange(parsedThYl, options.fromDate, options.toDate) ||
                        isDateInRange(parsedKq, options.fromDate, options.toDate);
        if (!inRange) continue;
      }
      xml3Rows.push(createRowFromHeaders(sv, XML3_COLUMNS));
    }
  }

  const wb = XLSX.utils.book_new();

  let finalFileName = '';
  let totalExported = 0;

  if (options.tableChoice === 'XML1') {
    const ws1 = XLSX.utils.aoa_to_sheet(xml1Rows);
    ws1['!cols'] = getColumnWidths(xml1Rows.slice(1), XML1_COLUMNS);
    XLSX.utils.book_append_sheet(wb, ws1, 'XML1');
    finalFileName = `XML1_Filtered_3176_${timestamp}.xlsx`;
    totalExported = xml1Rows.length - 1;
  } else if (options.tableChoice === 'XML2') {
    const ws2 = XLSX.utils.aoa_to_sheet(xml2Rows);
    ws2['!cols'] = getColumnWidths(xml2Rows.slice(1), XML2_COLUMNS);
    XLSX.utils.book_append_sheet(wb, ws2, 'XML2');
    finalFileName = `XML2_Thuoc_Filtered_3176_${timestamp}.xlsx`;
    totalExported = xml2Rows.length - 1;
  } else if (options.tableChoice === 'XML3') {
    const ws3 = XLSX.utils.aoa_to_sheet(xml3Rows);
    ws3['!cols'] = getColumnWidths(xml3Rows.slice(1), XML3_COLUMNS);
    XLSX.utils.book_append_sheet(wb, ws3, 'XML3');
    finalFileName = `XML3_DVKT_Filtered_3176_${timestamp}.xlsx`;
    totalExported = xml3Rows.length - 1;
  } else {
    // ALL THREE SHEETS
    const ws1 = XLSX.utils.aoa_to_sheet(xml1Rows);
    ws1['!cols'] = getColumnWidths(xml1Rows.slice(1), XML1_COLUMNS);
    XLSX.utils.book_append_sheet(wb, ws1, 'XML1');

    const ws2 = XLSX.utils.aoa_to_sheet(xml2Rows);
    ws2['!cols'] = getColumnWidths(xml2Rows.slice(1), XML2_COLUMNS);
    XLSX.utils.book_append_sheet(wb, ws2, 'XML2');

    const ws3 = XLSX.utils.aoa_to_sheet(xml3Rows);
    ws3['!cols'] = getColumnWidths(xml3Rows.slice(1), XML3_COLUMNS);
    XLSX.utils.book_append_sheet(wb, ws3, 'XML3');

    finalFileName = `XML_TronBo_123_Filtered_3176_${timestamp}.xlsx`;
    totalExported = (xml1Rows.length - 1) + (xml2Rows.length - 1) + (xml3Rows.length - 1);
  }

  // Write file out
  const wbOut = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbOut], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, finalFileName);

  return { totalExported, fileName: finalFileName };
}
