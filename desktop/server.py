import os
import sys
import time
import json
import base64
import subprocess
import threading
import tkinter as tk
from tkinter import filedialog
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException, Body
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
import uvicorn
from db import XmlDatabase

# Determine base directory
if getattr(sys, 'frozen', False):
    BASE_DIR = sys._MEIPASS
    DATA_DIR = os.path.join(os.environ.get('APPDATA', os.path.expanduser('~')), 'NsN_XML_DataHub_3176')
else:
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    DATA_DIR = os.path.join(BASE_DIR, 'data')

os.makedirs(DATA_DIR, exist_ok=True)
DB_PATH = os.path.join(DATA_DIR, 'nsn_xml3176_data.db')
CONFIG_PATH = os.path.join(DATA_DIR, 'export_settings.json')
db = XmlDatabase(DB_PATH)

def get_default_downloads_dir():
    try:
        d = os.path.join(os.path.expanduser('~'), 'Downloads')
        if os.path.exists(d):
            return d
    except Exception:
        pass
    return os.path.expanduser('~')

def load_export_config():
    default_cfg = {
        "askEveryTime": True,
        "defaultDir": get_default_downloads_dir(),
        "autoOpenFolder": False
    }
    if os.path.exists(CONFIG_PATH):
        try:
            with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
                saved = json.load(f)
                default_cfg.update(saved)
        except Exception:
            pass
    return default_cfg

