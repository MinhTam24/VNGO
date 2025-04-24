import React, { useEffect, useState, useContext } from 'react';
import '../../css/Notification.css';
import NotificationApi from '../../Api/NotificationApi';
import { useAuth } from '../contexts/AuthContext';
import { NotificationContext } from "../contexts/NotificationContext";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const { authId } = useAuth();
  const { notification } = useContext(NotificationContext);



  // Fetch notifications from API
  useEffect(() => {
    if (authId) {
      const fetchNotifications = async () => {
        try {
          const response = await NotificationApi.getListNotificationRecived(authId);
          if (Array.isArray(response)) {
            const groupedNotifications = groupNotificationsBySender(response);
            setNotifications(groupedNotifications);
          } else {
            console.error("API response is not an array:", response);
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };
      fetchNotifications();
    }
  }, [authId]);


  useEffect(() => {
    if (notification) {
      setNotifications((prevNotifications) => [...prevNotifications, notification]);
    }
  }, [notification]);
  

  const groupNotificationsBySender = (notifications) => {
    const grouped = {};

    notifications.forEach(notification => {
      const sender = notification.sender || 'Unknown Sender';
      if (!grouped[sender]) {
        grouped[sender] = [];
      }
      grouped[sender].push(notification);
    });

    return Object.keys(grouped).map((sender) => {
      const senderNotifications = grouped[sender];
      if (senderNotifications.length > 3) {
        const lastNotificationContent = senderNotifications[senderNotifications.length - 1].content;
        return {
          ...senderNotifications[senderNotifications.length - 1],
          content: `${truncateMessage(lastNotificationContent)} (${senderNotifications.length} new notifications)`,
          isGrouped: true,
        };
      } else {
        return senderNotifications.map(notification => ({
          ...notification,
          content: notification.content,
          isGrouped: false,
        }));
      }
    }).flat();
  };

  // Remove single notification
  const removeNotificaion = async (notificationId) => {
    try {
      const response = await NotificationApi.removeNotification(notificationId);
      if (response === true) {
        setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
      }
    } catch (error) {
      console.error("Error removing notification:", error);
    }
  };

  // Remove all notifications by sender
  const removeNotificaionBysender = async (senderId) => {
    try {
      const response = await NotificationApi.removeNotificationBySender(senderId, authId);
      setNotifications(prev => prev.filter(notification => notification.sender !== senderId));
    } catch (error) {
      console.error("Error removing notifications by sender:", error);
    }
  };

  const truncateMessage = (message) => {
    return message?.length > 40 ? `${message.slice(0, 40)}...` : message || 'No message content';
  };

  const truccateContent = (message) => {
    return message?.length > 60 ? `${message.slice(0, 60)}...` : message || 'No message content';
  };


  return (
    <main className="col-sm-6 py-2">
      <h2 className="mt-3 titleTb">Thông báo</h2>
      <hr />
      <div className="notificationZone">
        {notifications.length === 0 ? (
          <p>KHÔNG Có Thống báo</p>
        ) : (
          notifications.map((notification, index) => (
            <div key={index} className="notification success d-flex flex-column align-items-start">
              <button
                className="btn btn-close"
                onClick={() => {
                  if (notification.isGrouped) {
                    removeNotificaionBysender(notification.sender);
                  } else {
                    removeNotificaion(notification.id);
                  }
                }}
              ></button>
              <div className="d-flex align-items-center mb-2 w-100">
                <div className="notification-avatar me-2">
                  <img
                    src={notification.thumNail}
                    alt="Avatar"
                    className="avatar-img rounded-circle"
                  />
                </div>
                <div className="d-flex flex-column w-100">
                  <div className="d-flex gap-1 text-dark">
                    <span className="fw-bold">{notification.nameSender}</span>
                    <p className="mb-0" style={{ fontWeight: 150 }}>
                      {truccateContent(notification.content)}
                    </p>
                  </div>
                  <div className="timestamp">{notification.sentAt}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
};

export default Notification;
