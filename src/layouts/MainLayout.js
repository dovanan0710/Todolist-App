import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from './Header';

const MainLayout = ({ children }) => {
    const location = useLocation();

    // Check if the current path is active
    const isActive = (path) => {
        return location.pathname === path ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100';
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Header />

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

                </div>
            </footer>
        </div>
    );
};

export default MainLayout;