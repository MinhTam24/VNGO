import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import axios from "axios";
import { useAuth } from "../../js/contexts/AuthContext"; // Import AuthContext
import config from "../../config";



const ButtonCreatePost = () => {
    const [trips, setTrips] = useState([]); // State lưu danh sách chuyến đi
    const [selectedTrip, setSelectedTrip] = useState(""); // State lưu chuyến đi được chọn
    const [errors, setErrors] = useState({});
    const { authId } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false); // Thêm state để theo dõi trạng thái đăng bài
      const { SERVER_API } = config;
    


    const [blog, setBlog] = useState({
        tour: '',
        decription: '',
        files: [],
        previews: [] // Thêm state để lưu các URL preview
    });



    useEffect(() => {
        if (authId) {
            // Gọi API để lấy danh sách chuyến đi.
            const fetchTrips = async () => {
                try {
                    const token = localStorage.getItem("token"); // Lấy token từ localStorage
                    const response = await axios.get(`${SERVER_API}/api/tour-createBy/${authId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}` // Gắn token xác thực
                        }
                    });                    setTrips(response.data); // Gắn dữ liệu chuyến đi vào state
                } catch (error) {
                    console.error("Lỗi khi tải danh sách chuyến đi:", error);
                }
            };

            fetchTrips();
        }
    }, [authId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBlog({
            ...blog,
            [name]: value,
        });
    };

    const handleSelectChange = (e) => {
        setSelectedTrip(e.target.value);
        setBlog({
            ...blog,
            tour: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        const selectedFiles = e.target.files;  // Lấy danh sách file người dùng chọn
        const fileArray = Array.from(selectedFiles);

        // Kết hợp các file cũ với các file mới
        const newFiles = [...blog.files, ...fileArray];

        // Tạo các preview URL cho hình ảnh
        const filePreviews = fileArray.map(file => URL.createObjectURL(file));

        setBlog({
            ...blog,
            files: newFiles,  // Kết hợp các file mới vào mảng file cũ
            previews: [...blog.previews, ...filePreviews],  // Kết hợp các preview mới vào mảng preview cũ
        });
    };

    const handleRemoveImage = (index) => {
        const newFiles = [...blog.files];
        const newPreviews = [...blog.previews];

        newFiles.splice(index, 1);
        newPreviews.splice(index, 1);

        setBlog({
            ...blog,
            files: newFiles,
            previews: newPreviews,
        });
    };

    const handleSubmit = async () => {
        // Kiểm tra điều kiện
       

        setIsSubmitting(true); // Đặt trạng thái đăng bài là đang gửi

        const formData = new FormData();
        formData.append("decription", blog.decription);
        formData.append("tour", blog.tour);
        if (blog.files != null) {
            blog.files.forEach((file) => formData.append("files", file));
        }

        try {
            const token = localStorage.getItem("token");

            const response = await axios.post(`${SERVER_API}/api/blog`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    'Authorization': `Bearer ${token}`,  // Gửi token đúng cách trong header
                },
            });

            if (response.status === 200) {
                Swal.fire({
                    title: "Thành công",
                    heightAuto: false,
                    confirmButtonText: "OK",
                    text: "Bạn đã đăng bài viết!",
                    icon: "success"
                }).then(() => {
                    // Tải lại trang khi người dùng nhấn "OK"
                    window.location.reload();
                  });
                
                setBlog({
                    tour: '',
                    decription: '',
                    files: [],
                    previews: [],
                });
            }
        } catch (error) {
            console.error("Lỗi khi đăng bài:", error);
            Swal.fire({
                icon: 'error',
                title: 'Đã xảy ra lỗi!',
                text: 'Có vấn đề xảy ra khi đăng bài.',
            });
        } finally {
            setIsSubmitting(false); // Đặt trạng thái đăng bài là xong
        }
        
    };

    return (
        <div>
            <button
                type="button"
                className="btn btn-custom"
                data-bs-toggle="modal"
                data-bs-target="#postModal"
            >
                <i className="fas fa-pen" style={{ color: "green" }} />
            </button>
            <div
                className="modal fade "
                id="postModal"
                tabIndex={-1}
                aria-labelledby="postModalLabel"
                aria-hidden="true"
                data-bs-backdrop="static"
            >
                <div className="modal-dialog modal-sm">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="postModalLabel">
                                Tạo bài viết của bạn
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="d-flex">
                                    <div style={{ flex: 1 }}>
                                        <div className="row ">
                                            <div className="col-md-12">
                                                <label htmlFor="decription" className="form-label">
                                                    Mô tả:
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    id="decription"
                                                    rows={3}
                                                    name="decription"
                                                    placeholder="Hãy nói gì về bài viết này..."
                                                    value={blog.decription}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>


                                        <div className="row">
                                            <div className="col-md-12">
                                                <label htmlFor="tripList" className="col-form-label">
                                                    Chuyến đi:
                                                </label>
                                                <select
                                                    className="form-select"
                                                    id="tripList"
                                                    value={selectedTrip}
                                                    onChange={handleSelectChange}
                                                >
                                                    <option value="" disabled>
                                                        Chọn chuyến đi
                                                    </option>
                                                    {trips.map((trip) => (
                                                        <option key={trip.id} value={trip.id}>
                                                            {trip.title}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.tour && <div className="text-danger">{errors.tour}</div>}

                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="image-upload" className="col-form-label fw-bold">
                                                Chọn hình ảnh:
                                            </label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                id="image-upload"
                                                accept="image/*"
                                                name="files"
                                                multiple
                                                onChange={handleFileChange}
                                            />

                                            {blog.previews.length > 0 && (
                                                <div className="pt-3" style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
                                                    {blog.previews.map((preview, index) => (
                                                        <div key={index} style={{ position: 'relative', width: '100px', height: '100px' }}>
                                                            <img
                                                                src={preview}
                                                                alt="preview"
                                                                style={{
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    objectFit: 'cover',
                                                                    borderRadius: '10px',
                                                                }}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveImage(index)}
                                                                style={{
                                                                    position: 'absolute',
                                                                    top: '5px',
                                                                    right: '5px',
                                                                    background: 'rgba(0, 0, 0, 0.6)',
                                                                    color: 'white',
                                                                    border: 'none',
                                                                    borderRadius: '50%',
                                                                    width: '20px',
                                                                    height: '20px',
                                                                    display: 'flex',
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                X
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Đóng
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleSubmit}
                                >
                                    {isSubmitting ? "Đang đăng..." : "Đăng bài"}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ButtonCreatePost;
