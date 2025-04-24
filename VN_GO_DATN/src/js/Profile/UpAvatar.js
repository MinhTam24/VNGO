import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import accountApi from "../../Api/AccountApi";
import Swal from "sweetalert2";

const ImgModal = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [showImgModal, setShowImgModal] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file)); // Tạo URL để xem trước ảnh
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            Swal.fire({
                icon: "warning",
                title: "Cảnh báo",
                text: "Vui lòng chọn một file để upload.",
            });
            return;
        }

        const formData = new FormData();
        formData.append("images", selectedFile); // Tên field cần khớp với @RequestParam trên backend

        try {
            setIsUploading(true);
            const response = await accountApi.postAvatar(formData);
            if (response) {
                setMessage("Cập nhật avatar thành công!");
                Swal.fire({
                    icon: "success",
                    title: "Thành công",
                    text: "Cập nhật avatar thành công!",
                });
            } else {
                setMessage("Đã xảy ra lỗi trong quá trình tải lên.");
                Swal.fire({
                    icon: "error",
                    title: "Lỗi",
                    text: "Đã xảy ra lỗi trong quá trình tải lên.",
                });
            }
        } catch (error) {
            console.error("Lỗi khi tải lên ảnh:", error);
            setMessage("Đã xảy ra lỗi. Vui lòng thử lại.");
        } finally {
            setIsUploading(false);
            setShowImgModal(false); // Ẩn modal sau khi upload xong
            window.location.reload();
        }
    };

    return (
        <div className="img-modal">
            <button
                className="btn btn-custom btn-sm"
                onClick={() => setShowImgModal(true)}
            >
                <i className="bi bi-pencil-fill"></i>
            </button>

            {showImgModal && (
                <div
                    className="modal show d-block"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                >
                    <div className="custom-modal-dialog">
                        <div className="custom-modal-content">
                            <div className="custom-modal-header">
                                <h5 className="custom-modal-title">Cập nhật Avatar</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowImgModal(false)}
                                ></button>
                            </div>
                            <div className="custom-modal-body text-center">
                                <div style={{ position: "relative", textAlign: "center" }}>
                                    <input
                                        type="file"
                                        id="fileUpload"
                                        onChange={handleFileChange}
                                        style={{
                                            opacity: 0,
                                            position: "absolute",
                                            zIndex: -1,
                                        }}
                                    />
                                    <label
                                        htmlFor="fileUpload"
                                        style={{
                                            display: "inline-block",
                                            padding: "10px 20px",
                                            backgroundColor: "#4CAF50",
                                            color: "white",
                                            fontSize: "16px",
                                            fontWeight: "bold",
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                            textAlign: "center",
                                            transition: "all 0.3s ease",
                                            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.target.style.backgroundColor = "#45a049")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.target.style.backgroundColor = "#4CAF50")
                                        }
                                    >
                                        Chọn File
                                    </label>
                                </div>

                                {preview && (
                                    <div className="mt-3">
                                        <strong>Avatar</strong>
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            style={{
                                                width: "300px", // Đặt kích thước cố định
                                                height: "300px", // Chiều cao bằng với chiều rộng
                                                borderRadius: "50%", // Làm hình tròn
                                                objectFit: "cover", // Giữ hình ảnh không méo
                                                display: "block", // Căn giữa nếu cần
                                                margin: "0 auto", // Căn giữa hình ảnh
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="custom-modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowImgModal(false)}
                                >
                                    Đóng
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleUpload}
                                    disabled={isUploading}
                                >
                                    {isUploading ? "Đang tải lên..." : "Tải lên"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {message && <p className="mt-3 text-info text-center">{message}</p>}
        </div>
    );
};

export default ImgModal;
