import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AccountApi from "../../Api/AccountApi";
import config from "../../config";
import Swal from "sweetalert2";
const { SERVER_API } = config;

const UpdateHobby = () => {
    const { authId } = useAuth();
    const [selectedHobbies, setSelectedHobbies] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [listHobby, setListHobby] = useState([]);
    const [showHobbyModal, setShowHobbyModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!authId) {
            alert("Vui lòng đăng nhập lại!");
            navigate("/login");
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const allHobbiesResponse = await axios.get(`${SERVER_API}/hobby`);
                const userHobbiesResponse = await axios.get(
                    `${SERVER_API}/hobbies/${authId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if(allHobbiesResponse && allHobbiesResponse.data){
                    setListHobby(allHobbiesResponse.data);
                    setSelectedHobbies(userHobbiesResponse.data.map((hobby) => hobby.name));
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
                Swal.fire({
                    icon: "error",
                    title: "Lỗi",
                    text: "Không thể tải dữ liệu. Vui lòng thử lại sau.",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [authId, navigate]);

    const filteredOptions = listHobby.filter((hobby) =>
        hobby.name.toLowerCase().includes(searchInput.toLowerCase())
    );

    const handleSelectHobby = async (hobby) => {
        if (selectedHobbies.includes(hobby.name)) return;

        try {
            await axios.put(
                `${SERVER_API}/addhobbies/${authId}`,
                [hobby.id],
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSelectedHobbies((prev) => [...prev, hobby.name]);
        } catch (error) {
            console.error("Lỗi khi thêm sở thích:", error);
            alert("Không thể thêm sở thích. Vui lòng thử lại.");
        }
    };

    const handleRemoveHobby = async (hobbyName) => {
        const hobbyToRemove = listHobby.find((hobby) => hobby.name === hobbyName);

        if (!hobbyToRemove) return;
        try {
            await axios.put(
                `${SERVER_API}/removehobbies/${authId}`,
                [hobbyToRemove.id],
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSelectedHobbies((prev) => prev.filter((hobby) => hobby !== hobbyName));
        } catch (error) {
            console.error("Lỗi khi xóa sở thích:", error);
            alert("Không thể xóa sở thích. Vui lòng thử lại.");
        }
    };

    const handleComplete = () => {
        setShowHobbyModal(false);
        Swal.fire({
            icon: "success",
            title: "Hoàn tất",
            text: "Cập nhật sở thích thành công!",
        }).then(() => window.location.reload());
    };

    return (
        <>
            <button
                style={{ float: "right" }}
                className="btn btn-custom btn-sm"
                onClick={() => setShowHobbyModal(true)}
            >
                <i className="bi bi-pencil-fill"></i>
            </button>

            {/* HobbyModal */}
            {showHobbyModal && (
                <div
                    className="modal show"
                    style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="custom-modal-dialog">
                        <div className="custom-modal-content">
                            <div className="custom-modal-header">
                                <h5 className="custom-modal-title">Chọn sở thích của bạn</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowHobbyModal(false)}
                                ></button>
                            </div>
                            <div className="custom-modal-body">
                                {loading ? (
                                    <p>Đang tải dữ liệu...</p>
                                ) : (
                                    <>
                                        <div className="mb-3" style={{ width: "100%" }}>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Tìm sở thích..."
                                                value={searchInput}
                                                onChange={(e) => setSearchInput(e.target.value)}
                                            />
                                        </div>

                                        {selectedHobbies.length > 0 && (
                                            <div className="mb-3">
                                                <h5>Sở thích của bạn:</h5>
                                                <div className="d-flex flex-wrap" >
                                                    {selectedHobbies.map((hobby, index) => (
                                                        <span 
                                                            key={index}
                                                            className="badge bg-light text-dark me-2 mb-2 span-hobby"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleRemoveHobby(hobby)}
                                                        >
                                                            {hobby} <span>&times;</span>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div
                                            className="d-flex flex-wrap"
                                            style={{
                                                maxHeight: "350px", // Điều chỉnh chiều cao tối đa theo nhu cầu
                                                overflowY: "auto", // Thêm thanh cuộn dọc khi danh sách vượt quá chiều cao
                                            }}
                                        >
                                            {filteredOptions.map((hobby, index) => (
                                                <button
                                                    key={index}
                                                    className="btn btn-outline-info me-2 mb-2"
                                                    style={{ borderRadius: "20px" }}
                                                    onClick={() => handleSelectHobby(hobby)}
                                                >
                                                    {hobby.name}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="custom-modal-footer" style={{ maxHeight: "50px" }}>
                                <button className="btn btn-primary" onClick={handleComplete}>
                                    Hoàn tất
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UpdateHobby;
