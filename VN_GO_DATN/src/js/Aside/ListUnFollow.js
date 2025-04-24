import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import config from "../../config";

const { SERVER_API } = config;

const ListUnFollow = () => {
  const { isLoggedIn, authId } = useAuth(); // Lấy thông tin đăng nhập và userId
  console.log("isLoggedIn:", isLoggedIn, "authId:", authId);
  const [accountsFollowed, setAccountsFollowed] = useState([]);
  const [accountsNotFollowed, setAccountsNotFollowed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState({});
  const token = localStorage.getItem("token");

  const fetchNotFollowedAccounts = async () => {
    try {
      const response = await fetch(`${SERVER_API}/notfollowed/${authId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("LIST CHƯA FOLLOW", data)
        const updatedData = data.map((account) => ({
          ...account,
          isFollowed: false, // Mặc định là chưa theo dõi
        }));
        setAccountsNotFollowed(updatedData);
      } else {
        console.error(
          "Failed to fetch not followed accounts:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching not followed accounts:", error);
    }
  };

  const followAccount = async (followedId) => {
    setLoadingStates((prev) => ({ ...prev, [followedId]: true }));
    try {
      const response = await fetch(
        `${SERVER_API}/follow?followerId=${authId}&followedId=${followedId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setLoadingStates((prev) => ({ ...prev, [followedId]: false }));
        setAccountsNotFollowed((prev) =>
          prev.map((account) =>
            account.id === followedId
              ? { ...account, isFollowed: true }
              : account
          )
        );
        Swal.fire({
          icon: "success",
          title: "Đã theo dõi",
          text: "Bạn đã theo dõi tài khoản này thành công!",
        });
      } else {
        console.error("Failed to follow:", response.statusText);
        setLoadingStates((prev) => ({ ...prev, [followedId]: false }));
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể theo dõi tài khoản này. Vui lòng thử lại.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setLoadingStates((prev) => ({ ...prev, [followedId]: false }));
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Đã xảy ra lỗi trong quá trình theo dõi.",
      }); 
    }
  };

  const unfollowAccount = async (followedId) => {
    setLoadingStates((prev) => ({ ...prev, [followedId]: true }));
    try {
      const response = await fetch(
        `${SERVER_API}/unfollow?followerId=${authId}&followedId=${followedId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setLoadingStates((prev) => ({ ...prev, [followedId]: false }));
        setAccountsNotFollowed((prev) =>
          prev.map((account) =>
            account.id === followedId
              ? { ...account, isFollowed: false }
              : account
          )
        );
        Swal.fire({
          icon: "success",
          title: "Đã hủy theo dõi",
          text: "Bạn đã hủy theo dõi tài khoản này thành công!",
        });
      } else {
        console.error("Failed to unfollow account:", response.statusText);
        setLoadingStates((prev) => ({ ...prev, [followedId]: false }));
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể hủy theo dõi tài khoản này. Vui lòng thử lại.",
        });
      }
    } catch (error) {
      console.error("Error unfollowing account:", error);
      setLoadingStates((prev) => ({ ...prev, [followedId]: false }));
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Đã xảy ra lỗi trong quá trình hủy theo dõi.",
      });
    }
  };

  useEffect(() => {
    if (isLoggedIn && authId) {
      Promise.all([fetchNotFollowedAccounts()])
        .then(() => setIsLoading(false))
        .catch((error) => console.error(error));
    }
  }, [isLoggedIn, authId]);

  return (
    <div className="contact-list">
      <h4>Gợi ý theo dõi</h4>
      {isLoading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div className="row">
          {accountsNotFollowed.length === 0 ? (
            <p>Tất cả tài khoản đã được theo dõi.</p>
          ) : (
            accountsNotFollowed.map((account) => (
              <div key={account.id} className="contact-item">
                {/* Hình ảnh tài khoản */}
                <Link to={`/profile/${account.id}`}>
                  <img src= {account.avatarUrl} alt={account.fullName}/>
                </Link>
                <span>{account.fullName}</span>
                <button
                  style={{ fontSize: "0.7rem", padding: "0.25rem 0.5rem" }}
                  onClick={() => {
                    if (loadingStates[account.id]) return; // Tránh nhấn nhiều lần khi đang tải
                    if (account.isFollowed) {
                        unfollowAccount(account.id); // Hủy theo dõi
                      } else {
                        followAccount(account.id); // Theo dõi
                      }
                    }}
                    className={`btn ${
                      loadingStates[account.id]
                        ? "btn-danger"
                        : account.isFollowed
                        ? "btn-danger"
                        : "btn-outline-info"
                    }`}
                    disabled={isLoading || loadingStates[account.id]}
                  >
                    {loadingStates[account.id]
                      ? "Đang xử lý..."
                      : account.isFollowed
                      ? "Đã theo dõi"
                      : "Theo dõi"}
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  };
  
  export default ListUnFollow;