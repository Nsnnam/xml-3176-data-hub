/**
 * Date utility functions for Vietnam BHYT QĐ 3176 XML data
 */

export interface ParsedDateResult {
  raw: string;
  ymd: string;          // YYYY-MM-DD
  displayDateTime: string; // DD/MM/YYYY HH:mm
  displayDate: string;     // DD/MM/YYYY
  timestamp: number | null;
  isValid: boolean;
}

export function parseXmlDate(val: any): ParsedDateResult {
  if (val === undefined || val === null || val === '') {
    return { raw: '', ymd: '', displayDateTime: '', displayDate: '', timestamp: null, isValid: false };
  }

  const rawStr = String(val).trim();
  
  // Pattern 1: 12-digit number (YYYYMMDDHHmm) e.g. 202601110744
  // Pattern 2: 14-digit number (YYYYMMDDHHmmss) e.g. 20260111074400
  // Pattern 3: 8-digit number (YYYYMMDD) e.g. 20260111
  const cleanDigits = rawStr.replace(/\D/g, '');
  
  if (cleanDigits.length >= 8) {
    const year = cleanDigits.substring(0, 4);
    const month = cleanDigits.substring(4, 6);
    const day = cleanDigits.substring(6, 8);
    
    // validate simple bounds
    const y = parseInt(year, 10);
    const m = parseInt(month, 10);
    const d = parseInt(day, 10);
    
    if (y >= 1900 && y <= 2100 && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      let hour = '00';
      let minute = '00';
      if (cleanDigits.length >= 12) {
        hour = cleanDigits.substring(8, 10);
        minute = cleanDigits.substring(10, 12);
      }
      
      const ymd = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      const displayDate = `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
      const displayDateTime = cleanDigits.length >= 12 ? `${displayDate} ${hour}:${minute}` : displayDate;
      const dateObj = new Date(y, m - 1, d, parseInt(hour, 10) || 0, parseInt(minute, 10) || 0);
      
      return {
        raw: rawStr,
        ymd,
        displayDateTime,
        displayDate,
        timestamp: dateObj.getTime(),
        isValid: true
      };
    }
  }

  // Fallback for standard date strings (ISO, etc.)
  const parsed = new Date(rawStr);
  if (!isNaN(parsed.getTime())) {
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');
    const hour = String(parsed.getHours()).padStart(2, '0');
    const minute = String(parsed.getMinutes()).padStart(2, '0');
    const ymd = `${year}-${month}-${day}`;
    return {
      raw: rawStr,
      ymd,
      displayDate: `${day}/${month}/${year}`,
      displayDateTime: `${day}/${month}/${year} ${hour}:${minute}`,
      timestamp: parsed.getTime(),
      isValid: true
    };
  }

  return {
    raw: rawStr,
    ymd: '',
    displayDateTime: rawStr,
    displayDate: rawStr,
    timestamp: null,
    isValid: false
  };
}

/**
 * Format date/datetime value into VN display string (DD/MM/YYYY or DD/MM/YYYY HH:mm)
 */
export function formatDateVN(val: any): string {
  if (val === undefined || val === null || val === '') return '—';
  const res = parseXmlDate(val);
  return res.isValid ? (res.displayDateTime || res.displayDate) : String(val);
}

/**
 * Check if a YYYY-MM-DD string is within [fromDate, toDate]
 */
export function isDateInRange(targetYmd: string | undefined, fromYmd: string, toYmd: string): boolean {
  if (!targetYmd) return false;
  if (fromYmd && targetYmd < fromYmd) return false;
  if (toYmd && targetYmd > toYmd) return false;
  return true;
}

/**
 * Format currency in VND (e.g. 1.250.000 đ)
 */
export function formatVND(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null || amount === '') return '0 đ';
  const num = typeof amount === 'number' ? amount : parseFloat(String(amount));
  if (isNaN(num)) return '0 đ';
  return new Intl.NumberFormat('vi-VN').format(Math.round(num)) + ' đ';
}

/**
 * Quick date preset generator
 */
export function getDatePresets() {
  const now = new Date();
  const format = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const todayStr = format(now);

  // 7 days ago
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);

  // 30 days ago
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);

  // This month
  const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // Last month
  const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  // This year
  const firstDayYear = new Date(now.getFullYear(), 0, 1);
  const lastDayYear = new Date(now.getFullYear(), 11, 31);

  return [
    { label: 'Hôm nay', from: todayStr, to: todayStr },
    { label: '7 ngày qua', from: format(sevenDaysAgo), to: todayStr },
    { label: '30 ngày qua', from: format(thirtyDaysAgo), to: todayStr },
    { label: 'Tháng này', from: format(firstDayThisMonth), to: format(lastDayThisMonth) },
    { label: 'Tháng trước', from: format(firstDayLastMonth), to: format(lastDayLastMonth) },
    { label: 'Cả năm', from: format(firstDayYear), to: format(lastDayYear) },
  ];
}
