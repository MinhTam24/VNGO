import axiosClient from "./axiosClient";

const MessageApi = {
    getListMessageBySenderIdAndRecipientId: (senderId, recipientId) => {
        return axiosClient.get(`/messages/${senderId}/${recipientId}`);
    },

    getLastedMessage: (senderId, recipientId) => {
        return axiosClient.get(`/api/latest-message/${senderId}/${recipientId}`);
    },

    updateSentToRead: (senderId, recipientId) => {
        return axiosClient.put(`/api/messages-status/${senderId}/${recipientId}`)
    },

    getCountUnread: (senderId, recipientId) => {
        return axiosClient.get(`/api/count-unread/${senderId}/${recipientId}`)
    },

    getAllCountUnread: (recipientId) => {
        return axiosClient.get(`/api/count-all-unread/${recipientId}`)
    },

    deleteContact: (senderId, recipientId) => {
        return axiosClient.put("/api/message/delete", null, {
            params: { 
                senderId: senderId,
                recipientId: recipientId
            }
        });
    }
    

};

export default MessageApi;