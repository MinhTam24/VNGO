import { useState } from "react";
import SendMail from "../../Api/SendMail";
import accountApi from "../../Api/AccountApi";
import { Navigate, Link } from "react-router-dom";



const Forgotpassword = () => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [tokenError, setTokenError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleSendEmail = async () => {
    if (!email) {
      setEmailError("Vui lòng nhập địa chỉ email!");
      setError("");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Địa chỉ email không hợp lệ!");
      setError("");
      return;
    }
    setEmailError(""); // Xóa lỗi email nếu không có lỗi
    setLoading(true); // Bắt đầu trạng thái loading khi gửi email

    try {
      const otp = await SendMail.sentOtp(email);
      setMessage("Đã gửi mã đến " + email);
      setStep(2); // Chuyển sang bước 2
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        <a href="/signup">Đăng ký tài khoản</a>
        setEmailError("Tài khoản chưa đăng ký");
      } else {
        setError("Có lỗi xảy ra, vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false); // Dừng trạng thái loading
    }
  };


  const handleVerify = async () => {
    if (!email || !token) {
      setError("Vui lòng nhập email và mã OTP!");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Địa chỉ email không hợp lệ!");
      return;
    }

    setEmailError("");
    setLoading(true);
    try {
      const response = await SendMail.verifyOtp(email, token);
      if (response === true) {
        setError("Xác thực thành công!");
        const request = { email, newPassword };
        const resetResponse = await accountApi.ResetPassWord(request);
        if (resetResponse === true) {
          setError("Mật khẩu đã được thay đổi thành công!");
          localStorage.removeItem("email");
          localStorage.removeItem("password")
          setRedirect(true);
        } else {
          setError("Cập nhật mật khẩu không thành công, vui lòng thử lại!");
        }
      } else {
        setError("Mã xác nhận không chính xác hoặc đã hết hạn!");
      }
    } catch (error) {
      console.error("Lỗi xác thực:", error);
      setError("Mã xác nhận không đúng");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = () => {
    if (!token) {
      setTokenError("Vui lòng nhập mã xác nhận!");
      return;
    }
    if (!validatePassword(newPassword)) {
      setPasswordError("Mật khẩu mới phải có ít nhất 8 ký tự!");
      return;
    }
    setTokenError("");
    setPasswordError("");
    handleVerify();
  };

  if (redirect) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <div className="row ht-100v flex-row-reverse no-gutters">
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div className="signup-form">
            <div className="auth-logo text-center mb-5">
              <div className="row pt-4">
                <div className="col-md-12 ">
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
                <p
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: "0px",
                  }}
                >
                  VNGo Travel Social Network
                </p>
                <span
                  style={{ textAlign: "center", marginBottom: "0px" }}
                >
                  Trang mạng xã hội về du lịch Việt Nam
                </span>
              </div>
            </div>
            <form>
              {step === 1 && (
                <>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <input
                          type="email"
                          className={`form-control ${emailError ? "is-invalid" : ""}`}
                          name="email"
                          placeholder="Nhập địa chỉ Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        {emailError && (
                          <small className="text-danger">{emailError}</small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-12 text-right">
                      <div className="form-group">
                        <button
                          type="button"
                          className="btn btn-primary sign-up"
                          onClick={handleSendEmail}
                          disabled={loading}
                        >
                          {loading ? "Đang gửi..." : "Gửi mã xác nhận"}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {step === 2 && (
                <>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <input
                          type="text"
                          className={`form-control ${tokenError ? "is-invalid" : ""}`}
                          name="token"
                          placeholder="Nhập mã xác nhận"
                          value={token}
                          onChange={(e) => setToken(e.target.value)}
                        />
                        {tokenError && (
                          <small className="text-danger">{tokenError}</small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <input
                          type="password"
                          className={`form-control ${passwordError ? "is-invalid" : ""}`}
                          name="newPassword"
                          placeholder="Nhập mật khẩu mới"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        {passwordError && (
                          <small className="text-danger">{passwordError}</small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-12 text-right">
                      <div className="form-group">
                        <button
                          type="button"
                          className="btn btn-primary sign-up"
                          onClick={handleResetPassword}
                          disabled={loading}
                        >
                          {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {error && (
                <div className="col-md-12 text-center mt-3">
                  <small className="text-danger">{error}</small>
                </div>
              )}
              <div className="col-md-12 text-center mt-5">
                <span className="go-login">
                  Đã nhớ mật khẩu? <Link to="/login">Đăng nhập</Link>
                </span>
              </div>
            </form>
          </div>
        </div>
        <div className="col-md-6 auth-bg-image d-flex justify-content-center align-items-center">
          <div className="auth-left-content mt-5 mb-5 text-center">
            <div className="weather-small text-white">
              <p className="current-weather">
                {" "}
                <span>VNGo</span>
              </p>
              <p className="weather-city">Travel Social Network</p>
            </div>
            <div className="text-white mt-5 mb-5">
              <h2 className="create-account mb-3">Quên mật khẩu?</h2>
              <p>
                Nhập địa chỉ email của bạn để nhận mã xác nhận và thay đổi mật khẩu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Forgotpassword;
