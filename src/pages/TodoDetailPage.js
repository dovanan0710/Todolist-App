import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import todoService from '../services/apiService';
import Loading from '../components/common/Loading';

const TodoDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        type: 'Việc nhà',
        priority: 'Bình thường',
        status: 'Chưa làm',
        startTime: '',
        endTime: '',
        completed: false
    });

    useEffect(() => {
        const fetchTodoDetail = async () => {
            try {
                const response = await todoService.axios.get(`/todos/${id}`);
                const todoData = response.data;

                // Format dates for datetime-local input
                const formatDateForInput = (dateStr) => {
                    if (!dateStr) return '';
                    const date = new Date(dateStr);
                    return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
                };

                setFormData({
                    title: todoData.title || '',
                    type: todoData.type || 'Việc nhà',
                    priority: todoData.priority || 'Bình thường',
                    status: todoData.status || 'Chưa làm',
                    startTime: formatDateForInput(todoData.startTime),
                    endTime: formatDateForInput(todoData.endTime),
                    completed: todoData.completed || false
                });

                setLoading(false);
            } catch (error) {
                console.error('Error fetching todo detail:', error);
                setError('Không thể tải thông tin công việc. Vui lòng thử lại sau.');
                setLoading(false);
            }
        };

        fetchTodoDetail();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            // Nếu thay đổi status, cập nhật cả completed
            ...(name === 'status' ? { completed: value === 'Đã làm' } : {})
        }));
    };

    const handleUpdate = async () => {
        if (!formData.title.trim()) {
            alert('Tiêu đề không được để trống');
            return;
        }

        try {
            await todoService.updateTodo(id, formData);
            alert('Cập nhật thành công!');
            navigate('/');
        } catch (error) {
            console.error('Error updating todo:', error);
            alert('Cập nhật thất bại. Vui lòng thử lại.');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
            try {
                await todoService.deleteTodo(id);
                alert('Xóa thành công!');
                navigate('/');
            } catch (error) {
                console.error('Error deleting todo:', error);
                alert('Xóa thất bại. Vui lòng thử lại.');
            }
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">{error}</div>;
    }

    return (
        <div className="px-4 py-2">
            {/* Header với nút quay lại */}
            <div className="flex items-center mb-4">
                <button
                    onClick={() => navigate('/')}
                    className="mr-2 p-2 text-blue-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <h2 className="text-xl font-bold">Chi tiết công việc</h2>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID:</label>
                    <div className="p-2 bg-gray-100 rounded text-sm">{id}</div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên công việc:</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại công việc:</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Việc nhà">Việc nhà</option>
                        <option value="Việc trên trường">Việc trên trường</option>
                        <option value="Công việc">Công việc</option>
                        <option value="Cá nhân">Cá nhân</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tình trạng:</label>
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Cần gấp">Cần gấp</option>
                        <option value="Bình thường">Bình thường</option>
                        <option value="Thoải mái">Thoải mái</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái:</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Chưa làm">Chưa làm</option>

                        <option value="Đã làm">Đã làm</option>
                    </select>
                </div>

                <div className="mb-4 flex items-center">
                    <input
                        type="checkbox"
                        id="completed"
                        name="completed"
                        checked={formData.completed}
                        onChange={(e) => setFormData(prev => ({
                            ...prev,
                            completed: e.target.checked,
                            status: e.target.checked ? 'Đã làm' : 'Chưa làm'
                        }))}
                        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                    />
                    <label htmlFor="completed" className="text-sm font-medium text-gray-700">
                        Đánh dấu hoàn thành
                    </label>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian bắt đầu:</label>
                    <input
                        type="datetime-local"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian kết thúc:</label>
                    <input
                        type="datetime-local"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex space-x-2">
                    <button
                        onClick={handleUpdate}
                        className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600"
                    >
                        Cập nhật
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex-1 bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600"
                    >
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TodoDetailPage;