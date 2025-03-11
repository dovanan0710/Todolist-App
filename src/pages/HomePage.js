import React from 'react';
import TodoList from '../components/todo/TodoList';

const HomePage = () => {
    return (
        <div>
            <h1 className="text-xl font-bold mb-4 text-center">Danh sách việc cần làm</h1>
            <TodoList />
        </div>
    );
};

export default HomePage;