import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { Modal } from "react-bootstrap";
import config from "../../config";


const EditLocationDetail = ({ locationName, locationDetailId }) => {
    const [locationDetail, setLocationDetail] = useState(null); // State lưu thông tin LocationDetail
    const [error, setError] = useState(null); // State lưu lỗi nếu có
    const [showModal, setShowModal] = useState(false); // State quản lý modal
    const { SERVER_API } = config;

    // Fetch API khi component render
    useEffect(() => {
        if (locationDetailId) {
            const fetchLocationDetail = async () => {
                try {
                    const token = localStorage.getItem("token"); // Lấy token từ localStorage
                    const response = await axios.get(
                        `${SERVER_API}/api/locationdetail/${locationDetailId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`, // Gắn token vào header Authorization
                            },
                        }
                    ); setLocationDetail(response.data); // Lưu dữ liệu vào state
                    console.log("IDLCTDT" + locationDetailId)
                } catch (err) {
                    console.error("Lỗi khi fetch dữ liệu:", err);
                    setError(err.message);
                }
            };
            fetchLocationDetail();

        }

    }, [locationDetailId]); // Chạy lại khi `id` thay đổi

    // Hàm xử lý khi thay đổi giá trị trong input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLocationDetail((prev) => ({
            ...prev,
            [name]: value, // Cập nhật giá trị field tương ứng
        }));
    };

    // Hàm bổ sung giây nếu thiếu
    const appendSeconds = (time) => {
        if (time && time.length === 5) { // Định dạng HH:mm
            return `${time}:00`; // Thêm giây vào thời gian
        }
        return time; // Nếu đã có giây
    };

    // Hàm xử lý khi submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Hiển thị hộp thoại xác nhận
        const result = await Swal.fire({
            title: "Xác nhận",
            text: "Bạn có chắc chắn muốn cập nhật thông tin này?",
            icon: "warning",
            heightAuto: false,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Cập nhật",
            cancelButtonText: "Hủy",
        });

        if (result.isConfirmed) {
            try {
                const updatedData = {
                    ...locationDetail,
                    startHour: appendSeconds(locationDetail.startHour),
                    endHour: appendSeconds(locationDetail.endHour),
                };

                const token = localStorage.getItem("token"); // Lấy token từ localStorage
                const response = await axios.put(
                    `${SERVER_API}/api/locationdetail`,
                    updatedData, // Dữ liệu cập nhật
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Gắn token vào header
                            'Content-Type': 'application/json', // Đảm bảo định dạng nội dung
                        },
                    }
                );
                if (response.status === 200) {
                    Swal.fire(
                        {
                            heightAuto: false,
                            title: "Thành công",
                            confirmButtonText: "OK",
                            text: "Thông tin đã được cập nhật.",
                            icon: "success"
                        }).then(() => {
                            // Tải lại trang khi người dùng nhấn "OK"
                            window.location.reload();
                        });
                    setShowModal(false); // Đóng modal
                }
            } catch (err) {
                Swal.fire("Thất bại", "Đã xảy ra lỗi khi cập nhật.", "error");
                console.error("Lỗi:", err.response ? err.response.data : err.message);
            }
        }
    };

    if (error) {
        return <div>Lỗi: {error}</div>;
    }

    if (!locationDetail) {
        return <div></div>;
    }

    return (
        <div>
            {/* Nút "Chỉnh sửa" */}
            <a href="#" className="float-end text-decoration-none custom-link fw-bold" onClick={() => setShowModal(true)}>
                Chỉnh sửa
            </a>

            {/* Modal sử dụng react-bootstrap */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh sửa chi tiết địa điểm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <style>
                            {`
                input,
                select {
                  width: 100%;
                  padding: 10px;
                  margin-bottom: 15px;
                  border: 1px solid #ced4da;
                  border-radius: 5px;
                  font-size: 14px;
                }

                input:focus,
                select:focus {
                  border-color: #80bdff;
                  outline: none;
                  box-shadow: 0 0 5px rgba(0, 123, 255, 0.25);
                }

                label {
                  font-weight: bold;
                  display: block;
                  margin-bottom: 5px;
                }

                button[type="submit"] {
                  width: 100%;
                  padding: 12px;
                  background-color: #007bff;
                  color: white;
                  border: none;
                  border-radius: 5px;
                  font-size: 16px;
                  cursor: pointer;
                  margin-top: 15px;
                }

                button[type="submit"]:hover {
                  background-color: #0056b3;
                }
              `}
                        </style>
                        <div>
                            <label>Tên địa điểm</label>
                            <input type="text" name="id" value={locationName} disabled />
                        </div>

                        <div>
                            <label>Miêu tả:</label>
                            <input
                                type="text"
                                name="description"
                                value={locationDetail.description || ""}
                                onChange={handleInputChange}
                            />
                        </div>



                        <div className="row">
                            <div className="col-sm-6">
                                <label>Thời gian bắt đầu:</label>
                                <input
                                    type="time"
                                    name="startHour"
                                    value={locationDetail.startHour || ""}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="col-sm-6">
                                <label>Thời gian kết thúc:</label>
                                <input
                                    type="time"
                                    name="endHour"
                                    value={locationDetail.endHour || ""}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="col-sm-6">
                                <label>Giá:</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={locationDetail.price || ""}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="col-sm-6">
                                <label>Phương tiện:</label>
                                <select
                                    name="vehicle"
                                    value={locationDetail.vehicle || ""}
                                    onChange={handleInputChange}
                                >
                                    <option value="CAR">Car</option>
                                    <option value="BUS">Bus</option>
                                    <option value="MOTOBIKE">Motorbike</option>
                                </select>
                            </div>
                        </div>





                        <button type="submit" className="btn btn-primary">
                            Lưu thay đổi
                        </button>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default EditLocationDetail;