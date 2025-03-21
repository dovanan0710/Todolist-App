import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const MainLayout = ({ children }) => {
    const location = useLocation();

    // Check if the current path is active
    const isActive = (path) => {
        return location.pathname === path ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100';
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-md sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex justify-between items-center">
                        <Link to="/" className="text-lg font-bold text-blue-600">TodoList App</Link>

                        <nav className="flex space-x-2">
                            <Link
                                to="/"
                                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/')}`}
                            >
                                Trang chủ
                            </Link>
                            <Link
                                to="/about"
                                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/about')}`}
                            >
                                Giới thiệu
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="flex-grow container mx-auto py-4">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white shadow-inner mt-8 py-4">
                <div className="container mx-auto px-4">
                    <div className="text-center text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} TodoList App - Ứng dụng quản lý công việc
                    </div>
                    <div className="text-left text-gray-500 text-sm">
                        Liên hệ : an07102003@gmail.com
                    </div>
                    <div className="text-left text-gray-500 text-sm">
                        Hotline: 0986916803
                    </div>

                </div>
            </footer>
        </div>
    );
};

export default MainLayout;