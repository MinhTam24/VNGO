import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap'; // Import React-Bootstrap components
import config from "../../config";

const ModalTour = (props) => {
    const [tour, setTour] = useState({
        title: '',
        descriptionTour: '',
        startDate: '',
        endDate: '',
        expense: '',
        addressTour: '',
        quantityMember: '',
        allowedToApply: false,
        files: [],
        previews: []  // Thêm state để lưu các URL preview
    });

    const [location, setLocation] = useState({
        name: '',
        address: '',
        province: '',
        coordinates: '',
        locationDetailDto: {
            description: '',
            position: '',
            price: 0,
            startHour: '',
            endHour: '',
            vehicle: '',
            tour: (props.tourId !== null && props.tourId !== undefined) ? props.tourId : "1"
            },
    });

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [locationAdded, setLocationAdded] = useState(false);
    const { SERVER_API } = config;

    // Xử lý thay đổi giá trị input
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name in location) {
            setLocation({
                ...location,
                [name]: value,
            });
        } else if (name in location.locationDetailDto) {
            setLocation({
                ...location,
                locationDetailDto: {
                    ...location.locationDetailDto,
                    [name]: value,
                },
            });
        } else {
            setTour({
                ...tour,
                [name]: value,
            });
        }
    };

    // Xử lý khi thay đổi file (hình ảnh)
    const handleFileChange = (e) => {
        const selectedFiles = e.target.files;  // Lấy danh sách file người dùng chọn
        const fileArray = Array.from(selectedFiles);

        // Kết hợp các file cũ với các file mới
        const newFiles = [...tour.files, ...fileArray];

        // Tạo các preview URL cho hình ảnh
        const filePreviews = fileArray.map(file => URL.createObjectURL(file));

        setTour({
            ...tour,
            files: newFiles,  // Kết hợp các file mới vào mảng file cũ
            previews: [...tour.previews, ...filePreviews],  // Kết hợp các preview mới vào mảng preview cũ
        });
    };

    // Xử lý xóa ảnh
    const handleRemoveImage = (index) => {
        const newFiles = [...tour.files];
        const newPreviews = [...tour.previews];

        newFiles.splice(index, 1);
        newPreviews.splice(index, 1);

        setTour({
            ...tour,
            files: newFiles,
            previews: newPreviews,
        });
    };

    // Thêm Địa Điểm
    const addLocation = async () => {
        const { name, address, province, coordinates, locationDetailDto } = location;

        const data = {
            name,
            address,
            province,
            coordinates,
            locationDetailDto,
        };

        try {
            const token = localStorage.getItem("token"); // Lấy token từ localStorage

            const response = await fetch(`${SERVER_API}/api/location`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Gắn token vào header
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setLocationAdded(true);
                alert('Đã thêm địa điểm thành công');
            } else {
                throw new Error('Thêm địa điểm thất bại');
            }
        } catch (error) {
            console.error(error);
            setErrorMessage('Có lỗi xảy ra khi thêm địa điểm' + error);
        }
    };

    // Cập nhật Tour
    const updateTour = async () => {
        if (!locationAdded) {
            setErrorMessage('Vui lòng thêm ít nhất một địa điểm trước khi cập nhật tour!');
            return;
        }

        const { tourId } = props;
        const { title, descriptionTour, startDate, endDate, expense, addressTour, quantityMember, allowedToApply, files } = tour;

        if (!tourId) {
            setErrorMessage('Không có ID tour để cập nhật');
            return;
        }

        setLoading(true);
        setErrorMessage('');

        const formData = new FormData();
        formData.append('id', tourId);
        formData.append('title', title);
        formData.append('descriptionTour', descriptionTour);
        formData.append('startDate', startDate);
        formData.append('endDate', endDate);
        formData.append('expense', expense);
        formData.append('addressTour', addressTour);
        formData.append('quantityMember', quantityMember);
        formData.append('allowedToApply', allowedToApply);

        Array.from(files).forEach(file => {
            formData.append('files', file);
        });

        try {
            const token = localStorage.getItem("token"); // Lấy token từ localStorage
            const response = await fetch(`${SERVER_API}/api/tour-data`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`, // Gắn token vào header
                },
                body: formData, // Dữ liệu gửi đi
            });

            if (response.ok) {
                alert('Cập nhật tour thành công!');
            } else {
                throw new Error('Cập nhật tour thất bại');
            }
        } catch (error) {
            console.error('Có lỗi xảy ra', error);
            setErrorMessage('Có lỗi xảy ra. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div
                className="modal fade"
                id="tourModal"
                tabIndex={-1}
                aria-labelledby="tourModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-fullscreen w-100 h-100">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="tourModalLabel">
                                Hãy viết chuyến đi của bạn
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body">
                            <div className="d-flex" style={{ height: "100%" }}>
                                {/* Form bên trái */}
                                <div
                                    className="left-section"
                                    style={{
                                        flex: 2,
                                        backgroundColor: "#f8f9fa",
                                        padding: 20,
                                        overflowY: "auto"
                                    }}
                                >
                                    {/* Tên chuyến đi */}
                                    <div className="row g-3">
                                        {/* Tên tour */}
                                        <div className="col-md-6">
                                            <label htmlFor="tenTour" className="form-label">
                                                Tên tour:
                                            </label>
                                            <textarea
                                                className="form-control"
                                                id="tenTour"
                                                rows={3}
                                                placeholder="Tiêu đề chuyến đi của bạn"
                                                style={{ height: 200 }}
                                                defaultValue={""}
                                                name="title"
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            {/* <label htmlFor="map" className="form-label">
                                                Chọn địa điểm trên bản đồ:
                                            </label>
                                            <iframe
                                                style={{ borderRadius: 10 }}
                                                id="map"
                                                width="100%"
                                                height="200px"
                                                loading="lazy"
                                                allowFullScreen=""
                                                src="https://www.google.com/maps/place/Lana+Coffee/@10.8340335,106.6803153,855m/data=!3m2!1e3!4b1!4m6!3m5!1s0x31752915579e0cd3:0x3ffa13c9ca9097c5!8m2!3d10.8340335!4d106.6828902!16s%2Fg%2F11jrqdbqw8?hl=vi-VN&entry=ttu&g_ep=EgoyMDI0MTExNy4wIKXMDSoASAFQAw%3D%3D"
                                            ></iframe> */}
                                        </div>

                                        {/* Mô tả */}
                                        <div className="col-md-12">
                                            <label htmlFor="moTa" className="form-label">
                                                Mô tả
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="moTa"
                                                placeholder="Nhập mô tả"
                                                name="descriptionTour"
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        {/* Địa chỉ */}
                                        <div className="col-md-8">
                                            <label htmlFor="diaChiTour" className="form-label">
                                                Địa chỉ
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="diaChiTour"
                                                placeholder="Nhập địa chỉ"
                                                name="addressTour"
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>


                                        {/* Chi phí */}
                                        <div className="col-md-6">
                                            <label htmlFor="chiPhi" className="form-label">
                                                Chi phí
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="chiPhi"
                                                name="expense"
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        {/* Số lượng thành viên */}
                                        <div className="col-md-6">
                                            <label htmlFor="slThanhVien" className="form-label">
                                                Số lượng thành viên
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="slThanhVien"
                                                name="quantityMember"
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        {/* Cho phéo áp dụng */}
                                        <div className="form-check col-md-12">
                                            <label htmlFor="choPhepApDung" className="form-check-label">
                                                Cho phép áp dụng
                                            </label>
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                id="choPhepApDung"
                                                name="allowedToApply"
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        {/* Ngày bắt đầu */}
                                        <div className="col-md-6">
                                            <label htmlFor="ngayKhoiHanh" className="form-label">
                                                Ngày khởi hành
                                            </label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="ngayKhoiHanh"
                                                name="startDate"
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        {/* Ngày kết thúc */}
                                        <div className="col-md-6">
                                            <label htmlFor="ngayKetThuc" className="form-label">
                                                Ngày kết thúc
                                            </label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="ngayKetThuc"
                                                name="endDate"
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                    </div>
                                    <div className="mb-3" style={{ height: "cover" }}>
                                        <label htmlFor="image-upload" className="col-form-label">
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

                                        {tour.previews.length > 0 && (
                                            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
                                                {tour.previews.map((preview, index) => (
                                                    <div key={index} style={{ position: 'relative', width: '100px', height: '100px' }}>
                                                        <img
                                                            src={preview}
                                                            alt="preview"
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover',  // Đảm bảo ảnh luôn chiếm toàn bộ khung vuông
                                                                borderRadius: '10px'  // Làm tròn góc
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


                                    <div className="mb-3">
                                        <h3 style={{ textAlign: "center" }}>
                                            Danh sách chuyến đi đã tạo
                                        </h3>
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th scope="col">STT</th>
                                                    <th scope="col">Tên địa điểm</th>
                                                    <th scope="col">Địa chỉ</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <th scope="row">1</th>
                                                    <td>Hà Nội</td>
                                                    <td>10/104 linh đông, hà nội.</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-primary btn-sm"
                                                            onClick={() => { }}
                                                        >
                                                            Chỉnh sửa
                                                        </button>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">2</th>
                                                    <td>Lana coffee</td>
                                                    <td>phạm huy thông gò vấp tphcm.</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-primary btn-sm"
                                                            onClick={() => { }}
                                                        >
                                                            Chỉnh sửa
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>




                                {/* Form bên phải */}
                                <div
                                    className="right-section"
                                    style={{
                                        flex: 1,
                                        backgroundColor: "#e9ecef",
                                        padding: 20,
                                        overflowY: "auto"
                                    }}
                                >
                                    <h2 style={{ textAlign: "center" }}>Mô tả chi tiết địa điểm</h2>
                                    <div className="col-md-12">
                                        <label htmlFor="map" className="form-label">
                                            Chọn địa điểm trên bản đồ:
                                        </label>
                                        <iframe
                                            style={{ borderRadius: 10 }}
                                            id="map"
                                            width="100%"
                                            height="200px"
                                            loading="lazy"
                                            allowFullScreen=""
                                            src="https://www.google.com/maps/place/Lana+Coffee/@10.8340335,106.6803153,855m/data=!3m2!1e3!4b1!4m6!3m5!1s0x31752915579e0cd3:0x3ffa13c9ca9097c5!8m2!3d10.8340335!4d106.6828902!16s%2Fg%2F11jrqdbqw8?hl=vi-VN&entry=ttu&g_ep=EgoyMDI0MTExNy4wIKXMDSoASAFQAw%3D%3D"
                                        ></iframe>
                                    </div>
                                    {/* Thêm input tên địa điểm và địa chỉ */}
                                    <div className="mb-3">
                                        <label htmlFor="place-name" className="col-form-label">
                                            Tên địa điểm:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="place-name"
                                            placeholder="Nhập tên địa điểm"
                                            name="name" onChange={handleChange} required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="place-address" className="col-form-label">
                                            Địa chỉ:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="place-address"
                                            placeholder="Nhập địa chỉ"
                                            name="address" onChange={handleChange} required
                                        />
                                    </div>
                                    {/* Mô tả chuyến đi */}
                                    <div className="mb-3">
                                        <label htmlFor="description" className="col-form-label">
                                            Mô tả chuyến đi:
                                        </label>
                                        <textarea
                                            className="form-control"
                                            id="description"
                                            rows={5}
                                            defaultValue={""}
                                            name="description" onChange={handleChange} required
                                        />
                                    </div>
                                    {/* Thời gian chuyến đi */}
                                    <div className="d-flex mb-3">
                                        <div className="me-3" style={{ flex: 1, minWidth: 0 }}>
                                            <label htmlFor="start-time" className="col-form-label">
                                                Thời gian bắt đầu:
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="start-time"
                                                name="startHour" onChange={handleChange} required
                                            />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <label htmlFor="end-time" className="col-form-label">
                                                Thời gian kết thúc:
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="end-time"
                                                name="endHour" onChange={handleChange} required
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="place-province" className="col-form-label">
                                            Tỉnh thành:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="place-province"
                                            placeholder="Nhập tỉnh thành"
                                            name="province" onChange={handleChange} required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="place-coordinates" className="col-form-label">
                                            Google Map:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="place-coordinates"
                                            placeholder="Nhập map"
                                            name="coordinates" onChange={handleChange} required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="place-price" className="col-form-label">
                                            Giá:
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="place-price"
                                            placeholder="Nhập giá"
                                            name="price" onChange={handleChange} required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="place-position" className="col-form-label">
                                            Google Map:
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="place-position"
                                            placeholder="Nhập map"
                                            name="position" onChange={handleChange} required
                                        />
                                    </div>


                                    {/* Phương tiện */}
                                    <div className="mb-3">
                                        <label htmlFor="transportation" className="col-form-label">
                                            Phương tiện:
                                        </label>
                                        <input className='form-control' id='transportation' type="text" name="vehicle" onChange={handleChange} required />
                                        {/* <select className="form-control" id="transportation">
                                            <option value="airplane">Máy bay</option>
                                            <option value="train">Tàu hỏa</option>
                                            <option value="bus">Xe khách</option>
                                            <option value="car">Ô tô</option>
                                            <option value="motorcycle">Xe máy</option>
                                        </select> */}
                                    </div>



                                    {/* Nút lưu và xóa */}
                                    <div className="d-flex justify-content-end">
                                        <button type="button" className="btn btn-primary me-2" onClick={addLocation} disabled={loading}>
                                            {loading ? 'Đang xử lý...' : 'Thêm Địa Điểm'}

                                        </button>
                                        <button type="button" className="btn btn-danger">
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Đóng
                            </button>
                            <button type="button" className="btn btn-primary" onClick={updateTour}
                                disabled={loading || !locationAdded}>
                                {loading ? 'Đang xử lý...' : 'Cập nhật tour'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalTour;
