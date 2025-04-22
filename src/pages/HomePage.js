import React from 'react';
import TodoList from '../components/todo/TodoList';

const HomePage = () => {
    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="flex items-center justify-center mb-8">
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-400 py-6 px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                            <h2 className="text-white text-xl font-semibold">Quản lý công việc của bạn</h2>
                            <p className="text-blue-100 mt-1">Tạo, sắp xếp và theo dõi các công việc một cách hiệu quả</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <div className="flex items-center bg-white bg-opacity-20 text-white rounded-lg py-2 px-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                {new Date().toLocaleDateString('vi-VN', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <TodoList />
                </div>
            </div>
        </div>
    );
};

export default HomePage;