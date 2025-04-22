import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Hero Section */}
            <section className="pt-16 pb-24 md:pt-24 md:pb-32">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center">
                        {/* Text Content */}
                        <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                                Quản lý công việc hiệu quả với <span className="text-blue-600">TodoList App</span>
                            </h1>
                            <p className="text-lg text-gray-600 mb-8">
                                Ứng dụng quản lý công việc đơn giản, mạnh mẽ và linh hoạt. Giúp bạn sắp xếp công việc, theo dõi tiến độ và hoàn thành mục tiêu mỗi ngày.
                            </p>
                            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                <Link
                                    to="/todo"
                                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-6 py-3 text-center transition duration-300 shadow-lg hover:shadow-xl"
                                >
                                    Bắt đầu ngay
                                </Link>
                                <Link
                                    to="/about"
                                    className="inline-block bg-white hover:bg-gray-100 text-blue-600 font-medium rounded-lg px-6 py-3 text-center transition duration-300 border border-blue-600 shadow-md hover:shadow-lg"
                                >
                                    Tìm hiểu thêm
                                </Link>
                            </div>
                        </div>

                        {/* Illustration */}
                        <div className="lg:w-1/2">
                            <div className="relative">
                                <div className="bg-blue-100 rounded-full h-64 w-64 absolute -top-10 -right-10 opacity-50"></div>
                                <div className="relative z-10 bg-white p-6 rounded-xl shadow-xl">
                                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-medium text-blue-700">Danh sách công việc</h3>
                                            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">Hôm nay</span>
                                        </div>
                                    </div>

                                    {/* Sample Todo Items */}
                                    <div className="space-y-3">
                                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                                            <div className="w-5 h-5 rounded border-2 border-blue-500 flex items-center justify-center bg-blue-500 mr-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <span className="line-through text-gray-500">Chuẩn bị tài liệu họp</span>
                                        </div>

                                        <div className="flex items-center p-3 bg-white border border-gray-200 rounded-lg">
                                            <div className="w-5 h-5 rounded border-2 border-gray-300 mr-3"></div>
                                            <span className="text-gray-800">Họp với nhóm phát triển</span>
                                        </div>

                                        <div className="flex items-center p-3 bg-white border border-gray-200 rounded-lg">
                                            <div className="w-5 h-5 rounded border-2 border-gray-300 mr-3"></div>
                                            <span className="text-gray-800">Hoàn thiện báo cáo tuần</span>
                                        </div>

                                        <div className="flex items-center p-3 bg-white border border-gray-200 rounded-lg">
                                            <div className="w-5 h-5 rounded border-2 border-gray-300 mr-3"></div>
                                            <span className="text-gray-800">Email cho khách hàng</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <span className="ml-3 text-gray-500">Thêm công việc mới</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Tính năng nổi bật</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-blue-50 rounded-xl p-6 hover:shadow-lg transition duration-300">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Thêm & quản lý</h3>
                            <p className="text-gray-600">Dễ dàng thêm, sửa đổi và xóa các công việc cần làm mọi lúc mọi nơi.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-blue-50 rounded-xl p-6 hover:shadow-lg transition duration-300">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Sắp xếp thứ tự</h3>
                            <p className="text-gray-600">Kéo thả linh hoạt để sắp xếp các công việc theo thứ tự ưu tiên của bạn.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-blue-50 rounded-xl p-6 hover:shadow-lg transition duration-300">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Trạng thái & tiến độ</h3>
                            <p className="text-gray-600">Theo dõi trạng thái của công việc: chưa làm, đang làm hoặc đã hoàn thành.</p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-blue-50 rounded-xl p-6 hover:shadow-lg transition duration-300">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Nhắc nhở</h3>
                            <p className="text-gray-600">Nhận thông báo cho các công việc sắp đến hạn để không bỏ lỡ việc quan trọng.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Cách sử dụng</h2>
                    <p className="text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                        Chỉ với vài bước đơn giản, bạn có thể bắt đầu sử dụng TodoList để tối ưu công việc hàng ngày
                    </p>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Tạo công việc</h3>
                            <p className="text-gray-600">Thêm các công việc cần làm với tiêu đề, thời gian và mô tả chi tiết.</p>
                        </div>

                        {/* Step 2 */}
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Sắp xếp & phân loại</h3>
                            <p className="text-gray-600">Kéo thả để sắp xếp các công việc theo thứ tự ưu tiên hoặc lọc theo trạng thái.</p>
                        </div>

                        {/* Step 3 */}
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Hoàn thành & theo dõi</h3>
                            <p className="text-gray-600">Đánh dấu công việc đã hoàn thành và theo dõi tiến độ của bạn qua thời gian.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Người dùng nói gì về chúng tôi</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Testimonial 1 */}
                        <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition duration-300">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-blue-200 rounded-full overflow-hidden mr-4">
                                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800">Nguyễn Văn A</h4>
                                    <p className="text-gray-500 text-sm">Quản lý dự án</p>
                                </div>
                            </div>
                            <p className="text-gray-600 italic">
                                "Ứng dụng TodoList này đã giúp tôi tổ chức công việc hiệu quả hơn rất nhiều. Tính năng kéo thả để sắp xếp thứ tự ưu tiên thực sự rất hữu ích!"
                            </p>
                            <div className="mt-4 flex text-yellow-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

    );
};
export default Dashboard;
