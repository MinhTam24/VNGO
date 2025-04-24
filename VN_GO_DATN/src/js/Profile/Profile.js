import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import "../../css/Profile.css";
import Post from "../Main/Post";
import AccountApi from "../../Api/AccountApi";
import UpdateHobby from "./UpdateHobby";
import ImgModal from "./UpAvatar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import FollowButton from "./FollowButton";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import config from "../../config";
import { Link } from "react-router-dom";
import axios from "axios";
import BlogList from "../Main/BlogList";

const { SERVER_API } = config;

const Profile = () => {
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editedAccount, setEditedAccount] = useState(null);
  const [isFollowing, setIsFollowing] = useState();
  const { authId } = useAuth();

  // Fetch account details
  const fetchAccount = async (id) => {
    if (!id) {
      console.error("Invalid or missing authId");
      setIsLoading(false);
      return;
    }

    try {
      // Kiểm tra trước khi gọi API
      console.log("Fetching data for authId:", id);

      // Gọi hàm getProfile từ AccountApi và truyền authId vào
      const profile = await AccountApi.getProfile(id); // Gọi API với authId

      console.log("Account data:", profile); // Kiểm tra dữ liệu trả về
      // Nếu dữ liệu hợp lệ, cập nhật state
      if (profile) {
        setAccount(profile);
      } else {
        console.error("No account data returned");
      }
    } catch (error) {
      // Xử lý lỗi
      console.error("Error fetching account:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = () => {
    setEditedAccount(account); // Set data to edit
    setShowProfileModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedAccount({ ...editedAccount, [name]: value });
  };
  const handleSaveChanges = async () => {
    try {
      // Đảm bảo rằng ngày sinh được chuyển đổi về định dạng yyyy-mm-dd
      const formattedBirthday = new Date(editedAccount.birthday)
        .toISOString()
        .split("T")[0];

      // Chuẩn bị đối tượng gửi đi với định dạng đúng
      const updatedAccount = {
        fullName: editedAccount.fullName,
        email: editedAccount.email,
        phone: editedAccount.phone,
        address: editedAccount.address,
        birthday: formattedBirthday, // Đảm bảo rằng ngày sinh đã đúng định dạng
        gender: editedAccount.gender,
      };

      // Gửi dữ liệu cập nhật tới API
      const response = await AccountApi.updateAccount(
        account.id,
        updatedAccount
      );
      console.log("editedAccount.id:", editedAccount.id);
      console.log("API Response:", response);
      if (response) {
        // Kiểm tra theo mã trạng thái HTTP
        console.log("Dữ liệu trả về hợp lệ");
        alert("Cập nhật thành công!");
        fetchAccount(authId);
        return;
      } else {
        throw new Error("Không thể cập nhật tài khoản. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error(error);
      alert("Đã xảy ra lỗi khi lưu thay đổi. Vui lòng thử lại.");
    } finally {
      setShowProfileModal(false);
    }
  };






  console.log("authId: ", authId);
  console.log("id: ", id);

  console.log("Rendering button: ", id === authId);

  // Gọi API khi component mount và khi authId thay đổi
  useEffect(() => {
    fetchAccount(id); // Gọi lại API khi `id` thay đổi
  }, [id]);

  // Điều kiện kiểm tra và hiển thị khi chưa đăng nhập hoặc đang tải
  if (isLoading) return <p>Đang tải dữ liệu...</p>;
  if (!account)
    return <p>Không tìm thấy thông tin tài khoản hoặc có lỗi xảy ra.</p>;

  // Render giao diện nếu dữ liệu đã có
  return (
    <>
      <Header />
      <div className="container-fluid first-section">
        <div className="background-profile">
          <img
            className="background-image"
            src={account.backgroundImage || "/IMG/Sea.jpg"}
            alt="Post Image"
          />
        </div>
        <div className="avartarBox row">
          <img className="col-2" src={account.avatarUrl} alt="Avatar" />
          <div className="theodoi col-10 d-flex justify-content-between align-items-center">
            <p className="name">{account.fullName}</p>

            {Number(account.id) !== Number(authId) && account && (
              <FollowButton
                followedId={account.id}
                isInitiallyFollowing={isFollowing}
                onFollowChange={setIsFollowing}
              >
                {/* {loadingStates[account.id]
                  ? "Đang xử lý..."
                  : isFollowing
                  ? "Đã theo dõi"
                  : "Theo dõi"} */}
                theo dõi
              </FollowButton>
            )}
          </div>
        </div>
      </div>
      <div className="inputAvatar" style={{ marginLeft: "150px" }}>
        {Number(account.id) === Number(authId) && account && (<ImgModal></ImgModal>)}

      </div>
      <div className="container da">
        <ul className="nav nav-tabs catalog">
          <li className="nav-item">
            <a className="nav-link" href="#">
              Bài viết
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Chuyến đi
            </a>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to={`/followedlist/${id}`}>
              Theo dõi
            </Link>
          </li>
        </ul>
      </div>
      <div className="container-fluid second-session">
        <div className="container p-3">
          <div className="row">
            <aside className="col-md-4 d-none d-md-block ps-3">
              <div className="bg-white p-3 rounded shadow-sm">
                <li className="list-group-item d-flex align-items-center justify-content-between">
                  <h4 className="fw-bold mb-0">Giới Thiệu</h4>
                  {Number(id) === Number(authId) ? (
                    <button
                      className="btn btn-custom btn-sm"
                      onClick={handleEditClick}
                    >
                      <i className="bi bi-pencil-fill"></i>
                    </button>
                  ) : null}
                </li>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex align-items-center">
                    <i className="bi bi-gender-ambiguous text-info me-2"></i>
                    <strong>
                      {account.gender === "MALE"
                        ? "Nam"
                        : account.gender === "FEMALE"
                          ? "Nữ"
                          : "Không xác định"}
                    </strong>
                  </li>
                  <li className="list-group-item d-flex align-items-center">
                    <i className="bi bi-calendar-fill text-success me-2"></i>
                    <strong>
                      {(() => {
                        const dateParts = account.birthday.split("-");
                        return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
                      })()}
                    </strong>
                  </li>
                  <li className="list-group-item d-flex align-items-center">
                    <i className="bi bi-telephone-fill text-warning me-2"></i>
                    <strong>{account.phone}</strong>
                  </li>
                  <li className="list-group-item d-flex align-items-center">
                    <i className="bi bi-envelope-fill text-primary me-2"></i>
                    <strong>{account.email}</strong>
                  </li>
                  <li className="list-group-item d-flex align-items-center">
                    <i className="bi bi-geo-alt-fill text-danger me-2"></i>
                    <strong>{account.address}</strong>
                  </li>
                  <li className="d-flex  flex-column">
                    <span
                      className="mb-2 fw-bold "
                      style={{ fontSize: "1.5rem", paddingTop: "0.5rem" }}
                    >
                      Sở thích:
                      {Number(id) === Number(authId) ? <UpdateHobby /> : null}
                    </span>
                    <div>
                      {account.userHobbies?.map((hobby, index) => {
                        const colors = [
                          "primary",
                          "success",
                          "danger",
                          "warning",
                          "info",
                          "dark",
                        ];
                        const randomColor =
                          colors[Math.floor(Math.random() * colors.length)];
                        return (
                          <span
                            key={index}
                            className={`badge border border-${randomColor} text-dark me-3 `}
                            style={{
                              fontSize: "1rem",
                              padding: "0.5rem 0.75rem",
                              marginRight: "1rem",
                              marginBottom: "1rem",
                            }}
                          >
                            {hobby.name}
                          </span>
                        );
                      }) || <span>Không có sở thích</span>}
                    </div>
                  </li>
                </ul>
              </div>
            </aside>

            <div className="col-md-8 col-sm-12">
              <BlogList id = {id} />
            </div>
          </div>
        </div>
      </div>

      {showProfileModal && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="custom-modal-dialog">
            <div className="custom-modal-content">
              <div className="custom-modal-header">
                <h5 className="custom-modal-title">Chỉnh sửa hồ sơ</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowProfileModal(false)}
                ></button>
              </div>
              <div className="custom-modal-body">
                <div className="row">
                  <div className="col-md-12">
                    {/* Cột 1: Thông tin cá nhân */}
                    <div className="mb-3">
                      <label htmlFor="avatar" className="form-label">
                        Chọn ảnh đại diện
                      </label>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="fullName" className="form-label">
                          Họ tên
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          className="form-control"
                          value={editedAccount?.fullName || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="phone" className="form-label">
                          Số điện thoại
                        </label>
                        <input
                          type="text"
                          id="phone"
                          name="phone"
                          className="form-control"
                          value={editedAccount?.phone || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email:
                      </label>
                      <input
                        type="text"
                        id="email"
                        name="email"
                        className="form-control"
                        value={editedAccount?.email || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="gender" className="form-label">
                          Giới tính:
                        </label>
                        <select
                          id="gender"
                          name="gender"
                          className="form-control"
                          value={editedAccount?.gender || ""}
                          onChange={handleInputChange}
                        >
                          <option value="MALE">Chọn giới tính</option>
                          <option value="MALE">Nam</option>
                          <option value="FEMALE">Nữ</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="birthday" className="form-label">
                          Ngày sinh
                        </label>
                        <input
                          type="date"
                          id="birthday"
                          name="birthday"
                          className="form-control"
                          value={editedAccount?.birthday || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="address" className="form-label">
                        Địa chỉ:
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        className="form-control"
                        value={editedAccount?.address || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="custom-modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowProfileModal(false)}
                >
                  Hủy
                </button>
                <button className="btn btn-primary" onClick={handleSaveChanges}>
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;