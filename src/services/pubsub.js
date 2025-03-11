// Triển khai PubSub Pattern
class PubSub {
    constructor() {
        this.subscribers = {};
    }

    // Đăng ký subscriber
    subscribe(event, callback) {
        if (!this.subscribers[event]) {
            this.subscribers[event] = [];
        }
        const index = this.subscribers[event].push(callback) - 1;

        // Trả về hàm để unsubscribe
        return {
            unsubscribe: () => {
                this.subscribers[event].splice(index, 1);
            }
        };
    }

    // Phát ra sự kiện và dữ liệu tới tất cả subscribers
    publish(event, data) {
        if (!this.subscribers[event]) {
            return;
        }

        this.subscribers[event].forEach(callback => {
            callback(data);
        });
    }
}

// Tạo instance của PubSub để sử dụng trong toàn bộ ứng dụng
const pubsub = new PubSub();

export default pubsub;