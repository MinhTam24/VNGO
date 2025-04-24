import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import "../../css/Friends.css";
import config from "../../config";
import Swal from "sweetalert2";

const { SERVER_API } = config;

const Follows = () => {
  const { isLoggedIn, authId } = useAuth(); // Lấy thông tin từ AuthContext
  console.log("isLoggedIn:", isLoggedIn, "authId:", authId);

  const [accountsFollowed, setAccountsFollowed] = useState([]);
  const [accountsNotFollowed, setAccountsNotFollowed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState({});
  const token = localStorage.getItem("token");

  // Hàm lấy danh sách tài khoản đã theo dõi
  const fetchFollowedAccounts = async () => {
    try {
      const response = await fetch(`${SERVER_API}/followed/${authId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAccountsFollowed(data);
      } else {
        Swal.fire("Lỗi", "Không thể tải danh sách đã theo dõi.", "error");      }
    } catch (error) {
      Swal.fire("Lỗi", "Có lỗi xảy ra khi tải danh sách đã theo dõi.", "error");    }
  };

  // Hàm lấy danh sách tài khoản chưa theo dõi
  const fetchNotFollowedAccounts = async () => {
    try {
      const response = await fetch(`${SERVER_API}/notfollowed/${authId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAccountsNotFollowed(data);
      } else {
        Swal.fire("Lỗi", "Không thể tải danh sách chưa theo dõi.", "error");      }
    } catch (error) {
      Swal.fire("Lỗi", "Có lỗi xảy ra khi tải danh sách chưa theo dõi.", "error");
    }
  };

  // Theo dõi tài khoản
  const followAccount = async (followedId) => {
    setLoadingStates((prev) => ({ ...prev, [followedId]: true }));
    try {
      const response = await fetch(`${SERVER_API}/follow?followerId=${authId}&followedId=${followedId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await Promise.all([fetchFollowedAccounts(), fetchNotFollowedAccounts()]);
        Swal.fire("Thành công", "Bạn đã theo dõi tài khoản thành công.", "success");
      } else {
        Swal.fire("Lỗi", "Không thể theo dõi tài khoản.", "error");
      }
    } catch (error) {
      Swal.fire("Lỗi", "Có lỗi xảy ra khi theo dõi tài khoản.", "error");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [followedId]: false }));
    }
  };

  // Hủy theo dõi tài khoản
  const unfollowAccount = async (followedId) => {
    try {
      const response = await fetch(`${SERVER_API}/unfollow?followerId=${authId}&followedId=${followedId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await Promise.all([fetchFollowedAccounts(), fetchNotFollowedAccounts()]);
        Swal.fire("Thành công", "Bạn đã hủy theo dõi tài khoản thành công.", "success");
      } else {
        Swal.fire("Lỗi", "Không thể hủy theo dõi tài khoản.", "error");
      }
    } catch (error) {
      Swal.fire("Lỗi", "Có lỗi xảy ra khi hủy theo dõi tài khoản.", "error");
    }
  };

  // Lấy dữ liệu khi component được mount
  useEffect(() => {
    if (isLoggedIn && authId) {
      Promise.all([fetchFollowedAccounts(), fetchNotFollowedAccounts()])
        .then(() => setIsLoading(false))
        .catch((error) => {
          Swal.fire("Lỗi", "Không thể tải dữ liệu.", "error");
        });
    }
  }, [isLoggedIn, authId]);

  return (
    <main className="col-sm-9 py-2">
      <h2 className="title">Quản lý theo dõi</h2>
      {isLoading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div className="d-flex justify-content-between">
          {/* Đã theo dõi */}
          <div className="col-6">
            <h3 style={{ textAlign: "center" }}>Đã theo dõi</h3>
            <div className="row justify-content-center">
              {accountsFollowed.length === 0 ? (
                <p>Bạn chưa theo dõi tài khoản nào.</p>
              ) : (
                accountsFollowed.map((account) => (
                  <div
                    key={account.id}
                    className="card p-0 me-3 mb-3"
                    style={{ width: "15rem" }}
                  >
                    <div className="card-body">
                      <h5 className="card-title text-center">
                        {account.fullName}
                      </h5>
                      <button
                        onClick={() => unfollowAccount(account.id)}
                        className="btn btn-outline-danger"
                      >
                        Hủy theo dõi
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chưa theo dõi */}
          <div className="col-6" >
            <h3 style={{ textAlign: "center" }}>Chưa theo dõi</h3>
            <div className="row justify-content-center">
              {accountsNotFollowed.length === 0 ? (
                <p>Tất cả tài khoản đã được theo dõi.</p>
              ) : (
                accountsNotFollowed.map((account) => (
                  <div
                    key={account.id}
                    className="card p-0 me-3 mb-3"
                    style={{ width: "15rem" }}
                  >
                    <div className="card-body">
                      <h5 className="card-title text-center">
                        {account.fullName}
                      </h5>
                      <button
                        onClick={() => followAccount(account.id)}
                        className="btn btn-outline-info"
                        disabled={loadingStates[account.id]} // Disable nút khi đang xử lý
                      >
                        {loadingStates[account.id] ? "Đang xử lý..." : "Theo dõi"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Follows;
                  