import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import ModalTour from './ModalTour';
import Post from './Post'; // Giả sử Post là component đăng bài viết

const ModalFade = ({ tourId, postId }) => {
    const [isModalTourOpen, setIsModalTourOpen] = useState(false);
    const [isPostOpen, setIsPostOpen] = useState(false);

    // Mở ModalTour nếu có tourId, mở Post nếu có postId
    useEffect(() => {
        if (tourId) {
            setIsModalTourOpen(true);
            setIsPostOpen(false); // Đảm bảo Post không mở khi có tourId
        } else if (postId) {
            setIsPostOpen(true);
            setIsModalTourOpen(false); // Đảm bảo ModalTour không mở khi có postId
        } else {
            setIsModalTourOpen(false);
            setIsPostOpen(false); // Nếu không có tourId hay postId, đóng cả hai
        }
    }, [tourId, postId]);

    const handleCloseTourModal = () => {
        setIsModalTourOpen(false);
    };

    const handleClosePostModal = () => {
        setIsPostOpen(false);
    };

    return (
        <>
            {/* Hiển thị ModalTour nếu có tourId */}
            {isModalTourOpen && <ModalTour tourId={tourId} />}

            {/* Hiển thị Post nếu có postId */}
            {isPostOpen && <Post postId={postId} />}

            
        </>
    );
};

export default ModalFade;
