import React, { useState, useEffect, useContext } from 'react';
import '../../css/Chat.css';
import { NotificationContext } from "../contexts/NotificationContext";
import MessageApi from "../../Api/MessageApi";
import { useAuth } from '../../js/contexts/AuthContext';

const Chat = () => {
    const [messagenotificationCount, setMessagenotificationCount] = useState(0);
    
    const { messages } = useContext(NotificationContext); // Giả sử `messages` là danh sách thông báo mới
    const { authId } = useAuth();

    const countUnreadMessage = async (authId) => {
        try {
            const unreadCount = await MessageApi.getAllCountUnread(authId);
            setMessagenotificationCount(unreadCount);
        } catch (error) {
            console.error("Lỗi khi đếm tin nhắn chưa đọc:", error);
            return 0;
        }
    };

    useEffect(() => {
        if (authId) {
            countUnreadMessage(authId);
        }
    }, [authId])

    // Đặt về 0 khi click vào biểu tượng chat
    const handleMessageNotificationClick = () => {
        setMessagenotificationCount(0);
    };

    useEffect(() => {
        if (messages) {
            setMessagenotificationCount((prevCount) => prevCount + 1);
        }
    }, [messages]);

    return (
        <div className="chat-icon" onClick={handleMessageNotificationClick}>
            <i className="fas fa-comments icon"></i>
            {messagenotificationCount > 0 && (
                <span className="notification-badge messsage-notification">
                    {messagenotificationCount}
                </span>
            )}
        </div>
    );
};

export default Chat;
