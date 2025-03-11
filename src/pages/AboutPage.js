import React from 'react';

const AboutPage = () => {
    return (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Giới thiệu ứng dụng TodoList</h1>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Giới thiệu</h2>
                <p className="mb-3">
                    Ứng dụng TodoList là một công cụ quản lý công việc đơn giản và hiệu quả,
                    giúp bạn quản lý danh sách các việc cần làm một cách dễ dàng.
                </p>
                <p>
                    Với giao diện thân thiện và dễ sử dụng, ứng dụng giúp bạn không bỏ sót bất kỳ
                    công việc quan trọng nào, từ việc nhà đến công việc tại trường học hoặc cơ quan.
                </p>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Tính năng chính</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Thêm việc cần làm với nhiều thông tin chi tiết</li>
                    <li>Phân loại công việc theo nhiều loại khác nhau</li>
                    <li>Đánh dấu mức độ ưu tiên (cần gấp, bình thường, thoải mái)</li>
                    <li>Cập nhật trạng thái công việc (chưa làm, đang làm, đã làm)</li>
                    <li>Sắp xếp thứ tự công việc bằng cách kéo thả</li>
                    <li>Xóa công việc đã hoàn thành</li>
                    <li>Giao diện thân thiện với điện thoại di động</li>
                </ul>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Công nghệ sử dụng</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li>ReactJS: Thư viện JavaScript cho phát triển giao diện người dùng</li>
                    <li>TailwindCSS: Framework CSS tiện ích cho thiết kế giao diện</li>
                    <li>SortableJS: Thư viện JavaScript cho tính năng kéo thả</li>
                    <li>Mô hình PubSub: Mẫu thiết kế để quản lý state của ứng dụng</li>
                    <li>MockAPI: Dịch vụ cung cấp API giả lập để lưu trữ dữ liệu</li>
                </ul>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-3">Hướng dẫn sử dụng</h2>
                <ol className="list-decimal pl-5 space-y-2">
                    <li>Tại trang chủ, nhấn vào nút "Thêm mới" để tạo công việc mới</li>
                    <li>Điền các thông tin cần thiết và nhấn "Thêm công việc"</li>
                    <li>Để đánh dấu hoàn thành, nhấn vào biểu tượng tích trong danh sách</li>
                    <li>Để chỉnh sửa công việc, nhấn vào biểu tượng bút chì hoặc tên công việc</li>
                    <li>Để xóa công việc, nhấn vào biểu tượng thùng rác</li>
                    <li>Để sắp xếp thứ tự, kéo và thả các công việc bằng cách giữ biểu tượng điểm tròn</li>
                </ol>
            </div>
        </div>
    );
};

export default AboutPage;