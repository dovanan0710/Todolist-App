import React from 'react';
import TodoList from '../components/todo/TodoList';
const HomePage = () => {
    return (
        <div>
            <div className="flex items-center justify-center mb-8">
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
                    className="w-8 h-8 text-blue-500 mr-2"
                >
                    <rect x="3" y="5" width="6" height="6" rx="1"></rect>
                    <path d="m3 17 2 2 4-4"></path>
                    <path d="M13 6h8"></path>
                    <path d="M13 12h8"></path>
                    <path d="M13 18h8"></path>
                </svg>
                <h1 className="text-3xl font-bold text-gray-800">Danh sách việc cần làm</h1>
            </div>
            <TodoList />
        </div>
    );
};

export default HomePage;