/**
 * Google Apps Script - API Tra Cứu Kết Quả Tuyển Sinh Lớp 6
 * 
 * Hướng dẫn: 
 * 1. Mở file Google Sheets chứa dữ liệu tuyển sinh.
 * 2. Vào menu "Tiện ích mở rộng" (Extensions) -> Chọn "Apps Script".
 * 3. Xóa hết mã mặc định trong file `Mã.gs` (Code.gs) và dán toàn bộ đoạn code dưới đây vào.
 * 4. Nhấn nút Save (Biểu tượng đĩa mềm).
 * 5. Nhấn nút "Triển khai" (Deploy) -> "Triển khai mới" (New deployment).
 * 6. Chọn loại triển khai là "Ứng dụng web" (Web app).
 * 7. Thiết lập cấu hình:
 *    - Mô tả: API Tra cứu tuyển sinh 2026-2027
 *    - Thực thi dưới danh nghĩa: "Tôi" (Chính tài khoản Google của bạn)
 *    - Ai có quyền truy cập: "Mọi người" (Anyone) - RẤT QUAN TRỌNG ĐỂ CLIENT GỌI ĐƯỢC API.
 * 8. Nhấn "Triển khai" (Deploy) và cấp quyền truy cập nếu Google yêu cầu.
 * 9. Sao chép "URL của ứng dụng web" (Web app URL) để dán vào file `index.html` của bạn.
 */

function doGet(e) {
  // Thiết lập CORS và kiểu dữ liệu trả về là JSON
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  try {
    // 1. Kiểm tra tham số đầu vào cccd
    if (!e || !e.parameter || !e.parameter.cccd) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: "Thiếu số CCCD cần tra cứu."
      }))
      .setMimeType(ContentService.MimeType.JSON);
    }

    var searchCCCD = e.parameter.cccd.trim();
    
    // 2. Lấy dữ liệu từ Google Sheets
    // Sử dụng getActiveSpreadsheet() vì Script này liên kết trực tiếp với Sheet chứa dữ liệu
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Sử dụng getDisplayValues() thay vì getValues() để giữ nguyên định dạng hiển thị
    // (Giúp giữ nguyên số 0 ở đầu CCCD và định dạng ngày tháng như dd/mm/yyyy)
    var data = sheet.getDataRange().getDisplayValues();
    
    if (data.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: "Không có dữ liệu tuyển sinh trên hệ thống."
      }))
      .setMimeType(ContentService.MimeType.JSON);
    }

    // Tiêu đề các cột tương ứng:
    // Cột A (chỉ số 0): STT
    // Cột B (chỉ số 1): Họ tên
    // Cột C (chỉ số 2): Số CCCD
    // Cột D (chỉ số 3): Giới tính
    // Cột E (chỉ số 4): Ngày sinh
    // Cột F (chỉ số 5): Dân tộc
    // Cột G (chỉ số 6): Học trường Tiểu học
    // Cột H (chỉ số 7): Trạng thái
    
    var foundStudent = null;

    // Duyệt qua từng hàng dữ liệu (bỏ qua hàng tiêu đề index 0)
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var sheetCCCD = row[2] ? row[2].toString().trim() : "";
      
      // So khớp CCCD (không phân biệt khoảng trắng dư thừa)
      if (sheetCCCD === searchCCCD) {
        var status = row[7] ? row[7].toString().trim().toLowerCase() : "";
        
        // Trả về dữ liệu học sinh kèm trạng thái cột H (yes/no)
        foundStudent = {
          stt: row[0] ? row[0].toString().trim() : "",
          hoTen: row[1] ? row[1].toString().trim() : "",
          cccd: sheetCCCD,
          gioiTinh: row[3] ? row[3].toString().trim() : "",
          ngaySinh: row[4] ? row[4].toString().trim() : "",
          danToc: row[5] ? row[5].toString().trim() : "",
          truongTieuHoc: row[6] ? row[6].toString().trim() : "",
          trangThai: status
        };
        break; // Đã tìm thấy CCCD (CCCD là duy nhất), dừng vòng lặp
      }
    }

    // 3. Trả về kết quả
    if (foundStudent) {
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        data: foundStudent
      }))
      .setMimeType(ContentService.MimeType.JSON);
    } else {
      // Nếu không tìm thấy hoặc trạng thái không phải là "Yes", trả về cùng một thông báo chung
      // Điều này nhằm đảm bảo tính bảo mật, không để lộ việc CCCD có tồn tại trên hệ thống hay không
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: "Không tìm thấy thông tin tuyển sinh hợp lệ với Số CCCD đã cung cấp."
      }))
      .setMimeType(ContentService.MimeType.JSON);
    }

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: "Có lỗi xảy ra trong quá trình truy vấn hệ thống: " + error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}
