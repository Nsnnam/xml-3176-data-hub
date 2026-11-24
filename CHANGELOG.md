# Nhật Ký Thay Đổi (Changelog) - NsN XML DataHub 3176

Tất cả các thay đổi đáng chú ý của dự án **NsN XML DataHub 3176** sẽ được ghi chép chi tiết tại tài liệu này.

---

## [v1.1.1] - 2026-11-24

### 📁 1. Cấu Hình Nơi Lưu & Hộp Thoại Chọn Vị Trí Khi Xuất File Excel (Bản Desktop EXE)
- **Hộp thoại Windows Save As bản địa**: Cho phép người dùng trực tiếp lựa chọn thư mục lưu và đổi tên file theo ý muốn mỗi khi xuất dữ liệu.
- **Cấu hình nơi lưu linh hoạt**:
  - Tùy chọn **"Luôn hỏi vị trí lưu mỗi khi bấm xuất"** (bật mặc định).
  - Tùy chọn cấu hình **"Thư mục lưu mặc định"** với nút `[📂 Đổi thư mục...]` mở hộp thoại chọn thư mục Windows (Folder Browser).
  - Tùy chọn **"Tự động mở thư mục chứa file ngay sau khi xuất xong"**.
- **Hiển thị đường dẫn lưu rõ ràng**: Sau khi xuất thành công, ứng dụng hiển thị đường dẫn tệp đầy đủ kèm nút **`[📂 Mở Thư Mục Chứa File Trong Windows Explorer]`** giúp định vị file ngay lập tức.
- **Áp dụng toàn diện**: Áp dụng cho toàn bộ các chức năng xuất: Hộp thoại Xuất Excel chính (3 bảng), Modal chi tiết 4 thẻ KPI, và xuất 1-click tại bảng thống kê.

### 🎯 2. Khắc Phục Lỗi Cài Đặt Bộ Lọc Bị Ẩn & Thêm Cột Tùy Ý Theo Bảng XML 1, 2, 3
- **Sửa triệt để lỗi footer bị che khuất**: Cố định kích thước modal thông minh (`h-[90vh] max-h-[720px]`), phân chia vùng cuộn nội dung độc lập (`min-h-0 overflow-y-auto`) và thanh chân trang cố định (`sticky bottom-0`). Các nút điều khiển (`Khôi phục mặc định`, `Đóng & Áp Dụng Ngay`) luôn luôn hiển thị trực quan ở đáy màn hình.
- **Cơ chế tự động lưu tức thì (Auto-Save)**: Mọi thao tác tích chọn bật/tắt hoặc chỉnh sửa tên hiển thị đều được tự động lưu ngay vào bộ nhớ cục bộ, không lo bị mất cấu hình khi đóng hộp thoại.
- **Bộ chọn phân loại XML tiện dụng**: Bổ sung hệ thống Tab lọc nhanh theo nguồn bảng: `Tất Cả`, `XML1 (Tổng Hợp)`, `XML2 (Thuốc)`, `XML3 (DVKT & VTYT)`.
- **Thêm cột hiển thị tùy ý không giới hạn**: Tích hợp danh mục toàn bộ các cột nghiệp vụ chuẩn QĐ 3176 (Mã bệnh nhân, Họ tên, CCCD, Thẻ BHYT, Khoa, Bệnh chính, Chẩn đoán, Mã HSBA, Tên thuốc, Đường dùng, Bác sĩ, Tên DVKT, Mã máy, Người thực hiện...). Người dùng chỉ cần chọn cột và bấm **`[➕ Thêm Cột Này]`** để tạo ngay nút lọc nhanh ngoài màn hình chính.
- **Đồng bộ hiển thị tức thì ra ngoài màn hình**: Khắc phục lỗi tích chọn hiển thị nhưng không render ra ngoài thanh công cụ. Giờ đây tất cả các cột được bật đều xuất hiện đầy đủ trên thanh "Nhặt thông tin lọc" ngoài trang chính.

