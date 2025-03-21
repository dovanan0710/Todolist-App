import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotificationBell = ({ upcomingTasks = [] }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const formatTime = (dateStr) => {
        if (!dateStr) return "Không có thời hạn";
        let date = new Date(dateStr);

        // Nếu ngày không hợp lệ, thử thêm ":00.000Z"
        if (isNaN(date.getTime())) {
            date = new Date(dateStr + ":00.000Z");
        }
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };


    return (
        <div className="relative mr-4" ref={notificationRef}>
            <button
                className="text-gray-600 hover:text-blue-600 focus:outline-none"
                onClick={() => {
                    setShowNotifications(prev => !prev);
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
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
                {/* Badge hiển thị số lượng thông báo */}
                {upcomingTasks.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {upcomingTasks.length}
                    </span>
                )}
            </button>

            {/* Dropdown hiển thị danh sách công việc cần làm */}
            {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-700">Công việc sắp đến hạn</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {upcomingTasks.length > 0 ? (
                            upcomingTasks.map(task => (
                                <Link
                                    to={`/todo/${task.id}`}
                                    key={task.id}
                                    className="block px-4 py-2 hover:bg-gray-100 border-b border-gray-100"
                                    onClick={() => setShowNotifications(false)}
                                >
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mt-1">
                                            <svg className="h-4 w-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-2">
                                            <p className="text-sm font-medium text-gray-900">{task.title}</p>
                                            <p className="text-xs text-gray-500">{formatTime(task.startTime)}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                Không có công việc nào sắp đến hạn
                            </div>
                        )}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-200">
                        <Link
                            to="/"
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                            onClick={() => setShowNotifications(false)}
                        >
                            Xem tất cả công việc
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;