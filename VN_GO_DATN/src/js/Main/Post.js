/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from "@mui/icons-material/Favorite";
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import BlogPost from "./BlogPost";
import config from "../../config";

const Post = () => {
    


    const {authId} = useAuth();
    const [blogs, setBlogs] = useState([]);
    const [page, setPage] = useState(0); // Trang hiện tại
    const [size, setSize] = useState(5); // Số lượng blog trên mỗi trang
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
    const [hasMore, setHasMore] = useState(true); // Kiểm tra nếu còn blog để tải hay không
    const { SERVER_API } = config;
    


    const [likedPosts, setLikedPosts] = useState({}); // Quản lý trạng thái like cho từng bài đăng

    const handleLikeToggle = (blogId) => {
        setLikedPosts((prev) => ({
            ...prev,
            [blogId]: !prev[blogId], // Đảo ngược trạng thái like
        }));
    };



    

    const [selectedBlog, setSelectedBlog] = useState(null);
    const [modalSlideIndex, setModalSlideIndex] = useState(1); // Chỉ số slide trong modal

   



    const handleNextSlideModal = () => {
        const totalSlides = selectedBlog.images.length;
        setModalSlideIndex(modalSlideIndex === totalSlides ? 1 : modalSlideIndex + 1);
    };

    const handlePrevSlideModal = () => {
        const totalSlides = selectedBlog.images.length;
        setModalSlideIndex(modalSlideIndex === 1 ? totalSlides : modalSlideIndex - 1);
    };


    // Hàm fetch API
    const fetchBlogs = async (currentPage, pageSize) => {
        try {
            setLoading(true); // Đánh dấu đang tải dữ liệu
            const token = localStorage.getItem("token"); // Lấy token từ localStorage
            setLoading(true); // Đánh dấu đang tải dữ liệu
            const response = await axios.get(
                `${SERVER_API}/api/blog-page`, 
                {
                    params: { page: currentPage, size: pageSize },
                    headers: {
                        // 'Authorization': `Bearer ${token}`, // Gửi token đúng cách trong header
                    },
                }, 
            );
            

            // In ra response.data để kiểm tra cấu trúc của nó
            console.log("Response Data: ", response.data);

            if (Array.isArray(response.data)) {
                // Nếu số lượng blog tải về ít hơn size, có thể đã tải hết dữ liệu
                if (response.data.length < pageSize) {
                    setHasMore(false); // Nếu số lượng blog tải về ít hơn số lượng mỗi trang, dừng tải thêm
                }

                // Chỉ thêm bài viết mới nếu chưa có trong mảng blogs
                setBlogs((prevBlogs) => [
                    ...prevBlogs,
                    ...response.data.filter(
                        (newBlog) => !prevBlogs.some((blog) => blog.id === newBlog.id)
                    ),
                ]

                );
                setError(null); // Reset lỗi (nếu có)
            } else {
                setHasMore(false); // Nếu số lượng blog tải về ít hơn số lượng mỗi trang, dừng tải thêm
            }
        } catch (err) {
            setError("Không thể tải danh sách bài viết.");
        } finally {
            setLoading(false); // Kết thúc trạng thái tải
        }
    };


    // Gọi fetchBlogs khi page thay đổi và không đang tải dữ liệu
    useEffect(() => {
        if (!loading && hasMore) {
            fetchBlogs(page, size);
        }
    }, [page]);  // Chỉ gọi khi page thay đổi

    // Hàm phát hiện khi cuộn đến cuối trang
    const handleScroll = () => {
        const scrollableHeight = document.documentElement.scrollHeight;
        const currentScroll = window.innerHeight + document.documentElement.scrollTop;

        // Nếu cuộn đến cuối trang và không đang tải dữ liệu, gọi trang tiếp theo
        if (currentScroll >= scrollableHeight - 50 && !loading && hasMore) {
            setPage((prev) => prev + 1); // Tăng trang khi cuộn đến cuối
        }
    };

    useEffect(() => {
        // Đảm bảo rằng chúng ta chỉ thêm event listener một lần
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [loading, hasMore]);  // Chỉ re-attach event khi loading hoặc hasMore thay đổi




    return (
        <div>
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Kiểm tra xem có blog hay không */}
            {blogs.length === 0 ? (
                <p>Không có bài viết nào để hiển thị.</p>
            ) : (
                <div>
                    {blogs.map((blog, index) => (
                        <BlogPost
                            key={blog.id}
                            blog={blog}  
                            blogs = {blogs}
                        />
                    ))}
                </div>
            )}

            {/* Nút "Trang tiếp" chỉ khi chưa tải xong */}
            {loading && <p>Đang tải...</p>}
            {!hasMore && <p>Đã tải hết tất cả bài viết.</p>}
        </div>
    );
};

export default Post;
