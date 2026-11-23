# NsN XML DataHub 3176

[![Deploy to GitHub Pages](https://github.com/Nsnnam/xml-3176-data-hub/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/Nsnnam/xml-3176-data-hub/actions/workflows/deploy-pages.yml)
[![Version](https://img.shields.io/badge/version-1.0.0-teal.svg)](https://github.com/Nsnnam/xml-3176-data-hub)
[![Platform](https://img.shields.io/badge/platform-Windows%20Setup%20EXE%20%7C%20Web-blue.svg)](https://github.com/Nsnnam/xml-3176-data-hub/releases)
[![Author](https://img.shields.io/badge/author-Nguy%E1%BB%85n%20S%C6%A1n%20Nam%20(Nsnnam)-0ea5e9.svg)](https://github.com/Nsnnam)
[![License](https://img.shields.io/badge/license-MIT-slate.svg)](LICENSE)

> **NsN XML DataHub 3176** là giải pháp toàn diện hỗ trợ nạp, phân tích tự động, tìm kiếm toàn năng, trích lọc chuyên sâu và xuất Excel dữ liệu hồ sơ khám chữa bệnh BHYT bảng 1, 2, 3 (**XML1, XML2, XML3**) định dạng Excel theo chuẩn **Quyết định 3176/QĐ-BYT**.
>
> Hỗ trợ **cả hai phương thức**:
> 1. 🖥️ **Ứng dụng Cài đặt Windows Desktop (Setup EXE)**: Sử dụng động cơ cơ sở dữ liệu nhúng **SQLite WAL + Streaming Parser**, tối ưu cho tập dữ liệu cực lớn, import hàng chục file cùng lúc mà không lo tràn bộ nhớ (RAM).
> 2. 🌐 **Ứng dụng Trực tuyến (Web Browser)**: Chạy trực tiếp trên trình duyệt, không cần cài đặt.

---

## 📥 Tải về Bộ Cài đặt Desktop (Khuyên Dùng Cho Dữ Liệu Lớn)

Khi dữ liệu Excel có kích thước lớn hoặc cần nạp nhiều đợt dữ liệu KCB cùng lúc, việc sử dụng trình duyệt web có thể bị giới hạn bộ nhớ RAM V8 JavaScript. **NsN XML DataHub 3176 Desktop** được thiết kế chuyên biệt để giải quyết triệt để vấn đề này:

👉 **[⬇️ Tải NsN_XML_DataHub_3176_Setup_v1.0.0.exe (35 MB)](https://github.com/Nsnnam/xml-3176-data-hub/releases/download/v1.0.0/NsN_XML_DataHub_3176_Setup_v1.0.0.exe)**

- **Đóng gói dạng Setup chuẩn Windows** (Inno Setup 6): Cài đặt nhanh chóng chỉ với vài cú nhấp chuột, tự tạo shortcut Desktop & Start Menu.
- **Không dùng trình duyệt**: Cửa sổ ứng dụng native độc lập (WebView2), giao diện mượt mà, không thanh địa chỉ, không lag giật.
- **Xử lý dữ liệu lớn không tràn RAM**: Sử dụng cơ chế đọc file Excel dạng luồng (`streaming generator`), lưu trữ và lập chỉ mục (indexing) trên SQLite nhúng cục bộ.
- **Bảo mật tuyệt đối**: Dữ liệu chạy 100% offline nội bộ trên máy trạm của bạn, không gửi bất kỳ thông tin nào ra ngoài.

Ứng dụng trực tuyến (cho tệp vừa và nhỏ): **[https://nsnnam.github.io/xml-3176-data-hub/](https://nsnnam.github.io/xml-3176-data-hub/)**

---

## 🌟 Điểm Nổi Bật & Tính Năng Chuyên Sâu

### 1. Nạp Dữ Liệu Excel Tự Động — Không Cần File Mẫu
- Hỗ trợ nạp trực tiếp các file Excel `.xlsx`, `.xls` xuất từ các hệ thống Quản lý bệnh viện (HIS), LIS, PACS hoặc Cổng tiếp nhận BHYT.
- **Tự động nhận diện** bảng XML1 (Tổng hợp KCB), XML2 (Thuốc & Dược liệu), XML3 (Dịch vụ kỹ thuật & VTYT) dựa trên cấu trúc các cột đặc trưng và tên file.
- Cho phép chọn hàng loạt file cùng lúc qua hộp thoại Windows Native Dialog hoặc kéo thả linh hoạt.

### 2. Bộ Lọc Đa Lựa Chọn ("Nhặt" Thông Tin Đầu Vào)
Hệ thống tích hợp bảng chọn nhiều giá trị thông minh cho phép người dùng **"nhặt" chính xác** các điều kiện đầu vào từ chính dữ liệu đã nạp:
- **Nhặt Mã Nhóm**: Danh sách tất cả mã nhóm thuốc (XML2) và nhóm dịch vụ kỹ thuật (XML3) kèm số lượng bản ghi tương ứng.
- **Nhặt Mã Bệnh ICD-10**: Toàn bộ mã bệnh chính, mã bệnh kèm theo từ XML1 và XML3.
- **Nhặt Thuốc & Dược liệu**: Tên thuốc, mã hoạt chất, nồng độ/hàm lượng từ XML2.
- **Nhặt Dịch vụ kỹ thuật**: Tên dịch vụ kỹ thuật, mã DVKT, vật tư y tế từ XML3.
- Hỗ trợ công cụ tìm kiếm nhanh trong bảng chọn, nút "Chọn tất cả", "Bỏ chọn" và tùy chọn logic kết hợp: **VÀ (AND)** hoặc **HOẶC (OR)** giữa các nhóm điều kiện.

### 3. Chế Độ Tìm Kiếm Toàn Năng & "Tìm Chính Xác" (Exact Match)
- **Tìm kiếm đa năng**: Tìm kiếm theo bất kỳ từ khóa nào trên toàn bộ 3 bảng dữ liệu (Họ tên, Mã LK, Mã BN, Mã HSBA, CCCD, Mã BHYT, Khoa điều trị, Bác sĩ, Số thầu, Mã máy...).
- **🎯 Tùy chọn Tìm chính xác**: Cho phép chuyển đổi linh hoạt giữa tìm tương đối và tìm chính xác 100% theo từ khóa gõ vào (rất hữu ích khi tìm kiếm đúng mã thẻ, đúng mã bệnh hoặc đúng mã hồ sơ).

### 4. Xuất Excel 1-Click Ngay Tại Các Bảng Thống Kê
- Bảng điều khiển phân tích hiển thị trực quan: Top mã bệnh ICD-10, Top Thuốc, Top Dịch vụ kỹ thuật và Top Khoa phòng phát sinh nhiều nhất.
- Tích hợp sẵn nút **`[📥 Xuất]`** trực tiếp tại mỗi dòng thống kê: Chỉ cần 1 cú nhấp chuột là có thể tải ngay file Excel chi tiết danh sách tất cả bệnh nhân và dịch vụ/thuốc liên quan đến chỉ số đó.

### 5. Lọc Khoảng Thời Gian Linh Hoạt Đa Mốc
Lọc hồ sơ theo bất kỳ mốc thời gian nào theo yêu cầu nghiệp vụ giám định:
- **`NGAY_VAO`**: Ngày vào viện (Bảng 1).
- **`NGAY_RA`**: Ngày ra viện (Bảng 1).
- **`NGAY_YL`**: Ngày y lệnh (Bảng 2 Thuốc hoặc Bảng 3 DVKT).
- **`NGAY_TH_YL`**: Ngày thực hiện y lệnh.
- **`NGAY_KQ`**: Ngày trả kết quả (Bảng 3).
- **`NGAY_TTOAN`**: Ngày thanh toán (Bảng 1).
- **Bất kỳ mốc nào**: Khớp nếu hồ sơ có bất kỳ sự kiện nào trong khoảng thời gian chọn.
- Các nút chọn nhanh: *Hôm nay, 7 ngày qua, 30 ngày qua, Tháng này, Tháng trước, Cả năm*.

### 6. Xuất Dữ Liệu Sau Lọc Ra Excel Chuẩn QĐ 3176
- **Xuất Bảng 1 (XML1)**: Chuẩn đầy đủ **65 cột** nghiệp vụ theo QĐ 3176/QĐ-BYT.
- **Xuất Bảng 2 (XML2)**: Chuẩn đầy đủ **43 cột** chi tiết thuốc theo QĐ 3176/QĐ-BYT.
- **Xuất Bảng 3 (XML3)**: Chuẩn đầy đủ **51 cột** dịch vụ kỹ thuật, thời gian và mã máy.
- **Xuất Trọn Bộ 3 Bảng**: Tạo 1 file Excel duy nhất gồm 3 Sheet riêng biệt (`XML1`, `XML2`, `XML3`) chứa trọn vẹn dữ liệu các hồ sơ đã lọc.

### 7. Khóa Bảo Mật Hàng Ngày ("namns")
- Tích hợp lớp bảo vệ: Nhập mã mở khóa **`namns`** 1 lần mỗi ngày để bắt đầu phiên làm việc.
- Hết ngày hệ thống tự động yêu cầu xác thực lại để bảo vệ thông tin.
- Có nút "Khóa nhanh" trên thanh điều hướng khi rời máy tính.

---

## 📋 Cấu Trúc Các Bảng Dữ Liệu Chuẩn QĐ 3176

| Bảng XML | Tên bảng | Số cột | Khóa liên kết |
| :--- | :--- | :---: | :--- |
| **XML1** | Tổng hợp khám chữa bệnh | **65 cột** | `MA_LK` (Mã liên kết hồ sơ) |
| **XML2** | Chi tiết thuốc, dược liệu | **43 cột** | `MA_LK`, liên kết ngày `NGAY_YL`, `NGAY_TH_YL` |
| **XML3** | Chi tiết dịch vụ kỹ thuật, VTYT | **51 cột** | `MA_LK`, liên kết ngày `NGAY_YL`, `NGAY_TH_YL`, `NGAY_KQ` |

---

## 🛠️ Hướng Dẫn Tự Đóng Gói Bộ Cài Đặt Desktop

Nếu bạn muốn tùy biến hoặc tự build lại file `.exe` cài đặt từ mã nguồn:

### Yêu cầu môi trường:
1. **Python 3.10+** (đã cài đặt các thư viện cần thiết):
   ```bash
   pip install pyinstaller pywebview fastapi uvicorn openpyxl xlsxwriter
   ```
2. **Node.js 18+** & **npm**.
3. **[Inno Setup 6](https://jrsoftware.org/isdl.php)** (cài đặt tại đường dẫn mặc định trên Windows).

### Tiến hành build tự động:
```bash
# 1. Clone repo và cài đặt thư viện web
git clone https://github.com/Nsnnam/xml-3176-data-hub.git
cd xml-3176-data-hub
npm install

# 2. Chạy kịch bản đóng gói tự động hóa (build Vite + PyInstaller + Inno Setup)
python scripts/build_desktop.py
```

Bộ cài đặt hoàn chỉnh sẽ xuất hiện tại thư mục:
`releases/setup/NsN_XML_DataHub_3176_Setup_v1.0.0.exe`.

---

## 👨‍💻 Tác giả & Bản quyền

- Tác giả: **Nguyễn Sơn Nam (Nsnnam)**
- GitHub: [https://github.com/Nsnnam](https://github.com/Nsnnam)
- Phát hành theo giấy phép mã nguồn mở MIT.
