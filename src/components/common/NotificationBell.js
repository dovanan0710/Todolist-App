import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const NotificationBell = ({ upcomingTasks }) => {
    const [isOpen, setIsOpen] = useState(false);
    const notificationRef = useRef(null);

    // Xử lý click bên ngoài để đóng dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Format thời gian
    const formatTime = (dateString) => {
        if (!dateString) return '';

        // Chuẩn hóa định dạng thời gian
        let normalizedTime = dateString;
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dateString)) {
            normalizedTime += ":00";
        }
        normalizedTime += ".000Z";

        const date = new Date(normalizedTime);
        return new Intl.DateTimeFormat('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    };

    // Tính toán thời gian sắp tới
    const getTimeUntil = (dateString) => {
        if (!dateString) return '';

        // Chuẩn hóa định dạng thời gian
        let normalizedTime = dateString;
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dateString)) {
            normalizedTime += ":00";
        }
        normalizedTime += ".000Z";

        const date = new Date(normalizedTime);
        const now = new Date();
        const diffMs = date - now;

        if (diffMs <= 0) return 'Bây giờ';

        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMins / 60);

        if (diffHours < 1) {
            return `${diffMins} phút nữa`;
        } else if (diffHours < 24) {
            return `${diffHours} giờ nữa`;
        } else {
            const diffDays = Math.floor(diffHours / 24);
            return `${diffDays} ngày nữa`;
        }
    };

    return (
        <div className="relative" ref={notificationRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100 focus:outline-none relative"
                aria-label="Thông báo"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6"
                >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>

                {/* Badge thông báo */}
                {upcomingTasks.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                        {upcomingTasks.length}
                    </span>
                )}
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <div className="absolute right-0 w-80 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                    <div className="p-3 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-800">Công việc sắp đến hạn</h3>
                    </div>

                    <div className="max-h-96 overflow-y-auto py-2">
                        {upcomingTasks.length === 0 ? (
                            <div className="px-4 py-6 text-center text-gray-500">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-12 w-12 mx-auto text-gray-300 mb-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1}
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                </svg>
                                <p>Không có công việc nào sắp đến hạn</p>
                            </div>
                        ) : (
                            upcomingTasks.map((task) => (
                                <Link
                                    key={task.id}
                                    to={`/todo/${task.id}`}
                                    className="block px-4 py-3 hover:bg-gray-50"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mr-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.414L11 9.586V6z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-800 truncate">{task.title}</h4>
                                            <p className="text-sm text-gray-500">{formatTime(task.startTime)}</p>
                                            <div className="mt-1">
                                                <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                                    {getTimeUntil(task.startTime)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>

                    {upcomingTasks.length > 0 && (
                        <div className="p-3 border-t border-gray-200 text-center">
                            <Link
                                to="/todo"
                                className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                onClick={() => setIsOpen(false)}
                            >
                                Xem tất cả công việc
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;