import React, { useState } from 'react';

const TodoForm = ({ onAddTodo }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '', // Thêm trường mô tả
        type: 'Việc nhà',
        priority: 'Bình thường',
        status: 'Chưa làm',
        startTime: '',
        endTime: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.title.trim()) {
            onAddTodo({
                ...formData,
                description: formData.description.trim(), // Xử lý mô tả
                title: formData.title.trim(),
                completed: formData.status === 'Đã làm'
            });

            // Reset form
            setFormData({
                title: '',
                type: 'Việc nhà',
                priority: 'Bình thường',
                status: 'Chưa làm',
                startTime: '',
                endTime: ''
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên công việc
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mô tả công việc
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Mô tả chi tiết về công việc này..."
                    ></textarea>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Loại công việc
                    </label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Việc nhà">Việc nhà</option>
                        <option value="Việc trên trường">Việc trên trường</option>
                        <option value="Công việc">Công việc</option>
                        <option value="Cá nhân">Cá nhân</option>
                        <option value="Cá nhân">Khác</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mức ưu tiên
                    </label>
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Cần gấp">Cao</option>
                        <option value="Bình thường">Trung bình</option>
                        <option value="Thoải mái">Thấp</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Trạng thái
                    </label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Chưa làm">Chưa làm</option>
                        <option value="Đã làm">Đã làm</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thời gian bắt đầu
                    </label>
                    <input
                        type="datetime-local"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thời gian kết thúc
                    </label>
                    <input
                        type="datetime-local"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Thêm công việc
                </button>
            </div>
        </form>
    );
};

export default TodoForm;