import React from 'react';
import { Link } from 'react-router-dom';

const TodoItem = ({ todo, onToggle, onDelete }) => {
    // Render badge cho priority
    const renderPriorityBadge = (priority) => {
        let colorClass = '';
        switch (priority) {
            case 'Cần gấp':
                colorClass = 'bg-red-100 text-red-800';
                break;
            case 'Bình thường':
                colorClass = 'bg-blue-100 text-blue-800';
                break;
            case 'Thoải mái':
                colorClass = 'bg-green-100 text-green-800';
                break;
            default:
                colorClass = 'bg-gray-100 text-gray-800';
        }
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>{priority}</span>;
    };

    // Render badge cho status
    const renderStatusBadge = (status) => {
        let colorClass = '';
        switch (status) {
            case 'Chưa làm':
                colorClass = 'bg-yellow-100 text-yellow-800';
                break;
            case 'Đang làm':
                colorClass = 'bg-blue-100 text-blue-800';
                break;
            case 'Đã làm':
                colorClass = 'bg-green-100 text-green-800';
                break;
            default:
                colorClass = 'bg-gray-100 text-gray-800';
        }
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>{status}</span>;
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

    return (
        <li className="bg-white rounded-lg shadow p-3 mb-3">
            <div className="flex items-start">
                <div className="drag-handle cursor-grab text-gray-400 mt-1 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="8" cy="8" r="1" />
                        <circle cx="8" cy="16" r="1" />
                        <circle cx="16" cy="8" r="1" />
                        <circle cx="16" cy="16" r="1" />
                    </svg>
                </div>

                <div className="flex-1">
                    <Link
                        to={`/todo/${todo.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium block mb-2"
                    >
                        {todo.title}
                    </Link>

                    {/* Thông tin hiển thị ngang hàng */}
                    <div className="grid grid-cols-3 gap-2 mb-2">
                        <div className="text-left">
                            <span className="text-gray-500 text-sm">Loại: </span>
                            <span className="text-sm">{todo.type || 'Chưa phân loại'}</span>
                        </div>

                        <div className="text-center">
                            <span className="text-gray-500 text-sm">Mức ưu tiên: </span>
                            {renderPriorityBadge(todo.priority || 'Bình thường')}
                        </div>

                        <div className="text-center">
                            <span className="text-gray-500 text-sm">Trạng thái: </span>
                            {renderStatusBadge(todo.status || 'Chưa làm')}
                        </div>
                    </div>

                    <div className="text-xs text-gray-500 mb-2">
                        <div>Bắt đầu: {formatDateTime(todo.startTime)}</div>
                        <div>Kết thúc: {formatDateTime(todo.endTime)}</div>
                    </div>

                    <div className="flex justify-end space-x-2 border-t pt-2">
                        <button
                            onClick={() => onToggle(todo.id)}
                            className="p-1 text-blue-500 hover:text-blue-700 rounded"
                            title="Thay đổi trạng thái"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 12l2 2 4-4"></path>
                                <circle cx="12" cy="12" r="10"></circle>
                            </svg>
                        </button>

                        <Link
                            to={`/todo/${todo.id}`}
                            className="p-1 text-green-500 hover:text-green-700 rounded"
                            title="Chỉnh sửa"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </Link>

                        <button
                            onClick={() => onDelete(todo.id)}
                            className="p-1 text-red-500 hover:text-red-700 rounded"
                            title="Xóa"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </li>
    );
};

export default TodoItem;