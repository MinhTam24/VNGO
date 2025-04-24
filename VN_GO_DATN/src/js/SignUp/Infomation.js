import { useState } from "react";
import accountApi from "../../Api/AccountApi";
import { useNavigate } from "react-router-dom";

const Infomation = () => {
  // State lưu trữ giá trị form
  const [formData, setFormData] = useState({
    firstName: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    birthday: "",
    passWord: "",
    confirmPassword: "",
  });

  // State lưu trữ lỗi
  const [errors, setErrors] = useState({});
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const navigate = useNavigate();

  // Hàm xử lý thay đổi trong form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Kiểm tra hợp lệ
  const validate = () => {
    let tempErrors = {};
    if (!formData.firstName) {
      tempErrors.firstName = "Tên không được để trống!";
    }
    
    if (formData.firstName && formData.firstName.length < 2)
      tempErrors.firstName = "Tên phải có ít nhất 2 ký tự!";
    
    if (!formData.fullName) {
      tempErrors.fullName = "Họ và tên không được để trống!";
    }
    
    if (formData.fullName && formData.fullName.length < 2)
      tempErrors.fullName = "Họ và tên phải có ít nhất 2 ký tự!";
    
    
    
    if (!formData.email) tempErrors.email = "Email không được để trống!";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
      tempErrors.email = "Email không hợp lệ!";

    if (!formData.phone) tempErrors.phone = "Số điện thoại không được để trống!";
    if (formData.phone && !/^\d{10,11}$/.test(formData.phone)) {
      tempErrors.phone = "Số điện thoại phải chứa 10 đến 11 chữ số và chỉ chứa chữ số!";
    }

    if (!formData.address) {
      tempErrors.address = "Địa chỉ không được để trống!";
    }
    

    if (!formData.gender) tempErrors.gender = "Giới tính không được để trống!";

    if (!formData.day || !formData.month || !formData.year)
      tempErrors.date = "Ngày, tháng, năm không được để trống!";

    if (!formData.passWord) tempErrors.passWord = "Mật khẩu không được để trống!";
    if (formData.passWord && formData.passWord.length < 4)
      tempErrors.passWord = "Mật khẩu phải có ít nhất 4 ký tự!";

    if (formData.passWord !== formData.confirmPassword)
      tempErrors.confirmPassword = "Mật khẩu và xác nhận mật khẩu không khớp!";

    if (!formData.confirmPassword)
      tempErrors.confirmPassword = "Vui lòng xác nhận mật khẩu!";


    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const signUp = async () => {
    try {

      const formattedBirthday = `${formData.year}-${formData.month.padStart(2, "0")}-${formData.day.padStart(2, "0")}`;
      const payload = {
        email: formData.email,
        passWord: formData.passWord,
        firstName: formData.firstName,
        fullName: formData.lastName,
        birthday: formattedBirthday,
        address: formData.address,
        phone: formData.phone,
        gender: formData.gender === "male" ? "MALE" : "FEMALE",
      };

      const response = await accountApi.signUp(payload);
      if (response) {
        console.log(response);
        localStorage.removeItem("email")
        localStorage.removeItem("password")
        navigate("/login"); // Chuyển hướng sang trang đăng nhập
      } else {
        console.log("erroKhông có restpone Khônr");
      }
} catch (error) {
      console.log(error);
    }
};

  // Xử lý submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      signUp();
      console.log("Form is valid", formData);
    } else {
      console.log("Form has errors", errors);
    }
  };

  return (
    <>
      <div className="col-md-6 d-flex justify-content-center align-items-center">
        <div className="signup-form">
          <div className="auth-logo text-center mb-5">
            <div className="row pt-4">
              <div className="col-md-12 ">
                <img
                  src="IMG/logoVNGO.png"
                  style={{
                    width: "80px",
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
              <span style={{ textAlign: "center", marginBottom: "0px" }}>
                Trang mạng xã hội về du lịch Việt Nam
              </span>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="pt-0 mt-0">
            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Tên"
                  />
                  {errors.firstName && (
                    <p className="text-danger">{errors.firstName}</p>
                  )}
                </div>
              </div>
              <div className="col-md-8">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Họ và tên"
                  />
                  {errors.lastName && (
                    <p className="text-danger">{errors.fullName}</p>
                  )}
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Địa chỉ Email"
                  />
{errors.email && (
                    <p className="text-danger">{errors.email}</p>
                  )}
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Số điện thoại"
                  />
                  {errors.phone && (
                    <p className="text-danger">{errors.phone}</p>
                  )}
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Địa chỉ thường trú"
                  />
                  {errors.address && (
                    <p className="text-danger">{errors.address}</p>
                  )}
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <div className="gender-options">
                    <label>- Chọn giới tính -</label>
                    <div>
                      <input
                        type="radio"
                        id="male"
                        name="gender"
                        value="male"
                        onChange={handleChange}
                      />
                      <label htmlFor="male">Nam</label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id="female"
                        name="gender"
                        value="female"
                        onChange={handleChange}
                      />
                      <label htmlFor="female">Nữ</label>
                    </div>
                  </div>
                  {errors.gender && (
                    <p className="text-danger">{errors.gender}</p>
                  )}
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <select
                    name="day"
                    value={formData.day}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">- Chọn ngày -</option>
                    {/* Hiển thị đủ từ ngày 1 đến ngày 31 */}
                    {[...Array(31)].map((_, index) => (
                      <option key={index} value={index + 1}>
                        {index + 1}
                      </option>
                    ))}
                  </select>
                  {errors.date && <p className="text-danger">{errors.date}</p>}
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <select
                    name="month"
                    value={formData.month}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">- Chọn tháng -</option>
                    {[...Array(12)].map((_, index) => (
                      <option key={index} value={index + 1}>
                        {index + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-group">
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">- Chọn năm -</option>
                    {[...Array(100)].map((_, index) => (
                      <option key={index} value={2024 - index}>
                        {2024 - index}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control"
                    name="passWord"
                    value={formData.passWord}
                    onChange={handleChange}
                    placeholder="Mật khẩu"
                  />
                  {errors.password && (
                    <p className="text-danger">{errors.password}</p>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Xác nhận mật khẩu"
                  />
                  {errors.confirmPassword && (
                    <p className="text-danger">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
              <div className="col-md-12">
                <button type="submit" className="btn btn-primary">
                  Đăng ký
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Infomation;