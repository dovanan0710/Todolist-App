import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TodoItem = ({ todo, onToggle, onDelete }) => {
    const [showDescription, setShowDescription] = useState(false);

    // Render badge cho priority
    const renderPriorityBadge = (priority) => {
        let colorClass = '';
        switch (priority) {
            case 'Cần gấp':
                colorClass = 'bg-red-200 text-red-800 border border-red-300';
                break;
            case 'Bình thường':
                colorClass = 'bg-blue-200 text-blue-800 border border-blue-300';
                break;
            case 'Thoải mái':
                colorClass = 'bg-green-200 text-green-800 border border-green-300';
                break;
            default:
                colorClass = 'bg-gray-200 text-gray-800 border border-gray-300';
        }
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>{priority}</span>;
    };

    // Render badge cho status
    const renderStatusBadge = (status) => {
        let colorClass = '';
        let icon = null;

        switch (status) {
            case 'Chưa làm':
                colorClass = 'bg-yellow-200 text-yellow-800 border border-yellow-300';
                icon = (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                );
                break;
            case 'Đang làm':
                colorClass = 'bg-blue-200 text-blue-800 border border-blue-300';
                icon = (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                );
                break;
            case 'Đã làm':
                colorClass = 'bg-green-200 text-green-800 border border-green-300';
                icon = (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                );
                break;
            default:
                colorClass = 'bg-gray-200 text-gray-800 border border-gray-300';
        }

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${colorClass}`}>
                {icon}
                {status}
            </span>
        );
    };

    // Định dạng ngày giờ
    const formatDateTime = (dateTimeStr) => {
        if (!dateTimeStr) return 'Chưa đặt';
        const date = new Date(dateTimeStr);
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    // Kiểm tra xem task đã quá hạn chưa
    const isOverdue = (endTimeStr) => {
        if (!endTimeStr) return false;
        const endTime = new Date(endTimeStr);
        const now = new Date();
        return endTime < now && todo.status !== 'Đã làm';
    };

    // Xác định màu nền dựa trên trạng thái task
    const getBackgroundColor = () => {
        if (todo.status === 'Đã làm') {
            return 'bg-green-50';
        }
        if (isOverdue(todo.endTime)) {
            return 'bg-red-50';
        }
        return 'bg-gray-50';
    };

    return (
        <li className={`${getBackgroundColor()} rounded-lg shadow p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200 mb-5`}>
            <div className="flex items-start">
                <div className="drag-handle cursor-grab text-gray-400 mt-1 mr-3 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="8" cy="8" r="1" />
                        <circle cx="8" cy="16" r="1" />
                        <circle cx="16" cy="8" r="1" />
                        <circle cx="16" cy="16" r="1" />
                    </svg>
                </div>

                <div className="flex-1">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                            <Link
                                to={`/todo/${todo.id}`}
                                className={`text-lg hover:text-blue-700 font-medium ${todo.status === 'Đã làm'
                                        ? 'text-gray-500 line-through'
                                        : 'text-gray-800'
                                    }`}
                            >
                                {todo.title}
                            </Link>

                            {/* Nút xem mô tả */}
                            {todo.description && (
                                <button
                                    onClick={() => setShowDescription(!showDescription)}
                                    className="ml-2 text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-gray-200"
                                    title={showDescription ? "Ẩn mô tả" : "Xem mô tả"}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        {showDescription ? (
                                            <path d="M18 15l-6-6-6 6" />
                                        ) : (
                                            <path d="M6 9l6 6 6-6" />
                                        )}
                                    </svg>
                                </button>
                            )}
                        </div>

                        <div className="flex space-x-2">
                            {renderStatusBadge(todo.status || 'Chưa làm')}
                            {renderPriorityBadge(todo.priority || 'Bình thường')}
                        </div>
                    </div>

                    {/* Hiển thị mô tả khi showDescription = true */}
                    {showDescription && todo.description && (
                        <div className="bg-white p-3 mb-3 rounded-lg text-sm text-gray-700 border-l-3 border-blue-400 shadow-sm">
                            {todo.description}
                        </div>
                    )}

                    {/* Thông tin về loại công việc */}
                    <div className="mb-3">
                        <span className="text-gray-600 font-medium">Loại: </span>
                        <span className="text-gray-800 bg-gray-200 px-2 py-1 rounded-md text-sm">
                            {todo.type || 'Chưa phân loại'}
                        </span>
                    </div>

                    {/* Thông tin thời gian */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3 text-sm">
                        <div className="flex items-center text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Bắt đầu: {formatDateTime(todo.startTime)}</span>
                        </div>

                        <div className={`flex items-center ${isOverdue(todo.endTime) ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>
                                {isOverdue(todo.endTime)
                                    ? `Quá hạn (${formatDateTime(todo.endTime)})`
                                    : `Kết thúc: ${formatDateTime(todo.endTime)}`
                                }
                            </span>
                        </div>
                    </div>

                    {/* Nút thao tác - luôn hiển thị bên phải không phụ thuộc vào việc có mô tả hay không */}
                    <div className="flex justify-end items-center pt-2 border-t border-gray-200">
                        <div className="flex space-x-2">
                            {/* Nút thay đổi trạng thái */}
                            <button
                                onClick={() => onToggle(todo.id)}
                                className="p-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                                title="Thay đổi trạng thái"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 12l2 2 4-4"></path>
                                    <circle cx="12" cy="12" r="10"></circle>
                                </svg>
                            </button>

                            {/* Nút chỉnh sửa */}
                            <Link
                                to={`/todo/${todo.id}`}
                                className="p-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                                title="Chỉnh sửa"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </Link>

                            {/* Nút xóa */}
                            <button
                                onClick={() => onDelete(todo.id)}
                                className="p-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                                title="Xóa"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 6h18"></path>
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
};

export default TodoItem;