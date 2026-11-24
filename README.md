# NsN XML DataHub 3176

[![Deploy to GitHub Pages](https://github.com/Nsnnam/xml-3176-data-hub/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/Nsnnam/xml-3176-data-hub/actions/workflows/deploy-pages.yml)
[![Version](https://img.shields.io/badge/version-1.1.0-teal.svg)](https://github.com/Nsnnam/xml-3176-data-hub)
[![Platform](https://img.shields.io/badge/platform-Windows%20Setup%20EXE%20%7C%20Web-blue.svg)](https://github.com/Nsnnam/xml-3176-data-hub/releases)
[![Author](https://img.shields.io/badge/author-Nguy%E1%BB%85n%20S%C6%A1n%20Nam%20(Nsnnam)-0ea5e9.svg)](https://github.com/Nsnnam)
[![License](https://img.shields.io/badge/license-MIT-slate.svg)](LICENSE)

> **NsN XML DataHub 3176** là giải pháp toàn diện hỗ trợ nạp, phân tích tự động, tìm kiếm toàn năng, trích lọc chuyên sâu theo từng cột XML và xuất Excel dữ liệu hồ sơ khám chữa bệnh BHYT bảng 1, 2, 3 (**XML1, XML2, XML3**) định dạng Excel và cả gói XML chuẩn **Quyết định 3176/QĐ-BYT** (15 bảng).
>
> Hỗ trợ **cả hai phương thức**:
> 1. 🖥️ **Ứng dụng Cài đặt Windows Desktop (Setup EXE)**: Sử dụng động cơ cơ sở dữ liệu nhúng **SQLite WAL + Streaming Parser**, tối ưu cho tập dữ liệu cực lớn, import hàng chục file cùng lúc mà không lo tràn bộ nhớ (RAM).
> 2. 🌐 **Ứng dụng Trực tuyến (Web Browser)**: Chạy trực tiếp trên trình duyệt, không cần cài đặt.

---

## 📥 Tải về Bộ Cài đặt Desktop (Khuyên Dùng Cho Dữ Liệu Lớn)

Khi dữ liệu Excel hoặc XML có kích thước lớn hoặc cần nạp nhiều đợt dữ liệu KCB cùng lúc, việc sử dụng trình duyệt web có thể bị giới hạn bộ nhớ RAM V8 JavaScript. **NsN XML DataHub 3176 Desktop** được thiết kế chuyên biệt để giải quyết triệt để vấn đề này:

👉 **[⬇️ Tải NsN_XML_DataHub_3176_Setup_v1.1.0.exe (Bản Mới Nhất)](https://github.com/Nsnnam/xml-3176-data-hub/releases/download/v1.1.0/NsN_XML_DataHub_3176_Setup_v1.1.0.exe)**

- **Icon ứng dụng y tế chuyên nghiệp**: Thiết kế vector khiên bảo vệ y tế sắc nét, nhận diện chuyên nghiệp trên Windows Desktop, Start Menu và thanh tác vụ Taskbar.
- **Đóng gói dạng Setup chuẩn Windows** (Inno Setup 6): Cài đặt nhanh chóng chỉ với vài cú nhấp chuột, tự tạo shortcut Desktop & Start Menu.
- **Không dùng trình duyệt**: Cửa sổ ứng dụng native độc lập (WebView2), giao diện mượt mà, không thanh địa chỉ, không lag giật.
- **Xử lý dữ liệu lớn không tràn RAM**: Đọc luồng `streaming generator` và `iterparse`, lưu trữ và lập chỉ mục trên SQLite nhúng cục bộ.
- **Bảo mật tuyệt đối**: Dữ liệu chạy 100% offline nội bộ trên máy trạm của bạn, không gửi bất kỳ thông tin nào ra ngoài.

Ứng dụng trực tuyến (cho tệp vừa và nhỏ): **[https://nsnnam.github.io/xml-3176-data-hub/](https://nsnnam.github.io/xml-3176-data-hub/)**

---

## 🌟 Điểm Nổi Bật & Tính Năng Mới Trên Phiên Bản v1.1.0

### 🏥 1. Hệ Thống 3 Giao Diện Đẳng Cấp & Font Be Vietnam Pro
- **Giao diện Y tế (Medical Navy/Cyan)**: Tông màu xanh biển đậm kết hợp viền ngọc y tế, tạo cảm giác tin cậy, chuyên sâu và dịu mắt khi làm việc lâu.
- **Giao diện Đen (Midnight Dark)**: Nền đen tuyền công nghệ cao, độ tương phản sắc nét, giảm thiểu tối đa ánh sáng xanh.
- **Giao diện Trắng (Hospital Clean White)**: Tông màu trắng thanh lịch phong cách bệnh viện hiện đại, sắc thái chữ than chì dễ đọc dưới ánh sáng mạnh.
- Tích hợp chuẩn phông chữ quốc gia **Be Vietnam Pro** với đầy đủ các trọng số font tối ưu hiển thị tiếng Việt y khoa không lỗi chân chữ.
- Chuẩn hóa toàn bộ mảng màu của font, màu chữ, nền thẻ card, bảng biểu và viền border theo từng giao diện đảm bảo tính thẩm mỹ, độ tương phản cao, không bị lóa hoặc chìm màu.

### 📊 2. Khám Phá Chi Tiết Thông Tin Chung & Xuất Excel (KPI Drill-Down)
- 4 thẻ KPI tổng quan (Hồ sơ KCB, Tổng viện phí, Thuốc XML2, DVKT & VTYT XML3) hỗ trợ **nhấp chuột trực tiếp** để mở hộp thoại phân tích chi tiết:
  - **Hồ Sơ KCB**: Bảng danh sách bệnh nhân chi tiết, lọc tìm kiếm tức thì, xem chi tiết từng ca và xuất Excel danh sách hồ sơ.
  - **Tổng Viện Phí**: Thống kê cơ cấu viện phí phân bổ theo từng khoa phòng điều trị (Tổng chi BV, BHYT thanh toán, Bệnh nhân trả, Tỷ lệ BHYT).
  - **Thuốc (XML2)**: Tổng hợp toàn bộ danh mục thuốc kê đơn trong kỳ, số lượt kê, tổng số lượng và tổng chi phí.
  - **DVKT & VTYT (XML3)**: Bảng chi tiết toàn bộ kỹ thuật xét nghiệm, CĐHA, vật tư tiêu hao xếp theo chi phí.
- Tích hợp nút **[📥 Xuất Excel]** chuyên dụng ngay trong từng modal để tải báo cáo phân tích phục vụ đối soát BHYT.

### 📥 3. Hỗ Trợ Nạp Trực Tiếp Gói XML Mã Hóa Theo Quyết Định 3176 (15 Bảng)
- Động cơ nạp dữ liệu thông minh hỗ trợ đọc trực tiếp tệp XML gói hồ sơ gửi Cổng giám định BHYT theo chuẩn Quyết định 3176/QĐ-BYT:
  - Tự động bóc tách và giải mã các bảng XML1 đến XML15, hỗ trợ nội dung nén mã hóa **Base64** trong thẻ `<NOIDUNGFILE>` hoặc XML trực tiếp.
  - Tự động phân loại, trích xuất dữ liệu XML1 (`<TONG_HOP>`), XML2 (`<CHI_TIET_THUOC>`), XML3 (`<CHI_TIET_DVKT>`) nạp thẳng vào cơ sở dữ liệu.
  - Tốc độ xử lý siêu tốc: Nạp tệp XML dung lượng lớn chỉ mất vài phần trăm giây với thuật toán đọc luồng `iterparse` không tốn RAM.
- **Sửa triệt để lỗi giao diện thẻ Import**: Thiết kế lại layout dạng lưới 2 cột chia 3 hàng rõ ràng, ngắt chuỗi tự động chống lồng chữ hoặc đè chữ khi nạp nhiều file cùng lúc.

### 🎯 4. Nhặt Thông Tin Lọc Mã BN & Cài Đặt Cấu Hình Bộ Lọc Nhanh
- Bổ sung bộ lọc **Nhặt Mã BN (`MA_BN`)** kèm tên bệnh nhân và số lượt khám.
- Bổ sung nút **`[⚙️ Cài đặt]`** cấu hình bộ lọc thông tin nhanh:
  - Cho phép người dùng chủ động **bật/tắt** hiển thị 9 loại bộ lọc theo nhu cầu công việc:
    1. Mã nhóm (Thuốc XML2 & DVKT XML3)
    2. Mã bệnh ICD-10
    3. Thuốc & Biệt dược (XML2)
    4. Dịch vụ kỹ thuật & VTYT (XML3)
    5. Mã bệnh nhân (`MA_BN`)
    6. Khoa điều trị (`MA_KHOA`)
    7. Số thẻ BHYT (`MA_THE_BHYT`)
    8. Bác sĩ / Người thực hiện (`NGUOI_THUC_HIEN`)
    9. Mã máy thực hiện (`MA_MAY`)
  - Cho phép tùy chỉnh **đổi tên hiển thị** của từng nút bộ lọc theo thói quen sử dụng của từng bệnh viện/phòng khám.
  - Khôi phục cấu hình mặc định chỉ với 1 cú click.

### 🔍 5. Tìm Kiếm Nhanh Theo Từng Cột XML & Tìm Chính Xác
- Thanh tìm kiếm tích hợp dropdown lựa chọn cột mục tiêu:
  - `🔍 Tất cả các cột (Toàn văn)`
  - **XML1**: `MA_LK`, `MA_BN`, `HO_TEN`, `SO_CCCD`, `MA_THE_BHYT`, `MA_BENH_CHINH`, `MA_BENH_KT`, `CHAN_DOAN_RV`, `MA_KHOA`, `MA_DKBD`, `MA_CSKCB`, `MA_HSBA`, `DIA_CHI`...
  - **XML2**: `TEN_THUOC`, `MA_THUOC`, `HAM_LUONG`, `DUONG_DUNG`, `SO_DANG_KY`, `TT_THAU`, `MA_BAC_SI`...
  - **XML3**: `TEN_DICH_VU`, `MA_DICH_VU`, `MA_MAY`, `NGUOI_THUC_HIEN`, `TEN_VAT_TU`, `MA_VAT_TU`, `MA_GIUONG`, `TT_THAU`, `SOPHIEU`...
- Nút **`🎯 Tìm chính xác`**: Tìm chính xác 100% theo cột chỉ định hoặc tìm kiếm tương đối không phân biệt dấu tiếng Việt.

### 📑 6. Xuất Dữ Liệu Sau Lọc Ra Excel Chuẩn QĐ 3176
- **Xuất Bảng 1 (XML1)**: Chuẩn đầy đủ **65 cột** nghiệp vụ theo QĐ 3176/QĐ-BYT.
- **Xuất Bảng 2 (XML2)**: Chuẩn đầy đủ **43 cột** chi tiết thuốc theo QĐ 3176/QĐ-BYT.
- **Xuất Bảng 3 (XML3)**: Chuẩn đầy đủ **51 cột** dịch vụ kỹ thuật, thời gian và mã máy.
- **Xuất Trọn Bộ 3 Bảng**: Tạo 1 file Excel duy nhất gồm 3 Sheet riêng biệt (`XML1`, `XML2`, `XML3`) chứa trọn vẹn dữ liệu các hồ sơ đã lọc.

### 🔒 7. Khóa Bảo Mật Hàng Ngày ("namns")
- Tích hợp lớp bảo vệ: Nhập mã mở khóa **`namns`** 1 lần mỗi ngày để bắt đầu phiên làm việc.
- Hết ngày hệ thống tự động yêu cầu xác thực lại để bảo vệ thông tin bệnh án.
- Nút "Khóa nhanh" trên thanh điều hướng khi rời máy tính.

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
`releases/setup/NsN_XML_DataHub_3176_Setup_v1.1.0.exe`.

---

## 👨‍💻 Tác giả & Bản quyền

- Tác giả: **Nguyễn Sơn Nam (Nsnnam)**
- GitHub: [https://github.com/Nsnnam](https://github.com/Nsnnam)
- Phát hành theo giấy phép mã nguồn mở MIT.
