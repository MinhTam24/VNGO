import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Modal, Button } from 'react-bootstrap';
import config from "../../config.json";
import { Dropdown } from 'react-bootstrap'; // Import Dropdown từ react-bootstrap
import tourApi from '../../Api/TourApi';
import Swal from 'sweetalert2';
import locationApi from '../../Api/LocationApi';
import { useAuth } from "../../js/contexts/AuthContext"; // Import AuthContext




const ButtonCreateTour = () => {
    const [tourId, setTourId] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [startTime, setStartTime] = useState('00:00:00');
    const [endTime, setEndTime] = useState('00:00:00');
    const [locationByCreateBy, setlocationByCreateBy] = useState([]); // nút dropdown
    const [locations, setLocations] = useState([]); // mảng location của tour
    const { authId } = useAuth();
    const [loading, setLoading] = useState(false);
    const [locationAdded, setLocationAdded] = useState(false);
    const [errors, setErrors] = useState({});
    const { SERVER_API } = config;


    useEffect(() => {
        if (authId) {
            getLocation(authId);
        }
    }, [authId]);

    useEffect(() => {
        if (locations.length > 0) {
            setLocationAdded(true); // Đánh dấu khi có địa điểm
        } else {
            setLocationAdded(false); // Đánh dấu khi danh sách trống
        }
    }, [locations]);

    const handleLocationSelect = (location) => {
        setLocations(prevLocations => {
            if (!prevLocations.some(existingLocation => existingLocation.id === location.id)) {
                return [...prevLocations, location];
            }
            return prevLocations; // Nếu phần tử đã có, không thêm vào nữa
        });
    };

    const handleRemoveLocation = (location) => {
        if (locations.some(existingLocation => existingLocation.id === location.id)) {
            setLocations(locations.filter(existingLocation => existingLocation.id !== location.id));
        }
    };


    const getLocation = async (id) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${SERVER_API}/api/location-createBY/${id}`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,  // Gửi token đúng cách trong header
                }
            });
            if (response.ok) {
                const data = await response.json();
                setlocationByCreateBy(data);
            } else {
                throw new Error("Không thể tạo tour. Vui lòng thử lại.");
            }
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
        }
    }


    const createTour = async () => {
        setIsCreating(true);
        setErrorMessage("");
        try {
            const data = await tourApi.createTour();
            if (data) {
                setTourId(data);
                setShowModal(true); // Mở modal khi tour được tạo thành công
            } else {
                throw new Error("Không thể tạo tour. Vui lòng thử lại.");
            }
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsCreating(false);
        }
    };

    // Xử lý thay đổi giá trị input
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
            price: 0,
            startHour: '',
            endHour: '',
            vehicle: '',
            tour: (tourId) ? tourId : " 1 "
        },
    });



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

        // Kiểm tra nếu giá trị là ngày kết thúc và nếu ngày kết thúc nhỏ hơn ngày bắt đầu
        if (name === "endDate" && value && tour.startDate) {
            const startDate = new Date(tour.startDate);
            const endDate = new Date(value);

            if (endDate < startDate) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    endDate: "Ngày kết thúc không thể nhỏ hơn ngày bắt đầu.",
                }));
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    endDate: "",
                }));
            }
        }



        if (!value.trim()) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: `Vui lòng nhập ${name}.`,
            }));
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: undefined,
            }));
        }


        // Kiểm tra nếu giá trị nhập vào hợp lệ (chỉ cho phép nhập số và chữ)
        if (!/^\d*$/.test(value)) return;

        // Xử lý thay đổi giờ, phút, giây cho startTime và endTime
        if (name.startsWith('start')) {
            const updatedStartTime = moment(startTime, 'HH:mm:ss');
            const updatedTime = updatedStartTime.set(name.replace('start', '').toLowerCase(), value);
            setStartTime(updatedTime.format('HH:mm:ss'));
        } else if (name.startsWith('end')) {
            const updatedEndTime = moment(endTime, 'HH:mm:ss');
            const updatedTime = updatedEndTime.set(name.replace('end', '').toLowerCase(), value);
            setEndTime(updatedTime.format('HH:mm:ss'));
        }


    };

    // Tạo chuỗi thời gian từ các phần (giờ, phút, giây)
    const startTimeDisplay = `${startTime !== '00:00:00' ? startTime : 'Chưa chọn'}`;
    const endTimeDisplay = `${endTime !== '00:00:00' ? endTime : 'Chưa chọn'}`;

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
        if (!validateFormLocation()) {
            console.log("validate false");
            return;
        }
        const { name, address, province, coordinates, locationDetailDto } = location;
        const { price } = locationDetailDto;
        locationDetailDto.startHour = moment(startTime, 'HH:mm:ss').format('HH:mm:ss');  // Lấy giờ từ startTime
        locationDetailDto.endHour = moment(endTime, 'HH:mm:ss').format('HH:mm:ss');      // Lấy giờ từ endTime

        // Chuẩn hóa giá trị position và price thành số
        const data = {
            name,
            address,
            province,
            coordinates,
            locationDetailDto: {
                ...locationDetailDto,
                price: parseFloat(price),         // Chuyển price thành số thực
                tour: tourId || "1",  // Nếu tourId chưa có, sử dụng "1" làm giá trị mặc định
            },
        };


        try {
            const response = await locationApi.createLocation(data)
            console.log("Response from server:", response);  // Log toàn bộ phản hồi để xem cấu trúc

            if (response) {
                const locationId = response;  // Giả sử server trả về `id` của location vừa tạo
                // Thêm `id` vào đối tượng `data`
                data.id = locationId;
                setLocations([...locations, data])
                setLocationAdded(true);
                Swal.fire({
                    title: "Thành công",
                    heightAuto: false,
                    confirmButtonText: "OK",
                    text: "Thêm địa điểm thành công!",
                    icon: "success"
                })
                console.log(data)
            }
        } catch (error) {
            setLocations([])
            console.error(error);
            setErrorMessage('Có lỗi xảy ra khi thêm địa điểm' + error);
        }
    };

    const addNewLocationDetail = async (tourId, locationId, position) => {
        const formData = new FormData();
        formData.append("tourId", tourId);
        formData.append("locationId", locationId);
        formData.append("position", position);

        try {
            const token = localStorage.getItem("token"); // Lấy token từ localStorage
            const response = await fetch(`${SERVER_API}/api/locationdetail-new`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}` // Gắn token xác thực
                },
                body: formData, // Gửi dữ liệu FormData
            });

            if (response.ok) {
                const successData = await response.json();
                console.log("Thành công:", successData);
            } else {
                const errorData = await response.json();
                console.error("Chi tiết lỗi:", errorData); // Xem thông tin lỗi từ server
                throw new Error("Thêm địa điểm thất bại");
            }
        } catch (error) {
            console.error("Có lỗi xảy ra:", error);
            setErrorMessage("Có lỗi xảy ra khi thêm địa điểm: " + error.message);
        }
    };



    const validateForm = () => {
        const newErrors = {};
        //Validate Tour
        if (!tour.title) newErrors.title = "Vui lòng nhập tên tour.";
        if (!tour.descriptionTour) newErrors.descriptionTour = "Vui lòng nhập mô tả.";
        if (!tour.addressTour) newErrors.addressTour = "Vui lòng nhập địa chỉ.";
        if (!tour.expense) newErrors.expense = "Vui lòng nhập chi phí.";
        if (!tour.quantityMember) newErrors.quantityMember = "Vui lòng nhập số lượng thành viên.";
        if (!tour.startDate) newErrors.startDate = "Vui lòng chọn ngày khởi hành.";
        if (!tour.endDate) newErrors.endDate = "Vui lòng chọn ngày kết thúc.";

        if (tour.endDate && tour.startDate && new Date(tour.endDate) < new Date(tour.startDate)) {
            newErrors.endDate = "Ngày kết thúc không thể nhỏ hơn ngày bắt đầu.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };


    const validateFormLocation = () => {
        const newErrors = {};

        // Kiểm tra các trường trong location
        if (!location.name || location.name === "") newErrors.name = "Vui lòng nhập tên địa điểm.";
        if (!location.address || location.address === "") newErrors.address = "Vui lòng nhập địa chỉ địa điểm.";
        if (!location.province || location.province === "") newErrors.province = "Vui lòng nhập tỉnh thành.";
        if (!location.coordinates || location.coordinates === "") newErrors.coordinates = "Vui lòng chọn tọa độ.";

        // Kiểm tra locationDetailDto nếu tồn tại
        if (location.locationDetailDto) {
            if (!location.locationDetailDto.description || location.locationDetailDto.description === "")
                newErrors.description = "Vui lòng nhập mô tả địa điểm.";
            if (!location.locationDetailDto.price && location.locationDetailDto.price !== 0)  // Kiểm tra nếu giá trị không phải là 0
                newErrors.price = "Vui lòng nhập giá.";
            if (!location.locationDetailDto.vehicle || location.locationDetailDto.vehicle === "")
                newErrors.vehicle = "Vui lòng chọn phương tiện.";
        } else {
            // Nếu `locationDetailDto` không tồn tại, thêm lỗi cho các trường con của nó
            newErrors.locationDetailDto = "Chi tiết địa điểm không tồn tại.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };






    // Cập nhật Tour
    const updateTour = async () => {
        if (!locationAdded) {
            setErrorMessage('Vui lòng thêm ít nhất một địa điểm trước khi cập nhật tour!');
            return;
        }
        if (!validateForm()) {
            return;
        }

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
                Authorization: `Bearer ${token}`, // Gắn token vào header
              },
              body: formData,
            });

            if (response.ok) {
                locations.forEach((location, index) => {
                    if (location && location.id) {
                        addNewLocationDetail(tourId, location.id, index + 1); // Truyền position = index + 1
                    }
                });
                console.log(locations)
                Swal.fire({
                    title: "Thành công",
                    heightAuto: false,
                    confirmButtonText: "OK",
                    text: "Tạo chuyến đi thàng công!",
                    icon: "success"
                });

                setShowModal(false);
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

    const handleDelete = () => {
        Swal.fire({
            title: 'Bạn có chắc muốn thoát không?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Có',
            cancelButtonText: 'Hủy',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteTour(tourId); // Thực hiện xóa tour nếu người dùng xác nhận
            } else {
                setShowModal(true); // Nếu người dùng hủy, giữ modal hiển thị
            }
        });
    };


    // Xóa Tour 
    const deleteTour = async (tourId) => {
        if (!tourId) {
            setErrorMessage("Không có tour để xóa!")
            return;
        }
        try {
            const data = await tourApi.deleteTour(tourId)
            if (data) {
                setErrors({})
                setLocations([])
                setShowModal(false);
            } else {
                throw new Error("Không thể đóng, vui lòng thử lại!")
            }
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <div>
            <button type="button" className="btn btn-custom" onClick={createTour} disabled={isCreating} >
                <i className="fas fa-route" style={{ color: "blue" }} />
                {/* {isCreating ? "Đang tạo tour..." : "Tạo Tour Mới"} */}
            </button>
            <Modal className='modal-fullscreen w-100 h-100 custom-modal-width' show={showModal} onHide={() => handleDelete(tourId)}>
                <Modal.Header
                    closeButton
                    onClick={() => {
                        handleDelete(tourId);
                    }}
                >
                    <Modal.Title className="fs-5 fw-bold">Tạo chuyến đi</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex" style={{ height: "100%" }}>
                        {/* Form bên trái */}
                        <div
                            className="left-section"
                            style={{
                                flex: 1.5,
                                backgroundColor: "#f8f9fa",
                                padding: 20,
                                overflowY: "auto"
                            }}
                        >
                            {/* Tên chuyến đi */}
                            <div className="row g-3">
                                {/* Tên tour */}
                                <div className="col-md-12">
                                    <label htmlFor="tenTour" className="form-label fw-bold">
                                        Tên chuyến đi:
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.title ? "is-invalid" : ""}`}
                                        id="tenTour"
                                        placeholder="Tên chuyến đi của bạn"
                                        name="title"
                                        onChange={handleChange}
                                    />
                                    {errors.title && <small className="text-danger">{errors.title}</small>}
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
                                    <label htmlFor="moTa" className="form-label fw-bold">
                                        Mô tả:
                                    </label>
                                    <textarea
                                        className={`form-control ${errors.descriptionTour ? "is-invalid" : ""}`}
                                        id="moTa"
                                        placeholder="Nhập mô tả chuyến đi"
                                        name="descriptionTour"
                                        onChange={handleChange}
                                        rows={4}
                                    />
                                    {errors.descriptionTour && <small className="text-danger">{errors.descriptionTour}</small>}
                                </div>


                                {/* Địa chỉ */}
                                <div className="col-md-12">
                                    <label htmlFor="diaChiTour" className="form-label fw-bold">
                                        Địa chỉ:
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.addressTour ? "is-invalid" : ""}`}
                                        id="diaChiTour"
                                        placeholder="Nhập địa chỉ đích đến chuyến đi của bạn"
                                        name="addressTour"
                                        onChange={handleChange}
                                    />
                                    {errors.addressTour && <small className="text-danger">{errors.addressTour}</small>}
                                </div>

                                {/* Chi phí */}
                                <div className="col-md-6">
                                    <label htmlFor="chiPhi" className="form-label fw-bold">
                                        Tổng chi phí:
                                    </label>
                                    <input
                                        type="number"
                                        className={`form-control ${errors.expense ? "is-invalid" : ""}`}
                                        id="chiPhi"
                                        name="expense"
                                        onChange={handleChange}
                                        placeholder='Tổng chi phí của chuyến đi'
                                    />
                                    {errors.expense && <small className="text-danger">{errors.expense}</small>}
                                </div>

                                <div className="col-md-6">
                                    <label htmlFor="slThanhVien" className="form-label fw-bold">
                                        Số lượng thành viên:
                                    </label>
                                    <input
                                        type="number"
                                        className={`form-control ${errors.quantityMember ? "is-invalid" : ""}`}
                                        id="slThanhVien"
                                        name="quantityMember"
                                        onChange={handleChange}
                                        placeholder='Số lượng thành viên tham gia chuyến đi'
                                    />
                                    {errors.quantityMember && <small className="text-danger">{errors.quantityMember}</small>}
                                </div>

                                {/* Cho phéo áp dụng */}
                                <div className="form-check col-md-12">
                                    <label htmlFor="choPhepApDung" className="form-check-label fw-bold">
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
                                    <label htmlFor="ngayKhoiHanh" className="form-label fw-bold">
                                        Ngày khởi hành:
                                    </label>
                                    <input
                                        type="date"
                                        className={`form-control ${errors.startDate ? "is-invalid" : ""}`}
                                        id="ngayKhoiHanh"
                                        name="startDate"
                                        onChange={handleChange}
                                    />
                                    {errors.startDate && <small className="text-danger">{errors.startDate}</small>}
                                </div>

                                {/* Ngày kết thúc */}
                                <div className="col-md-6">
                                    <label htmlFor="ngayKetThuc" className="form-label fw-bold">
                                        Ngày kết thúc:
                                    </label>
                                    <input
                                        type="date"
                                        className={`form-control ${errors.endDate ? "is-invalid" : ""}`}
                                        id="ngayKetThuc"
                                        name="endDate"
                                        value={tour.endDate}  // Đảm bảo giá trị ngày kết thúc được liên kết
                                        onChange={handleChange}
                                    />
                                    {errors.endDate && <small className="text-danger">{errors.endDate}</small>}
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
                                {/* {errors.files && <small className="text-danger">{errors.files}</small>} */}

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

                            <div className="mb-3 mb-1">
                                <label className="col-form-label fw-bold" >
                                    Chọn địa điểm từng tạo
                                </label>
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        Áp dụng địa điểm của bạn
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {locationByCreateBy.map((location, index) => (
                                            <Dropdown.Item key={index} href={`#/${location.name}`} onClick={() => handleLocationSelect(location)}>
                                                {location.name} {/* Hiển thị tên địa điểm */}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>





                            <div className="mb-3 ">
                                <h3 style={{ textAlign: "center", color: "red", fontWeight: "bolder" }}>
                                    Danh sách địa điểm
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
                                        {locations.map((location, index) => (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{location.name}</td>
                                                <td>{location.address}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-primary btn-sm"
                                                        onClick={() => handleRemoveLocation(location)}
                                                    >
                                                        Xóa
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
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
                            <h2 style={{ textAlign: "center" }}>Tạo địa điểm</h2>
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
                                <label htmlFor="place-name" className="col-form-label fw-bold">
                                    Tên địa điểm:
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                    id="place-name"
                                    placeholder="Nhập tên địa điểm"
                                    name="name"
                                    onChange={handleChange}
                                    required
                                />
                                {errors.name && <small className="text-danger">{errors.name}</small>}
                            </div>
                            {/* Địa chỉ */}
                            <div className="mb-3">
                                <label htmlFor="place-address" className="col-form-label  fw-bold">
                                    Địa chỉ:
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.address ? "is-invalid" : ""}`}
                                    id="place-address"
                                    placeholder="Nhập địa chỉ"
                                    name="address"
                                    onChange={handleChange}
                                    required
                                />
                                {errors.address && <small className="text-danger">{errors.address}</small>}
                            </div>
                            {/* Mô tả chuyến đi */}
                            <div className="mb-3">
                                <label htmlFor="description" className="col-form-label fw-bold">
                                    Mô tả chuyến đi:
                                </label>
                                <textarea
                                    className={`form-control ${errors.description ? "is-invalid" : ""}`}
                                    id="description"
                                    rows={5}
                                    defaultValue={""}
                                    name="description"
                                    onChange={handleChange}
                                    required
                                />
                                {errors.description && <small className="text-danger">{errors.description}</small>}
                            </div>
                            {/* Thời gian chuyến đi */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <label htmlFor="start-time" className="col-form-label fw-bold">
                                    Thời gian bắt đầu:
                                </label>
                                <div className="d-flex">
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="startHour"
                                        value={moment(startTime, 'HH:mm:ss').format('HH')}
                                        onChange={handleChange}
                                        max="23"
                                        min="0"
                                        required
                                        placeholder="Giờ"
                                    />
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="startMinute"
                                        value={moment(startTime, 'HH:mm:ss').format('mm')}
                                        onChange={handleChange}
                                        max="59"
                                        min="0"
                                        required
                                        placeholder="Phút"
                                    />
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="startSecond"
                                        value={moment(startTime, 'HH:mm:ss').format('ss')}
                                        onChange={handleChange}
                                        max="59"
                                        min="0"
                                        required
                                        placeholder="Giây"
                                    />
                                </div>
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                                <label htmlFor="end-time" className="col-form-label fw-bold">
                                    Thời gian kết thúc:
                                </label>
                                <div className="d-flex">
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="endHour"
                                        value={moment(endTime, 'HH:mm:ss').format('HH')}
                                        onChange={handleChange}
                                        max="23"
                                        min="0"
                                        required
                                        placeholder="Giờ"
                                    />
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="endMinute"
                                        value={moment(endTime, 'HH:mm:ss').format('mm')}
                                        onChange={handleChange}
                                        max="59"
                                        min="0"
                                        required
                                        placeholder="Phút"
                                    />
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="endSecond"
                                        value={moment(endTime, 'HH:mm:ss').format('ss')}
                                        onChange={handleChange}
                                        max="59"
                                        min="0"
                                        required
                                        placeholder="Giây"
                                    />
                                </div>
                            </div>

                            {/* Hiển thị chuỗi thời gian bắt đầu và kết thúc */}
                            {/* <div>
                                <p className='pt-4 fw-bold'>Thời gian bắt đầu: {startTimeDisplay}</p>
                                <p className=' fw-bold'>Thời gian kết thúc: {endTimeDisplay}</p>
                            </div> */}

                            {/* Hiển thị thông báo lỗi */}
                            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

                            <div className="mb-3">
                                <label htmlFor="place-province" className="col-form-label fw-bold">
                                    Tỉnh thành:
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.province ? "is-invalid" : ""}`}
                                    id="place-province"
                                    placeholder="Nhập tỉnh thành"
                                    name="province"
                                    onChange={handleChange}
                                    required
                                />
                                {errors.province && <small className="text-danger">{errors.province}</small>}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="place-coordinates" className="col-form-label fw-bold">
                                    Google Map:
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.coordinates ? "is-invalid" : ""}`}
                                    id="place-coordinates"
                                    placeholder="Nhập tọa độ Google Map"
                                    name="coordinates"
                                    onChange={handleChange}
                                    required
                                />
                                {errors.coordinates && <small className="text-danger">{errors.coordinates}</small>}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="place-price" className="col-form-label fw-bold">
                                    Chi phí:
                                </label>
                                <input
                                    type="number"
                                    className={`form-control ${errors.price ? "is-invalid" : ""}`}
                                    id="place-price"
                                    placeholder="Nhập chi phí đã tiêu tại địa điểm"
                                    name="price"
                                    onChange={handleChange}
                                    required
                                    min={0}
                                />
                                {errors.price && <small className="text-danger">{errors.price}</small>}
                            </div>



                            {/* Phương tiện */}
                            <div className="mb-3">
                                <label htmlFor="transportation" className="col-form-label fw-bold">
                                    Phương tiện:
                                </label>
                                <select
                                    className={`form-control ${errors.vehicle ? "is-invalid" : ""}`}
                                    id="transportation"
                                    name="vehicle"
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Chọn phương tiện</option>
                                    <option value="MOTOBIKE">Xe máy</option>
                                    <option value="CAR">Xe hơi</option>
                                    <option value="BUS">Xe Bus</option>
                                    <option value="TRAIN">Tàu hỏa</option>
                                    <option value="PLANE">Máy bay</option>
                                    <option value="BICYCLE">Xe đạp</option>
                                    <option value="BOAT">Thuyền</option>




                                </select>
                                {errors.vehicle && <small className="text-danger">{errors.vehicle}</small>}
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
                </Modal.Body>
                {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        handleDelete(tourId);
                    }}

                    > HỦY</Button>
                    <Button className="btn btn-primary " onClick={updateTour}
                        disabled={loading || !locationAdded}>         {loading ? 'Đang xử lý...' : 'Cập nhật tour'}</Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default ButtonCreateTour;
