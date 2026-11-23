# NsN XML DataHub 3176

[![Deploy to GitHub Pages](https://github.com/Nsnnam/xml-3176-data-hub/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/Nsnnam/xml-3176-data-hub/actions/workflows/deploy-pages.yml)
[![Version](https://img.shields.io/badge/version-1.1.0-teal.svg)](https://github.com/Nsnnam/xml-3176-data-hub)
[![Platform](https://img.shields.io/badge/platform-Windows%20Setup%20EXE%20%7C%20Web-blue.svg)](https://github.com/Nsnnam/xml-3176-data-hub/releases)
[![Author](https://img.shields.io/badge/author-Nguy%E1%BB%85n%20S%C6%A1n%20Nam%20(Nsnnam)-0ea5e9.svg)](https://github.com/Nsnnam)
[![License](https://img.shields.io/badge/license-MIT-slate.svg)](LICENSE)

> **NsN XML DataHub 3176** là giải pháp toàn diện hỗ trợ nạp, phân tích tự động, tìm kiếm toàn năng, trích lọc chuyên sâu theo từng cột XML và xuất Excel dữ liệu hồ sơ khám chữa bệnh BHYT bảng 1, 2, 3 (**XML1, XML2, XML3**) định dạng Excel theo chuẩn **Quyết định 3176/QĐ-BYT**.
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

## 🌟 Điểm Nổi Bật & Tính Năng Mới Nhất

### 1. Nạp & Quản Lý File Đầu Vào — Xóa Lần Lượt hoặc Xóa Tất Cả File
- Hỗ trợ nạp trực tiếp các file Excel `.xlsx`, `.xls` xuất từ các hệ thống HIS, LIS, PACS hoặc Cổng tiếp nhận BHYT.
- **Tự động nhận diện** bảng XML1 (Tổng hợp KCB), XML2 (Thuốc), XML3 (DVKT & VTYT) dựa trên cấu trúc các cột đặc trưng và tên file.
- **Quản lý danh sách file đầu vào linh hoạt**:
  - Giao diện bảng danh sách file chi tiết (Tên file, loại bảng, số dòng, dung lượng, thời gian nạp).
  - **Xóa lần lượt từng file**: Bấm nút xóa bên cạnh file bất kỳ, hệ thống sẽ tự động gỡ bỏ bản ghi của file đó và tính toán lại toàn bộ dữ liệu & thống kê ngay lập tức.
  - **Xóa tất cả file (Clear All Files)**: Cho phép làm sạch toàn bộ cơ sở dữ liệu chỉ với 1 cú click.

### 2. Tìm Kiếm Nhanh Theo Từng Cột XML (Column-Specific Search)
- Thanh tìm kiếm tích hợp dropdown lựa chọn cột mục tiêu:
  - `🔍 Tất cả các cột (Toàn văn)`
  - **XML1**: `MA_LK`, `MA_BN`, `HO_TEN`, `SO_CCCD`, `MA_THE_BHYT`, `MA_BENH_CHINH`, `MA_BENH_KT`, `CHAN_DOAN_RV`, `MA_KHOA`, `MA_DKBD`, `MA_CSKCB`, `MA_HSBA`, `DIA_CHI`...
  - **XML2**: `TEN_THUOC`, `MA_THUOC`, `HAM_LUONG`, `DUONG_DUNG`, `SO_DANG_KY`, `TT_THAU`, `MA_BAC_SI`...
  - **XML3**: `TEN_DICH_VU`, `MA_DICH_VU`, `MA_MAY`, `NGUOI_THUC_HIEN`, `TEN_VAT_TU`, `MA_VAT_TU`, `MA_GIUONG`, `TT_THAU`, `SOPHIEU`...
- Kết hợp hoàn hảo với nút **`🎯 Tìm chính xác`**: Cho phép tìm chính xác 100% theo cột chỉ định hoặc tìm kiếm tương đối không phân biệt dấu tiếng Việt.

### 3. Bộ Lọc Chuyên Sâu Từng Cột XML & Quy Tắc Tùy Biến (Custom Column Rules)
- **Điều kiện lọc nhanh đặc thù**:
  - **Kết quả điều trị (`KET_QUA_DTRI`)**: Khỏi bệnh, Đỡ/giảm, Không thay đổi, Nặng hơn, Tử vong.
  - **Tình trạng ra viện (`MA_LOAI_RV`)**: Ra viện, Chuyển viện, Trốn viện, Xin về.
  - **Giới tính (`GIOI_TINH`)**: Nam, Nữ.
  - **Đầu mã đối tượng thẻ BHYT**: Chọn nhanh các nhóm đối tượng (TE - Trẻ em < 6 tuổi, GD - Hộ gia đình, DN - Doanh nghiệp, CA - Công an, QN - Quân đội, HT - Hưu trí, CN - Cận nghèo, HN - Hộ nghèo, CC - Người có công...) hoặc gõ đầu mã bất kỳ.
  - **Mã máy thực hiện (`MA_MAY`)**: Lọc theo máy xét nghiệm, CĐHA, nội soi...
  - **Đường dùng thuốc (`DUONG_DUNG`)**: Uống, Tiêm bắp, Tiêm tĩnh mạch, Truyền, Đặt...
  - **Khoảng Viện phí (`T_TONGCHI_BV`)**: Lọc theo số tiền từ ... đến ... VNĐ.
- **Trình dựng quy tắc lọc cột tùy biến không giới hạn (Custom Column Rules)**:
  - Cho phép người dùng thêm nhiều dòng điều kiện lọc trên toàn bộ **65 cột XML1**, **43 cột XML2**, và **51 cột XML3**.
  - Đầy đủ toán tử: `Chứa (CONTAINS)`, `Bằng chính xác (=)`, `Bắt đầu bằng`, `Lớn hơn (>=)`, `Nhỏ hơn (<=)`, `Có dữ liệu (NOT_EMPTY)`.

### 4. Quản Lý Điều Kiện Lọc — Xóa Lần Lượt hoặc Xóa Tất Cả Bộ Lọc
- Thanh nhãn **"Các điều kiện đang lọc" (Active Filters Bar)** hiển thị trực quan toàn bộ điều kiện đang được kích hoạt:
  - Từ khóa tìm kiếm & Cột tìm kiếm
  - Khoảng thời gian & Mốc thời gian
  - Khoa điều trị, Loại KCB, Bộ lọc có thuốc/DVKT
  - Các mục đã nhặt (Nhóm, ICD, Thuốc, DVKT)
  - Các điều kiện cột chuyên sâu và từng quy tắc tùy biến
- **Xóa lần lượt từng điều kiện**: Bấm dấu **`×`** trên bất kỳ nhãn nào để hủy riêng điều kiện đó mà không ảnh hưởng đến các điều kiện khác.
- **Xóa tất cả bộ lọc**: Bấm nút **`Xóa Tất Cả Bộ Lọc`** màu đỏ để đưa toàn bộ hệ thống về trạng thái ban đầu chỉ với 1 cú click.

### 5. Bộ Lọc Đa Lựa Chọn ("Nhặt" Thông Tin Đầu Vào)
- **Nhặt Mã Nhóm**: Danh sách tất cả mã nhóm thuốc (XML2) và nhóm dịch vụ kỹ thuật (XML3) kèm số lượng bản ghi tương ứng.
- **Nhặt Mã Bệnh ICD-10**: Toàn bộ mã bệnh chính, mã bệnh kèm theo từ XML1 và XML3.
- **Nhặt Thuốc & Dược liệu**: Tên thuốc, mã hoạt chất, nồng độ/hàm lượng từ XML2.
- **Nhặt Dịch vụ kỹ thuật**: Tên dịch vụ kỹ thuật, mã DVKT, vật tư y tế từ XML3.
- Tùy chọn logic kết hợp: **VÀ (AND)** hoặc **HOẶC (OR)** giữa các nhóm điều kiện.

### 6. Xuất Excel 1-Click Ngay Tại Các Bảng Thống Kê
- Bảng điều khiển phân tích hiển thị trực quan: Top mã bệnh ICD-10, Top Thuốc, Top Dịch vụ kỹ thuật và Top Khoa phòng phát sinh nhiều nhất.
- Nút **`[📥 Xuất]`** trực tiếp tại mỗi dòng thống kê để tải ngay file Excel chi tiết danh sách tất cả bệnh nhân và dịch vụ/thuốc liên quan đến chỉ số đó.

### 7. Xuất Dữ Liệu Sau Lọc Ra Excel Chuẩn QĐ 3176
- **Xuất Bảng 1 (XML1)**: Chuẩn đầy đủ **65 cột** nghiệp vụ theo QĐ 3176/QĐ-BYT.
- **Xuất Bảng 2 (XML2)**: Chuẩn đầy đủ **43 cột** chi tiết thuốc theo QĐ 3176/QĐ-BYT.
- **Xuất Bảng 3 (XML3)**: Chuẩn đầy đủ **51 cột** dịch vụ kỹ thuật, thời gian và mã máy.
- **Xuất Trọn Bộ 3 Bảng**: Tạo 1 file Excel duy nhất gồm 3 Sheet riêng biệt (`XML1`, `XML2`, `XML3`) chứa trọn vẹn dữ liệu các hồ sơ đã lọc.

### 8. Khóa Bảo Mật Hàng Ngày ("namns")
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
