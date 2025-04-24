import axiosClient from "./axiosClient";

const CommentApi = {
  getCommentsByBlogId(blogId) {
    return axiosClient.get(`/api/comments/blog/${blogId}`);
  },
  addComment(commentDto) {
    return axiosClient.post("/api/comments", commentDto);
  },
  deleteComment(commentId) {
    return axiosClient.delete(`/api/comments/${commentId}`);
  },
};

export default CommentApi;
