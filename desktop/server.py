import os
import sys
import time
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
db = XmlDatabase(DB_PATH)

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

# 5. Export Detail from Statistics Click
@app.post("/api/export/statistic")
def export_statistic(payload: StatExportPayload):
    downloads_dir = os.path.join(os.path.expanduser('~'), 'Downloads')
    timestamp = time.strftime('%Y%m%d_%H%M%S')
    clean_val = "".join([c if c.isalnum() else "_" for c in payload.keyValue])[:20]
    out_name = f"Xuat_ThongKe_{payload.statType}_{clean_val}_{timestamp}.xlsx"
    out_path = os.path.join(downloads_dir, out_name)

    res = db.export_statistic_detail(payload.statType, payload.keyValue, out_path)
    return {
        "success": True,
        "filePath": out_path,
        "fileName": out_name,
        "rowCount": res.get("rowCount", 0)
    }

# 6. Static files (React build dist)
DIST_DIR = os.path.join(BASE_DIR, 'dist')
if os.path.exists(DIST_DIR):
    app.mount("/", StaticFiles(directory=DIST_DIR, html=True), name="static")

def run_server(port=28176):
    uvicorn.run(app, host="127.0.0.1", port=port, log_level="warning")

if __name__ == '__main__':
    run_server()
