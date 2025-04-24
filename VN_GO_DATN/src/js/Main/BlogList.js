import React, { useEffect, useState } from "react";
import BlogPost from "./BlogPost";
import { useAuth } from "../../js/contexts/AuthContext";
import config from "../../config";
const BlogList = ({id}) => {
  const [blogs, setBlogs] = useState([]); // State để lưu danh sách blog
  const [error, setError] = useState(null); // State để lưu lỗi nếu có
  const { SERVER_API } = config;

  // Fetch dữ liệu từ API
  useEffect(() => {
    if(id){
      const fetchBlogs = async () => {
        try {
          const token = localStorage.getItem("token"); // Lấy token từ localStorage
          const response = await fetch(
            `${SERVER_API}/api/blog-createBy?accountId=${id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Gắn token vào request
              },
            }
          );          if (!response.ok) {
            throw new Error(`Lỗi: ${response.statusText}`);
          }
          const data = await response.json(); // Chuyển đổi response thành JSON
          setBlogs(data || []); // Lưu dữ liệu vào state, mặc định là mảng rỗng nếu không có dữ liệu
        } catch (err) {
          setError(err.message); // Lưu lỗi vào state
        }
      };
      fetchBlogs(); // Gọi hàm fetch dữ liệu
    }

  }, [id]); // Chỉ chạy lại nếu `id` thay đổi

  // Nếu có lỗi, hiển thị lỗi
  if (error) {
    return <p style={{ color: "red" }}>Không có bài viết nào!</p>;
  }

  // Nếu dữ liệu rỗng, hiển thị thông báo
  if (!blogs || blogs.length === 0) {
    return <p>Không có bài viết nào.</p>;
  }

  // Hiển thị danh sách bài viết
  return (
    <div>
      {blogs.map((blog) => (
        <BlogPost key={blog.id} blog={blog} blogs = {blogs}/>
      ))}
    </div>
  );
};

export default BlogList;
