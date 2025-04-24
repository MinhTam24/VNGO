import axiosClient from "./axiosClient";

const LikeApi = {
    // Thêm like cho blog
    like: (blogId, accountId) => {
        return axiosClient.post(`/api/likes?blogId=${blogId}&accountID=${accountId}`)
    },

    // Hủy like cho blog
    unlike: (blogId, accountId) => {
        return axiosClient.delete('/api/unlike', {
            params: {
                blogId: blogId,
                accountID: accountId,
            },
        });
    },

    // Đếm số lượng like của blog
    countLikes: (blogId) => {
        return axiosClient.get('/api/count-likes', {
            params: {
                blogId: blogId,
            },
        });
    },

    // Lấy danh sách người dùng đã like blog
    getListLikes: (blogId) => {
        return axiosClient.get('/api/likes', {
            params: {
                blogId: blogId,
            },
        });
    },

    // Kiểm tra người dùng đã like blog hay chưa
    isLiked: (blogId, accountId) => {
        return axiosClient.get('/api/like/status', {
            params: {
                blogId: blogId,
                accountID: accountId,
            },
        });
    },
};

export default LikeApi;
