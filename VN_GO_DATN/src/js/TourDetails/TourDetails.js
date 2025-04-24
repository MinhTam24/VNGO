import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import '../../css/TourDetails.css';
import { useAuth } from "../../js/contexts/AuthContext";
import { Navigate } from 'react-router-dom'; // Sử dụng Navigate để chuyển hướng
import config from "../../config.json";
import { EditLocation } from "@mui/icons-material";
import EditLocationDetail from "./EditLocationDetail";
import UpdateLocation from "./UpdateLocation";
import EditTour from "./EditTour";


const TourDetails = () => {
  const { authId } = useAuth();
  const { id } = useParams();  // Lấy id từ URL
  const [tours, setTours] = useState({});
  const [locationDto, setLocationDto] = useState([]);
  const [ListimageUrl, setimageUrl] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null); // Thêm state cho địa điểm đã chọn
  const [sortedLocationDto, setSortedLocationDto] = useState([]);
  const { SERVER_API } = config;
  const token = localStorage.getItem("token")


  const getTours = async (id) => {
    const response = await fetch(`${SERVER_API}/api/tour/${id}`, {
      method: "GET", // Phương thức yêu cầu
      headers: {
        "Content-Type": "application/json", // Đảm bảo header đúng kiểu dữ liệu
        Authorization: `Bearer ${token}`,   // Gắn token vào header Authorization
      },
    }); if (response.ok) {
      const tours = await response.json();
      setTours(tours);
      setLocationDto(tours.locationDto || []);
      setimageUrl(tours.imageUrl || []);
    }
  };

  useEffect(() => {
    getTours(id);
  }, [id]);



  useEffect(() => {
    if (locationDto.length > 0) {
      const sortedLocations = [...locationDto].sort(
        (a, b) => a.locationDetailDto.position - b.locationDetailDto.position
      );
      // Kiểm tra nếu danh sách đã sắp xếp thay đổi thì mới cập nhật
      if (JSON.stringify(locationDto) !== JSON.stringify(sortedLocations)) {
        setLocationDto(sortedLocations);
        setSelectedLocation(sortedLocations[0]); // Chọn phần tử đầu tiên sau khi sắp xếp
      }
    }
  }, [locationDto]);


  // useEffect(() => {
  //   if (locationDto.length > 0) {
  //     setSelectedLocation(locationDto[0]); // Chọn phần tử đầu tiên trong locationDto
  //   }
  // }, [locationDto]);

  // useEffect(() => {
  //   if (locationDto.length > 0) {
  //     // Sắp xếp locationDto theo position
  //     const sortedLocations = [...locationDto].sort(
  //       (a, b) => a.locationDetailDto.position - b.locationDetailDto.position
  //     );
  //     setLocationDto(sortedLocations);
  //     setSelectedLocation(sortedLocations[0]); // Chọn phần tử đầu tiên sau khi sắp xếp
  //   }
  // }, [locationDto]);


  const currentTourId = tours.id;



  // Hàm xử lý khi nhấn vào một địa điểm trong lịch trình
  const handleLocationClick = (location) => {
    // Kiểm tra điều kiện: locationDetailDto.tour = id và locationDetailDto.location = id của location
    const locationDetail = location.locationDetailDto;

    // Kiểm tra nếu tour id và location id khớp với khóa ngoại trong locationDetailDto
    if (locationDetail && locationDetail.tour === tours.id && locationDetail.location === location.id) {
      setSelectedLocation(location); // Cập nhật địa điểm đã chọn nếu thỏa mãn điều kiện
    } else {
      setSelectedLocation(locationDto[0]); // Nếu không thỏa mãn, đặt lại selectedLocation thành null
    }
  };



  // Khởi tạo state cho chỉ số slide hiện tại
  const [slideIndex, setSlideIndex] = useState(1);

  // Khởi tạo state cho ID của mục lịch trình được chọn
  const [selectedItineraryId, setSelectedItineraryId] = useState(null);


  // Dữ liệu của chuyến du lịch (tourData) với các thông tin như tên tour, người tạo, chi phí, lịch trình



  // Chọn mục lịch trình hiện tại theo ID hoặc mặc định chọn mục đầu tiên

  // Hàm xử lý chuyển sang slide tiếp theo hoặc quay lại slide trước
  const handleNextSlide = (n) => {
    let newIndex = slideIndex + n; // Tính chỉ số mới của slide
    if (newIndex > ListimageUrl.length) newIndex = 1; // Nếu chỉ số vượt quá số lượng hình ảnh, quay lại slide đầu tiên
    if (newIndex < 1) newIndex = ListimageUrl.length; // Nếu chỉ số nhỏ hơn 1, quay lại slide cuối cùng
    setSlideIndex(newIndex); // Cập nhật chỉ số slide
  };

  // Hàm xử lý khi người dùng chọn slide cụ thể
  const handleCurrentSlide = (index) => {
    setSlideIndex(index); // Cập nhật chỉ số slide hiện tại
  };

  // Kiểm tra trạng thái đăng nhập của người dùng
  const { isLoggedIn } = useAuth(); // Lấy trạng thái đăng nhập từ hook useAuth

  // Nếu người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
  // if (!isLoggedIn) {
  //   return <Navigate to="/login" />; // Điều hướng đến trang đăng nhập nếu chưa đăng nhập
  // }




  return (
    <>
      {/* Thông tin chuyến đi */}
      <div className="col-sm-9">
        <div className="pt-3">
          <h4 className="fw-bold">{tours.title}</h4>
          <span style={{ color: "#7c5f5f", fontSize: "0.8rem" }}>
            Chuyến đi của {tours.ownerName}
          </span>
        </div>


        {/* Slideshow */}
        <div className="row">
          <div className="col-sm-7">
            <div className="container">
              {ListimageUrl.map((img, index) => (
                <div
                  key={index}
                  className="mySlides"
                  style={{
                    display: index + 1 === slideIndex ? "block" : "none",
                  }}
                >
                  <div className="numbertext">{`${index + 1} / ${ListimageUrl.length}`}</div>
                  <img src={img} alt="" style={{ width: "100%" }} />
                </div>
              ))}
              <a className="prev" onClick={() => handleNextSlide(-1)}>
                ❮
              </a>
              <a className="next" onClick={() => handleNextSlide(1)}>
                ❯
              </a>
              <div className="caption-container">
                <p id="caption"></p>
              </div>
              <div className="thumbnail-container">
                <div className="row">
                  {ListimageUrl.map((img, index) => (
                    <div key={index} className="column">
                      <img
                        className={`demo cursor ${index + 1 === slideIndex ? "active" : ""
                          }`}
                        src={img}
                        alt={`Slide ${index + 1}`}
                        onClick={() => handleCurrentSlide(index + 1)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin tổng quan */}
          <div className="col-sm-5">
            <div className="row">
              <div className="col-sm-6">
                <span className="ms-5" style={{ color: "#8e8e8e" }}>
                  Được tạo lúc:
                </span>
                <h6
                  className="ms-5 d-flex gap-1"
                  style={{ color: "#8e8e8e" }}
                >
                  {tours.createdAt}
                </h6>
              </div>
              <div className="col-sm-6">
                <EditTour tourId={tours.id} />
              </div>
              <div className="col-sm-12" >
                <span className="ms-5 fw-bold" style={{ color: "#3a443b" }}>Địa chỉ:</span>
                <h6 className="ms-5">{tours.addressTour}</h6>
              </div>
              <div className="col-sm-6">
                <span className="ms-5 fw-bold" style={{ color: "#3a443b" }}>Số lượng người đi:</span>
                <h6 className="ms-5 d-flex gap-1">{tours.quantityMember}<p className="fw-bold">người</p></h6>
              </div>
              <div className="col-sm-6">
                <span className="ms-5 fw-bold" style={{ color: "#3a443b" }}>Tổng chi phí:</span>
                <h6 className="ms-5 d-flex gap-1">{tours.expense}<p>VND</p></h6>
              </div>
              <div className="col-sm-6">
                <span className="ms-5 fw-bold" style={{ color: "#3a443b" }}>Thời gian bắt đầu</span>
                <p className="ms-5 d-flex gap-1">{tours.startDate}</p>
              </div>
              <div className="col-sm-6">
                <span className="ms-5 fw-bold" style={{ color: "#3a443b" }}>Thời gian kết thúc</span>
                <p className="ms-5 d-flex gap-1">{tours.endDate}</p>
              </div>
              <div
                className="col-sm-12 tour-description"
                style={{ color: "#3a443b", wordWrap: "break-word", whiteSpace: "pre-line" }}
              >
                <span className="ms-5 fw-bold">Mô tả chuyến đi:</span>
                <h6 className="ms-5">{tours.descriptionTour}</h6>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-12 py-4">
          <div className="row">
            {/* Phần lịch trình */}
            <div className="col-sm-4 " >
              <div className="itinerary-container">
                <div className="header-title">Lịch trình</div>
                <hr />
                <div className="ltrinh" style={{ maxHeight: '400px', overflowY: 'auto', overflowX: 'hidden' }}>
                  {locationDto.map((location, index) => {
                    const locationDetail = location.locationDetailDto;
                    // Kiểm tra nếu tourId và locationDetailId khớp
                    if (locationDetail && locationDetail.tour === tours.id) {
                      return (
                        <div key={location.id}>
                          <div className="row">
                            <div
                              className="place-item col-sm-10"
                              onClick={() => handleLocationClick(location)} // Cập nhật địa điểm đã chọn
                              style={{ cursor: "pointer" }}
                            >
                              <div className="place-icon">
                                <i className="fas fa-map-marker-alt" />
                              </div>
                              <div>
                                <div className="place-info">
                                  <span className="text-dark text-decoration-none">
                                    {location.name}
                                  </span>
                                </div>
                                <div className="address">Địa chỉ: {location.address}</div>
                              </div>
                            </div>
                            <div className="col-sm-2 d-flex justify-content-start text-start">
                              {tours.createBy == authId && (
                                <UpdateLocation locationId={location.id} />
                              )}
                            </div>
                          </div>
                          {/* Hiển thị mũi tên nếu không phải là địa điểm cuối cùng */}
                          {index < locationDto.length - 1 && (
                            <div className="arrow">↓</div>
                          )}
                        </div>
                      );
                    }
                    return null; // Không hiển thị địa điểm nếu không khớp
                  })}
                </div>
              </div>
            </div>

            {/* Phần thông tin địa điểm */}
            <div className="col-sm-8 pb-3" style={{ backgroundColor: "#f2f2f2" }}>
              <div className="row">
                <div className="col-sm-8 py-3">
                  <div className="header-title">Địa điểm</div>
                  <hr />
                </div>
                <div className="col-sm-4 py-4">
                  {tours.createBy == authId && (
                    <EditLocationDetail locationName={selectedLocation ? selectedLocation.name : null} locationDetailId={selectedLocation ? selectedLocation.locationDetailDto.id : null} />
                  )}

                </div>
              </div>

              {selectedLocation ? (
                <div>
                  <span className="fw-bold">{selectedLocation.name.toUpperCase()}</span>
                  <span className="text-warning ms-2">
                    <i className="fas fa-star" />
                    <i className="fas fa-star" />
                    <i className="fas fa-star" />
                  </span>
                  <div className="py-3">
                    <span className="fw-bold">Thời gian: </span>
                    <span>{selectedLocation.locationDetailDto.startHour} - {selectedLocation.locationDetailDto.endHour}</span>
                    <span className="ms-5 fw-bold">Chi phí: </span>
                    <span>{selectedLocation.locationDetailDto.price} VND</span>
                  </div>
                  <div className="py-3">
                    <span className="fw-bold">Phương tiện: </span>
                    <span>{selectedLocation.locationDetailDto.vehicle}</span>
                  </div>
                  <div>
                    <span className="fw-bold">Địa chỉ: </span>
                    <span>{selectedLocation.address}</span>
                  </div>
                  <div className="py-3">
                    <span className="fw-bold">Mô tả:</span>
                    <p>{selectedLocation.locationDetailDto.description}</p>
                  </div>
                </div>
              ) : (
                <div >Hãy chọn địa điểm</div>
              )}
            </div>
          </div>
        </div>


      </div>
    </>
  );
};

export default TourDetails;