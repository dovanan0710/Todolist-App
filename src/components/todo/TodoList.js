import React, { useEffect, useRef, useState } from 'react';
import Sortable from 'sortablejs';
import pubsub from '../../services/pubsub';
import todoService from '../../services/apiService';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import Loading from '../common/Loading';
import Notification from '../common/Notification';

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // Tìm kiếm và lọc
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(1);

    // Thông báo
    const [notification, setNotification] = useState({
        show: false,
        message: '',
        type: 'success',
        todoTitle: ''
    });

    const todoListRef = useRef(null);
    const sortableRef = useRef(null);

    // Đăng ký các sự kiện PubSub 
    useEffect(() => {
        // Đăng ký các sự kiện từ API Service
        const loadedSubscription = pubsub.subscribe('TODOS_LOADED', (data) => {
            // Sắp xếp dữ liệu trước khi cập nhật state
            const sortedData = [...data].sort((a, b) => a.order - b.order);
            setTodos(sortedData);
            setTotalPages(Math.ceil(sortedData.length / itemsPerPage));
            setLoading(false);
        });

        const addedSubscription = pubsub.subscribe('TODO_ADDED', (newTodo) => {
            setTodos(prevTodos => {
                const newTodos = [...prevTodos, newTodo];
                setTotalPages(Math.ceil(newTodos.length / itemsPerPage));
                setShowForm(false);
                return newTodos;
            });
        });

        const updatedSubscription = pubsub.subscribe('TODO_UPDATED', (updatedTodo) => {
            setTodos(prevTodos => {
                const oldTodo = prevTodos.find(todo => todo.id === updatedTodo.id);

                if (oldTodo && oldTodo.status !== 'Đã làm' && updatedTodo.status === 'Đã làm') {
                    setNotification({
                        show: true,
                        message: `Bạn đã hoàn thành công việc: ${updatedTodo.title}`,
                        type: 'success',
                        todoTitle: updatedTodo.title
                    });
                }

                return prevTodos.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo);
            });
        });

        const deletedSubscription = pubsub.subscribe('TODO_DELETED', (id) => {
            setTodos(prevTodos => {
                const newTodos = prevTodos.filter(todo => todo.id !== id);
                setTotalPages(Math.ceil(newTodos.length / itemsPerPage));

                if (currentPage > 1 && (currentPage - 1) * itemsPerPage >= newTodos.length) {
                    setCurrentPage(currentPage - 1);
                }

                return newTodos;
            });
        });

        const reorderedSubscription = pubsub.subscribe('TODOS_REORDERED', (reorderedTodos) => {
            if (Array.isArray(reorderedTodos)) {
                setTodos(reorderedTodos);
            }
        });

        const errorSubscription = pubsub.subscribe('API_ERROR', (error) => {
            setError(error.message || 'Đã xảy ra lỗi');
            setLoading(false);
        });

        // Tải dữ liệu ban đầu
        loadTodos();

        // Hủy đăng ký khi component unmount
        return () => {
            loadedSubscription.unsubscribe();
            addedSubscription.unsubscribe();
            updatedSubscription.unsubscribe();
            deletedSubscription.unsubscribe();
            reorderedSubscription.unsubscribe();
            errorSubscription.unsubscribe();

            if (sortableRef.current) {
                sortableRef.current.destroy();
            }
        };
    }, []);

    // Khởi tạo SortableJS sau khi component được render
    useEffect(() => {
        const currentTodos = getCurrentPageTodos();

        if (todoListRef.current && currentTodos.length > 0) {
            if (sortableRef.current) {
                sortableRef.current.destroy();
            }

            sortableRef.current = new Sortable(todoListRef.current, {
                animation: 150,
                handle: '.drag-handle',
                onEnd: handleDragEnd,
                ghostClass: 'bg-blue-50'
            });
        }
    }, [todos, currentPage, itemsPerPage, searchTerm, statusFilter]);

    // Lọc todos dựa trên tìm kiếm và bộ lọc trạng thái
    const getFilteredTodos = () => {
        return todos.filter(todo => {
            // Lọc theo tìm kiếm
            const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase());

            // Lọc theo trạng thái
            let matchesStatus = true;
            if (statusFilter === 'active') {
                matchesStatus = todo.status === 'Chưa làm';
            } else if (statusFilter === 'completed') {
                matchesStatus = todo.status === 'Đã làm';
            }

            return matchesSearch && matchesStatus;
        });
    };

    // Lấy các todos cho trang hiện tại
    const getCurrentPageTodos = () => {
        const filteredTodos = getFilteredTodos();
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredTodos.slice(startIndex, endIndex);
    };

    // Tải danh sách todos
    const loadTodos = async () => {
        setLoading(true);
        await todoService.getTodos();
    };

    // Sắp xếp todos theo thứ tự khi nhận được từ API
    useEffect(() => {
        const loadedSubscription = pubsub.subscribe('TODOS_LOADED', (data) => {
            const sortedData = [...data].sort((a, b) => a.order - b.order);
            setTodos(sortedData);
            setTotalPages(Math.ceil(sortedData.length / itemsPerPage));
            setLoading(false);
        });

        return () => {
            loadedSubscription.unsubscribe();
        };
    }, [itemsPerPage]);

    // Xử lý thay đổi trong tìm kiếm
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    // Xử lý thay đổi bộ lọc trạng thái
    const handleStatusFilterChange = (status) => {
        setStatusFilter(status);
        setCurrentPage(1);
    };

    // Xử lý khi kéo thả kết thúc
    const handleDragEnd = (event) => {
        const { oldIndex, newIndex } = event;
        if (oldIndex === newIndex) return;

        // Tính toán index thực trong mảng todos gốc
        const startIndex = (currentPage - 1) * itemsPerPage;
        const realOldIndex = startIndex + oldIndex;
        const realNewIndex = startIndex + newIndex;

        // Tạo bản sao mới của mảng todos
        const newTodos = [...todos];
        // Di chuyển item trong mảng
        const [movedItem] = newTodos.splice(realOldIndex, 1);
        newTodos.splice(realNewIndex, 0, movedItem);

        // Cập nhật thứ tự cho mỗi item trong mảng
        const updatedTodos = newTodos.map((todo, index) => ({
            ...todo,
            order: index
        }));

        // Cập nhật thứ tự lên server
        todoService.updateOrder(updatedTodos)
            .then(() => {
                // Tải lại danh sách todos để đảm bảo đúng thứ tự
                loadTodos();

                // Thông báo cho người dùng
                setNotification({
                    show: true,
                    message: 'Đã cập nhật thứ tự công việc thành công',
                    type: 'success',
                    todoTitle: ''
                });
            })
            .catch(error => {
                console.error('Lỗi khi cập nhật thứ tự:', error);

                // Thông báo lỗi
                setNotification({
                    show: true,
                    message: 'Không thể cập nhật thứ tự công việc',
                    type: 'error',
                    todoTitle: ''
                });

                // Tải lại dữ liệu từ server trong trường hợp lỗi
                loadTodos();
            });
    };

    // Thêm todo mới
    const handleAddTodo = (todoData) => {
        const newTodo = {
            ...todoData,
            order: todos.length
        };
        todoService.addTodo(newTodo);
    };

    // Cập nhật trạng thái todo
    const handleToggleTodo = (id) => {
        const todo = todos.find(todo => todo.id === id);
        if (todo) {
            const newStatus = todo.status === 'Đã làm' ? 'Chưa làm' : 'Đã làm';
            todoService.updateTodo(id, {
                status: newStatus,
                completed: newStatus === 'Đã làm'
            });
        }
    };

    // Xóa todo
    const handleDeleteTodo = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
            todoService.deleteTodo(id);
        }
    };

    // Xử lý thay đổi trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Xử lý thay đổi số mục trên mỗi trang
    const handleItemsPerPageChange = (e) => {
        const value = parseInt(e.target.value);
        setItemsPerPage(value);
        const filteredTodos = getFilteredTodos();
        setTotalPages(Math.ceil(filteredTodos.length / value));
        setCurrentPage(1);
    };

    // Cập nhật tổng số trang khi thay đổi bộ lọc hoặc tìm kiếm
    useEffect(() => {
        const filteredTodos = getFilteredTodos();
        setTotalPages(Math.ceil(filteredTodos.length / itemsPerPage));
        if (currentPage > Math.ceil(filteredTodos.length / itemsPerPage)) {
            setCurrentPage(1);
        }
    }, [todos, searchTerm, statusFilter, itemsPerPage]);

    // Tạo mảng các số trang để hiển thị
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
            let endPage = startPage + maxPagesToShow - 1;

            if (endPage > totalPages) {
                endPage = totalPages;
                startPage = Math.max(1, endPage - maxPagesToShow + 1);
            }

            if (startPage > 1) {
                pageNumbers.push(1);
                if (startPage > 2) pageNumbers.push('...');
            }

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) pageNumbers.push('...');
                pageNumbers.push(totalPages);
            }
        }

        return pageNumbers;
    };

    if (loading && todos.length === 0) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="rounded-xl bg-red-50 p-6 text-center shadow">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-red-900 mb-2">Đã xảy ra lỗi</h3>
                <p className="text-red-700">{error}</p>
            </div>
        );
    }

    const currentTodos = getCurrentPageTodos();
    const filteredTodos = getFilteredTodos();

    return (
        <div className="max-w-full">
            {/* Form thêm mới (hiển thị khi showForm = true) */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-50 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
                        <div className="p-4 border-b sticky top-0 bg-blue-600 text-white rounded-t-xl z-10">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold">Thêm công việc mới</h2>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="text-white p-2 hover:text-gray-200 rounded-full hover:bg-blue-500 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <TodoForm onAddTodo={handleAddTodo} />
                        </div>
                    </div>
                </div>
            )}

            {/* Tiêu đề và nút thêm mới */}
            <div className="mb-6 flex justify-between items-center">
                <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h2 className="text-xl font-semibold text-gray-800">Danh sách công việc của bạn</h2>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-md hover:shadow-lg"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Thêm mới
                </button>
            </div>

            {/* Thanh tìm kiếm và bộ lọc */}
            <div className="bg-blue-50 rounded-xl shadow p-6 mb-6">
                <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm kiếm công việc..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="relative w-full md:w-48">
                        <select
                            value={statusFilter}
                            onChange={(e) => handleStatusFilterChange(e.target.value)}
                            className="w-full pl-4 pr-8 py-2 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Tất cả</option>
                            <option value="active">Chưa hoàn thành</option>
                            <option value="completed">Đã hoàn thành</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Danh sách công việc */}
            <div className="bg-gray-100 rounded-xl shadow-lg overflow-hidden">
                {todos.length === 0 ? (
                    <div className="p-8 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-blue-300 mb-4">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có việc cần làm</h3>
                        <p className="text-gray-500 mb-4">Thêm công việc mới để bắt đầu quản lý hiệu quả</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition-colors inline-flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Thêm công việc mới
                        </button>
                    </div>
                ) : filteredTodos.length === 0 ? (
                    <div className="p-8 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-blue-300 mb-4">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy kết quả</h3>
                        <p className="text-gray-500 mb-4">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setStatusFilter('all');
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition-colors"
                        >
                            Xem tất cả công việc
                        </button>
                    </div>
                ) : (
                    <div>
                        <ul ref={todoListRef} className="divide-y divide-gray-200 margin: 10px">
                            {currentTodos.map((todo) => (
                                <TodoItem
                                    key={todo.id}
                                    todo={todo}
                                    onToggle={handleToggleTodo}
                                    onDelete={handleDeleteTodo}
                                />
                            ))}
                        </ul>

                        {/* Phân trang */}
                        <div className="bg-gray-200 px-6 py-4 flex flex-col md:flex-row justify-between items-center">
                            <div className="mb-4 md:mb-0">
                                <select
                                    value={itemsPerPage}
                                    onChange={handleItemsPerPageChange}
                                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value={5}>5 mục/trang</option>
                                    <option value={10}>10 mục/trang</option>
                                    <option value={15}>15 mục/trang</option>
                                    <option value={20}>20 mục/trang</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-center">
                                <div className="flex border border-gray-300 rounded-lg overflow-hidden shadow-sm bg-white">
                                    {/* Nút Previous */}
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-2 border-r ${currentPage === 1
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'hover:bg-blue-50 text-blue-600'
                                            }`}
                                    >
                                        &laquo;
                                    </button>

                                    {/* Các nút số trang */}
                                    {getPageNumbers().map((number, index) => (
                                        number === '...' ? (
                                            <span key={`ellipsis-${index}`} className="px-3 py-2 border-r text-gray-500">
                                                ...
                                            </span>
                                        ) : (
                                            <button
                                                key={number}
                                                onClick={() => handlePageChange(number)}
                                                className={`px-3 py-2 border-r min-w-[40px] ${currentPage === number
                                                    ? 'bg-blue-600 text-white'
                                                    : 'hover:bg-blue-50 text-blue-600'
                                                    }`}
                                            >
                                                {number}
                                            </button>
                                        )
                                    ))}

                                    {/* Nút Next */}
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`px-3 py-2 ${currentPage === totalPages
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'hover:bg-blue-50 text-blue-600'
                                            }`}
                                    >
                                        &raquo;
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4 md:mt-0 text-sm text-gray-600">
                                {filteredTodos.length > 0 && (
                                    <>
                                        Hiển thị {Math.min((currentPage - 1) * itemsPerPage + 1, filteredTodos.length)} - {Math.min(currentPage * itemsPerPage, filteredTodos.length)} của {filteredTodos.length} công việc
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Nút thêm mới - fixed ở góc phải dưới */}
            <div className="fixed bottom-6 right-6 z-10">
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-colors"
                    aria-label="Thêm công việc mới"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
            </div>

            {/* Thông báo */}
            {notification.show && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification({ ...notification, show: false })}
                />
            )}
        </div>
    );
};

export default TodoList;