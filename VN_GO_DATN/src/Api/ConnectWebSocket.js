import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import config from '../config.json';


const connectWebSocket = ({ authId, authAvatar, authFullName, onMessage, onComment, onNotification, onStatus }) => {
    
    if (!authId) return;     

    const client = new Client({
        webSocketFactory: () => new SockJS(`${config.SERVER_API}/ws`),
        
        onConnect: () => {
            console.log('Connected to WebSocket with authId', authId);

            // Đăng ký nhận tin nhắn cá nhân
            if (authId) {
                client.subscribe(`/user/${authId}/queue/messages`, (message) => {
                    onMessage(JSON.parse(message.body));
                    console.log("MESSAGE:" +JSON.parse( message.body))
                });
                client.subscribe(`/user/${authId}/queue/notification`, (notification) => { 
                    onNotification(JSON.parse(notification.body));
                    console.log("NOTIFICATION: " + JSON.parse( notification.body))
                });
                client.subscribe(`/topic/online`, (statusMessage) => { 
                    const accountStatus = JSON.parse(statusMessage.body); 
                    onStatus(accountStatus);
                    console.log("ACCOUNTSTATUS: ", accountStatus);
                });
                
                  
                // gửi trạng thái online hoặc offline đến tất cả mọi người
                client.publish({
                    destination: '/app/user.Online',
                    body: JSON.stringify({
                        accountId: authId,
                        status: 'ONLINE'
                    }),
                });

            }
        },

        onWebSocketClose: () => {
            if (client.connected) {
                console.log("WebSocket closed, sending OFFLINE status...");
                client.publish({
                    destination: '/app/user.Online',
                    body: JSON.stringify({
                        accountId: authId,
                        status: 'OFFLINE'
                    }),
                });
            } else {
                console.warn("Kết nối đã đóng, không thể gửi trạng thái OFFLINE.");
            }   
        },
        
        onStompError: (error) => {
            console.error('WebSocket Error:', error);
        },


    });


    let currentCommentSubscription = null;

    // đăng ký lắng nhe commnent từ bài viết 
    const subscribeToBlog = (blogId) => {
        if (!client.connected) {
            console.error("WebSocket is not connected yet.");
            return;
        }
    
        if (currentCommentSubscription) {
            currentCommentSubscription.unsubscribe();
            console.log("Unsubscribed from previous blog.");
        }
    
        if (blogId) {
            currentCommentSubscription = client.subscribe(`/topic/blog/${blogId}`, (comment) => {
                const commentData = JSON.parse(comment.body);
                console.log("Received comment:", commentData);
                onComment(commentData);
            });
            console.log(`Subscribed to comments for blogId: ${blogId}`);
        }
    };
    // hủy đăng ký lắng ghe comment
    const unsubscribeFromBlog = () => {
        if (currentCommentSubscription) {
            currentCommentSubscription.unsubscribe();
            currentCommentSubscription = null;
            console.log("Unsubscribed from blog comments.");
        }
    };


    const sendComment = (blogId, content) => {
        if (client.connected) {
            const commentData = {
                blogId,
                accountId: authId, // id người gửi
                fullName: authFullName, // fullName mguoi gui
                avatar: authAvatar,// avatar  người gửi
                content, 
            };

            console.log("Sending comment:", commentData);

            client.publish({
                destination: `/app/blog/${blogId}/comment`,
                body: JSON.stringify(commentData),
            });
        } else {
            console.error("WebSocket is not connected.");
        }
    };

    // gửi tin nhắn
    const sendMessage = (recipientId, message) => {
        if (client.connected) {
            const messageData = {
                senderId: authId,
                recipientId,
                content: message,
                sentAt: new Date(),
                status: 'SENT',
            };

            console.log("Đang gửi tin nhắn:", messageData);

            client.publish({
                destination: '/app/chat',
                body: JSON.stringify(messageData),
            });
        } else {
            console.error("WebSocket chưa kết nối.");
        }
    };

    // gửi gin thông báo 
    const sendNotification = ({ recipient, tagetId, notificationType, content }) => {
        if (client.connected) {
            const notificationData = {
                recipient,
                sender: authId,
                tagetId,
                notificationType,
                status: 'SENT',
                content,
                thumNail: authAvatar,
                nameSender: authFullName,
                sentAt: new Date()
            };

            console.log("Đang gửi thông báo:", notificationData);

            client.publish({
                destination: '/app/notification', // Địa chỉ WebSocket cho thông báo
                body: JSON.stringify(notificationData),
            });
        } else {
            console.error("WebSocket chưa kết nối.");
        }
    };

    client.activate();
    return { sendMessage, sendNotification, subscribeToBlog, unsubscribeFromBlog, sendComment, client };
};

export default connectWebSocket;


