// Daily authorization management for NsN XML DataHub
const AUTH_KEY = 'nsn_xml_daily_auth';
const SECRET_PASSCODE = 'namns';

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export interface AuthState {
  isUnlocked: boolean;
  unlockedDate: string | null;
}

export function checkDailyAuth(): boolean {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    const today = getTodayDateString();
    return data.unlocked === true && data.date === today;
  } catch {
    return false;
  }
}

export function unlockDailyAuth(inputPasscode: string): { success: boolean; message: string } {
  const trimmed = (inputPasscode || '').trim().toLowerCase();
  if (trimmed === SECRET_PASSCODE.toLowerCase()) {
    const today = getTodayDateString();
    localStorage.setItem(AUTH_KEY, JSON.stringify({
      unlocked: true,
      date: today,
      timestamp: Date.now()
    }));
    return { success: true, message: 'Mở khóa thành công! Chúc bạn làm việc hiệu quả.' };
  }
  return { success: false, message: 'Mã truy cập không đúng. Vui lòng liên hệ NamNs!' };
}

export function lockDailyAuth(): void {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch (e) {
    console.error('Error locking system', e);
  }
}