### ☀️ 3. Đại Tu Độ Tương Phản Giao Diện Trắng (Light Theme) — Siêu Sắc Nét & Chống Nhạt Màu
- Khắc phục triệt để tình trạng chữ bị nhạt màu, mờ nhạt hoặc hòa vào nền trắng:
  - Chuẩn hóa toàn bộ văn bản chính sang màu than chì đậm **`#0f172a` (Slate-900)** với font weight đậm đà.
  - Văn bản phụ rõ nét với màu **`#334155` (Slate-700)**.
  - Ô nhập liệu và dropdown hiển thị chữ đen sắc nét `#0f172a`, đường viền rõ ràng `#94a3b8`, placeholder dễ đọc `#64748b`.
  - Tiêu đề bảng (`thead`) có nền phân biệt `#f1f5f9` với viền đôi phân cách rõ rệt.
- **Nâng cấp toàn bộ gam màu điểm nhấn y tế (Medical Accents)**:
  - Màu Teal, Cyan, Emerald, Amber, Purple, Blue, Pink trên nền trắng được chuyển sang các sắc thái đậm sâu (Shade 700 như `#0f766e`, `#0369a1`, `#047857`, `#b45309`, `#6d28d9`), tăng độ tương phản lên hơn **4.5:1** đạt chuẩn WCAG AAA.
  - Các khối thẻ card chuyển sang màu trắng thanh khiết với bóng mờ tinh tế, loại bỏ hoàn toàn các mảng màu đen/xám đục bị sót lại.

---

## [v1.1.0] - 2026-11-24

### 🏥 1. Thiết Kế Icon Mới Chuyên Nghiệp Cho Ứng Dụng Windows EXE
- Thay thế icon mặc định bằng icon vector y tế chuyên nghiệp đa độ phân giải (16x16 đến 256x256).
- Thiết kế hình chiếc khiên bảo vệ y tế bo tròn viền cyan, chữ thập y tế màu trắng lồng nhịp tim điện tâm đồ ECG dạng sóng âm kỹ thuật số.
- Áp dụng đồng bộ cho:
  - Cửa sổ ứng dụng Desktop Windows (`NsN_XML_DataHub_3176.exe`).
  - File cài đặt Setup (`NsN_XML_DataHub_3176_Setup_v1.1.0.exe`).
  - Biểu tượng Web (`public/favicon.ico` và `public/icon.png`).

### 🎨 2. Hệ Thống 3 Giao Diện Đẳng Cấp & Tích Hợp Font Be Vietnam Pro
- **Giao diện Y tế (Medical Navy/Cyan)**: Tông màu xanh biển đậm kết hợp viền ngọc y tế, tạo cảm giác tin cậy, chuyên sâu và dịu mắt khi làm việc lâu.
- **Giao diện Đen (Midnight Dark)**: Nền đen tuyền công nghệ cao, độ tương phản sắc nét, giảm thiểu tối đa ánh sáng xanh.
- **Giao diện Trắng (Hospital Clean White)**: Tông màu trắng thanh lịch phong cách bệnh viện hiện đại, sắc thái chữ than chì dễ đọc dưới ánh sáng mạnh.
- Tích hợp chuẩn phông chữ quốc gia **Be Vietnam Pro** với đầy đủ các trọng số font (Regular, Medium, SemiBold, Bold) tối ưu hiển thị tiếng Việt y khoa không lỗi chân chữ.
- Chuẩn hóa toàn bộ mảng màu của font, màu chữ, nền thẻ card, bảng biểu và viền border theo từng giao diện đảm bảo tính thẩm mỹ, độ tương phản cao, không bị lóa hoặc chìm màu.

