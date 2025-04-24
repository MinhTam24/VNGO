import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import config from "../../config";
import Swal from "sweetalert2";
import { Token } from "@mui/icons-material";


const { SERVER_API } = config;

const FollowButton = ({ followerId, followedId, onFollowChange }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { authId } = useAuth();
    const token = localStorage.getItem("token");

    // Fetch trạng thái follow ban đầu
    const fetchFollowStatus = async () => {
        try {
            const response = await fetch(
                `${SERVER_API}/checkfollow?followerId=${authId}&followedId=${followedId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.ok) {
                const data = await response.json();
                setIsFollowing(data); // true/false từ API
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Lỗi",
                    text: `Không thể lấy trạng thái theo dõi: ${response.statusText}`,
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: `Đã xảy ra lỗi khi lấy trạng thái theo dõi: ${error.message}`,
            });
        }
    };

    // Xử lý sự kiện Follow/Unfollow
    const handleFollowUnfollow = async () => {
        setIsLoading(true);
        try {
            if (isFollowing) {
                await unfollowAccount(authId, followedId);
                Swal.fire({
                    icon: "success",
                    title: "Thành công",
                    text: "Bạn đã hủy theo dõi thành công!",
                });
            } else {
                await followAccount(authId, followedId);
                Swal.fire({
                    icon: "success",
                    title: "Thành công",
                    text: "Bạn đã theo dõi thành công!",
                });
            }
            setIsFollowing(!isFollowing); // Đổi trạng thái
            if (onFollowChange) onFollowChange(!isFollowing); // Thông báo parent component (nếu có)
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: `Đã xảy ra lỗi khi theo dõi: ${error.message}`,
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm follow API
    const followAccount = async (authId, followedId) => {
        const response = await fetch(
            `${SERVER_API}/follow?followerId=${authId}&followedId=${followedId}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}`, },
            }
        );
        if (!response.ok) {
            throw new Error("Failed to follow account");
        }
    };

    // Hàm unfollow API
    const unfollowAccount = async (authId, followedId) => {
        if (token) {
            const response = await fetch(
                `${SERVER_API}/unfollow?followerId=${authId}&followedId=${followedId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Failed to unfollow account");
            }
        }

    };

    // Gọi API kiểm tra follow ban đầu
    useEffect(() => {
        fetchFollowStatus();
    }, [authId, followedId]);

    return (
        <button
            onClick={handleFollowUnfollow}
            disabled={isLoading}
            className={`btn ${isFollowing ? "btn-danger" : "btn-outline-info"}`}
        >
            {isLoading
                ? "Đang xử lý..."
                : isFollowing
                    ? "Hủy theo dõi"
                    : "Theo dõi"}
        </button>
    );
};

export default FollowButton;
