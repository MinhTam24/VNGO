import axiosClient from './axiosClient';  // Giả sử axiosClient đã được định nghĩa như trong câu hỏi trước

const BlogApi = {
    //Tạo bài viết
    createBlog: (blog) => {
        return axiosClient.post('/api/blog',{
            decription: blog.description, 
            isActivated: blog.isActivated,
            tour: blog.tour,
            files: blog.files
        });
    },

};

export default BlogApi;
