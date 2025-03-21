import axios from 'axios';
import pubsub from './pubsub';

// Thay url này bằng url mockapi của bạn
// Trong apiService.js
const API_URL = 'https://67cece56125cd5af757c0b85.mockapi.io/todolist-api';

class TodoService {
    constructor() {
        this.axios = axios.create({
            baseURL: API_URL,
        });
    }

    // Lấy danh sách todos
    async getTodos() {
        try {
            const response = await this.axios.get('/todos');
            pubsub.publish('TODOS_LOADED', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching todos:', error);
            pubsub.publish('API_ERROR', error);
            return [];
        }
    }

    // Thêm todo mới
    async addTodo(todo) {
        try {
            const response = await this.axios.post('/todos', todo);
            pubsub.publish('TODO_ADDED', response.data);
            return response.data;
        } catch (error) {
            console.error('Error adding todo:', error);
            pubsub.publish('API_ERROR', error);
            return null;
        }
    }
    // Cập nhật todo
    async updateTodo(id, updates) {
        try {
            const response = await this.axios.put(`/todos/${id}`, updates);
            pubsub.publish('TODO_UPDATED', response.data);
            return response.data;
        } catch (error) {
            console.error('Error updating todo:', error);
            pubsub.publish('API_ERROR', error);
            return null;
        }
    }

    // Xóa todo
    async deleteTodo(id) {
        try {
            await this.axios.delete(`/todos/${id}`);
            pubsub.publish('TODO_DELETED', id);
            return true;
        } catch (error) {
            console.error('Error deleting todo:', error);
            pubsub.publish('API_ERROR', error);
            return false;
        }
    }

    // Cập nhật thứ tự 
    async updateOrder(todos) {
        try {
            // MockAPI không có endpoint riêng cho việc cập nhật thứ tự
            // Thay vì gửi một request duy nhất, chúng ta sẽ cập nhật từng item
            const updatePromises = todos.map((todo, index) =>
                this.updateTodo(todo.id, { order: index })
            );

            await Promise.all(updatePromises);
            pubsub.publish('TODOS_REORDERED', todos);
            return todos;
        } catch (error) {
            console.error('Error updating order:', error);
            pubsub.publish('API_ERROR', error);
            // Fallback: Tải lại danh sách để đồng bộ
            this.getTodos();
            return null;
        }
    }
}

export default new TodoService();