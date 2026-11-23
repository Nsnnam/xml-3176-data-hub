import os
import sqlite3
import time
from typing import List, Dict, Any, Optional, Tuple
import openpyxl
import xlsxwriter

class XmlDatabase:
    def __init__(self, db_path: str):
        self.db_path = db_path
        os.makedirs(os.path.dirname(os.path.abspath(db_path)), exist_ok=True)
        self._init_db()

    def get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode = WAL")
        conn.execute("PRAGMA synchronous = NORMAL")
        conn.execute("PRAGMA temp_store = MEMORY")
        conn.execute("PRAGMA cache_size = -64000") # 64MB cache
        return conn

    def _init_db(self):
        with self.get_connection() as conn:
            cur = conn.cursor()
            # 1. Imported Files Table
            cur.execute("""
            CREATE TABLE IF NOT EXISTS imported_files (
                id TEXT PRIMARY KEY,
                file_name TEXT,
                file_path TEXT,
                file_size INTEGER,
                table_type TEXT,
                record_count INTEGER,
                loaded_at TEXT
            )
            """)

            # 2. XML1 Table (65 columns stored as json or primary query columns + raw_json)
            cur.execute("""
            CREATE TABLE IF NOT EXISTS xml1 (
                ma_lk TEXT PRIMARY KEY,
                stt INTEGER,
                ma_bn TEXT,
                ho_ten TEXT,
                so_cccd TEXT,
                ngay_sinh TEXT,
                gioi_tinh TEXT,
                dia_chi TEXT,
                ma_the_bhyt TEXT,
                ma_dkbd TEXT,
                chan_doan_vao TEXT,
                chan_doan_rv TEXT,
                ma_benh_chinh TEXT,
                ma_benh_kt TEXT,
                ngay_vao TEXT,
                ngay_ra TEXT,
                ngay_ttoan TEXT,
                so_ngay_dtri REAL,
                t_tongchi_bv REAL,
                t_tongchi_bh REAL,
                t_bhtt REAL,
                t_bntt REAL,
                t_thuoc REAL,
                t_vtyt REAL,
                ma_loai_kcb TEXT,
                ma_khoa TEXT,
                ma_cskcb TEXT,
                ma_hsba TEXT,
                file_id TEXT,
                raw_json TEXT
            )
            """)

            # Indexes on XML1
            cur.execute("CREATE INDEX IF NOT EXISTS idx_x1_bn ON xml1(ma_bn)")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_x1_hoten ON xml1(ho_ten)")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_x1_cccd ON xml1(so_cccd)")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_x1_the ON xml1(ma_the_bhyt)")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_x1_icd ON xml1(ma_benh_chinh)")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_x1_vao ON xml1(ngay_vao)")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_x1_ra ON xml1(ngay_ra)")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_x1_khoa ON xml1(ma_khoa)")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_x1_loai ON xml1(ma_loai_kcb)")

            # 3. XML2 Table (Drugs)
            cur.execute("""
            CREATE TABLE IF NOT EXISTS xml2 (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ma_lk TEXT,
                stt INTEGER,
                ma_thuoc TEXT,
                ma_nhom TEXT,
                ten_thuoc TEXT,
                don_vi_tinh TEXT,
                ham_luong TEXT,
                so_luong REAL,
                don_gia REAL,
                thanh_tien_bv REAL,
                thanh_tien_bh REAL,
                t_bhtt REAL,
                t_bntt REAL,
                ma_khoa TEXT,
                ma_bac_si TEXT,
                ngay_yl TEXT,
                ngay_th_yl TEXT,
                tt_thau TEXT,
                file_id TEXT,
                raw_json TEXT
            )
            """)

            # Indexes on XML2
            cur.execute("CREATE INDEX IF NOT EXISTS idx_x2_lk ON xml2(ma_lk)")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_x2_nhom ON xml2(ma_nhom)")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_x2_mathuoc ON xml2(ma_thuoc)")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_x2_tenthuoc ON xml2(ten_thuoc)")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_x2_yl ON xml2(ngay_yl)")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_x2_thyl ON xml2(ngay_th_yl)")

            # 4. XML3 Table (Services & Supplies)
            cur.execute("""
            CREATE TABLE IF NOT EXISTS xml3 (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ma_lk TEXT,
                stt INTEGER,
                ma_dich_vu TEXT,
                ma_vat_tu TEXT,
                ma_nhom TEXT,
                ten_dich_vu TEXT,
                ten_vat_tu TEXT,
                don_vi_tinh TEXT,
                so_luong REAL,
                don_gia_bv REAL,
                don_gia_bh REAL,
                thanh_tien_bv REAL,
                thanh_tien_bh REAL,
                t_bhtt REAL,
                t_bntt REAL,
                ma_khoa TEXT,
                ma_bac_si TEXT,
                nguoi_thuc_hien TEXT,
                ma_benh TEXT,
                ngay_yl TEXT,
                ngay_th_yl TEXT,
                ngay_kq TEXT,
                ma_may TEXT,
                tt_thau TEXT,
                file_id TEXT,
                raw_json TEXT
            )
            """)

            # Indexes on XML3
            cur.execute("CREATE INDEX IF NOT EXISTS idx_x3_lk ON xml3(ma_lk)")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_x3_nhom ON xml3(ma_nhom)")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_x3_madv ON xml3(ma_dich_vu)")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_x3_tendv ON xml3(ten_dich_vu)")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_x3_benh ON xml3(ma_benh)")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_x3_may ON xml3(ma_may)")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_x3_yl ON xml3(ngay_yl)")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_x3_thyl ON xml3(ngay_th_yl)")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_x3_kq ON xml3(ngay_kq)")

            conn.commit()

    def clear_database(self):
        with self.get_connection() as conn:
            cur = conn.cursor()
            cur.execute("DELETE FROM imported_files")
            cur.execute("DELETE FROM xml1")
            cur.execute("DELETE FROM xml2")
            cur.execute("DELETE FROM xml3")
            conn.commit()
            cur.execute("VACUUM")

    def remove_file(self, file_id: str):
        with self.get_connection() as conn:
            cur = conn.cursor()
            cur.execute("DELETE FROM imported_files WHERE id = ?", (file_id,))
            cur.execute("DELETE FROM xml1 WHERE file_id = ?", (file_id,))
            cur.execute("DELETE FROM xml2 WHERE file_id = ?", (file_id,))
            cur.execute("DELETE FROM xml3 WHERE file_id = ?", (file_id,))
            conn.commit()

    def get_imported_files(self) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            cur = conn.cursor()
            cur.execute("SELECT * FROM imported_files ORDER BY loaded_at DESC")
            return [dict(row) for row in cur.fetchall()]

    def import_excel_file(self, file_path: str, progress_callback=None) -> Dict[str, Any]:
        """
        Stream reads an Excel file using openpyxl (read_only=True) and inserts into SQLite in batches
        """
        import json
        file_name = os.path.basename(file_path)
        file_size = os.path.getsize(file_path)
        file_id = f"{file_name}_{int(time.time())}"

        wb = openpyxl.load_workbook(file_path, read_only=True)
        sheet_name = wb.sheetnames[0]
        for s in wb.sheetnames:
            if any(k in s.lower() for k in ['xml1', 'xml2', 'xml3', 'bảng 1', 'bảng 2', 'bảng 3']):
                sheet_name = s
                break

        ws = wb[sheet_name]
        row_iter = ws.iter_rows(values_only=True)

        # 1. Read header row
        headers = []
        for row in row_iter:
            row_vals = [str(c or '').strip() for c in row]
            if any('MA_LK' in c.upper() for c in row_vals):
                headers = [c.upper() for c in row_vals]
                break

        if not headers:
            wb.close()
            raise ValueError(f"Không tìm thấy dòng tiêu đề chứa MA_LK trong file {file_name}")

        # 2. Detect table type
        h_set = set(headers)
        fname_upper = file_name.upper()

        if 'MA_THUOC' in h_set or 'TEN_THUOC' in h_set:
            table_type = 'XML2'
        elif 'MA_DICH_VU' in h_set or 'TEN_DICH_VU' in h_set or 'NGAY_KQ' in h_set:
            table_type = 'XML3'
        elif 'MA_BENH_CHINH' in h_set or 'CHAN_DOAN_RV' in h_set or 'T_TONGCHI_BV' in h_set:
            table_type = 'XML1'
        elif 'XML2' in fname_upper:
            table_type = 'XML2'
        elif 'XML3' in fname_upper:
            table_type = 'XML3'
        else:
            table_type = 'XML1'

        # Map header name to column index
        col_map = {h: idx for idx, h in enumerate(headers)}

        def get_val(r, col_name, default=''):
            idx = col_map.get(col_name)
            if idx is not None and idx < len(r):
                v = r[idx]
                return v if v is not None else default
            return default

        def to_num(val, default=0.0):
            if val is None or val == '':
                return default
            try:
                return float(val)
            except:
                return default

        # 3. Stream rows into SQLite
        batch_size = 5000
        batch = []
        total_rows = 0

        with self.get_connection() as conn:
            cur = conn.cursor()

            if table_type == 'XML1':
                insert_sql = """
                INSERT OR REPLACE INTO xml1 (
                    ma_lk, stt, ma_bn, ho_ten, so_cccd, ngay_sinh, gioi_tinh, dia_chi,
                    ma_the_bhyt, ma_dkbd, chan_doan_vao, chan_doan_rv, ma_benh_chinh,
                    ma_benh_kt, ngay_vao, ngay_ra, ngay_ttoan, so_ngay_dtri, t_tongchi_bv,
                    t_tongchi_bh, t_bhtt, t_bntt, t_thuoc, t_vtyt, ma_loai_kcb, ma_khoa,
                    ma_cskcb, ma_hsba, file_id, raw_json
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """
                for row in row_iter:
                    if not row or not any(row): continue
                    ma_lk = str(get_val(row, 'MA_LK', '')).strip()
                    if not ma_lk: continue

                    record_dict = {h: row[idx] if idx < len(row) else '' for h, idx in col_map.items()}

                    batch.append((
                        ma_lk,
                        int(to_num(get_val(row, 'STT', 0))),
                        str(get_val(row, 'MA_BN', '')).strip(),
                        str(get_val(row, 'HO_TEN', '')).strip(),
                        str(get_val(row, 'SO_CCCD', '')).strip(),
                        str(get_val(row, 'NGAY_SINH', '')).strip(),
                        str(get_val(row, 'GIOI_TINH', '')).strip(),
                        str(get_val(row, 'DIA_CHI', '')).strip(),
                        str(get_val(row, 'MA_THE_BHYT', get_val(row, 'MA_THE', ''))).strip(),
                        str(get_val(row, 'MA_DKBD', '')).strip(),
                        str(get_val(row, 'CHAN_DOAN_VAO', '')).strip(),
                        str(get_val(row, 'CHAN_DOAN_RV', '')).strip(),
                        str(get_val(row, 'MA_BENH_CHINH', '')).strip(),
                        str(get_val(row, 'MA_BENH_KT', '')).strip(),
                        str(get_val(row, 'NGAY_VAO', '')).strip(),
                        str(get_val(row, 'NGAY_RA', '')).strip(),
                        str(get_val(row, 'NGAY_TTOAN', '')).strip(),
                        to_num(get_val(row, 'SO_NGAY_DTRI', 0)),
                        to_num(get_val(row, 'T_TONGCHI_BV', 0)),
                        to_num(get_val(row, 'T_TONGCHI_BH', 0)),
                        to_num(get_val(row, 'T_BHTT', 0)),
                        to_num(get_val(row, 'T_BNTT', 0)),
                        to_num(get_val(row, 'T_THUOC', 0)),
                        to_num(get_val(row, 'T_VTYT', 0)),
                        str(get_val(row, 'MA_LOAI_KCB', '')).strip(),
                        str(get_val(row, 'MA_KHOA', '')).strip(),
                        str(get_val(row, 'MA_CSKCB', '')).strip(),
                        str(get_val(row, 'MA_HSBA', '')).strip(),
                        file_id,
                        json.dumps(record_dict, ensure_ascii=False)
                    ))
                    total_rows += 1

                    if len(batch) >= batch_size:
                        cur.executemany(insert_sql, batch)
                        batch = []
                        if progress_callback: progress_callback(file_name, total_rows)

                if batch:
                    cur.executemany(insert_sql, batch)

            elif table_type == 'XML2':
                insert_sql = """
                INSERT INTO xml2 (
                    ma_lk, stt, ma_thuoc, ma_nhom, ten_thuoc, don_vi_tinh, ham_luong,
                    so_luong, don_gia, thanh_tien_bv, thanh_tien_bh, t_bhtt, t_bntt,
                    ma_khoa, ma_bac_si, ngay_yl, ngay_th_yl, tt_thau, file_id, raw_json
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """
                for row in row_iter:
                    if not row or not any(row): continue
                    ma_lk = str(get_val(row, 'MA_LK', '')).strip()
                    if not ma_lk: continue

                    record_dict = {h: row[idx] if idx < len(row) else '' for h, idx in col_map.items()}

                    batch.append((
                        ma_lk,
                        int(to_num(get_val(row, 'STT', 0))),
                        str(get_val(row, 'MA_THUOC', '')).strip(),
                        str(get_val(row, 'MA_NHOM', '')).strip(),
                        str(get_val(row, 'TEN_THUOC', '')).strip(),
                        str(get_val(row, 'DON_VI_TINH', '')).strip(),
                        str(get_val(row, 'HAM_LUONG', '')).strip(),
                        to_num(get_val(row, 'SO_LUONG', 0)),
                        to_num(get_val(row, 'DON_GIA', 0)),
                        to_num(get_val(row, 'THANH_TIEN_BV', 0)),
                        to_num(get_val(row, 'THANH_TIEN_BH', 0)),
                        to_num(get_val(row, 'T_BHTT', 0)),
                        to_num(get_val(row, 'T_BNTT', 0)),
                        str(get_val(row, 'MA_KHOA', '')).strip(),
                        str(get_val(row, 'MA_BAC_SI', '')).strip(),
                        str(get_val(row, 'NGAY_YL', '')).strip(),
                        str(get_val(row, 'NGAY_TH_YL', '')).strip(),
                        str(get_val(row, 'TT_THAU', '')).strip(),
                        file_id,
                        json.dumps(record_dict, ensure_ascii=False)
                    ))
                    total_rows += 1

                    if len(batch) >= batch_size:
                        cur.executemany(insert_sql, batch)
                        batch = []
                        if progress_callback: progress_callback(file_name, total_rows)

                if batch:
                    cur.executemany(insert_sql, batch)

            elif table_type == 'XML3':
                insert_sql = """
                INSERT INTO xml3 (
                    ma_lk, stt, ma_dich_vu, ma_vat_tu, ma_nhom, ten_dich_vu, ten_vat_tu,
                    don_vi_tinh, so_luong, don_gia_bv, don_gia_bh, thanh_tien_bv,
                    thanh_tien_bh, t_bhtt, t_bntt, ma_khoa, ma_bac_si, nguoi_thuc_hien,
                    ma_benh, ngay_yl, ngay_th_yl, ngay_kq, ma_may, tt_thau, file_id, raw_json
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """
                for row in row_iter:
                    if not row or not any(row): continue
                    ma_lk = str(get_val(row, 'MA_LK', '')).strip()
                    if not ma_lk: continue

                    record_dict = {h: row[idx] if idx < len(row) else '' for h, idx in col_map.items()}

                    batch.append((
                        ma_lk,
                        int(to_num(get_val(row, 'STT', 0))),
                        str(get_val(row, 'MA_DICH_VU', '')).strip(),
                        str(get_val(row, 'MA_VAT_TU', '')).strip(),
                        str(get_val(row, 'MA_NHOM', '')).strip(),
                        str(get_val(row, 'TEN_DICH_VU', '')).strip(),
                        str(get_val(row, 'TEN_VAT_TU', '')).strip(),
                        str(get_val(row, 'DON_VI_TINH', '')).strip(),
                        to_num(get_val(row, 'SO_LUONG', 0)),
                        to_num(get_val(row, 'DON_GIA_BV', 0)),
                        to_num(get_val(row, 'DON_GIA_BH', 0)),
                        to_num(get_val(row, 'THANH_TIEN_BV', 0)),
                        to_num(get_val(row, 'THANH_TIEN_BH', 0)),
                        to_num(get_val(row, 'T_BHTT', 0)),
                        to_num(get_val(row, 'T_BNTT', 0)),
                        str(get_val(row, 'MA_KHOA', '')).strip(),
                        str(get_val(row, 'MA_BAC_SI', '')).strip(),
                        str(get_val(row, 'NGUOI_THUC_HIEN', '')).strip(),
                        str(get_val(row, 'MA_BENH', '')).strip(),
                        str(get_val(row, 'NGAY_YL', '')).strip(),
                        str(get_val(row, 'NGAY_TH_YL', '')).strip(),
                        str(get_val(row, 'NGAY_KQ', '')).strip(),
                        str(get_val(row, 'MA_MAY', '')).strip(),
                        str(get_val(row, 'TT_THAU', '')).strip(),
                        file_id,
                        json.dumps(record_dict, ensure_ascii=False)
                    ))
                    total_rows += 1

                    if len(batch) >= batch_size:
                        cur.executemany(insert_sql, batch)
                        batch = []
                        if progress_callback: progress_callback(file_name, total_rows)

                if batch:
                    cur.executemany(insert_sql, batch)

            # Record file info
            cur.execute("""
            INSERT OR REPLACE INTO imported_files (id, file_name, file_path, file_size, table_type, record_count, loaded_at)
            VALUES (?, ?, ?, ?, ?, ?, datetime('now', 'localtime'))
            """, (file_id, file_name, file_path, file_size, table_type, total_rows))

            conn.commit()

        wb.close()
        return {
            "id": file_id,
            "fileName": file_name,
            "fileSize": file_size,
            "tableType": table_type,
            "recordCount": total_rows
        }

    def get_stats(self) -> Dict[str, Any]:
        """
        Fast SQL aggregations for summary dashboard
        """
        with self.get_connection() as conn:
            cur = conn.cursor()

            # Dossiers count & costs
            cur.execute("""
            SELECT 
                COUNT(*) as total_dossiers,
                COALESCE(SUM(t_tongchi_bv), 0) as total_bv,
                COALESCE(SUM(t_bhtt), 0) as total_bh,
                COALESCE(SUM(t_bntt), 0) as total_bn,
                SUM(CASE WHEN ma_loai_kcb = '3' THEN 1 ELSE 0 END) as inpatient,
                SUM(CASE WHEN ma_loai_kcb != '3' THEN 1 ELSE 0 END) as outpatient
            FROM xml1
            """)
            row = cur.fetchone()
            total_dossiers = row['total_dossiers'] or 0
            total_bv = row['total_bv'] or 0
            total_bh = row['total_bh'] or 0
            total_bn = row['total_bn'] or 0
            inpatient = row['inpatient'] or 0
            outpatient = row['outpatient'] or 0

            # Total XML2 & XML3 counts
            cur.execute("SELECT COUNT(*) FROM xml2")
            total_xml2 = cur.fetchone()[0]

            cur.execute("SELECT COUNT(*) FROM xml3")
            total_xml3 = cur.fetchone()[0]

            # Top 10 Diseases
            cur.execute("""
            SELECT ma_benh_chinh as code, chan_doan_rv as name, COUNT(*) as count
            FROM xml1
            WHERE ma_benh_chinh IS NOT NULL AND ma_benh_chinh != ''
            GROUP BY ma_benh_chinh
            ORDER BY count DESC
            LIMIT 10
            """)
            top_diseases = [dict(r) for r in cur.fetchall()]

            # Top 10 Drugs
            cur.execute("""
            SELECT ten_thuoc as name, ma_thuoc as code, SUM(so_luong) as count, SUM(thanh_tien_bv) as cost
            FROM xml2
            WHERE ten_thuoc IS NOT NULL AND ten_thuoc != ''
            GROUP BY ten_thuoc
            ORDER BY count DESC
            LIMIT 10
            """)
            top_drugs = [dict(r) for r in cur.fetchall()]

            # Top 10 Services
            cur.execute("""
            SELECT 
                COALESCE(NULLIF(ten_dich_vu, ''), ten_vat_tu) as name,
                COALESCE(NULLIF(ma_dich_vu, ''), ma_vat_tu) as code,
                SUM(so_luong) as count,
                SUM(thanh_tien_bv) as cost
            FROM xml3
            WHERE (ten_dich_vu IS NOT NULL AND ten_dich_vu != '') OR (ten_vat_tu IS NOT NULL AND ten_vat_tu != '')
            GROUP BY name
            ORDER BY count DESC
            LIMIT 10
            """)
            top_services = [dict(r) for r in cur.fetchall()]

            # Departments
            cur.execute("""
            SELECT ma_khoa, COUNT(*) as count
            FROM xml1
            WHERE ma_khoa IS NOT NULL AND ma_khoa != ''
            GROUP BY ma_khoa
            ORDER BY count DESC
            """)
            departments = {r['ma_khoa']: r['count'] for r in cur.fetchall()}

            return {
                "totalDossiers": total_dossiers,
                "totalXml1": total_dossiers,
                "totalXml2": total_xml2,
                "totalXml3": total_xml3,
                "totalCostBV": total_bv,
                "totalCostBH": total_bh,
                "totalCostBN": total_bn,
                "inpatientCount": inpatient,
                "outpatientCount": outpatient,
                "topDiseases": top_diseases,
                "topDrugs": top_drugs,
                "topServices": top_services,
                "departmentCounts": departments
            }

    def get_distinct_values(self) -> Dict[str, Any]:
        """
        Retrieves unique values for multi-select picker filters ('Nhặt' thông tin đầu vào)
        """
        with self.get_connection() as conn:
            cur = conn.cursor()

            # Groups (Mã nhóm) from XML2 and XML3
            cur.execute("""
            SELECT DISTINCT ma_nhom, 'XML2 (Thuốc)' as source, COUNT(*) as count 
            FROM xml2 WHERE ma_nhom IS NOT NULL AND ma_nhom != '' GROUP BY ma_nhom
            UNION
            SELECT DISTINCT ma_nhom, 'XML3 (DVKT)' as source, COUNT(*) as count 
            FROM xml3 WHERE ma_nhom IS NOT NULL AND ma_nhom != '' GROUP BY ma_nhom
            ORDER BY count DESC
            """)
            groups = [dict(r) for r in cur.fetchall()]

            # Top 200 ICDs
            cur.execute("""
            SELECT ma_benh_chinh as code, chan_doan_rv as name, COUNT(*) as count
            FROM xml1 WHERE ma_benh_chinh IS NOT NULL AND ma_benh_chinh != ''
            GROUP BY ma_benh_chinh
            ORDER BY count DESC
            LIMIT 200
            """)
            icds = [dict(r) for r in cur.fetchall()]

            # Top 200 Drugs
            cur.execute("""
            SELECT ma_thuoc as code, ten_thuoc as name, ham_luong, COUNT(*) as count
            FROM xml2 WHERE ten_thuoc IS NOT NULL AND ten_thuoc != ''
            GROUP BY ten_thuoc
            ORDER BY count DESC
            LIMIT 200
            """)
            drugs = [dict(r) for r in cur.fetchall()]

            # Top 200 Services
            cur.execute("""
            SELECT 
                COALESCE(NULLIF(ma_dich_vu, ''), ma_vat_tu) as code,
                COALESCE(NULLIF(ten_dich_vu, ''), ten_vat_tu) as name,
                ma_nhom,
                COUNT(*) as count
            FROM xml3 
            WHERE (ten_dich_vu IS NOT NULL AND ten_dich_vu != '') OR (ten_vat_tu IS NOT NULL AND ten_vat_tu != '')
            GROUP BY name
            ORDER BY count DESC
            LIMIT 200
            """)
            services = [dict(r) for r in cur.fetchall()]

            # Distinct Departments
            cur.execute("SELECT DISTINCT ma_khoa FROM xml1 WHERE ma_khoa IS NOT NULL AND ma_khoa != '' ORDER BY ma_khoa")
            depts = [r[0] for r in cur.fetchall()]

            return {
                "groups": groups,
                "icds": icds,
                "drugs": drugs,
                "services": services,
                "departments": depts
            }

    def query_dossiers(self, filters: Dict[str, Any], page: int = 1, page_size: int = 25) -> Dict[str, Any]:
        """
        Executes query against SQLite database with omni-search, exact-match, date filters, and picked multi-selects
        """
        with self.get_connection() as conn:
            cur = conn.cursor()

            search_query = (filters.get('searchQuery') or '').strip()
            search_column = (filters.get('searchColumn') or 'ALL').strip()
            exact_match = bool(filters.get('exactMatch', False))
            date_criteria = filters.get('dateCriteria', 'ALL_DATES')
            from_date = (filters.get('fromDate') or '').strip().replace('-', '') # YYYYMMDD
            to_date = (filters.get('toDate') or '').strip().replace('-', '')
            ma_khoa = (filters.get('maKhoa') or '').strip()
            ma_loai_kcb = (filters.get('maLoaiKcb') or '').strip()
            has_drugs_only = bool(filters.get('hasDrugsOnly', False))
            has_services_only = bool(filters.get('hasServicesOnly', False))

            picked_icds = filters.get('pickedIcds') or []
            picked_drugs = filters.get('pickedDrugs') or []
            picked_services = filters.get('pickedServices') or []
            picked_groups = filters.get('pickedGroups') or []
            match_mode = filters.get('matchMode', 'OR') # OR or AND

            # Fast column criteria
            ket_qua_dtri = (filters.get('ketQuaDtri') or '').strip()
            ma_loai_rv = (filters.get('maLoaiRv') or '').strip()
            gioi_tinh = (filters.get('gioiTinh') or '').strip()
            dau_ma_the = (filters.get('dauMaThe') or '').strip().upper()
            ma_may = (filters.get('maMay') or '').strip()
            duong_dung = (filters.get('duongDung') or '').strip()
            min_cost = filters.get('minCost')
            max_cost = filters.get('maxCost')
            custom_rules = filters.get('customRules') or []

            where_clauses = ["1=1"]
            params = []

            # 1. Search Query: Omni-search or Column-Specific
            if search_query:
                if search_column and search_column != 'ALL':
                    op = "= ?" if exact_match else "LIKE ?"
                    val = search_query if exact_match else f"%{search_query}%"

                    if search_column == 'MA_LK':
                        where_clauses.append(f"x1.ma_lk {op}")
                        params.append(val)
                    elif search_column == 'MA_BN':
                        where_clauses.append(f"x1.ma_bn {op}")
                        params.append(val)
                    elif search_column == 'HO_TEN':
                        where_clauses.append(f"x1.ho_ten {op}")
                        params.append(val)
                    elif search_column == 'SO_CCCD':
                        where_clauses.append(f"x1.so_cccd {op}")
                        params.append(val)
                    elif search_column == 'MA_THE_BHYT':
                        where_clauses.append(f"x1.ma_the_bhyt {op}")
                        params.append(val)
                    elif search_column == 'MA_BENH_CHINH':
                        where_clauses.append(f"x1.ma_benh_chinh {op}")
                        params.append(val)
                    elif search_column == 'MA_BENH_KT':
                        where_clauses.append(f"x1.ma_benh_kt {op}")
                        params.append(val)
                    elif search_column == 'CHAN_DOAN_RV':
                        where_clauses.append(f"x1.chan_doan_rv {op}")
                        params.append(val)
                    elif search_column == 'MA_KHOA':
                        where_clauses.append(f"x1.ma_khoa {op}")
                        params.append(val)
                    elif search_column == 'MA_DKBD':
                        where_clauses.append(f"x1.ma_dkbd {op}")
                        params.append(val)
                    elif search_column == 'MA_CSKCB':
                        where_clauses.append(f"x1.ma_cskcb {op}")
                        params.append(val)
                    elif search_column == 'MA_HSBA':
                        where_clauses.append(f"x1.ma_hsba {op}")
                        params.append(val)
                    elif search_column == 'DIA_CHI':
                        where_clauses.append(f"x1.dia_chi {op}")
                        params.append(val)
                    # XML2
                    elif search_column == 'TEN_THUOC':
                        where_clauses.append(f"EXISTS (SELECT 1 FROM xml2 x2 WHERE x2.ma_lk = x1.ma_lk AND x2.ten_thuoc {op})")
                        params.append(val)
                    elif search_column == 'MA_THUOC':
                        where_clauses.append(f"EXISTS (SELECT 1 FROM xml2 x2 WHERE x2.ma_lk = x1.ma_lk AND x2.ma_thuoc {op})")
                        params.append(val)
                    elif search_column == 'HAM_LUONG':
                        where_clauses.append(f"EXISTS (SELECT 1 FROM xml2 x2 WHERE x2.ma_lk = x1.ma_lk AND x2.ham_luong {op})")
                        params.append(val)
                    elif search_column == 'DUONG_DUNG':
                        where_clauses.append(f"EXISTS (SELECT 1 FROM xml2 x2 WHERE x2.ma_lk = x1.ma_lk AND json_extract(x2.raw_json, '$.DUONG_DUNG') {op})")
                        params.append(val)
                    elif search_column == 'SO_DANG_KY':
                        where_clauses.append(f"EXISTS (SELECT 1 FROM xml2 x2 WHERE x2.ma_lk = x1.ma_lk AND json_extract(x2.raw_json, '$.SO_DANG_KY') {op})")
                        params.append(val)
                    elif search_column == 'TT_THAU_XML2':
                        where_clauses.append(f"EXISTS (SELECT 1 FROM xml2 x2 WHERE x2.ma_lk = x1.ma_lk AND x2.tt_thau {op})")
                        params.append(val)
                    elif search_column == 'MA_BAC_SI_XML2':
                        where_clauses.append(f"EXISTS (SELECT 1 FROM xml2 x2 WHERE x2.ma_lk = x1.ma_lk AND x2.ma_bac_si {op})")
                        params.append(val)
                    # XML3
                    elif search_column == 'TEN_DICH_VU':
                        where_clauses.append(f"EXISTS (SELECT 1 FROM xml3 x3 WHERE x3.ma_lk = x1.ma_lk AND x3.ten_dich_vu {op})")
                        params.append(val)
                    elif search_column == 'MA_DICH_VU':
                        where_clauses.append(f"EXISTS (SELECT 1 FROM xml3 x3 WHERE x3.ma_lk = x1.ma_lk AND x3.ma_dich_vu {op})")
                        params.append(val)
                    elif search_column == 'MA_MAY':
                        where_clauses.append(f"EXISTS (SELECT 1 FROM xml3 x3 WHERE x3.ma_lk = x1.ma_lk AND x3.ma_may {op})")
                        params.append(val)
                    elif search_column == 'NGUOI_THUC_HIEN':
                        where_clauses.append(f"EXISTS (SELECT 1 FROM xml3 x3 WHERE x3.ma_lk = x1.ma_lk AND x3.nguoi_thuc_hien {op})")
                        params.append(val)
                    elif search_column == 'TEN_VAT_TU':
                        where_clauses.append(f"EXISTS (SELECT 1 FROM xml3 x3 WHERE x3.ma_lk = x1.ma_lk AND x3.ten_vat_tu {op})")
                        params.append(val)
                    elif search_column == 'MA_VAT_TU':
                        where_clauses.append(f"EXISTS (SELECT 1 FROM xml3 x3 WHERE x3.ma_lk = x1.ma_lk AND x3.ma_vat_tu {op})")
                        params.append(val)
                    elif search_column == 'MA_GIUONG':
                        where_clauses.append(f"EXISTS (SELECT 1 FROM xml3 x3 WHERE x3.ma_lk = x1.ma_lk AND x3.ma_giuong {op})")
                        params.append(val)
                    elif search_column == 'TT_THAU_XML3':
                        where_clauses.append(f"EXISTS (SELECT 1 FROM xml3 x3 WHERE x3.ma_lk = x1.ma_lk AND x3.tt_thau {op})")
                        params.append(val)
                    elif search_column == 'SOPHIEU':
                        where_clauses.append(f"(EXISTS (SELECT 1 FROM xml2 x2 WHERE x2.ma_lk = x1.ma_lk AND json_extract(x2.raw_json, '$.SOPHIEU') {op}) OR EXISTS (SELECT 1 FROM xml3 x3 WHERE x3.ma_lk = x1.ma_lk AND json_extract(x3.raw_json, '$.SOPHIEU') {op}))")
                        params.extend([val, val])
                else:
                    # Omni-search across all columns
                    if exact_match:
                        where_clauses.append("""
                        (
                            x1.ma_lk = ? OR x1.ma_bn = ? OR x1.ho_ten = ? OR x1.so_cccd = ? OR
                            x1.ma_the_bhyt = ? OR x1.ma_benh_chinh = ? OR x1.ma_hsba = ? OR
                            EXISTS (SELECT 1 FROM xml2 x2 WHERE x2.ma_lk = x1.ma_lk AND (x2.ma_thuoc = ? OR x2.ten_thuoc = ?)) OR
                            EXISTS (SELECT 1 FROM xml3 x3 WHERE x3.ma_lk = x1.ma_lk AND (x3.ma_dich_vu = ? OR x3.ten_dich_vu = ? OR x3.ma_may = ?))
                        )
                        """)
                        params.extend([search_query] * 12)
                    else:
                        like_term = f"%{search_query}%"
                        where_clauses.append("""
                        (
                            x1.ma_lk LIKE ? OR x1.ma_bn LIKE ? OR x1.ho_ten LIKE ? OR x1.so_cccd LIKE ? OR
                            x1.ma_the_bhyt LIKE ? OR x1.ma_benh_chinh LIKE ? OR x1.ma_benh_kt LIKE ? OR
                            x1.chan_doan_rv LIKE ? OR x1.chan_doan_vao LIKE ? OR x1.dia_chi LIKE ? OR
                            EXISTS (SELECT 1 FROM xml2 x2 WHERE x2.ma_lk = x1.ma_lk AND (x2.ten_thuoc LIKE ? OR x2.ma_thuoc LIKE ?)) OR
                            EXISTS (SELECT 1 FROM xml3 x3 WHERE x3.ma_lk = x1.ma_lk AND (x3.ten_dich_vu LIKE ? OR x3.ma_dich_vu LIKE ? OR x3.ma_may LIKE ?))
                        )
                        """)
                        params.extend([like_term] * 15)

            # 2. Picked Items Filter ('Nhặt' thông tin)
            picked_subqueries = []
            if picked_icds:
                placeholders = ','.join(['?'] * len(picked_icds))
                picked_subqueries.append(f"(x1.ma_benh_chinh IN ({placeholders}) OR x1.ma_benh_kt IN ({placeholders}))")
                params.extend(picked_icds * 2)

            if picked_drugs:
                placeholders = ','.join(['?'] * len(picked_drugs))
                picked_subqueries.append(f"EXISTS (SELECT 1 FROM xml2 x2 WHERE x2.ma_lk = x1.ma_lk AND (x2.ten_thuoc IN ({placeholders}) OR x2.ma_thuoc IN ({placeholders})))")
                params.extend(picked_drugs * 2)

            if picked_services:
                placeholders = ','.join(['?'] * len(picked_services))
                picked_subqueries.append(f"EXISTS (SELECT 1 FROM xml3 x3 WHERE x3.ma_lk = x1.ma_lk AND (x3.ten_dich_vu IN ({placeholders}) OR x3.ma_dich_vu IN ({placeholders}) OR x3.ten_vat_tu IN ({placeholders})))")
                params.extend(picked_services * 3)

            if picked_groups:
                placeholders = ','.join(['?'] * len(picked_groups))
                picked_subqueries.append(f"(EXISTS (SELECT 1 FROM xml2 x2 WHERE x2.ma_lk = x1.ma_lk AND x2.ma_nhom IN ({placeholders})) OR EXISTS (SELECT 1 FROM xml3 x3 WHERE x3.ma_lk = x1.ma_lk AND x3.ma_nhom IN ({placeholders})))")
                params.extend(picked_groups * 2)

            if picked_subqueries:
                join_op = " AND " if match_mode == 'AND' else " OR "
                where_clauses.append(f"({join_op.join(picked_subqueries)})")

            # 3. Date Range
            if from_date or to_date:
                # In 3176, dates are stored like 202601110744... prefix is YYYYMMDD
                f_dt = f"{from_date}0000" if from_date else "190001010000"
                t_dt = f"{to_date}2359" if to_date else "210012312359"

                if date_criteria == 'NGAY_VAO':
                    where_clauses.append("substr(x1.ngay_vao, 1, 12) BETWEEN ? AND ?")
                    params.extend([f_dt, t_dt])
                elif date_criteria == 'NGAY_RA':
                    where_clauses.append("substr(x1.ngay_ra, 1, 12) BETWEEN ? AND ?")
                    params.extend([f_dt, t_dt])
                elif date_criteria == 'NGAY_TTOAN':
                    where_clauses.append("substr(x1.ngay_ttoan, 1, 12) BETWEEN ? AND ?")
                    params.extend([f_dt, t_dt])
                elif date_criteria == 'NGAY_YL':
                    where_clauses.append("""
                    (
                        EXISTS (SELECT 1 FROM xml2 x2 WHERE x2.ma_lk = x1.ma_lk AND substr(x2.ngay_yl, 1, 12) BETWEEN ? AND ?) OR
                        EXISTS (SELECT 1 FROM xml3 x3 WHERE x3.ma_lk = x1.ma_lk AND substr(x3.ngay_yl, 1, 12) BETWEEN ? AND ?)
                    )
                    """)
                    params.extend([f_dt, t_dt, f_dt, t_dt])
                elif date_criteria == 'NGAY_TH_YL':
                    where_clauses.append("""
                    (
                        EXISTS (SELECT 1 FROM xml2 x2 WHERE x2.ma_lk = x1.ma_lk AND substr(x2.ngay_th_yl, 1, 12) BETWEEN ? AND ?) OR
                        EXISTS (SELECT 1 FROM xml3 x3 WHERE x3.ma_lk = x1.ma_lk AND substr(x3.ngay_th_yl, 1, 12) BETWEEN ? AND ?)
                    )
                    """)
                    params.extend([f_dt, t_dt, f_dt, t_dt])
                elif date_criteria == 'NGAY_KQ':
                    where_clauses.append("EXISTS (SELECT 1 FROM xml3 x3 WHERE x3.ma_lk = x1.ma_lk AND substr(x3.ngay_kq, 1, 12) BETWEEN ? AND ?)")
                    params.extend([f_dt, t_dt])
                else: # ALL_DATES
                    where_clauses.append("""
                    (
                        substr(x1.ngay_vao, 1, 12) BETWEEN ? AND ? OR
                        substr(x1.ngay_ra, 1, 12) BETWEEN ? AND ? OR
                        EXISTS (SELECT 1 FROM xml2 x2 WHERE x2.ma_lk = x1.ma_lk AND (substr(x2.ngay_yl, 1, 12) BETWEEN ? AND ? OR substr(x2.ngay_th_yl, 1, 12) BETWEEN ? AND ?)) OR
                        EXISTS (SELECT 1 FROM xml3 x3 WHERE x3.ma_lk = x1.ma_lk AND (substr(x3.ngay_yl, 1, 12) BETWEEN ? AND ? OR substr(x3.ngay_th_yl, 1, 12) BETWEEN ? AND ? OR substr(x3.ngay_kq, 1, 12) BETWEEN ? AND ?))
                    )
                    """)
                    params.extend([f_dt, t_dt] * 7)

            # 4. Department
            if ma_khoa:
                where_clauses.append("x1.ma_khoa = ?")
                params.append(ma_khoa)

            # 5. Treatment Type
            if ma_loai_kcb:
                where_clauses.append("x1.ma_loai_kcb = ?")
                params.append(ma_loai_kcb)

            # 6. Has drugs / services
            if has_drugs_only:
                where_clauses.append("EXISTS (SELECT 1 FROM xml2 x2 WHERE x2.ma_lk = x1.ma_lk)")
            if has_services_only:
                where_clauses.append("EXISTS (SELECT 1 FROM xml3 x3 WHERE x3.ma_lk = x1.ma_lk)")

            # 7. Fast Column Criteria
            if ket_qua_dtri:
                where_clauses.append("json_extract(x1.raw_json, '$.KET_QUA_DTRI') = ?")
                params.append(ket_qua_dtri)
            if ma_loai_rv:
                where_clauses.append("json_extract(x1.raw_json, '$.MA_LOAI_RV') = ?")
                params.append(ma_loai_rv)
            if gioi_tinh:
                where_clauses.append("x1.gioi_tinh = ?")
                params.append(gioi_tinh)
            if dau_ma_the:
                where_clauses.append("x1.ma_the_bhyt LIKE ?")
                params.append(f"{dau_ma_the}%")
            if ma_may:
                where_clauses.append("EXISTS (SELECT 1 FROM xml3 x3 WHERE x3.ma_lk = x1.ma_lk AND x3.ma_may LIKE ?)")
                params.append(f"%{ma_may}%")
            if duong_dung:
                where_clauses.append("EXISTS (SELECT 1 FROM xml2 x2 WHERE x2.ma_lk = x1.ma_lk AND json_extract(x2.raw_json, '$.DUONG_DUNG') LIKE ?)")
                params.append(f"%{duong_dung}%")
            if min_cost is not None and min_cost != '':
                where_clauses.append("x1.t_tongchi_bv >= ?")
                params.append(float(min_cost))
            if max_cost is not None and max_cost != '':
                where_clauses.append("x1.t_tongchi_bv <= ?")
                params.append(float(max_cost))

            # 8. Dynamic Custom Column Rules
            for rule in custom_rules:
                tbl = rule.get('table', 'XML1')
                col = (rule.get('column') or '').strip().upper()
                op = rule.get('operator', 'CONTAINS')
                val = (rule.get('value') or '').strip()
                if not col:
                    continue

                if op == 'CONTAINS':
                    sql_op = "LIKE ?"
                    sql_val = f"%{val}%"
                elif op == 'EQUALS':
                    sql_op = "= ?"
                    sql_val = val
                elif op == 'STARTS_WITH':
                    sql_op = "LIKE ?"
                    sql_val = f"{val}%"
                elif op == 'GREATER_THAN':
                    sql_op = ">= ?"
                    sql_val = float(val) if val.replace('.', '', 1).isdigit() else val
                elif op == 'LESS_THAN':
                    sql_op = "<= ?"
                    sql_val = float(val) if val.replace('.', '', 1).isdigit() else val
                elif op == 'NOT_EMPTY':
                    sql_op = None
                    sql_val = None

                if tbl == 'XML1':
                    direct_cols = {'MA_LK', 'STT', 'MA_BN', 'HO_TEN', 'SO_CCCD', 'NGAY_SINH', 'GIOI_TINH', 'DIA_CHI', 'MA_THE_BHYT', 'MA_DKBD', 'CHAN_DOAN_VAO', 'CHAN_DOAN_RV', 'MA_BENH_CHINH', 'MA_BENH_KT', 'NGAY_VAO', 'NGAY_RA', 'NGAY_TTOAN', 'SO_NGAY_DTRI', 'T_TONGCHI_BV', 'T_TONGCHI_BH', 'T_BHTT', 'T_BNTT', 'T_THUOC', 'T_VTYT', 'MA_LOAI_KCB', 'MA_KHOA', 'MA_CSKCB', 'MA_HSBA'}
                    col_expr = f"x1.{col.lower()}" if col in direct_cols else f"json_extract(x1.raw_json, '$.{col}')"
                    if op == 'NOT_EMPTY':
                        where_clauses.append(f"{col_expr} IS NOT NULL AND length(trim({col_expr})) > 0")
                    else:
                        where_clauses.append(f"{col_expr} {sql_op}")
                        params.append(sql_val)
                elif tbl == 'XML2':
                    direct_cols = {'MA_LK', 'STT', 'MA_THUOC', 'MA_NHOM', 'TEN_THUOC', 'DON_VI_TINH', 'HAM_LUONG', 'SO_LUONG', 'DON_GIA', 'THANH_TIEN_BV', 'THANH_TIEN_BH', 'T_BHTT', 'T_BNTT', 'MA_KHOA', 'MA_BAC_SI', 'NGAY_YL', 'NGAY_TH_YL', 'TT_THAU'}
                    col_expr = f"x2.{col.lower()}" if col in direct_cols else f"json_extract(x2.raw_json, '$.{col}')"
                    if op == 'NOT_EMPTY':
                        where_clauses.append(f"EXISTS (SELECT 1 FROM xml2 x2 WHERE x2.ma_lk = x1.ma_lk AND {col_expr} IS NOT NULL AND length(trim({col_expr})) > 0)")
                    else:
                        where_clauses.append(f"EXISTS (SELECT 1 FROM xml2 x2 WHERE x2.ma_lk = x1.ma_lk AND {col_expr} {sql_op})")
                        params.append(sql_val)
                elif tbl == 'XML3':
                    direct_cols = {'MA_LK', 'STT', 'MA_DICH_VU', 'MA_VAT_TU', 'MA_NHOM', 'TEN_DICH_VU', 'TEN_VAT_TU', 'DON_VI_TINH', 'SO_LUONG', 'DON_GIA_BV', 'DON_GIA_BH', 'THANH_TIEN_BV', 'THANH_TIEN_BH', 'T_BHTT', 'T_BNTT', 'MA_KHOA', 'MA_BAC_SI', 'NGUOI_THUC_HIEN', 'MA_BENH', 'NGAY_YL', 'NGAY_TH_YL', 'NGAY_KQ', 'MA_MAY', 'TT_THAU'}
                    col_expr = f"x3.{col.lower()}" if col in direct_cols else f"json_extract(x3.raw_json, '$.{col}')"
                    if op == 'NOT_EMPTY':
                        where_clauses.append(f"EXISTS (SELECT 1 FROM xml3 x3 WHERE x3.ma_lk = x1.ma_lk AND {col_expr} IS NOT NULL AND length(trim({col_expr})) > 0)")
                    else:
                        where_clauses.append(f"EXISTS (SELECT 1 FROM xml3 x3 WHERE x3.ma_lk = x1.ma_lk AND {col_expr} {sql_op})")
                        params.append(sql_val)

            where_str = " AND ".join(where_clauses)

            # Count total matching
            count_sql = f"SELECT COUNT(*) FROM xml1 x1 WHERE {where_str}"
            cur.execute(count_sql, params)
            total_matched = cur.fetchone()[0]

            # Fetch page items
            offset = (page - 1) * page_size
            data_sql = f"""
            SELECT 
                x1.*,
                (SELECT COUNT(*) FROM xml2 x2 WHERE x2.ma_lk = x1.ma_lk) as xml2_count,
                (SELECT COUNT(*) FROM xml3 x3 WHERE x3.ma_lk = x1.ma_lk) as xml3_count
            FROM xml1 x1
            WHERE {where_str}
            ORDER BY x1.ma_lk DESC
            LIMIT ? OFFSET ?
            """
            cur.execute(data_sql, params + [page_size, offset])
            rows = [dict(r) for r in cur.fetchall()]

            # Format rows to match frontend DossierGroup schema
            formatted_items = []
            for r in rows:
                formatted_items.append({
                    "dossier": {
                        "maLk": r['ma_lk'],
                        "hoTen": r['ho_ten'],
                        "maBn": r['ma_bn'],
                        "soCccd": r['so_cccd'],
                        "maThe": r['ma_the_bhyt'],
                        "maBenhChinh": r['ma_benh_chinh'],
                        "tenBenhChinh": r['chan_doan_rv'] or r['chan_doan_vao'],
                        "ngayVao": r['ngay_vao'],
                        "ngayRa": r['ngay_ra'],
                        "tongChiBv": r['t_tongchi_bv'],
                        "tongBhtt": r['t_bhtt'],
                        "tongBntt": r['t_bntt'],
                        "maKhoa": r['ma_khoa'],
                        "maLoaiKcb": r['ma_loai_kcb'],
                        "xml1": r,
                        "xml2": [{"STT": 1}] * (r['xml2_count'] or 0), # placeholders for count
                        "xml3": [{"STT": 1}] * (r['xml3_count'] or 0),
                        "dates": {
                            "ngayVao": r['ngay_vao'],
                            "ngayRa": r['ngay_ra'],
                            "allNgayYl": [],
                            "allNgayThYl": [],
                            "allNgayKq": []
                        }
                    },
                    "matchedFields": []
                })

            return {
                "items": formatted_items,
                "totalMatched": total_matched,
                "page": page,
                "pageSize": page_size
            }

    def get_dossier_detail(self, ma_lk: str) -> Optional[Dict[str, Any]]:
        """
        Retrieves full XML1, XML2, XML3 records for a single dossier
        """
        import json
        with self.get_connection() as conn:
            cur = conn.cursor()
            cur.execute("SELECT raw_json FROM xml1 WHERE ma_lk = ?", (ma_lk,))
            row = cur.fetchone()
            if not row: return None
            x1 = json.loads(row[0]) if row[0] else {}

            cur.execute("SELECT raw_json FROM xml2 WHERE ma_lk = ? ORDER BY stt", (ma_lk,))
            x2_list = [json.loads(r[0]) for r in cur.fetchall() if r[0]]

            cur.execute("SELECT raw_json FROM xml3 WHERE ma_lk = ? ORDER BY stt", (ma_lk,))
            x3_list = [json.loads(r[0]) for r in cur.fetchall() if r[0]]

            return {
                "maLk": ma_lk,
                "hoTen": x1.get('HO_TEN', ''),
                "maBn": x1.get('MA_BN', ''),
                "soCccd": x1.get('SO_CCCD', ''),
                "maThe": x1.get('MA_THE_BHYT', x1.get('MA_THE', '')),
                "maBenhChinh": x1.get('MA_BENH_CHINH', ''),
                "tenBenhChinh": x1.get('CHAN_DOAN_RV', x1.get('CHAN_DOAN_VAO', '')),
                "ngayVao": x1.get('NGAY_VAO', ''),
                "ngayRa": x1.get('NGAY_RA', ''),
                "tongChiBv": float(x1.get('T_TONGCHI_BV') or 0),
                "tongBhtt": float(x1.get('T_BHTT') or 0),
                "tongBntt": float(x1.get('T_BNTT') or 0),
                "maKhoa": x1.get('MA_KHOA', ''),
                "maLoaiKcb": x1.get('MA_LOAI_KCB', ''),
                "xml1": x1,
                "xml2": x2_list,
                "xml3": x3_list,
                "dates": {
                    "ngayVao": x1.get('NGAY_VAO', ''),
                    "ngayRa": x1.get('NGAY_RA', ''),
                    "allNgayYl": [],
                    "allNgayThYl": [],
                    "allNgayKq": []
                }
            }

    def export_statistic_detail(self, stat_type: str, key_value: str, output_path: str) -> Dict[str, Any]:
        """
        'hỗ trợ xuất excel chi tiết ngay tại các bộ lọc thống kê (tức là hiển thị thống kê, click vào là cho phép xuất excel)'
        Directly exports matching dossiers or items into an Excel file
        """
        import json
        with self.get_connection() as conn:
            cur = conn.cursor()
            wb = xlsxwriter.Workbook(output_path, {'constant_memory': True})
            header_fmt = wb.add_format({'bold': True, 'bg_color': '#0d9488', 'font_color': '#ffffff', 'border': 1})
            data_fmt = wb.add_format({'border': 1})
            money_fmt = wb.add_format({'num_format': '#,##0', 'border': 1})

            if stat_type == 'ICD':
                # Export all dossiers matching this ICD
                cur.execute("SELECT raw_json FROM xml1 WHERE ma_benh_chinh = ? OR ma_benh_kt LIKE ?", (key_value, f"%{key_value}%"))
                ws = wb.add_worksheet(f"ICD_{key_value}"[:30])
                headers = ['MA_LK', 'MA_BN', 'HO_TEN', 'SO_CCCD', 'MA_BENH_CHINH', 'CHAN_DOAN_RV', 'NGAY_VAO', 'NGAY_RA', 'T_TONGCHI_BV', 'T_BHTT', 'MA_KHOA']
                for col_idx, h in enumerate(headers):
                    ws.write(0, col_idx, h, header_fmt)

                row_idx = 1
                for r in cur.fetchall():
                    d = json.loads(r[0])
                    for col_idx, h in enumerate(headers):
                        val = d.get(h, '')
                        if 'T_' in h:
                            ws.write_number(row_idx, col_idx, float(val or 0), money_fmt)
                        else:
                            ws.write(row_idx, col_idx, str(val or ''), data_fmt)
                    row_idx += 1

            elif stat_type == 'DRUG':
                # Export all XML2 rows of this drug
                cur.execute("""
                SELECT x2.raw_json, x1.ho_ten, x1.so_cccd
                FROM xml2 x2
                LEFT JOIN xml1 x1 ON x1.ma_lk = x2.ma_lk
                WHERE x2.ten_thuoc = ? OR x2.ma_thuoc = ?
                """, (key_value, key_value))
                ws = wb.add_worksheet("ChiTiet_Thuoc"[:30])
                headers = ['MA_LK', 'HO_TEN', 'SO_CCCD', 'MA_THUOC', 'TEN_THUOC', 'HAM_LUONG', 'DON_VI_TINH', 'SO_LUONG', 'DON_GIA', 'THANH_TIEN_BV', 'NGAY_YL', 'MA_BAC_SI', 'TT_THAU']
                for col_idx, h in enumerate(headers):
                    ws.write(0, col_idx, h, header_fmt)

                row_idx = 1
                for r in cur.fetchall():
                    d = json.loads(r[0])
                    d['HO_TEN'] = r[1]
                    d['SO_CCCD'] = r[2]
                    for col_idx, h in enumerate(headers):
                        val = d.get(h, '')
                        if h in ['SO_LUONG', 'DON_GIA', 'THANH_TIEN_BV']:
                            ws.write_number(row_idx, col_idx, float(val or 0), money_fmt)
                        else:
                            ws.write(row_idx, col_idx, str(val or ''), data_fmt)
                    row_idx += 1

            elif stat_type == 'SERVICE':
                # Export all XML3 rows of this service
                cur.execute("""
                SELECT x3.raw_json, x1.ho_ten, x1.so_cccd
                FROM xml3 x3
                LEFT JOIN xml1 x1 ON x1.ma_lk = x3.ma_lk
                WHERE x3.ten_dich_vu = ? OR x3.ma_dich_vu = ? OR x3.ten_vat_tu = ?
                """, (key_value, key_value, key_value))
                ws = wb.add_worksheet("ChiTiet_DVKT"[:30])
                headers = ['MA_LK', 'HO_TEN', 'SO_CCCD', 'MA_DICH_VU', 'TEN_DICH_VU', 'MA_NHOM', 'SO_LUONG', 'DON_GIA_BV', 'THANH_TIEN_BV', 'NGAY_YL', 'NGAY_TH_YL', 'NGAY_KQ', 'MA_MAY', 'NGUOI_THUC_HIEN']
                for col_idx, h in enumerate(headers):
                    ws.write(0, col_idx, h, header_fmt)

                row_idx = 1
                for r in cur.fetchall():
                    d = json.loads(r[0])
                    d['HO_TEN'] = r[1]
                    d['SO_CCCD'] = r[2]
                    for col_idx, h in enumerate(headers):
                        val = d.get(h, '')
                        if h in ['SO_LUONG', 'DON_GIA_BV', 'THANH_TIEN_BV']:
                            ws.write_number(row_idx, col_idx, float(val or 0), money_fmt)
                        else:
                            ws.write(row_idx, col_idx, str(val or ''), data_fmt)
                    row_idx += 1

            elif stat_type == 'DEPARTMENT':
                # Export all dossiers in this department
                cur.execute("SELECT raw_json FROM xml1 WHERE ma_khoa = ?", (key_value,))
                ws = wb.add_worksheet(f"Khoa_{key_value}"[:30])
                headers = ['MA_LK', 'MA_BN', 'HO_TEN', 'SO_CCCD', 'MA_BENH_CHINH', 'CHAN_DOAN_RV', 'NGAY_VAO', 'NGAY_RA', 'T_TONGCHI_BV', 'T_BHTT', 'MA_KHOA']
                for col_idx, h in enumerate(headers):
                    ws.write(0, col_idx, h, header_fmt)

                row_idx = 1
                for r in cur.fetchall():
                    d = json.loads(r[0])
                    for col_idx, h in enumerate(headers):
                        val = d.get(h, '')
                        if 'T_' in h:
                            ws.write_number(row_idx, col_idx, float(val or 0), money_fmt)
                        else:
                            ws.write(row_idx, col_idx, str(val or ''), data_fmt)
                    row_idx += 1

            wb.close()
            return {"success": True, "filePath": output_path, "rowCount": row_idx - 1}
