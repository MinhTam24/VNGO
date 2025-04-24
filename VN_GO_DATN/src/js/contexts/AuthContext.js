import React, { createContext, useContext, useState, useEffect } from "react";
import AuthApi from "../../Api/AuthApi";
import accountApi from "../../Api/AccountApi";
import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authId, setAuthId] = useState(null);
  const [authEmail, setAuthEmail] = useState(null);
  const [authAvatar, setAvatar] = useState(null);
  const [authFullName, setAuthFullName] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn) {
      <Navigate to="/" />;
    }
  }, [isLoggedIn]);

  // Lấy thông tin người dùng từ API
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        throw new Error("Token expired");
      }

      const [id, email, fullName, avatar] = await Promise.all([
        AuthApi.getUserId(),
        AuthApi.getCurrentUser(),
        AuthApi.getFullName(),
        AuthApi.getAvarta()
      ]);

      setAuthId(id);
      setAuthEmail(email);
      setAuthFullName(fullName);
      setAvatar(avatar);
      setIsLoggedIn(true);

      const timeLeft = (decodedToken.exp * 1000) - Date.now();
      setTimeout(logout, timeLeft);

    } catch (error) {
      console.error("Failed to fetch user info or token expired:", error);
      setIsLoggedIn(false);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserInfo();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (loginDto) => {
    try {
      const response = await accountApi.login(loginDto);
      if (response && response.token) {
        localStorage.setItem("token", response.token);
        setIsLoggedIn(true);
        await fetchUserInfo();
      } else {
        throw new Error("Invalid login response");
      }
    } catch (error) {
      setIsLoggedIn(false);
      throw error; // Ném lỗi ra để xử lý ở component SignIn
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setAuthId(null);
    setAuthEmail(null);
    setAuthFullName(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        authAvatar,
        isLoggedIn,
        authId,
        authEmail,
        authFullName,
        isLoading,
        login,
        logout,
      }}
    >
      {isLoading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

// Hook để sử dụng AuthContext
export const useAuth = () => useContext(AuthContext);
