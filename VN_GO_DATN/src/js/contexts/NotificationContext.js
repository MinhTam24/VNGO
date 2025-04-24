import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import connectWebSocket from '../../Api/ConnectWebSocket';
import { useAuth } from './AuthContext';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [messages, setMessages] = useState({});
    const [notification, setNotifications] = useState({});
    const [comments, setComments] = useState({});
    const { authId, authAvatar, authFullName, isLoggedIn, logout } = useAuth();
    const clientRef = useRef(null);
    const [sendMessage, setSendMessage] = useState(null);
    const [sendNotification, setSendNotification] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [onlineAccount, setOnlineAccount] = useState(null);
    const [currentBlogId, setCurrentBlogId] = useState(null);
    const subscribeToBlogRef = useRef(null);
    const unsubscribeFromBlogRef = useRef(null);
    const sendCommentRef = useRef(null);


    useEffect(() => {
        if (!authId) {
            console.log("authId không tồn tại. Đóng WebSocket nếu cần.");
            if (clientRef.current) {
                clientRef.current.deactivate();  
            }
            setIsConnected(false);
            return;
        }

        // Kết nối WebSocket nếu chưa kết nối
        const { client, sendMessage: sendMsgFunc, sendNotification: sendNotifFunc, subscribeToBlog, unsubscribeFromBlog, sendComment } = connectWebSocket({
            authId,
            authAvatar,
            authFullName,
            isLoggedIn,
            onMessage: (messages) => {
                setMessages(messages);
            },
            onComment: (comments) => {
                setComments(comments);
            },
            onNotification: (notification) => {
                console.log("thông báo trong context: " + notification);
                setNotifications(notification);
            },
            onStatus: (status) => {
                setOnlineAccount(status);
            }
        });

        clientRef.current = client;
        subscribeToBlogRef.current = subscribeToBlog;
        unsubscribeFromBlogRef.current = unsubscribeFromBlog;
        sendCommentRef.current = sendComment;

        setSendMessage(() => sendMsgFunc);
        setSendNotification(() => sendNotifFunc);
        setIsConnected(true);

        const handleBeforeUnload = () => {
            if (clientRef.current && clientRef.current.connected) {
                console.log("WebSocket đóng, gửi trạng thái OFFLINE...");
                clientRef.current.publish({
                    destination: '/app/user.Online',
                    body: JSON.stringify({
                        accountId: authId,
                        status: 'OFFLINE'
                    }),
                });
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            if (clientRef.current) {
                console.log("Deactivating WebSocket");
                clientRef.current.deactivate();
            }
            setIsConnected(false);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };

    }, [authId, authAvatar, authFullName, isLoggedIn]);

    useEffect(() => {
        if (authId && clientRef.current && clientRef.current.connected) {
            console.log("authId đã thay đổi, gửi trạng thái OFFLINE trước khi WebSocket ngắt kết nối");
            clientRef.current.publish({
                destination: '/app/user.Online',
                body: JSON.stringify({
                    accountId: authId,
                    status: 'OFFLINE'
                }),
            });
        }
        
    }, [authId]);

    const openBlog = (blogId) => {
        setCurrentBlogId(blogId);
        if (subscribeToBlogRef.current) {
            subscribeToBlogRef.current(blogId);
        }
    };


    const closeBlog = () => {
        setCurrentBlogId(null);
        if (unsubscribeFromBlogRef.current) {
            unsubscribeFromBlogRef.current();
        }
    };

    const sendComment = (blogId, content) => {
        if (sendCommentRef.current) {
            sendCommentRef.current(blogId, content);
        }
    };


    
    const handleLogout = () => {
        if (authId && clientRef.current && clientRef.current.connected) {
            console.log("authId đã thay đổi, gửi trạng thái OFFLINE trước khi WebSocket ngắt kết nối");
            clientRef.current.publish({
                destination: '/app/user.Online',
                body: JSON.stringify({
                    accountId: authId,
                    status: 'OFFLINE'
                }),
            });
            logout()
        }
    }


    return (
        <NotificationContext.Provider value={{
            messages,
            notification,
            comments,
            sendMessage,
            isConnected,
            onlineAccount,
            handleLogout,
            openBlog,
            closeBlog,
            currentBlogId,
            sendComment,
            sendNotification
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
