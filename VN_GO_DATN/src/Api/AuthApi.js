import axiosClient from './axiosClient';  // Giả sử axiosClient đã được định nghĩa như trong câu hỏi trước


const AuthApi = {

    getCurrentUser: () => {
        return axiosClient.get("/api/auth/current-user")
    },

    getAvarta: () => {
        return axiosClient.get("/api/auth/avatar")
    },

    getUserId: () => {
        return axiosClient.get("/api/auth/user-id")
    },

    getFullName: () => {
        return axiosClient.get("/api/auth/full-name")
    },

    getRoles: () => {
        return axiosClient.get("/api/auth/roles")
    },

    isAdmin: () => {
        return axiosClient.get("/api/auth/is-admin")
    },

    isUser: () => {
        return axiosClient.get("/api/auth/is-user")
    }

};

export default AuthApi;
