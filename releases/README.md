# NsN XML DataHub 3176 Releases

Thư mục chứa các bản phát hành đóng gói của ứng dụng **NsN XML DataHub 3176**.

## Tải bộ cài đặt Windows Setup (.exe)
- Phiên bản mới nhất: **v1.0.0**
- Tải trực tiếp tại: [GitHub Releases](https://github.com/Nsnnam/xml-3176-data-hub/releases)
- Tệp cài đặt: `NsN_XML_DataHub_3176_Setup_v1.0.0.exe`

## Cách tự đóng gói (Build Setup Installer từ mã nguồn)
Yêu cầu:
1. Python 3.10+ (đã cài đặt `pyinstaller`, `pywebview`, `fastapi`, `uvicorn`, `openpyxl`, `xlsxwriter`).
2. [Inno Setup 6](https://jrsoftware.org/isdl.php) (công cụ đóng gói Windows Setup tiêu chuẩn).

Chạy lệnh tự động hóa:
```bash
python scripts/build_desktop.py
```
Sau khi hoàn tất, file setup sẽ được tạo tại `releases/setup/NsN_XML_DataHub_3176_Setup_v1.0.0.exe`.
