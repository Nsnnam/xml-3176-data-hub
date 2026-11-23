# NsN XML DataHub 3176

[![Deploy to GitHub Pages](https://github.com/Nsnnam/xml-3176-data-hub/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/Nsnnam/xml-3176-data-hub/actions/workflows/deploy-pages.yml)
[![Version](https://img.shields.io/badge/version-1.0.0-teal.svg)](https://github.com/Nsnnam/xml-3176-data-hub)
[![Author](https://img.shields.io/badge/author-Nguy%E1%BB%85n%20S%C6%A1n%20Nam%20(Nsnnam)-0ea5e9.svg)](https://github.com/Nsnnam)
[![License](https://img.shields.io/badge/license-MIT-slate.svg)](LICENSE)

> **NsN XML DataHub 3176** là công cụ web hiện đại, chuyên nghiệp giúp nạp, phân tích tự động, tìm kiếm đa năng và lọc xuất Excel dữ liệu hồ sơ khám chữa bệnh BHYT bảng 1, 2, 3 (**XML1, XML2, XML3**) định dạng Excel theo chuẩn **Quyết định 3176/QĐ-BYT**.

Ứng dụng trực tuyến: **[https://nsnnam.github.io/xml-3176-data-hub/](https://nsnnam.github.io/xml-3176-data-hub/)**

---

## 🌟 Điểm nổi bật & Tính năng chính

### 1. Nạp dữ liệu Excel tự động — Không cần file mẫu
- Hỗ trợ nạp trực tiếp các file Excel `.xlsx`, `.xls` xuất từ các hệ thống HIS / Cổng tiếp nhận BHYT.
- **Tự động nhận diện** bảng XML1 (Tổng hợp KCB), XML2 (Thuốc & Dược liệu), XML3 (Dịch vụ kỹ thuật & VTYT) dựa trên cấu trúc các cột đặc trưng và tên file mà không bắt buộc theo khuôn mẫu cố định.
- Hỗ trợ kéo thả cùng lúc nhiều file hoặc nạp từng đợt linh hoạt.

### 2. Tự động phân tích & Liên kết dữ liệu (Data Modeling)
- Tự động liên kết toàn bộ hồ sơ của bệnh nhân qua trường khóa chính **`MA_LK`** (Mã liên kết).
- Bảng điều khiển KPI trực quan:
  - Tổng số lượng hồ sơ KCB, phân loại Ngoại trú / Nội trú.
  - Tổng viện phí KCB (`T_TONGCHI_BV`), quỹ BHYT chi trả (`T_BHTT`), người bệnh đồng chi trả (`T_BNTT`).
  - Tổng lượt chỉ định thuốc (XML2) và dịch vụ kỹ thuật / VTYT (XML3).
  - Phân tích Top 10 bệnh thường gặp theo mã **ICD-10**, Top thuốc và Top dịch vụ kỹ thuật phát sinh nhiều nhất.

### 3. Tìm kiếm toàn năng (Omni-Search Engine)
- Tìm kiếm tức thì bất kỳ thông tin nào bạn muốn trên toàn bộ 3 bảng dữ liệu:
  - **Hồ sơ bệnh nhân (XML1):** Họ tên, Mã LK, Mã BN, Mã HSBA, Số CCCD/Định danh, Mã thẻ BHYT, Địa chỉ, Mã CSKCB, Mã ĐKBD, Khoa điều trị...
  - **Chẩn đoán (ICD-10):** Mã bệnh chính, mã bệnh kèm theo, chẩn đoán vào viện, chẩn đoán ra viện.
  - **Thuốc & Dược liệu (XML2):** Tên thuốc, hoạt chất, hàm lượng, số đăng ký, số lô, thông tin thầu (`TT_THAU`), bác sĩ kê đơn, số phiếu.
  - **Dịch vụ kỹ thuật & VTYT (XML3):** Tên DVKT, tên vật tư, mã DVKT, mã nhóm, mã máy (`MA_MAY`), người thực hiện, vị trí.
- Hỗ trợ gõ tiếng Việt có dấu hoặc không dấu, tìm kiếm đa từ khóa kết hợp.

### 4. Lọc khoảng thời gian linh hoạt đa mốc
Hệ thống cho phép lọc hồ sơ theo bất kỳ mốc thời gian nào theo yêu cầu nghiệp vụ:
- **`NGAY_VAO`**: Ngày vào viện (Bảng 1).
- **`NGAY_RA`**: Ngày ra viện (Bảng 1).
- **`NGAY_YL`**: Ngày y lệnh (Bảng 2 Thuốc hoặc Bảng 3 DVKT).
- **`NGAY_TH_YL`**: Ngày thực hiện y lệnh.
- **`NGAY_KQ`**: Ngày trả kết quả (Bảng 3).
- **`NGAY_TTOAN`**: Ngày thanh toán (Bảng 1).
- **Bất kỳ mốc nào**: Khớp nếu bệnh nhân có bất kỳ sự kiện nào trong khoảng thời gian chọn.
- Tích hợp sẵn các nút chọn nhanh: *Hôm nay, 7 ngày qua, 30 ngày qua, Tháng này, Tháng trước, Cả năm*.

### 5. Xuất kết quả sau lọc ra Excel chuẩn QĐ 3176
- **Xuất Bảng 1 (XML1)**: Chuẩn đầy đủ **65 cột** nghiệp vụ theo QĐ 3176/QĐ-BYT.
- **Xuất Bảng 2 (XML2)**: Chuẩn đầy đủ **43 cột** chi tiết thuốc theo QĐ 3176/QĐ-BYT.
- **Xuất Bảng 3 (XML3)**: Chuẩn đầy đủ **51 cột** dịch vụ kỹ thuật, thời gian và mã máy.
- **Xuất Trọn Bộ 3 Bảng**: Tạo 1 file Excel duy nhất gồm 3 Sheet riêng biệt (`XML1`, `XML2`, `XML3`) chứa trọn vẹn dữ liệu các hồ sơ đã lọc.
- Tùy chọn lọc nâng cao khi xuất: cho phép chỉ trích xuất các dòng thuốc/dịch vụ phát sinh trong khoảng thời gian đã lọc.

### 6. Bảo mật & Khóa hàng ngày ("namns")
- Tích hợp lớp bảo mật nhẹ: nhập mã mở khóa **`namns`** 1 lần mỗi ngày để bắt đầu phiên làm việc.
- Dữ liệu được lưu trong trình duyệt theo ngày hiện tại, sang ngày mới hệ thống tự động yêu cầu xác thực lại.
- Nút "Khóa" nhanh trên thanh công cụ để bảo mật màn hình khi rời bàn làm việc.

### 7. Xử lý Client-Side an toàn 100%
- Toàn bộ thuật toán đọc Excel, phân tích và xuất dữ liệu diễn ra hoàn toàn bên trong trình duyệt người dùng.
- Tuyệt đối **không tải dữ liệu bệnh nhân lên máy chủ**, tuân thủ nghiêm ngặt quy định về bảo mật dữ liệu y tế.

---

## 📋 Cấu trúc các bảng dữ liệu chuẩn QĐ 3176

| Bảng XML | Tên bảng | Số cột | Khóa liên kết |
| :--- | :--- | :---: | :--- |
| **XML1** | Tổng hợp khám chữa bệnh | **65 cột** | `MA_LK` (Mã liên kết hồ sơ) |
| **XML2** | Chi tiết thuốc, dược liệu | **43 cột** | `MA_LK`, liên kết ngày `NGAY_YL`, `NGAY_TH_YL` |
| **XML3** | Chi tiết dịch vụ kỹ thuật, VTYT | **51 cột** | `MA_LK`, liên kết ngày `NGAY_YL`, `NGAY_TH_YL`, `NGAY_KQ` |

---

## 🚀 Cài đặt & Chạy dưới Local

Yêu cầu môi trường: **Node.js 18+** và **npm**.

```bash
# 1. Clone repository
git clone https://github.com/Nsnnam/xml-3176-data-hub.git
cd xml-3176-data-hub

# 2. Cài đặt các gói phụ thuộc
npm install

# 3. Chạy môi trường phát triển (Development)
npm run dev
```

Mở trình duyệt tại địa chỉ hiển thị trong terminal (mặc định: `http://localhost:5173/`).

### Đóng gói sản phẩm (Build Production)
```bash
npm run build
npm run preview
```

---

## 👨‍💻 Tác giả & Bản quyền

- Tác giả: **Nguyễn Sơn Nam (Nsnnam)**
- GitHub: [https://github.com/Nsnnam](https://github.com/Nsnnam)
- Phát hành theo giấy phép mã nguồn mở MIT.
