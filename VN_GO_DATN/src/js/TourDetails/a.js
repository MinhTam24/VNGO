/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from "@mui/icons-material/Favorite";
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
const postList = [
  {
    id: 1,
    user: {
      id: 1,
      avatar: "/img/avt.jpg",
      username: "Nguyễn Đức Tân",
      time: "1 giờ trước",
    },
    content: `Phố đèn lồng Hội An về đêm rực rỡ với hàng ngàn chiếc đèn lồng thủ công...`,
    images: ["/img/LOGO.PNG", "/img/post1.jpg", "/img/AVT.jpg"],
    interactions: {
      likes: 238,
      comments: 186,
      shares: 143,
    },
    comments: [
      {
        id: 1,
        userComment: {
          name: "Tâm",
          avatar: "/img/avt.jpg",
        },
        time: "54 phút trước",
        content: "Nó thật là đẹp và lãng mạn, bạn có thể chia sẻ kinh nghiệm cho tôi khi tới đó được không?",
      },
      {
        id: 2,
        userComment: {
          name: "Đạt",
          avatar: "/img/avt.jpg",
        },
        time: "54 phút trước",
        content: "Tuyệt quá!!!",
      },
      {
        id: 3,
        userComment: {
          name: "Tâm",
          avatar: "/img/avt.jpg",
        },
        time: "54 phút trước",
        content: "Ở đó có đặc sản gì ngon không bạn?",
      },
      {
        id: 4,
        userComment: {
          name: "Đức Tân",
          avatar: "/img/avt.jpg",
        },
        time: "38 phút trước",
        content: "Ở đâu vậy?",
      },
      {
        id: 5,
        userComment: {
          name: "Đức Tân",
          avatar: "/img/avt.jpg",
        },
        time: "38 phút trước",
        content: "Nó thật đẹp, chi phí của chuyến đi là bao nhiêu vậy bạn?",
      },
    ],
  },
  {
    id: 2,
    user: {
      id: 2,
      avatar: "/img/avt.jpg",
      username: "Trần Minh Tâm",
      time: "1 giờ trước",
    },
    content: `Phố đèn lồng Hội An về đêm rực rỡ với hàng ngàn chiếc đèn lồng thủ công...`,
    images: ["/img/post1.jpg", "/img/AVT.jpg", "/img/LOGO.PNG"],
    interactions: {
      likes: 116,
      comments: 186,
      shares: 143,
    },
    comments: [

    ],
  },
  // Thêm bài viết khác nếu cần...
];

