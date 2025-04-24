import React, { useState, useEffect } from 'react';
import '../../css/Tours.css';
import { Link } from 'react-router-dom';
import CreatPost from '../Main/CreatePost';
import { useAuth } from "../../js/contexts/AuthContext"; // Import AuthContext
import config from "../../config.json";
import TourDetails from '../TourDetails/TourDetails';
const { SERVER_API } = config;

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tourId, setTourId] = useState(null);
  const [error, setError] = useState(null);
  const { authId, authFullName, logout, isLoggedIn } = useAuth();  // AuthContext

  const token = localStorage.getItem('token')
  // Hàm lấy dữ liệu tour từ API
  const getTours = async () => {
    try {
      const response = await fetch(`${SERVER_API}/api/tour-createBy/${authId}`, {
        method: 'GET',  // Thêm phương thức GET nếu chưa có
        headers: {
          'Authorization': `Bearer ${token}`,  // Gửi token đúng cách trong header
          'Content-Type': 'application/json'   // Thêm header Content-Type nếu cần
        }
      });
      
      if (response.ok) {
        const toursData = await response.json();
        toursData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setTours(toursData);
      } else {
        throw new Error('Không thể tải dữ liệu từ server');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Gọi API khi component được mount
  useEffect(() => {
    getTours();
  }, []);

  return (
    <main className="col-sm-6 py-2">
      <CreatPost />
      {
        isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          tourId ? (
            <TourDetails id={tourId} />
          ) : (
            tours.length === 0 ? (
              <p>Không có chuyến đi nào.</p>
            ) : (
              tours.map((tour) => (
                <div className="post-card" key={tour.id}>
                  <div className="card d-flex flex-row">
                    {/* Hiển thị hình ảnh đầu tiên nếu có */}
                    {tour.imageUrl && tour.imageUrl.length > 0 && (
                      <img 
                        src={tour.imageUrl[0]} 
                        className="card-img-left " 
                        alt={tour.title} 
                        style={{ width: "280px", height: "150px", objectFit: "cover" ,
                          border: "2px solid #ccc"}} 
                      />
                    )}
                    <div className="card-body">
                      <h4 className="card-title">{tour.title}</h4>
                      <p className="card-text">{tour.description}</p>
                      <Link to={`/tourdetails/${tour.id}`}>
                        <button className="xem btn btn-outline-dark">
                          Xem chi tiết chuyến đi
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )
          )
        )
      }
    </main>
  );
};

export default Tours;
