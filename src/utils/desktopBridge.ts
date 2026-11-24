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

export interface DesktopExportConfig {
  askEveryTime: boolean;
  defaultDir: string;
  autoOpenFolder: boolean;
}

export async function getDesktopExportConfig(): Promise<DesktopExportConfig> {
  try {
    const res = await fetch(`${BASE_URL}/api/settings/export-config`);
    return await res.json();
  } catch (err) {
    return { askEveryTime: true, defaultDir: '', autoOpenFolder: false };
  }
}

export async function saveDesktopExportConfig(config: DesktopExportConfig): Promise<any> {
  const res = await fetch(`${BASE_URL}/api/settings/export-config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config)
  });
  return res.json();
}

export async function chooseDesktopExportDir(): Promise<{ success: boolean; chosenDir: string }> {
  const res = await fetch(`${BASE_URL}/api/settings/choose-export-dir`, { method: 'POST' });
  return res.json();
}

export async function showDesktopSaveAsDialog(defaultFileName: string, initialDir?: string): Promise<{ cancelled: boolean; filePath: string }> {
  const res = await fetch(`${BASE_URL}/api/settings/save-as-dialog`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ defaultFileName, initialDir })
  });
  return res.json();
}

export async function saveDesktopExcelFile(filePath: string, fileBase64: string): Promise<{ success: boolean; filePath: string; fileName: string; fileSize?: number }> {
  const res = await fetch(`${BASE_URL}/api/export/save-excel-file`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filePath, fileBase64 })
  });
  return res.json();
}

export async function openDesktopFileLocation(path: string): Promise<{ success: boolean }> {
  const res = await fetch(`${BASE_URL}/api/system/open-file-location`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path })
  });
  return res.json();
}
