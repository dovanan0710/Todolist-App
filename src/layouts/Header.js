import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NotificationBell from '../components/common/NotificationBell';
import todoService from '../services/apiService';
import pubsub from '../services/pubsub';

const Header = () => {
    const [upcomingTasks, setUpcomingTasks] = useState([]);

    const fetchUpcomingTasks = async () => {
        try {
            const response = await todoService.axios.get('/todos');
            const todos = response.data;

            const now = new Date();
            const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

            const upcoming = todos.filter(todo => {
                // Chuẩn hóa startTime nếu thiếu giây
                let normalizedTime = todo.startTime;
                if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(todo.startTime)) {
                    normalizedTime += ":00"; // Thêm giây nếu thiếu
                }
                normalizedTime += ".000Z"; // Đảm bảo định dạng đầy đủ

                const taskTime = new Date(normalizedTime);

                return taskTime > now && taskTime < next24Hours && !todo.completed;
            });

            setUpcomingTasks(upcoming);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách công việc:", error);
        }
    };

    useEffect(() => {
        // Lấy danh sách công việc ban đầu
        fetchUpcomingTasks();

        // Đăng ký sự kiện từ PubSub để refresh danh sách
        const todoUpdatedSubscription = pubsub.subscribe('TODO_UPDATED', fetchUpcomingTasks);
        const todoDeletedSubscription = pubsub.subscribe('TODO_DELETED', fetchUpcomingTasks);
        const todoAddedSubscription = pubsub.subscribe('TODO_ADDED', fetchUpcomingTasks);

        // Thiết lập interval để cập nhật định kỳ
        const intervalId = setInterval(fetchUpcomingTasks, 60000);

        // Cleanup
        return () => {
            clearInterval(intervalId);
            todoUpdatedSubscription.unsubscribe();
            todoDeletedSubscription.unsubscribe();
            todoAddedSubscription.unsubscribe();
        };
    }, []);

    const isActive = (path) => {
        return window.location.pathname === path
            ? 'text-blue-600 bg-blue-50'
            : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50';
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center text-lg font-bold text-blue-600">
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
                            className="w-6 h-6 mr-2"
                        >
                            <rect x="3" y="5" width="6" height="6" rx="1"></rect>
                            <path d="m3 17 2 2 4-4"></path>
                            <path d="M13 6h8"></path>
                            <path d="M13 12h8"></path>
                            <path d="M13 18h8"></path>
                        </svg>
                        TodoList App
                    </Link>

                    <div className="flex items-center">
                        {/* Component thông báo - Cần đảm bảo z-index cao hơn phần còn lại của trang */}
                        <div className="relative mr-2">
                            <NotificationBell upcomingTasks={upcomingTasks} />
                        </div>

                        <nav className="flex space-x-2">
                            <Link
                                to="/todo"
                                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/')}`}
                            >
                                My work
                            </Link>
                            <Link
                                to="/"
                                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/')}`}
                            >
                                Home
                            </Link>
                            <Link
                                to="/about"
                                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/about')}`}
                            >
                                About
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;