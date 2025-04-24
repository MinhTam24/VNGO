import axiosClient from "./axiosClient";

const NotificationApi = {

    getListNotificationRecived: (accountId)  => {
        return axiosClient.get("/api/notifications", {
            params: { accountId }  
          });
    },

    removeNotification: (notificationId) => {
        return axiosClient.delete("/api/remove-notification", {
            params: { notificationId }  
          });
    },

    removeNotificationBySender: (senderId, recipientId) => {
        return axiosClient.delete("/api/removeBySender", {
            params: { senderId, recipientId}  
          });
    }
};

export default NotificationApi;