def save_export_config_to_disk(cfg):
    try:
        with open(CONFIG_PATH, 'w', encoding='utf-8') as f:
            json.dump(cfg, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Error saving export settings: {e}")

app = FastAPI(title="NsN XML DataHub 3176 Desktop Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Background import state
import_progress = {
    "is_importing": False,
    "current_file": "",
    "total_files": 0,
    "completed_files": 0,
    "current_rows": 0,
    "error": None
}

class QueryPayload(BaseModel):
    searchQuery: Optional[str] = ""
    searchColumn: Optional[str] = "ALL"
    exactMatch: Optional[bool] = False
    dateCriteria: Optional[str] = "ALL_DATES"
    fromDate: Optional[str] = ""
    toDate: Optional[str] = ""
    maKhoa: Optional[str] = ""
    maLoaiKcb: Optional[str] = ""
    hasDrugsOnly: Optional[bool] = False
    hasServicesOnly: Optional[bool] = False
    pickedIcds: Optional[List[str]] = []
    pickedDrugs: Optional[List[str]] = []
    pickedServices: Optional[List[str]] = []
    pickedGroups: Optional[List[str]] = []
    pickedPatients: Optional[List[str]] = []
    pickedDepartments: Optional[List[str]] = []
    pickedCards: Optional[List[str]] = []
    pickedDoctors: Optional[List[str]] = []
    pickedMachines: Optional[List[str]] = []
    matchMode: Optional[str] = "OR"
    ketQuaDtri: Optional[str] = ""
    maLoaiRv: Optional[str] = ""
    gioiTinh: Optional[str] = ""
    dauMaThe: Optional[str] = ""
    maMay: Optional[str] = ""
    duongDung: Optional[str] = ""
    minCost: Optional[Any] = ""
    maxCost: Optional[Any] = ""
    customRules: Optional[List[Dict[str, Any]]] = []
    page: Optional[int] = 1
    pageSize: Optional[int] = 25

class StatExportPayload(BaseModel):
    statType: str # ICD, DRUG, SERVICE, DEPARTMENT
    keyValue: str

# 1. Native File Dialog Endpoint
@app.post("/api/files/open-dialog")
def open_native_file_dialog():
    root = tk.Tk()
    root.withdraw()
    root.attributes('-topmost', True)
    file_paths = filedialog.askopenfilenames(
        title="Chọn các file Excel & XML (15 Bảng) chuẩn QĐ 3176/QĐ-BYT",
        filetypes=[
            ("Tất cả tệp XML & Excel", "*.xlsx *.xls *.xml"),
            ("Tệp XML gói QĐ 3176 (*.xml)", "*.xml"),
            ("Tệp Excel (*.xlsx;*.xls)", "*.xlsx *.xls"),
            ("Tất cả tệp (*.*)", "*.*")
        ]
    )
    root.destroy()
    return {"filePaths": list(file_paths)}

# 2. Start Background Import
@app.post("/api/files/import")
def start_file_import(payload: Dict[str, Any] = Body(...)):
    global import_progress
    if import_progress["is_importing"]:
        raise HTTPException(status_code=400, detail="Hệ thống đang xử lý một đợt nạp file khác.")

    file_paths = payload.get("filePaths", [])
    if not file_paths:
        raise HTTPException(status_code=400, detail="Chưa chọn file nào.")

    def run_import():
        global import_progress
        import_progress["is_importing"] = True
        import_progress["total_files"] = len(file_paths)
        import_progress["completed_files"] = 0
        import_progress["error"] = None

        def on_prog(fname, rows):
            import_progress["current_file"] = fname
            import_progress["current_rows"] = rows

        for path in file_paths:
            try:
                import_progress["current_file"] = os.path.basename(path)
                import_progress["current_rows"] = 0
                db.import_file(path, progress_callback=on_prog)
                import_progress["completed_files"] += 1
            except Exception as e:
                import_progress["error"] = f"Lỗi đọc file {os.path.basename(path)}: {str(e)}"
                break

        import_progress["is_importing"] = False

    t = threading.Thread(target=run_import, daemon=True)
    t.start()
    return {"status": "started", "totalFiles": len(file_paths)}

@app.get("/api/files/progress")
def get_import_progress():
    global import_progress
    return import_progress

@app.get("/api/files/list")
def list_imported_files():
    return db.get_imported_files()

@app.delete("/api/files/{file_id}")
def delete_file(file_id: str):
    db.remove_file(file_id)
    return {"success": True}

@app.post("/api/files/clear")
def clear_all_files():
    db.clear_database()
    return {"success": True}

# 3. Stats & Distinct Values for Pickers
@app.get("/api/stats")
def get_stats():
    return db.get_stats()

@app.get("/api/distinct-values")
def get_distinct_values():
    return db.get_distinct_values()

# 4. Search & Query Dossiers
@app.post("/api/query/dossiers")
def query_dossiers(payload: QueryPayload):
    filters = payload.model_dump()
    page = payload.page or 1
    page_size = payload.pageSize or 25
    return db.query_dossiers(filters, page=page, page_size=page_size)

@app.get("/api/dossier/{ma_lk}")
def get_dossier_detail(ma_lk: str):
    detail = db.get_dossier_detail(ma_lk)
    if not detail:
        raise HTTPException(status_code=404, detail="Không tìm thấy hồ sơ")
    return detail

# 5. Export Settings & Direct File Saving
class ExportConfigPayload(BaseModel):
    askEveryTime: bool = True
    defaultDir: str = ""
    autoOpenFolder: bool = False

class SaveAsDialogPayload(BaseModel):
    defaultFileName: str = "NsN_Export_3176.xlsx"
    initialDir: Optional[str] = ""

class SaveExcelPayload(BaseModel):
    filePath: str
    fileBase64: str

class OpenLocationPayload(BaseModel):
    path: str

@app.get("/api/settings/export-config")
def get_export_config():
    return load_export_config()

@app.post("/api/settings/export-config")
def update_export_config(payload: ExportConfigPayload):
    cfg = load_export_config()
    cfg["askEveryTime"] = payload.askEveryTime
    if payload.defaultDir and os.path.exists(payload.defaultDir):
        cfg["defaultDir"] = payload.defaultDir
    cfg["autoOpenFolder"] = payload.autoOpenFolder
    save_export_config_to_disk(cfg)
    return {"success": True, "config": cfg}

@app.post("/api/settings/choose-export-dir")
def choose_export_directory():
    cfg = load_export_config()
    initial_dir = cfg.get("defaultDir") if os.path.exists(cfg.get("defaultDir", "")) else get_default_downloads_dir()
    root = tk.Tk()
    root.withdraw()
    root.attributes('-topmost', True)
    chosen_dir = filedialog.askdirectory(
        title="Chọn thư mục lưu file Excel mặc định",
        initialdir=initial_dir
    )
    root.destroy()
    if chosen_dir and os.path.exists(chosen_dir):
        cfg["defaultDir"] = chosen_dir
        save_export_config_to_disk(cfg)
        return {"success": True, "chosenDir": chosen_dir}
    return {"success": False, "chosenDir": cfg.get("defaultDir")}

@app.post("/api/settings/save-as-dialog")
def open_save_as_dialog(payload: SaveAsDialogPayload):
    cfg = load_export_config()
    initial_dir = payload.initialDir or cfg.get("defaultDir") or get_default_downloads_dir()
    if not os.path.exists(initial_dir):
        initial_dir = get_default_downloads_dir()

    root = tk.Tk()
    root.withdraw()
    root.attributes('-topmost', True)
    chosen_path = filedialog.asksaveasfilename(
        title="Chọn nơi lưu file Excel",
        initialdir=initial_dir,
        initialfile=payload.defaultFileName,
        defaultextension=".xlsx",
        filetypes=[("Tệp Excel (*.xlsx)", "*.xlsx"), ("Tất cả tệp (*.*)", "*.*")]
    )
    root.destroy()
    if chosen_path:
        # Also remember last used directory
        last_dir = os.path.dirname(chosen_path)
        if last_dir and os.path.exists(last_dir):
            cfg["lastUsedDir"] = last_dir
            save_export_config_to_disk(cfg)
        return {"cancelled": False, "filePath": chosen_path}
    return {"cancelled": True, "filePath": ""}

@app.post("/api/export/save-excel-file")
def save_excel_file_directly(payload: SaveExcelPayload):
    try:
        target_path = payload.filePath
        if not target_path:
            raise HTTPException(status_code=400, detail="Đường dẫn lưu file không hợp lệ.")

        target_dir = os.path.dirname(target_path)
        if target_dir:
            os.makedirs(target_dir, exist_ok=True)

        data_bytes = base64.b64decode(payload.fileBase64)
        with open(target_path, "wb") as f:
            f.write(data_bytes)

        cfg = load_export_config()
        if cfg.get("autoOpenFolder"):
            try:
                subprocess.Popen(f'explorer /select,"{os.path.abspath(target_path)}"')
            except Exception:
                pass

        return {
            "success": True,
            "filePath": target_path,
            "fileName": os.path.basename(target_path),
            "fileSize": len(data_bytes)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi ghi file Excel: {str(e)}")

@app.post("/api/system/open-file-location")
def open_file_location(payload: OpenLocationPayload):
    p = payload.path
    if not p or not os.path.exists(p):
        folder = os.path.dirname(p)
        if folder and os.path.exists(folder):
            os.startfile(folder)
            return {"success": True}
        raise HTTPException(status_code=404, detail="File hoặc thư mục không tồn tại.")
    try:
        subprocess.Popen(f'explorer /select,"{os.path.abspath(p)}"')
        return {"success": True}
    except Exception:
        try:
            os.startfile(os.path.dirname(p))
            return {"success": True}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

# 6. Export Detail from Statistics Click
@app.post("/api/export/statistic")
def export_statistic(payload: StatExportPayload):
    cfg = load_export_config()
    default_dir = cfg.get("defaultDir") or get_default_downloads_dir()
    timestamp = time.strftime('%Y%m%d_%H%M%S')
    clean_val = "".join([c if c.isalnum() else "_" for c in payload.keyValue])[:20]
    out_name = f"Xuat_ThongKe_{payload.statType}_{clean_val}_{timestamp}.xlsx"

    # If askEveryTime, prompt save-as dialog
    out_path = os.path.join(default_dir, out_name)
    if cfg.get("askEveryTime", True):
        chosen_path = None
        try:
            root = tk.Tk()
            root.withdraw()
            root.attributes('-topmost', True)
            chosen_path = filedialog.asksaveasfilename(
                title="Chọn nơi lưu file thống kê Excel",
                initialdir=default_dir,
                initialfile=out_name,
                defaultextension=".xlsx",
                filetypes=[("Tệp Excel (*.xlsx)", "*.xlsx"), ("Tất cả tệp (*.*)", "*.*")]
            )
            root.destroy()
        except Exception as tk_err:
            print(f"[Export Stat Dialog] Error: {tk_err}, using default path.")
            chosen_path = out_path

        if not chosen_path:
            return {"success": False, "cancelled": True, "filePath": "", "fileName": "", "rowCount": 0}
        out_path = chosen_path

    res = db.export_statistic_detail(payload.statType, payload.keyValue, out_path)
    
    if cfg.get("autoOpenFolder") and os.path.exists(out_path):
        try:
            subprocess.Popen(f'explorer /select,"{os.path.abspath(out_path)}"')
        except Exception:
            pass

    return {
        "success": True,
        "filePath": out_path,
        "fileName": os.path.basename(out_path),
        "rowCount": res.get("rowCount", 0)
    }

# 7. Export Filtered Excel (Synchronized across XML1, XML2, XML3 by MA_LK)
class FilteredExportPayload(BaseModel):
    filters: Dict[str, Any]
    tableChoice: Optional[str] = "ALL_THREE" # 'ALL_THREE' | 'XML1' | 'XML2' | 'XML3'
    onlyItemsInDateRange: Optional[bool] = False
    customFileName: Optional[str] = ""

@app.post("/api/export/filtered-excel")
def export_filtered_excel(payload: FilteredExportPayload):
    cfg = load_export_config()
    default_dir = cfg.get("defaultDir") or get_default_downloads_dir()
    timestamp = time.strftime('%Y%m%d_%H%M%S')

    if payload.tableChoice == 'XML1':
        default_name = f"XML1_Filtered_3176_{timestamp}.xlsx"
    elif payload.tableChoice == 'XML2':
        default_name = f"XML2_Thuoc_Filtered_3176_{timestamp}.xlsx"
    elif payload.tableChoice == 'XML3':
        default_name = f"XML3_DVKT_Filtered_3176_{timestamp}.xlsx"
    else:
        default_name = f"XML_TronBo_123_Filtered_3176_{timestamp}.xlsx"

    if payload.customFileName:
        default_name = payload.customFileName

    out_path = os.path.join(default_dir, default_name)
    if cfg.get("askEveryTime", True):
        chosen_path = None
        try:
            root = tk.Tk()
            root.withdraw()
            root.attributes('-topmost', True)
            chosen_path = filedialog.asksaveasfilename(
                title="Chọn nơi lưu file Excel xuất dữ liệu đã lọc (QĐ 3176)",
                initialdir=default_dir,
                initialfile=default_name,
                defaultextension=".xlsx",
                filetypes=[("Tệp Excel (*.xlsx)", "*.xlsx"), ("Tất cả tệp (*.*)", "*.*")]
            )
            root.destroy()
        except Exception as tk_err:
            print(f"[Export Filtered Dialog] Error: {tk_err}, using default path.")
            chosen_path = out_path

        if not chosen_path:
            return {"success": False, "cancelled": True, "filePath": "", "fileName": "", "rowCount": 0}
        out_path = chosen_path

    res = db.export_filtered_excel(
        filters=payload.filters,
        table_choice=payload.tableChoice or "ALL_THREE",
        output_path=out_path,
        only_in_date_range=bool(payload.onlyItemsInDateRange)
    )

    if cfg.get("autoOpenFolder") and os.path.exists(out_path):
        try:
            subprocess.Popen(f'explorer /select,"{os.path.abspath(out_path)}"')
        except Exception:
            pass

    return res

# 8. KPI Detail Breakdown & KPI Export
class KpiBreakdownPayload(BaseModel):
    type: str # 'COST' | 'DRUGS' | 'SERVICES' | 'DOSSIERS'
    search: Optional[str] = ""

class KpiExportPayload(BaseModel):
    type: str # 'COST' | 'DRUGS' | 'SERVICES' | 'DOSSIERS'
    search: Optional[str] = ""

@app.post("/api/kpi/breakdown")
def get_kpi_breakdown(payload: KpiBreakdownPayload):
    items = db.get_kpi_breakdown(payload.type, payload.search or "")
    return {"items": items}

@app.post("/api/kpi/export")
def export_kpi_table(payload: KpiExportPayload):
    cfg = load_export_config()
    default_dir = cfg.get("defaultDir") or get_default_downloads_dir()
    timestamp = time.strftime('%Y%m%d_%H%M%S')

    name_map = {
        'COST': 'CoCauVienPhi_TheoKhoaPhong',
        'DRUGS': 'DanhMuc_Thuoc_KeDon',
        'SERVICES': 'DanhMuc_DVKT_VTYT',
        'DOSSIERS': 'DanhSach_HoSo_KCB'
    }
    prefix = name_map.get(payload.type, 'ThongKe_ChiTiet')
    default_name = f"{prefix}_3176_{timestamp}.xlsx"

    out_path = os.path.join(default_dir, default_name)
    if cfg.get("askEveryTime", True):
        chosen_path = None
        try:
            root = tk.Tk()
            root.withdraw()
            root.attributes('-topmost', True)
            chosen_path = filedialog.asksaveasfilename(
                title="Chọn nơi lưu file thống kê chi tiết Excel",
                initialdir=default_dir,
                initialfile=default_name,
                defaultextension=".xlsx",
                filetypes=[("Tệp Excel (*.xlsx)", "*.xlsx"), ("Tất cả tệp (*.*)", "*.*")]
            )
            root.destroy()
        except Exception as tk_err:
            print(f"[Export KPI Dialog] Error: {tk_err}, using default path.")
            chosen_path = out_path

        if not chosen_path:
            return {"success": False, "cancelled": True, "filePath": "", "fileName": "", "rowCount": 0}
        out_path = chosen_path

    res = db.export_kpi_table_to_excel(payload.type, payload.search or "", out_path)

    if cfg.get("autoOpenFolder") and os.path.exists(out_path):
        try:
            subprocess.Popen(f'explorer /select,"{os.path.abspath(out_path)}"')
        except Exception:
            pass

    return res

# 9. Static files (React build dist)
DIST_DIR = os.path.join(BASE_DIR, 'dist')
if os.path.exists(DIST_DIR):
    app.mount("/", StaticFiles(directory=DIST_DIR, html=True), name="static")

def run_server(port=28176):
    uvicorn.run(app, host="127.0.0.1", port=port, log_level="warning")

if __name__ == '__main__':
    run_server()
