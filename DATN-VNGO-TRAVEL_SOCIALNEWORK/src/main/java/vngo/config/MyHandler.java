package vngo.config;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.CloseStatus;


public class MyHandler implements WebSocketHandler {

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("Kết nối WebSocket đã được thiết lập với session ID: " + session.getId());
        // Bạn có thể gửi một thông điệp chào mừng tới client
        session.sendMessage(new TextMessage("Chào mừng bạn đến với WebSocket!"));
    }

    @Override
    public void handleMessage(WebSocketSession session, org.springframework.web.socket.WebSocketMessage<?> message) throws Exception {
        // Xử lý khi có thông điệp đến từ client
        System.out.println("Nhận được thông điệp từ client: " + message.getPayload());
        // Trả lời lại client
        session.sendMessage(new TextMessage("Thông điệp của bạn đã được nhận: " + message.getPayload()));
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        // Xử lý lỗi khi kết nối gặp vấn đề
        System.out.println("Lỗi khi truyền tải: " + exception.getMessage());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        // Xử lý khi kết nối WebSocket bị đóng
        System.out.println("Kết nối WebSocket đã bị đóng, session ID: " + session.getId());
    }

    @Override
    public boolean supportsPartialMessages() {
        // Nếu bạn không hỗ trợ chia nhỏ tin nhắn thì trả về false
        return false;
    }
}