const Post = () => {


  const [likedPosts, setLikedPosts] = useState({}); // Quản lý trạng thái like cho từng bài đăng

  const handleLikeToggle = (postId) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId], // Đảo ngược trạng thái like
    }));
  };



  const [slideIndexes, setSlideIndexes] = useState(
    postList.reduce((acc, post) => {
      acc[post.id] = 1;
      return acc;
    }, {})
  );

  const [selectedPost, setSelectedPost] = useState(null);
  const [modalSlideIndex, setModalSlideIndex] = useState(1); // Chỉ số slide trong modal

  const handleNextSlide = (postId, n) => {
    const totalSlides = postList.find((post) => post.id === postId).images.length;
    setSlideIndexes((prevState) => {
      const newIndex = prevState[postId] + n;
      return {
        ...prevState,
        [postId]: newIndex > totalSlides ? 1 : newIndex < 1 ? totalSlides : newIndex,
      };
    });
  };

  const handleNextSlideModal = () => {
    const totalSlides = selectedPost.images.length;
    setModalSlideIndex(modalSlideIndex === totalSlides ? 1 : modalSlideIndex + 1);
  };

  const handlePrevSlideModal = () => {
    const totalSlides = selectedPost.images.length;
    setModalSlideIndex(modalSlideIndex === 1 ? totalSlides : modalSlideIndex - 1);
  };

  const renderPost = (post) => {
    return (
      <div key={post.id} className="post-card">
        <div className="post-header">
          <div className="d-flex align-items-center">
            <img src={post.user.avatar} alt="User Avatar" className="avatar" />
            <div className="user-info">
              <p className="username">{post.user.username}</p>
              <p className="time">{post.user.time}</p>
            </div>
          </div>

          {/* Nút Dropdown */}
          <div className="dropdown">
            <a
              href="#"
              className="btn btn-light"
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{
                backgroundColor: 'white'
              }}
            >
              <i className="fas fa-ellipsis-h save-icon" />
            </a>

            {/* Menu Dropdown */}
            <ul
              className="dropdown-menu"
              aria-labelledby="dropdownMenuButton"
              style={{
                width: "300px",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  style={{
                    textDecoration: "none",
                    color: "#000",
                    padding: "5px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <i className="bi bi-star me-2"></i>Quan tâm
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  style={{
                    textDecoration: "none",
                    color: "#000",
                    padding: "5px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <i className="bi bi-star-fill me-2"></i>Không quan tâm
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  style={{
                    textDecoration: "none",
                    color: "#000",
                    padding: "5px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <i className="bi bi-bookmark me-2"></i>Lưu bài viết
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  style={{
                    textDecoration: "none",
                    color: "#000",
                    padding: "5px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <i className="bi bi-clock-history me-2"></i>Xem lịch sử chỉnh sửa
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  style={{
                    textDecoration: "none",
                    color: "#000",
                    padding: "5px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <i className="bi bi-bell me-2"></i>Bật thông báo về bài viết này
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  style={{
                    textDecoration: "none",
                    color: "#000",
                    padding: "5px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <i className="bi bi-code me-2"></i>Nhúng
                </a>
              </li>
              <li>
                <hr
                  className="dropdown-divider"
                  style={{
                    margin: "10px 0",
                    borderTop: "1px solid #ddd",
                  }}
                />
              </li>
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  style={{
                    textDecoration: "none",
                    color: "#000",
                    padding: "5px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <i className="bi bi-eye-slash me-2"></i>Ẩn bài viết
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  style={{
                    textDecoration: "none",
                    color: "#000",
                    padding: "5px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <i className="bi bi-clock me-2"></i>Tạm ẩn Nguyễn Đức Tân
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  style={{
                    textDecoration: "none",
                    color: "#000",
                    padding: "5px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <i className="bi bi-x-circle me-2"></i>Bỏ theo dõi Nguyễn Đức Tân
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  style={{
                    textDecoration: "none",
                    color: "#000",
                    padding: "5px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <i className="bi bi-flag me-2"></i>Báo cáo bài viết
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="post-content py-0">
          <p>{post.content}</p>
        </div>
        <div className="post-image-container">
          {post.images.map((img, index) => (
            <div
              key={index}
              className="mySlides"
              style={{
                display: index + 1 === (slideIndexes[post.id] || 1) ? "block" : "none",
                height: "500px",
              }}
            >
              <div className="numbertext">{`${index + 1} / ${post.images.length}`}</div>
              <img src={img} alt={`Slide ${index + 1}`} />
            </div>
          ))}
          {post.images.length > 1 && (
            <>
              <a className="prevPost" onClick={() => handleNextSlide(post.id, -1)}>
                <p>❮</p>
              </a>
              <a className="nextPost" onClick={() => handleNextSlide(post.id, 1)}>
                <p>❯</p>
              </a>
            </>
          )}
        </div>
        <div className="post-icons">
          <div className="interaction ">
            <button onClick={() => handleLikeToggle(post.id)}>
              {likedPosts[post.id] ? (
                <FavoriteIcon style={{ color: 'red' }} />
              ) : (
                <FavoriteBorderOutlinedIcon />
              )}
            </button>
            <span>{post.interactions.likes + (likedPosts[post.id] ? 1 : 0)} Lượt thích</span>
          </div>
          <div className="interaction">
            <button
              data-bs-toggle="modal"
              data-bs-target="#commentModal"
              onClick={() => setSelectedPost(post)}
            >
              <ModeCommentOutlinedIcon />
            </button>
            <span >{post.interactions.comments} Bình luận</span>
          </div>
          <div className="interaction">
            <button>
              <ShareOutlinedIcon />
            </button>
            <span className="">{post.interactions.shares}Chia sẻ</span>
          </div>
        </div>
        <div className="post-footer">
          <Link to="/tourdetails" className="text-dark text-decoration-none">
            <span>Xem chi tiết chuyến đi...</span>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="post-list-container">
      {postList.map(renderPost)}
      {/* Modal Bootstrap */}
      <div
        className="modal fade"
        id="commentModal"
        tabIndex="-1"
        aria-labelledby="commentModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body row p-0">
              {selectedPost ? (
                <>
                  <div className="col-sm-7 ">
                    {/* Hiển thị hình ảnh trong modal */}
                    <div className="post-image-container" style={{ height: "100%" }}>
                      {selectedPost.images.map((img, index) => (
                        <div
                          key={index}
                          className="mySlides"
                          style={{
                            display: index + 1 === modalSlideIndex ? "block" : "none",
                            height: "100%",
                          }}
                        >
                          <div className="numbertext">{`${index + 1} / ${selectedPost.images.length}`}</div>
                          <img src={img} alt={`Slide ${index + 1}`} style={{ width: "100%", height: "100%" }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-sm-5 pt-2 rightComment px-0">
                    <div className="d-flex align-items-center PostOwner">
                      <img src={selectedPost.user.avatar} alt="User Avatar" className="avatar" />
                      <div className="user-info">
                        <p className="username">{selectedPost.user.username}</p>
                        <p className="time">{selectedPost.user.time}</p>
                      </div>
                    </div>
                    <p>{selectedPost.content}</p>
                    <hr />
                    {/* Render bình luận */}
                    <div className="comments">
                      {selectedPost.comments.map((comment) => (
                        <div key={comment.id} className="comment">
                          <div className="d-flex">
                            <img
                              src={comment.userComment.avatar}
                              alt="User Avatar"
                              className="avatar"
                            />
                            <div className="user-info">
                              <p className="username">{comment.userComment.name}</p>
                              <p className="ContentComment">{comment.content}</p>
                            </div>
                          </div>
                          <p className="time">{comment.time}</p> {/* Hiển thị thời gian */}

                        </div>
                      ))}
                    </div>
                    <hr className="m-0 " />
                    <div className="CommentInput w-100  d-flex align-items-center">
                      <input type="text" className="w-75  " placeholder="Viết bình luận..." />
                      <button type="button">Gửi</button>
                    </div>

                  </div>
                  {/* Các nút điều hướng trong modal */}
                  <div className="modal-image-navigation">
                    <button className="prevPostModal text-white" onClick={handlePrevSlideModal}>
                      ❮
                    </button>
                    <button className="nextPostModal text-white" onClick={handleNextSlideModal}>
                      ❯
                    </button>
                  </div>
                </>
              ) : (
                <p>Không có bài viết nào được chọn.</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;




<div className="blog-list-container">
{loading && <p>Đang tải...</p>}
{error && <p style={{ color: "red" }}>{error}</p>}
{blogs.length === 0 ? (
    <p>Không có bài viết nào để hiển thị.</p>
) : (
    <div>{blogs.map(renderBlog)}</div>
)}

{/* Modal Bootstrap */}
<div
    className="modal fade"
    id="commentModal"
    tabIndex="-1"
    aria-labelledby="commentModalLabel"
    aria-hidden="true"
>
    <div className="modal-dialog">
        <div className="modal-content">
            <div className="modal-body row p-0">
                {selectedBlog ? (
                    <>
                        <div className="col-sm-7 ">
                            {/* Hiển thị hình ảnh trong modal */}
                            <div className="post-image-container" style={{ height: "100%" }}>
                                {selectedBlog.images.map((img, index) => (
                                    <div
                                        key={index}
                                        className="mySlides"
                                        style={{
                                            display: index + 1 === modalSlideIndex ? "block" : "none",
                                            height: "100%",
                                        }}
                                    >
                                        <div className="numbertext">{`${index + 1} / ${selectedBlog.images.length}`}</div>
                                        <img src={img} alt={`Slide ${index + 1}`} style={{ width: "100%", height: "100%" }} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="col-sm-5 pt-2 rightComment px-0">
                            <div className="d-flex align-items-center PostOwner">
                                <img src={selectedBlog.user.avatar} alt="User Avatar" className="avatar" />
                                <div className="user-info">
                                    <p className="username">{selectedBlog.user.username}</p>
                                    <p className="time">{selectedBlog.user.time}</p>
                                </div>
                            </div>
                            <p>{selectedBlog.content}</p>
                            <hr />
                            {/* Render bình luận */}
                            <div className="comments">
                                {selectedBlog.comments.map((comment) => (
                                    <div key={comment.id} className="comment">
                                        <div className="d-flex">
                                            <img
                                                src={comment.userComment.avatar}
                                                alt="User Avatar"
                                                className="avatar"
                                            />
                                            <div className="user-info">
                                                <p className="username">{comment.userComment.name}</p>
                                                <p className="ContentComment">{comment.content}</p>
                                            </div>
                                        </div>
                                        <p className="time">{comment.time}</p> {/* Hiển thị thời gian */}
                                    </div>
                                ))}
                            </div>
                            <hr className="m-0 " />
                            <div className="CommentInput w-100  d-flex align-items-center">
                                <input type="text" className="w-75" placeholder="Viết bình luận..." />
                                <button type="button">Gửi</button>
                            </div>
                        </div>

                        {/* Các nút điều hướng trong modal */}
                        <div className="modal-image-navigation">
                            <button className="prevPostModal text-white" onClick={handlePrevSlideModal}>
                                ❮
                            </button>
                            <button className="nextPostModal text-white" onClick={handleNextSlideModal}>
                                ❯
                            </button>
                        </div>
                    </>
                ) : (
                    <p>Không có bài viết nào được chọn.</p>
                )}
            </div>
        </div>
    </div>
</div>
</div>








