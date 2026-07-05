# Hướng Dẫn Thiết Lập Hệ Thống Tra Cứu Kết Quả Tuyển Sinh Lớp 6

Tài liệu này hướng dẫn chi tiết các bước để thiết lập và kết nối trang tra cứu giao diện HTML (`index.html`) với dữ liệu trên Google Sheets thông qua Google Apps Script API bảo mật.

---

## 📋 Mục lục
1. [Bước 1: Chuẩn bị bảng dữ liệu Google Sheets](#bước-1-chuẩn-bị-bảng-dữ-liệu-google-sheets)
2. [Bước 2: Cài đặt và cấu hình Google Apps Script](#bước-2-cài-đặt-và-cấu-hình-google-apps-script)
3. [Bước 3: Cập nhật URL API vào giao diện HTML](#bước-3-cập-nhật-url-api-vào-giao-diện-html)
4. [Bước 4: Trải nghiệm và Triển khai trang web trực tuyến](#bước-4-trải-nghiệm-và-triển-khai-trang-web-trực-tuyến)
5. [🔒 Nguyên tắc bảo mật thông tin](#-nguyên-tắc-bảo-mật-thông-tin)

---

## Bước 1: Chuẩn bị bảng dữ liệu Google Sheets

1. Tạo một trang tính mới trên Google Sheets (Google Drive của bạn).
2. Thiết lập cấu trúc các cột dữ liệu đúng thứ tự và định dạng như sau (như trong ảnh mẫu):
   - **Cột A (STT)**: Số thứ tự (ví dụ: `1`, `2`, `3`...).
   - **Cột B (Họ tên)**: Họ tên học sinh (ví dụ: `Bùi Nguyễn Gia Hân`).
   - **Cột C (Số CCCD)**: Số CCCD 12 số của học sinh (ví dụ: `062315004404`).
     > *Mẹo*: Để tránh Google Sheet tự động xóa số `0` ở đầu CCCD, hãy định dạng cột CCCD này dưới dạng **Văn bản thuần túy** (Định dạng -> Số -> Văn bản thuần túy) trước khi nhập liệu.
   - **Cột D (Giới tính)**: `Nam` hoặc `Nữ`.
   - **Cột E (Ngày sinh)**: Ngày sinh của học sinh dạng chữ hoặc ngày (ví dụ: `20/10/2015`).
   - **Cột F (Dân tộc)**: Tên dân tộc (ví dụ: `Kinh`, `Ba na`).
   - **Cột G (Học trường Tiểu học)**: Tên trường tiểu học đã tốt nghiệp.
   - **Cột H (Trạng thái)**: Chỉ điền `Yes` cho những học sinh được duyệt hiển thị kết quả. Điền `No` hoặc để trống đối với những học sinh chưa được phép tra cứu thông tin tuyển sinh.

---

## Bước 2: Cài đặt và cấu hình Google Apps Script

Để tạo ra một API bảo mật kết nối với trang web, hãy làm theo các bước:

1. Tại file Google Sheet chứa dữ liệu tuyển sinh, chọn menu **Tiện ích mở rộng** (Extensions) -> Chọn **Apps Script**.
2. Một giao diện lập trình sẽ hiện ra. Xóa sạch mọi mã code mẫu có sẵn ở file `Mã.gs` (Code.gs).
3. Mở file [google_apps_script.js](file:///c:/Users/HPZBook/OneDrive%20-%20Sở%20GD&ĐT%20Quảng%20Ngãi/Desktop/KẾT%20QUẢ%20TS%20LỚP%206%2026-27/google_apps_script.js), sao chép (Copy) toàn bộ mã nguồn bên trong và dán (Paste) vào trình soạn thảo Apps Script vừa mở.
4. Bấm biểu tượng **Lưu dự án** (Hình đĩa mềm 💾) hoặc nhấn tổ hợp phím `Ctrl + S`.
5. Nhấn nút **Triển khai** (Deploy) ở góc trên bên phải -> Chọn **Triển khai mới** (New deployment).
6. Ở ô cấu hình mở ra:
   - Nhấp vào biểu tượng bánh răng bên cạnh chữ "Chọn loại" -> Chọn **Ứng dụng web** (Web app).
   - Điền phần mô tả (ví dụ: `API Tuyen Sinh Lop 6`).
   - Mục **Thực thi dưới danh nghĩa** (Execute as): Chọn **Tôi** (Tài khoản Google của bạn).
   - Mục **Ai có quyền truy cập** (Who has access): Chọn **Mọi người** (Anyone). *(Đây là tùy chọn cực kỳ quan trọng để trang HTML bên ngoài có thể gọi API này).*
7. Bấm nút **Triển khai** (Deploy).
8. Một cửa sổ yêu cầu cấp quyền sẽ hiện ra. Chọn **Ủ quyền truy cập** (Authorize access) -> Chọn tài khoản Google của bạn -> Bấm chọn **Nâng cao** (Advanced) -> Chọn **Đi tới dự án tuyển sinh (không an toàn)** -> Bấm **Cho phép** (Allow).
9. Sau khi hệ thống triển khai thành công, màn hình sẽ hiển thị mục **Ứng dụng web** kèm theo một đường dẫn dài. Hãy bấm **Sao chép** (Copy) đường link này (URL ứng dụng web). Link sẽ có định dạng tương tự:
   `https://script.google.com/macros/s/AKfycb.../exec`

---

## Bước 3: Cập nhật URL API vào giao diện HTML

1. Mở file [index.html](file:///c:/Users/HPZBook/OneDrive%20-%20Sở%20GD&ĐT%20Quảng%20Ngãi/Desktop/KẾT%20QUẢ%20TS%20LỚP%206%2026-27/index.html) bằng một phần mềm chỉnh sửa mã nguồn (như VS Code, Notepad++ hoặc Notepad mặc định của Windows).
2. Tìm đến dòng số **469** hoặc tìm từ khóa `GOOGLE_SCRIPT_URL`:
   ```javascript
   const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzUzC9j7k19bC-rYyQ7F0zC5c_q6p7w2W3_v7_v_v/exec";
   ```
3. Thay thế đường dẫn mẫu bên trong dấu ngoặc kép bằng **URL ứng dụng web** mà bạn vừa sao chép ở Bước 2.
4. Lưu file `index.html` lại.

---

## Bước 4: Trải nghiệm và Triển khai trang web trực tuyến

### Chạy trực tiếp trên máy tính
Bạn có thể nhấp đúp vào file `index.html` để mở trực tiếp trên trình duyệt Chrome, Edge, Cốc Cốc của máy tính hoặc điện thoại di động và thực hiện tra cứu thử nghiệm ngay lập tức.

### Triển khai lên internet miễn phí
Để PHHS toàn trường có thể truy cập được từ xa trên điện thoại di động, bạn có thể triển khai trang web tĩnh `index.html` hoàn toàn miễn phí lên một số nền tảng sau:

1. **Github Pages**:
   - Đăng tải file `index.html` lên một Repository công khai trên GitHub.
   - Vào Settings -> Pages -> Chọn nhánh `main` và lưu lại. Hệ thống sẽ cung cấp cho bạn một link trang web dạng `https://ten-tai-khoan.github.io/ten-du-an`.
2. **Vercel / Netlify**:
   - Chỉ cần kéo thả file `index.html` lên trang deploy nhanh của Netlify (netlify.com) hoặc Vercel (vercel.com) để sở hữu một trang web chạy trực tuyến trong vòng 30 giây.

---

## 🔒 Nguyên tắc bảo mật thông tin

*Tại sao giải pháp này an toàn hơn việc tải trực tiếp file CSV từ Google Sheets?*
- Số CCCD là thông tin định danh cá nhân nhạy cảm của học sinh. Nếu xuất bản Google Sheets trực tiếp dạng CSV để tìm kiếm ở phía Client, kẻ xấu có thể xem được toàn bộ danh sách Số CCCD và thông tin học sinh bằng tổ hợp phím `F12`.
- Với Google Apps Script chạy phía Server, **mọi quá trình tìm kiếm và lọc dữ liệu đều được thực hiện bảo mật trên Cloud của Google**. Trình duyệt của phụ huynh chỉ gửi đi duy nhất số CCCD cần tìm, và Google Apps Script chỉ phản hồi thông tin của đúng học sinh đó khi trạng thái là `Yes`. Không một ai có thể khai thác được dữ liệu của học sinh khác.
- Cột `Trạng thái` **không được gửi về trình duyệt**, đảm bảo tính kín kẽ cho dữ liệu quản trị của nhà trường.
