Trước khi triển khai ứng dụng, bạn cần cấu hình MockAPI cho dự án của mình:

Đăng nhập vào tài khoản MockAPI của bạn
Tạo một resource mới có tên là todos với các trường sau:

    id (string, tự động tạo)
    title (string)
    completed (boolean)
    order (number)
    createdAt (datetime)
Sau khi tạo xong, lấy URL endpoint của API và cập nhật lại trong file apiService.js:
    const API_URL = 'https://your-mockapi-endpoint.mockapi.io/api/v1';
 Chạy ứng dụng
    npm start

1. Mô hình PubSub
Ứng dụng sử dụng mô hình PubSub để quản lý trạng thái. Các thành phần chính:

pubsub.js: Triển khai mô hình PubSub với các phương thức subscribe và publish.
Các sự kiện được định nghĩa: TODOS_LOADED, TODO_ADDED, TODO_UPDATED, TODO_DELETED, TODOS_REORDERED, API_ERROR.

2. Giao tiếp với API

apiService.js: Xử lý các tác vụ CRUD với API sử dụng axios.
Mỗi khi có thay đổi, service sẽ publish sự kiện tương ứng để các component cập nhật.

3. Giao diện người dùng

TodoList: Component chính, quản lý trạng thái và hiển thị danh sách.
TodoItem: Hiển thị một mục todo, với khả năng kéo thả, đánh dấu hoàn thành, và xóa.
TodoForm: Form để thêm todo mới.

4. Kéo thả với SortableJS

Sử dụng SortableJS để triển khai chức năng kéo thả.
Mỗi item có một "handle" để người dùng có thể kéo thả.
Sự kiện onEnd được sử dụng để cập nhật thứ tự và gửi lên server.

Lưu ý khi triển khai

Cấu hình MockAPI: Đảm bảo cấu hình đúng các endpoint và schema của data.
Xử lý lỗi: Ứng dụng đã có cơ chế xử lý lỗi cơ bản, nhưng bạn có thể mở rộng để hiển thị thông báo lỗi chi tiết hơn.
Hiệu suất: Với danh sách lớn, bạn có thể cần phân trang hoặc tải theo nhóm.
Lưu trữ cục bộ: Bạn có thể thêm tính năng lưu trữ cục bộ (localStorage) để hoạt động offline.

Bạn có thể mở rộng ứng dụng với các tính năng khác như:

Tìm kiếm và lọc todos
Phân loại theo nhóm
Đặt hạn chót cho công việc
Đồng bộ hóa offline

Thêm một nút để dẫn đến trang quản lý ở phần head của trang chủchủ