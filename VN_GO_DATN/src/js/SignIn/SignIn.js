import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../../js/contexts/AuthContext";
import "../../css/SignInUp.css";

const SignIn = () => {
  const [email, setEmail] = useState(""); // Quản lý email nhập vào
  const [passWord, setPassword] = useState(""); // Quản lý mật khẩu nhập vào
  const [errors, setErrors] = useState({}); // Quản lý lỗi
  const { isLoggedIn, login } = useAuth(); // Sử dụng AuthContext
  const [rememberMe, setRememberMe] = useState(false); // Quản lý checkbox "Ghi nhớ mật khẩu"


  // Hàm validate form
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex kiểm tra email hợp lệ
    const newErrors = {};

    if (!email || email === "") {
      newErrors.email = "Email không được để trống.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Email không đúng định dạng.";
    }

    if (!passWord || passWord === "") {
      newErrors.passWord = "Mật khẩu không được để trống.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
  };


  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");

    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true); // Đánh dấu "Ghi nhớ mật khẩu"
    }
  }, []);

  const handleLogin = async () => {
    if (!validateForm()) return;




    try {
      const loginDto = { email, passWord };

      if (rememberMe) {
        localStorage.setItem("email", email);
        localStorage.setItem("password", passWord);
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
      }

      await login(loginDto);
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);

      if (error.response) {
        setErrors({
          email: "",
          passWord: "",
          fail: "Sai mật khẩu hoặc email",
        });
      } else {

        setErrors({
          email: "",
          passWord: "",
          fail: "Đã có lỗi xảy ra, vui lòng thử lại!"
        });
      }
    }
  };


  // Xử lý khi nhấn Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  // Nếu đã đăng nhập, chuyển hướng về trang chính
  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className="row ht-100v flex-row-reverse no-gutters">
      <div className="col-md-6 d-flex justify-content-center align-items-center">
        <div className="signup-form">
          <div className="auth-logo text-center mb-5">
            <div className="row pt-4">
              <div className="col-md-12">
                <img
                  src="IMG/logoVNGO.png"
                  style={{
                    width: "100px",
                    height: "auto",
                    display: "block",
                    margin: "0 auto 10px auto",
                  }}
                  className="logo-img"
                  alt="Logo"
                />
              </div>
              <p style={{ fontWeight: "bold", textAlign: "center", marginBottom: "0px" }}>
                VNGo Travel Social Network
              </p>
              <span style={{ textAlign: "center", marginBottom: "0px" }}>
                Trang mạng xã hội về du lịch Việt Nam
              </span>
            </div>
          </div>
          <form>
            <div className="row">
              <div className="col-md-12">
                <div className="form-group">
                  <input
                    type="email"
                    className={`form-control ${errors.email || errors.fail ? "is-invalid" : ""}`}
                    name="email"
                    placeholder="Địa chỉ Email"
                    value={email}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setEmail(e.target.value)} // Cập nhật email
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <input
                    type="password"
                    className={`form-control ${errors.passWord || errors.fail ? "is-invalid" : ""}`}
                    name="password"
                    placeholder="Mật khẩu"
                    value={passWord}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setPassword(e.target.value)} // Cập nhật mật khẩu
                  />
                  {errors.passWord && (
                    <div className="invalid-feedback"> {errors.passWord}</div>
                  )}
                  {errors.fail && <div className="invalid-feedback"> {errors.fail}</div>}
                </div>
              </div>
              <div className="col-md-12 mb-3">
                <Link to="/forgot-password">Quên mật khẩu?</Link>
              </div>
              <div className="col-md-6">
                <label className="custom-control material-checkbox">
                  <input
                    type="checkbox"
                    className="material-control-input"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)} // Cập nhật trạng thái "Ghi nhớ mật khẩu"
                  />
                  <span className="material-control-indicator" />
                  <span className="material-control-description">
                    Ghi nhớ cho lần sau
                  </span>
                </label>
              </div>
              <div className="col-md-6 text-right">
                <div className="form-group">
                  <button
                    type="button"
                    className="btn btn-primary sign-up"
                    onClick={handleLogin} // Gọi hàm đăng nhập
                  >
                    Đăng nhập
                  </button>
                </div>
              </div>
              <div className="col-md-12 text-center mt-5">
                <span className="go-login">
                  Tôi chưa có tài khoản <a href="/signup">Đăng kí ngay</a>
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="col-md-6 auth-bg-image d-flex justify-content-center align-items-center">
        <div className="auth-left-content mt-5 mb-5 text-center">
          <div className="weather-small text-white">
            <p className="current-weather">
              <span>VNGo</span>
            </p>
            <p className="weather-city">Travel Social Network</p>
          </div>
          <div className="text-white mt-5 mb-5">
            <h2 className="create-account mb-3">Chào Mừng</h2>
            <p>
              Cảm ơn bạn đã tham gia. Hãy cập nhật những chuyến đi mới được phát hành hàng
              ngày.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
