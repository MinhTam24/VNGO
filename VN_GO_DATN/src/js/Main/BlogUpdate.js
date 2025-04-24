import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from "../../js/contexts/AuthContext"; // Import AuthContext
import { useSpring, animated } from '@react-spring/web'; // Import react-spring
import Swal from 'sweetalert2';
import config from "../../config";


const BlogUpdate = ({ blogId }) => {
    const { authId } = useAuth();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [decription, setDecription] = useState('');
    const [imageUrls, setImageUrls] = useState([]); // URL của ảnh (bao gồm URL blob cho hiển thị trước)
    const [imagesToDelete, setImagesToDelete] = useState([]); // Các ảnh cũ cần xóa
    const [newImages, setNewImages] = useState([]); // File thực tế của ảnh mới
    const [isUpdating, setIsUpdating] = useState(false); // Trạng thái đang cập nhật
    const [showModal, setShowModal] = useState(false);
    const { SERVER_API } = config;

    const handleModalShow = () => setShowModal(true);
    const handleModalClose = () => setShowModal(false);

    // Fetch dữ liệu blog ban đầu
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                // Lấy token từ localStorage
                const token = localStorage.getItem("token");

                // Gọi API với axios và gắn token vào header
                const response = await axios.get(
                    `${SERVER_API}/api/blog/${blogId}`,
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`, // Gắn token vào Authorization header
                            "Content-Type": "application/json", // Đảm bảo loại dữ liệu là JSON
                        }
                    }
                ); setBlog(response.data);
                setDecription(response.data.decription);
                setImageUrls(response.data.imageUrl || []);
            } catch (err) {
                setError(err.message || 'Lỗi khi fetch dữ liệu');
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [blogId]);

    // Cập nhật nội dung bài viết
    const handleDecriptionChange = (event) => {
        setDecription(event.target.value);
    };

    // Xóa ảnh cũ
    const handleRemoveImage = (index) => {
        const removedUrl = imageUrls[index];
        setImagesToDelete((prev) => [...prev, removedUrl]); // Thêm URL ảnh vào danh sách cần xóa
        setImageUrls((prev) => prev.filter((_, i) => i !== index)); // Loại bỏ ảnh khỏi danh sách hiển thị
    };

    // Thêm ảnh mới
    const handleNewImageChange = (event) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const newFiles = Array.from(files); // Lưu file thực tế
            setNewImages((prevNewImages) => [...prevNewImages, ...newFiles]);

            // Tạo URL blob để hiển thị trước
            const newImagePreviews = newFiles.map((file) => URL.createObjectURL(file));
            setImageUrls((prevImageUrls) => [...prevImageUrls, ...newImagePreviews]);
        }
    };

    // Xử lý cập nhật bài viết
    const handleUpdate = async () => {
        try {

            // Hiển thị cảnh báo xác nhận trước khi cập nhật
            const result = await Swal.fire({
                title: 'Xác nhận cập nhật',
                text: 'Bạn có chắc chắn muốn cập nhật bài viết này không?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Cập nhật',
                cancelButtonText: 'Hủy',
                heightAuto: false,
            });

            if (!result.isConfirmed) {
                // Người dùng chọn "Hủy"
                return;
            }

            setIsUpdating(true);

            const formData = new FormData();

            // Thêm các trường văn bản
            formData.append('id', blogId);
            formData.append('decription', decription);

            // Gửi URL của ảnh cũ (loại bỏ URL blob)
            imageUrls
                .filter((url) => !url.startsWith('blob:')) // Chỉ giữ URL thực tế
                .forEach((url) => formData.append('imageUrl', url));

            // Gửi các file ảnh mới
            newImages.forEach((file) => formData.append('files', file));

            // Gửi dữ liệu lên server
            const token = localStorage.getItem("token"); // Lấy token từ localStorage

            await axios.put(
                `${SERVER_API}/api/blog`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`, // Gắn token vào Authorization header
                    },
                }
            );

            Swal.fire({
                title: 'Thành công',
                text: 'Cập nhật bài viết thành công!',
                icon: 'success',
                confirmButtonText: 'OK',
                heightAuto: false,
            }).then(() => {
                setShowModal(false); // Đóng modal khi người dùng nhấn OK
            });

            setShowModal(false)
        } catch (err) {
            console.error('Lỗi khi cập nhật bài viết:', err);
            Swal.fire({
                title: 'Lỗi',
                text: 'Đã xảy ra lỗi khi cập nhật bài viết. Vui lòng thử lại.',
                icon: 'error',
                confirmButtonText: 'OK',
                heightAuto: false,
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        Swal.fire({
            title: "Bạn có chắc chắn muốn xóa?",
            text: "Hành động này không thể hoàn tác!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
            heightAuto: false,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem("token"); // Lấy token từ localStorage
                    const response = await axios.delete(`${SERVER_API}/api/blog`, {
                        headers: {
                            'Authorization': `Bearer ${token}`, // Gắn token xác thực
                        },
                        params: { id: blogId }, // Gắn tham số truy vấn
                    });

                    if (response.status === 200) {
                        Swal.fire({
                            title: "Thành công",
                            text: "Xoá bài viết thành công!",
                            icon: "success",
                            confirmButtonText: "OK",
                            heightAuto: false,
                        }).then(() => {
                            // Tải lại trang khi người dùng nhấn "OK"
                            window.location.reload();
                        });
                    }
                } catch (error) {
                    console.error("Lỗi khi xoá bài viết:", error);
                    Swal.fire({
                        title: "Thất bại",
                        text: "Xoá bài viết thất bại!",
                        icon: "error",
                        confirmButtonText: "OK",
                        heightAuto: false,
                    });
                }
            }
        });
    };


    // Sử dụng react-spring cho modal
    const modalAnimation = useSpring({
        opacity: showModal ? 1 : 0,
        transform: showModal ? 'translateY(0)' : 'translateY(-50px)',
        config: { tension: 200, friction: 20 }
    });

    if (loading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>Lỗi: {error}</p>;

    return (
        <div>
            {/* Dropdown Menu */}
            <div className="dropdown">
                <a
                    href="#"
                    className="btn btn-light"
                    id="dropdownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ backgroundColor: 'white' }}
                >
                    <i className="fas fa-ellipsis-h save-icon" />
                </a>

                {/* Menu Dropdown */}
                {authId !== blog.createdBy ? (
                    <ul className="dropdown-menu">
                        {/* Các mục trong dropdown nếu không phải tác giả */}
                        <li>
                            <a className="dropdown-item" href="#">
                                <i className="bi bi-star me-2"></i>Quan tâm
                            </a>
                        </li>
                        <li>
                            <a className="dropdown-item" href="#">
                                <i className="bi bi-star-fill me-2"></i>Không quan tâm
                            </a>
                        </li>
                        <li>
                            <a className="dropdown-item" href="#">
                                <i className="bi bi-bookmark me-2"></i>Lưu bài viết
                            </a>
                        </li>
                        <li>
                            <a className="dropdown-item" href="#">
                                <i className="bi bi-clock-history me-2"></i>Xem lịch sử chỉnh sửa
                            </a>
                        </li>
                    </ul>
                ) : (
                    <ul className="dropdown-menu">
                        <li>
                            <a className="dropdown-item" href="#" onClick={handleModalShow}>
                                <i className="bi bi-pencil-square me-2"></i>Chỉnh sửa bài viết
                            </a>
                        </li>
                        <li>
                            <a className="dropdown-item" href="#" onClick={handleDelete}>
                                <i className="bi bi-trash me-2"></i>Xoá bài viết
                            </a>
                        </li>
                    </ul>
                )}
            </div>

            {/* Modal Chỉnh sửa bài viết */}
            <animated.div style={modalAnimation}>
                <Modal show={showModal}>
                    <Modal.Header closeButton onClick={handleModalClose}>
                        <Modal.Title>Chỉnh sửa Bài Viết</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formContent">
                                <Form.Label>Nội dung bài viết</Form.Label>
                                <input
                                    type="text"
                                    value={decription}
                                    onChange={handleDecriptionChange}
                                    className="form-control"
                                />
                            </Form.Group>

                            <Form.Group controlId="formImage" className="mt-3">
                                <Form.Label>Hình ảnh</Form.Label>
                                <div>
                                    {imageUrls.length > 0 ? (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                            {imageUrls.map((url, index) => (
                                                <div key={index} style={{ position: 'relative' }}>
                                                    <button
                                                        onClick={() => handleRemoveImage(index)}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '5px',
                                                            right: '5px',
                                                            background: 'red',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '50%',
                                                        }}
                                                    >
                                                        X
                                                    </button>
                                                    <img
                                                        src={url}
                                                        alt={`Hình ${index}`}
                                                        style={{
                                                            width: '120px',
                                                            height: '120px',
                                                            objectFit: 'cover',
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>Không có hình ảnh</p>
                                    )}
                                </div>

                                <div className='pt-2 pb-2'>
                                    <input type="file" multiple onChange={handleNewImageChange} />
                                </div>
                            </Form.Group>

                            <Button className='w-100' onClick={handleUpdate} disabled={isUpdating}>
                                {isUpdating ? 'Đang cập nhật...' : 'Cập nhật'}
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            </animated.div>
        </div>
    );
};

export default BlogUpdate;