### 📊 3. Khám Phá Chi Tiết Thông Tin Chung & Xuất Excel 1-Click (KPI Drill-Down)
- 4 thẻ KPI tổng quan (Hồ sơ KCB, Tổng viện phí, Thuốc XML2, DVKT & VTYT XML3) giờ đây hỗ trợ **nhấp chuột trực tiếp** để mở hộp thoại phân tích chi tiết:
  - **Hồ Sơ KCB**: Bảng danh sách bệnh nhân chi tiết, lọc tìm kiếm tức thì, xem chi tiết từng ca và xuất Excel danh sách hồ sơ.
  - **Tổng Viện Phí**: Thống kê cơ cấu viện phí phân bổ theo từng khoa phòng điều trị (Tổng chi BV, BHYT thanh toán, Bệnh nhân trả, Tỷ lệ BHYT).
  - **Thuốc (XML2)**: Tổng hợp toàn bộ danh mục thuốc kê đơn trong kỳ, số lượt kê, tổng số lượng và tổng chi phí.
  - **DVKT & VTYT (XML3)**: Bảng chi tiết toàn bộ kỹ thuật xét nghiệm, CĐHA, vật tư tiêu hao xếp theo chi phí.
- Tích hợp nút **[📥 Xuất Excel]** chuyên dụng ngay trong từng modal để tải báo cáo phân tích phục vụ đối soát BHYT.

### 📥 4. Hỗ Trợ Nạp Trực Tiếp Gói XML Mã Hóa Theo Quyết Định 3176 (15 Bảng)
- Động cơ nạp dữ liệu thông minh hỗ trợ đọc trực tiếp tệp XML gói hồ sơ gửi Cổng giám định BHYT theo chuẩn Quyết định 3176/QĐ-BYT:
  - Cấu trúc: `<GIAMDINHHS>` -> `<THONGTINHOSO>` -> `<DANHSACHHOSO>` -> `<HOSO>` -> `<FILEHOSO>`.
  - Tự động bóc tách và giải mã các bảng XML1 đến XML15, hỗ trợ nội dung nén mã hóa **Base64** trong thẻ `<NOIDUNGFILE>` hoặc XML trực tiếp.
  - Tự động phân loại, trích xuất dữ liệu XML1 (`<TONG_HOP>`), XML2 (`<CHI_TIET_THUOC>`), XML3 (`<CHI_TIET_DVKT>`) nạp thẳng vào cơ sở dữ liệu.
  - Tốc độ xử lý siêu tốc: Nạp tệp XML dung lượng lớn chỉ mất vài phần trăm giây với thuật toán đọc luồng `iterparse` không tốn RAM.

### 🛠️ 5. Sửa Lỗi Giao Diện Thẻ Import Bị Lồng Chữ
- Thiết kế lại hoàn toàn layout danh sách tệp đã nạp trong hộp thoại Import:
  - Bố cục lưới 2 cột thông thoáng (`grid-cols-1 sm:grid-cols-2`), co giãn linh hoạt theo kích thước cửa sổ.
  - Chia 3 hàng độc lập rõ ràng: Hàng 1 (Badge phân loại + Dung lượng + Nút xóa), Hàng 2 (Icon + Tên file có ngắt chuỗi chống tràn `truncate`), Hàng 3 (Số dòng dữ liệu + Thời gian nạp).
  - Khắc phục triệt để hiện tượng chữ bị lồng vào nhau, đè chồng lên số dòng khi nạp nhiều file cùng lúc.

### 🎯 6. Nhặt Thông Tin Lọc Cột Mã BN & Cài Đặt Cấu Hình Bộ Lọc Nhanh
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
  - Nút khôi phục cấu hình mặc định chỉ với 1 cú click.

---

## [v1.0.0] - 2026-11-23

### 🚀 Khởi tạo dự án NsN XML DataHub 3176
- Ứng dụng Desktop Windows (Setup EXE Inno Setup 6) tích hợp động cơ cơ sở dữ liệu nhúng SQLite WAL và WebView2.
- Ứng dụng Trực tuyến chạy trên GitHub Pages.
- Nạp đa file Excel XML1, XML2, XML3 theo chuẩn QĐ 3176/QĐ-BYT không tràn RAM.
- Tìm kiếm toàn năng và lọc chuyên sâu theo 65 cột XML1, 43 cột XML2, 51 cột XML3.
- Tính năng "Nhặt" thông tin lọc đa lựa chọn (Mã nhóm, ICD-10, Thuốc, DVKT).
- Xuất Excel 1-click tại các bảng thống kê và xuất chuẩn 3 bảng XML1, 2, 3.
- Mã khóa bảo mật hàng ngày `namns`.
