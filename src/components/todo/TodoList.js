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
    const [itemsPerPage, setItemsPerPage] = useState(4);
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
                const newTodos = [...prevTodos, newTodo]; // Sử dụng prevTodos thay vì todos
                console.log('newTodos', newTodos, 'prevTodos', prevTodos);
                setTotalPages(Math.ceil(newTodos.length / itemsPerPage));
                setShowForm(false);
                return newTodos; // Cập nhật state
            });
        });


        const updatedSubscription = pubsub.subscribe('TODO_UPDATED', (updatedTodo) => {
            setTodos(prevTodos => {
                const oldTodo = prevTodos.find(todo => todo.id === updatedTodo.id);

                // Kiểm tra nếu trạng thái đã chuyển từ chưa làm sang đã làm
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
                console.log('new', newTodos, prevTodos); // prevTodos là danh sách cũ, newTodos là danh sách mới
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

            // Hủy sortable
            if (sortableRef.current) {
                sortableRef.current.destroy();
            }
        };
    }, []);



    // Khởi tạo SortableJS sau khi component được render
    useEffect(() => {
        const currentTodos = getCurrentPageTodos();

        if (todoListRef.current && currentTodos.length > 0) {
            // Nếu đã có instance Sortable trước đó, destroy nó
            if (sortableRef.current) {
                sortableRef.current.destroy();
            }

            // Tạo instance mới của Sortable
            sortableRef.current = new Sortable(todoListRef.current, {
                animation: 150,
                handle: '.drag-handle',
                onEnd: handleDragEnd
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
            // Sắp xếp dữ liệu trước khi cập nhật state
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
        setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
    };

    // Xử lý thay đổi bộ lọc trạng thái
    const handleStatusFilterChange = (status) => {
        setStatusFilter(status);
        setCurrentPage(1); // Reset về trang đầu tiên khi thay đổi bộ lọc
    };

    // Xử lý khi kéo thả kết thúc
    // const handleDragEnd = (event) => {
    //     const { oldIndex, newIndex } = event;
    //     if (oldIndex === newIndex) return;

    //     // Tính toán index thực trong mảng todos gốc
    //     const startIndex = (currentPage - 1) * itemsPerPage;
    //     const realOldIndex = startIndex + oldIndex;
    //     const realNewIndex = startIndex + newIndex;

    //     // Tạo bản sao mới của mảng todos
    //     const newTodos = [...todos];
    //     // Di chuyển item trong mảng
    //     const [movedItem] = newTodos.splice(realOldIndex, 1);
    //     newTodos.splice(realNewIndex, 0, movedItem);

    //     // Cập nhật thứ tự cho mỗi item trong mảng
    //     const updatedTodos = newTodos.map((todo, index) => ({
    //         ...todo,
    //         order: index // Cập nhật thuộc tính order cho mỗi todo
    //     }));

    //     // Cập nhật state
    //     setTodos(updatedTodos);

    //     // Cập nhật thứ tự lên server
    //     todoService.updateOrder(updatedTodos).then(() => {
    //         // Đảm bảo cập nhật thành công
    //         console.log('Thứ tự đã được cập nhật trên server');

    //         // Thông báo cho người dùng
    //         setNotification({
    //             show: true,
    //             message: 'Đã cập nhật thứ tự công việc thành công',
    //             type: 'success',
    //             todoTitle: ''
    //         });
    //     }).catch(error => {
    //         console.error('Lỗi khi cập nhật thứ tự:', error);
    //         // Thêm xử lý lỗi ở đây nếu cần
    //         setError('Không thể cập nhật thứ tự các công việc. Vui lòng thử lại sau.');

    //         // Thông báo cho người dùng về lỗi
    //         setNotification({
    //             show: true,
    //             message: 'Không thể cập nhật thứ tự công việc',
    //             type: 'error',
    //             todoTitle: ''
    //         });

    //         // Tải lại dữ liệu từ server trong trường hợp lỗi
    //         loadTodos();
    //     });
    // };
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
            order: index // Cập nhật thuộc tính order cho mỗi todo
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
            order: todos.length // Thêm vào cuối danh sách
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
        setCurrentPage(1); // Reset về trang đầu tiên
    };

    // Cập nhật tổng số trang khi thay đổi bộ lọc hoặc tìm kiếm
    useEffect(() => {
        const filteredTodos = getFilteredTodos();
        setTotalPages(Math.ceil(filteredTodos.length / itemsPerPage));
        // Nếu trang hiện tại vượt quá tổng số trang mới, quay lại trang đầu tiên
        if (currentPage > Math.ceil(filteredTodos.length / itemsPerPage)) {
            setCurrentPage(1);
        }
    }, [todos, searchTerm, statusFilter, itemsPerPage]);

    // Tạo mảng các số trang để hiển thị
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5; // Số lượng nút trang tối đa hiển thị

        if (totalPages <= maxPagesToShow) {
            // Nếu tổng số trang nhỏ hơn hoặc bằng số trang tối đa, hiển thị tất cả
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Nếu tổng số trang lớn hơn số trang tối đa
            let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
            let endPage = startPage + maxPagesToShow - 1;

            if (endPage > totalPages) {
                endPage = totalPages;
                startPage = Math.max(1, endPage - maxPagesToShow + 1);
            }

            // Thêm nút trang đầu tiên nếu không phải từ trang 1
            if (startPage > 1) {
                pageNumbers.push(1);
                if (startPage > 2) pageNumbers.push('...'); // Thêm dấu ... nếu không liền kề
            }

            // Thêm các trang giữa
            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            // Thêm nút trang cuối cùng nếu không phải đến trang cuối
            if (endPage < totalPages) {
                if (endPage < totalPages - 1) pageNumbers.push('...'); // Thêm dấu ... nếu không liền kề
                pageNumbers.push(totalPages);
            }
        }

        return pageNumbers;
    };

    if (loading && todos.length === 0) {
        return <Loading />;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">{error}</div>;
    }

    const currentTodos = getCurrentPageTodos();
    const filteredTodos = getFilteredTodos();

    return (
        <div className="max-w-full px-4 py-2">
            {/* Form thêm mới (hiển thị khi showForm = true) */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="p-4 border-b sticky top-0 bg-white z-10">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold">Thêm công việc mới</h2>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="text-gray-500 p-2 hover:text-gray-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <TodoForm onAddTodo={handleAddTodo} />
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-4 flex justify-end items-center">

                {/* Nút thêm mới */}
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm flex items-center transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Thêm mới
                </button>
            </div>

            {/* Thanh tìm kiếm và bộ lọc */}
            <div className="mb-4 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
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
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="relative">
                    <select
                        value={statusFilter}
                        onChange={(e) => handleStatusFilterChange(e.target.value)}
                        className="pl-4 pr-8 py-2 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Tất cả</option>
                        <option value="active">Đang làm</option>
                        <option value="completed">Hoàn thành</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                </div>
            </div>

            {todos.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400 mb-4">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <p className="text-gray-500 mb-4">Chưa có việc cần làm nào.</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Thêm công việc mới
                    </button>
                </div>
            ) : filteredTodos.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400 mb-4">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <p className="text-gray-500 mb-4">Không tìm thấy công việc nào phù hợp.</p>
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setStatusFilter('all');
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Xem tất cả công việc
                    </button>
                </div>
            ) : (
                <div>
                    <ul ref={todoListRef} className="space-y-3">
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
                    <div className="mt-4 flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-2 md:mb-0">
                            <select
                                value={itemsPerPage}
                                onChange={handleItemsPerPageChange}
                                className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={5}>5 mục/trang</option>
                                <option value={10}>10 mục/trang</option>
                                <option value={15}>15 mục/trang</option>
                                <option value={20}>20 mục/trang</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-center">
                            <div className="flex border border-gray-300 rounded-md overflow-hidden">
                                {/* Nút Previous */}
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-1 border-r ${currentPage === 1
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'hover:bg-gray-100'
                                        }`}
                                >
                                    &laquo;
                                </button>

                                {/* Các nút số trang */}
                                {getPageNumbers().map((number, index) => (
                                    number === '...' ? (
                                        <span key={`ellipsis-${index}`} className="px-3 py-1 border-r text-gray-500">
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            key={number}
                                            onClick={() => handlePageChange(number)}
                                            className={`px-3 py-1 border-r ${currentPage === number
                                                ? 'bg-blue-500 text-white'
                                                : 'hover:bg-gray-100'
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
                                    className={`px-3 py-1 ${currentPage === totalPages
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'hover:bg-gray-100'
                                        }`}
                                >
                                    &raquo;
                                </button>
                            </div>
                        </div>

                        <div className="mt-2 md:mt-0 text-sm text-gray-500">
                            {filteredTodos.length > 0 ? (
                                <>
                                    Hiển thị {Math.min((currentPage - 1) * itemsPerPage + 1, filteredTodos.length)} - {Math.min(currentPage * itemsPerPage, filteredTodos.length)} của {filteredTodos.length} công việc
                                </>
                            ) : (
                                <>Không có công việc nào phù hợp</>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Nút thêm mới - fixed ở góc phải dưới */}
            <div className="fixed bottom-6 right-6">
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-colors"
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
