import React from 'react';
import ButtonCreateTour from './ButtonCreateTour';
import ButtonCreatePost from './ButtonCreatePost';

import ModalFade from './ModalFade';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 

const CreatPost = () => {
    const { authId, authAvatar } = useAuth(); // Lấy authId từ AuthContext

    return (
        <>
            {authId ? (
                <div className="post-input mb-3">
                    {/* Hiển thị avatar và liên kết đến trang profile của người dùng */}
                    <Link to={`/profile/${authId}`}>
                        <img src= {authAvatar} alt="Avatar" className="avatar1" />
                    </Link>
                    <button
                        className="input-text"
                        data-bs-toggle="modal"
                        data-bs-target="#postModal"
                    >
                        Hãy đăng những chuyến đi của bạn.....
                    </button>
                    <div className="button-container">
                        {/* Nút Đăng chuyến đi với biểu tượng hình ảnh */}
                        <ButtonCreateTour />
                        {/* Nút Đăng bài với biểu tượng bút */}
                        <ButtonCreatePost />
                    </div>
                </div>
            ) : (
                <div className="post-input mb-3">
                    {/* Hiển thị thông báo yêu cầu đăng nhập */}
                    <p>Bạn cần đăng nhập để tạo bài đăng.</p>
                    <Link to="/login">
                        <button className="btn btn-primary">Đăng nhập</button>
                    </Link>
                </div>
            )}
            <ModalFade />
        </>
    );
}

export default CreatPost;