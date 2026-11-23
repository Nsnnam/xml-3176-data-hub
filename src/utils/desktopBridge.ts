/**
 * Bridge client between React Frontend and Python SQLite Desktop Engine
 */

export const isDesktopMode = () => {
  return window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
};

const BASE_URL = isDesktopMode() ? '' : '';

export async function openNativeFileDialog(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/api/files/open-dialog`, { method: 'POST' });
  const data = await res.json();
  return data.filePaths || [];
}

export async function startDesktopImport(filePaths: string[]): Promise<any> {
  const res = await fetch(`${BASE_URL}/api/files/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filePaths })
  });
  return res.json();
}

export async function getDesktopImportProgress(): Promise<any> {
  const res = await fetch(`${BASE_URL}/api/files/progress`);
  return res.json();
}

export async function getDesktopFilesList(): Promise<any[]> {
  const res = await fetch(`${BASE_URL}/api/files/list`);
  return res.json();
}

export async function deleteDesktopFile(fileId: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/api/files/${encodeURIComponent(fileId)}`, { method: 'DELETE' });
  return res.json();
}

export async function clearDesktopData(): Promise<any> {
  const res = await fetch(`${BASE_URL}/api/files/clear`, { method: 'POST' });
  return res.json();
}

export async function getDesktopStats(): Promise<any> {
  const res = await fetch(`${BASE_URL}/api/stats`);
  return res.json();
}

export async function getDesktopDistinctValues(): Promise<any> {
  const res = await fetch(`${BASE_URL}/api/distinct-values`);
  return res.json();
}

export async function queryDesktopDossiers(filters: any, page: number = 1, pageSize: number = 25): Promise<any> {
  const res = await fetch(`${BASE_URL}/api/query/dossiers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...filters, page, pageSize })
  });
  return res.json();
}

export async function getDesktopDossierDetail(maLk: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/api/dossier/${encodeURIComponent(maLk)}`);
  return res.json();
}

export async function exportDesktopStatistic(statType: string, keyValue: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/api/export/statistic`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ statType, keyValue })
  });
  return res.json();
}
