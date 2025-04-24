import React, { useState, useContext, useEffect, useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../js/contexts/AuthContext";
import BlogUpdate from "./BlogUpdate";
import { ThumbUp, Comment, Share } from "@mui/icons-material";
import { NotificationContext } from "../contexts/NotificationContext";
import accountApi from '../../Api/AccountApi';
import LikeApi from '../../Api/LikeApi';
import CommentApi from "../../Api/CommentApi";


const BlogPost = ({ blog, blogs }) => {
    const { authId } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [slideIndexes, setSlideIndexes] = useState(
        blogs.reduce((acc, blog) => {
            acc[blog.id] = 1;
            return acc;
        }, {})
    );
    const commentEndRef = useRef(null);  // Tham chiếu khu vực comment
    const [modalSlideIndexes, setModalSlideIndexes] = useState({});
    const [liked, setLiked] = useState(false);
    const [unsubscribe, setUnsubscribe] = useState(null); // state để lưu trữ hàm unsubscribe
    const { sendNotification, openBlog, closeBlog, sendComment, comments } = useContext(NotificationContext);
    const [likeQuantity, setLikeQuantity] = useState(null)
    const [comment, setComment] = useState("");
    const [ mapComments , setMapComment] = useState([]);
    const [isCommentsFetched, setIsCommentsFetched] = useState(false);


    //  useEffect(() => {
    //         if (commentEndRef.current) {
    //             commentEndRef.current.scrollIntoView({ behavior: "smooth" });
    //         }
    //     }, [comment]);

    useEffect(() => {
           if (comments) {
            console.log("Nhận được comment", JSON.stringify(comments));  // Chuyển đối tượng thành chuỗi JSON để dễ kiểm tra
            setMapComment((prev) => [...prev, comments]);
           }
       }, [comments]);

    useEffect(() => {
        console.log("mapComments đã cập nhật: ", mapComments);
    }, [mapComments]);

    const handleModalClose = () => {
        setShowModal(false);
        setIsCommentsFetched(false);
        closeBlog();
    };


     useEffect(() => {
        if (showModal && blog && blog.id) {
            const unsubscribeFn = openBlog(blog.id);
            setUnsubscribe(() => unsubscribeFn);
    
          return () => {
            closeBlog(); 
            if (unsubscribeFn) unsubscribeFn(); 
          };
        }
      }, [showModal, blog, unsubscribe])
   
    

    const handleModalShow = async () => {
        setShowModal(true);
        if (!isCommentsFetched) {
            if (blog && blog.id) {
                await fechtlistComment();
                setIsCommentsFetched(true);
                console.log("Commet" + mapComments)
            }
           
        }
    };

  

    const handleSubmit = () => {
        if (comment.trim()) {
            sendComment(blog.id, comment);
            setComment("");
            sendNotification({
                recipient: blog.createdBy,
                tagetId: blog.id,
                notificationType: "LIKE",
                content: "Đã Comment bài viết của bạn"
            });
            setTimeout(() => {
                if (commentEndRef.current) {
                    commentEndRef.current.scrollIntoView({ behavior: "smooth" });
                }
            }, 300); // Đợi 500ms trước khi cuộn
          }
    };

    const handleNextSlide = (blogId, n, isModal = false) => {
        const totalSlides =
            blogs.find((blog) => blog.id === blogId)?.imageUrl.length || 0;

        if (isModal) {
            setModalSlideIndexes((prevState) => {
                const currentIndex = prevState[blogId] || 1;
                let newIndex = currentIndex + n;

                if (newIndex > totalSlides) newIndex = 1;
                if (newIndex < 1) newIndex = totalSlides;

                return { ...prevState, [blogId]: newIndex };
            });
        } else {
            setSlideIndexes((prevState) => {
                const currentIndex = prevState[blogId] || 1;
                let newIndex = currentIndex + n;

                if (newIndex > totalSlides) newIndex = 1;
                if (newIndex < 1) newIndex = totalSlides;

                return { ...prevState, [blogId]: newIndex };
            });
        }
    };


    const fechtCountLike = async (blog) => {
        if (blog.id) {
            try {
                const quantity = await LikeApi.countLikes(blog.id);
                console.log("Tổng số lượng like" + quantity)
                if (quantity >= 0) {
                    console.log("Tổng số lượng like" + quantity)
                    setLikeQuantity(quantity);
                    console.log("tổng like" + quantity + "Blog" + blog.id)
                }
            } catch (error) {
                alert("Lỗi fecht tông số lượng like" + error)
            }
        }
    }


    useEffect(() => {
        fechtIsLike(blog, authId);
        fechtCountLike(blog)
    }, [authId, blog])

    const fechtlistComment = async () => {
        try {
            if (blog && blog.id) {
                const response = await CommentApi.getCommentsByBlogId(blog.id);
                console.log("Response:", response);
                console.log("BlogID", blog.id); // Kiểm tra blog.id
                if (response) {
                    console.log("listComment", response); // Kiểm tra dữ liệu bình luận
                    setMapComment(response); // Lưu dữ liệu vào state
                }
                else {
                    console.log("Không có respone")
                }
            }
            else {
                console.log("Blog ID không hợp lệ")
            }
        } catch (error) {
            console.error("Lỗi khi fetch comment", error); // Log thêm lỗi để kiểm tra
            alert("Lỗi khi fetch comment");
        }
    };
    const fechtIsLike = async (blog, authId) => {
        console.log("blog Id " + blog.id)
        if (authId && blog.id) {
            try {
                const islike = await LikeApi.isLiked(blog.id, authId);
                if (islike == true) {
                    setLiked(true);
                    console.log("có like" + blog.id)
                } else {
                    setLiked(false);
                    console.log("ko like" + blog.id)
                }
            } catch (error) {
                alert("Lỗi fecht is like" + error)
            }
        }
    }

    


    const handleLikeClick = async (blog) => {
        if (blog && authId) {
            if (!liked) {
                try {
                    const response = LikeApi.like(blog.id, authId);
                    setLiked(true);
                    setLikeQuantity((prev) => (prev !== null ? prev + 1 : 1)); // Tăng số lượng like
                    sendNotification({
                        recipient: blog.createdBy,
                        tagetId: blog.id,
                        notificationType: "LIKE",
                        content: "Đã like 1 bài viết của bạn: " + blog.decription
                    });
                } catch (error) {
                    alert("có lỗi xảy ra khi like")
                }
            }
            else {
                try {
                    const response = LikeApi.unlike(blog.id, authId);
                    setLiked(false);
                    setLikeQuantity((prev) => (prev !== null && prev > 0 ? prev - 1 : 0)); // Giảm số lượng like
                } catch (error) {
                    alert("có lỗi xảy ra khi unlike")
                }
            }
        }
    };


    return (
        <div key={`${blog.id}-${blog.index}`} className="post-card">
            <div className="post-header">
                <div className="d-flex align-items-center">
                    <img src={blog.avatarUrl} alt="User Avatar" className="avatar" />
                    <div className="user-info">
                        <p className="username">{blog.fullName}</p>
                        <p className="time">{blog.createdAt}</p>
                    </div>
                </div>
                <BlogUpdate key={blog.id} blog={blog} blogId={blog.id} />
            </div>

            {/* Nội dung */}
            <div className="post-content py-0">
                <p>{blog.decription}</p>
            </div>

            {/* Ảnh bài viết */}
            <div className="post-image-container">
                {Array.isArray(blog.imageUrl) && blog.imageUrl.length > 0 ? (
                    blog.imageUrl.map((img, index) => (
                        <div
                            key={index}
                            className="mySlides"
                            style={{
                                display: index + 1 === (slideIndexes?.[blog.id] || 1) ? 'block' : 'none',
                                height: '500px',
                            }}
                        >
                            <div className="numbertext">{`${index + 1} / ${blog.imageUrl.length}`}</div>
                            <img src={img} alt={`Slide ${index + 1}`} />
                        </div>
                    ))
                ) : (
                    <div className="no-image" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                        <p>Không có hình ảnh để hiển thị.</p>
                    </div>
                )}

                {/* Hiển thị nút prev/next nếu có nhiều hơn 1 tấm ảnh */}
                {Array.isArray(blog.imageUrl) && blog.imageUrl.length > 1 && (
                    <>
                        <a className="prevPost" onClick={() => handleNextSlide(blog.id, -1)}>
                            <p>❮</p>
                        </a>
                        <a className="nextPost" onClick={() => handleNextSlide(blog.id, 1)}>
                            <p>❯</p>
                        </a>
                    </>
                )}
            </div>

            {/* Footer */}
            <div className="post-footer d-flex justify-content-between py-2">
                <button
                    className="btn"
                    onClick={() => handleLikeClick(blog)}
                    style={{ color: liked ? "inherit" : "black" }}
                >
                    <ThumbUp />  {likeQuantity !== null ? likeQuantity : 0} Like
                </button>
                <button className="btn" onClick={handleModalShow}>
                    <Comment /> Comment
                </button>
                <button className="btn">
                    <Share /> Share
                </button>
            </div>

            <Link to={`/tourdetails/${blog.tour}`} className="ps-3" style={{ textDecoration: 'underline', color: 'black' }}>
                Xem chi tiết chuyến đi
            </Link>

            {/* Modal */}
            <Modal
                show={showModal}
                onHide={handleModalClose}
                size="xl" // Đặt kích thước Modal thành "xl" (extra large)
                aria-labelledby="example-modal-sizes-title-lg"
                centered

            >
                <Modal.Header className="pb-0 ">
                    <p className=" fs-3 fw-bold">
                        Bài viết của {blog.fullName}
                    </p>
                </Modal.Header>
                <div style={{ maxHeight: "460px", overflowY: "auto", overflowX: "hidden" }}>

                    <Modal.Body>
                        {/* Tên và avatar người tạo */}
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                            <img
                                src={blog.avatarUrl}
                                alt="User Avatar"
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    marginRight: "10px",
                                }}
                            />
                            <div className="user-info">
                                <p className="username">{blog.fullName}</p>
                                <p className="time">{blog.createdAt}</p>
                            </div>
                        </div>
                        <p style={{ wordWrap: 'break-word' }}>{blog.decription}</p>

                        <div className="d-flex flex-column" style={{ height: "600px" }}>
                            {/* Hình ảnh trong Modal */}
                            <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
                                {Array.isArray(blog.imageUrl) && blog.imageUrl.length > 0 ? (
                                    blog.imageUrl.map((img, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                display:
                                                    index + 1 === (modalSlideIndexes?.[blog.id] || 1)
                                                        ? "block"
                                                        : "none",
                                                height: "100%",
                                                width: "100%",
                                            }}
                                        >
                                            <img
                                                src={img}
                                                alt={`Slide ${index + 1}`}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                }}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ textAlign: "center", padding: "20px" }}>
                                        Không có hình ảnh.
                                    </div>
                                )}

                                {/* Nút Prev và Next trong Modal */}
                                {Array.isArray(blog.imageUrl) && blog.imageUrl.length > 1 && (
                                    <>
                                        <a
                                            className="prev"
                                            onClick={() => handleNextSlide(blog.id, -1, true)}
                                            style={{
                                                position: "absolute",
                                                top: "50%",
                                                left: "10px",
                                                cursor: "pointer",
                                                color: "#fff",
                                                fontSize: "30px",
                                            }}
                                        >
                                            ❮
                                        </a>
                                        <a
                                            className="next"
                                            onClick={() => handleNextSlide(blog.id, 1, true)}
                                            style={{
                                                position: "absolute",
                                                top: "50%",
                                                right: "10px",
                                                cursor: "pointer",
                                                color: "#fff",
                                                fontSize: "30px",
                                            }}
                                        >
                                            ❯
                                        </a>
                                    </>
                                )}
                                {/* Danh sách bình luận */}

                            </div>



                        </div>
                    </Modal.Body>
                    <hr></hr>
                    <div className="ms-3">
                        {mapComments.map((comment) => (
                            <div
                                key={comment.id}
                            >
                                <div className="d-flex align-items-center mb-3" // Khoảng cách giữa các bình luận
                                >
                                    <img
                                        src={comment.avatar}
                                        alt="User Avatar"
                                        style={{
                                            width: "60px",
                                            height: "60px",
                                            borderRadius: "50%",
                                            marginRight: "10px",
                                        }}
                                    />
                                    <div className="user-info pe-2 blog-comment">
                                        <p className="username" style={{ marginLeft: "12px", marginRight: "12px", marginTop: "4px" }}>
                                            {comment.fullName}
                                        </p>
                                        <p className="time" style={{ fontSize: "11px", margin: 0, marginLeft: "12px", color: 'gray' }}>
                                            {comment.createdAt}
                                        </p>
                                        <p style={{ fontSize: '16px', margin: 0, marginLeft: "12px", marginBottom: "6px", marginRight: "12px" }}>{comment.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div ref={commentEndRef} />
                </div>
                <div className="comment-section py-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <Form style={{ flex: 1 }}>
                        <Form.Control
                            type="text"
                            placeholder="Viết bình luận..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}      
                        />
                    </Form>
                    <Button
                        variant="dark"
                        className="ml-2"
                        onClick={handleSubmit}
                        style={{ whiteSpace: 'nowrap' }} // Ensures the button text doesn't break into multiple lines
                    >
                        Gửi
                    </Button>
                </div>
            </Modal>    


        </div>
    );
};

export default BlogPost;
