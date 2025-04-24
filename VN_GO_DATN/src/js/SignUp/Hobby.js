import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/Hobby.css";
import { useNavigate } from "react-router-dom";
import config from "../../config";

const Hobby = ({ accountId }) => {
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [listHobby, setListHobby] = useState([]);
  const navigator = useNavigate();

  // Lấy danh sách sở thích từ API
  useEffect(() => {
    const fetchHobbies = async () => {
      try {
        const response = await axios.get(`${config.SERVER_API}/hobby`, {
        
        });
        setListHobby(response.data); // Giả sử API trả về mảng danh sách
      } catch (error) {
        console.error("Lỗi khi tải danh sách sở thích:", error);
      }
    };

    fetchHobbies();
  }, []);

  // Lọc danh sách sở thích dựa trên input tìm kiếm
  const filteredOptions = listHobby.filter((hobby) =>
    hobby.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  // Thêm sở thích vào tài khoản
  const handleSelectHobby = async (hobby) => {
    if (!selectedHobbies.includes(hobby.name)) {
      setSelectedHobbies([...selectedHobbies, hobby.name]);

      try {
        const hobbyIds = [hobby.id]; // Giả sử bạn có id sở thích trong `hobby`
        await axios.put(
          `${config.SERVER_API}/addhobbies/${accountId}`,
          null,
          { params: { hobbyId: hobbyIds } },
          // { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Sở thích đã được thêm.");
      } catch (error) {
        console.error("Lỗi khi thêm sở thích:", error);
      }
    }
  };

  // Xóa sở thích khỏi tài khoản
  const handleRemoveHobby = async (hobby) => {
    setSelectedHobbies(selectedHobbies.filter((item) => item !== hobby));

    try {
      const hobbyIds = [hobby.id]; // Giả sử bạn có id sở thích trong `hobby`
      await axios.delete(
        `${config.SERVER_API}/removehobbies/${accountId}`,
        { params: { hobbyId: hobbyIds } },
        // { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Sở thích đã được xóa.");
    } catch (error) {
      console.error("Lỗi khi xóa sở thích:", error);
    }
  };

  const handleCancel = () => {
    alert("Bạn đã hủy đăng kí");
    navigator("/login");
  };

  const handleCompleteRegistration = () => {
    if (selectedHobbies.length === 0) {
      alert("Vui lòng chọn ít nhất một sở thích!");
      return;
    }
    alert(`Đăng ký hoàn tất với các sở thích: ${selectedHobbies.join(", ")}`);
    navigator("/login");
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <h3
        className="mb-1"
        style={{
textAlign: "center",
          fontSize: "32px",
          fontWeight: "600",
          color: "#333",
          backgroundColor: "#fff",
          padding: "15px 0",
        }}
      >
        Chọn sở thích của bạn
      </h3>

      {/* Ô tìm kiếm */}
      <div className="mb-3" style={{ width: "300px" }}>
        <input
          type="text"
          className="form-control"
          placeholder="Tìm sở thích..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{
            fontSize: "16px",
            padding: "10px",
            borderRadius: "25px",
            border: "1px solid #ccc",
            width: "100%",
          }}
        />
      </div>

      {/* Sở thích đã chọn */}
      {selectedHobbies.length > 0 && (
        <div
          className="mb-3 d-flex flex-wrap justify-content-start"
          style={{
            maxHeight: "170px",
            overflowY: "auto",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <h5>Sở thích của bạn:</h5>
          {selectedHobbies.map((hobby, index) => (
            <span
              key={index}
              className="badge bg-light text-dark me-2 mb-2"
              style={{
                fontSize: "16px",
                padding: "8px 16px",
                borderRadius: "25px",
                cursor: "pointer",
                border: "1px solid #ccc",
                transition: "all 0.3s ease-in-out",
              }}
              onClick={() => handleRemoveHobby(hobby)}
            >
              {hobby}
              <span
                style={{
                  fontSize: "18px",
                  marginLeft: "8px",
                  cursor: "pointer",
                  color: "#e74c3c",
                }}
              >
                &times;
              </span>
            </span>
          ))}
        </div>
      )}

      {/* Các sở thích gợi ý */}
      <div
        className="d-flex flex-wrap justify-content-start"
        style={{ maxHeight: "300px", overflowY: "auto" }}
      >
        {filteredOptions.map((hobby, index) => (
          <button
            key={index}
            className="btn btn-outline-info me-2 mb-2"
            style={{
              fontSize: "16px",
              padding: "10px 20px",
              borderRadius: "20px",
              border: "2px solid #17a2b8",
              backgroundColor: "white",
              color: "#17a2b8",
              transition: "all 0.3s ease-in-out",
            }}
            onClick={() => handleSelectHobby(hobby)}
          >
            {hobby.name}
          </button>
        ))}
      </div>

      {/* Nút hoàn tất */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "10px",
marginRight: "50px",
          marginTop: "20px",
        }}
      >
        <button
          className="btn btn-primary"
          style={{
            fontSize: "18px",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            boxShadow: "0 4px 8px rgba(0, 123, 255, 0.2)",
          }}
          onClick={handleCompleteRegistration}
        >
          Hoàn tất đăng ký
        </button>

        <button
          onClick={handleCancel}
          className="btn btn-danger"
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#dc3545",
            color: "#fff",
            fontSize: "16px",
          }}
        >
          Hủy Đăng Ký
        </button>
      </div>
    </div>
  );
};

export default Hobby;
