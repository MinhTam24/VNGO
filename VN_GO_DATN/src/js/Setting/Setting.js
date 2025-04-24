import React, { useState } from "react";
import '../../css/Setting.css';
import Header from "../Header/Header";
const Settings = () => {
    const [activeContent, setActiveContent] = useState("account"); // State để lưu nội dung đang hiển thị

    return (
        
        <div className="settings-container">
            <Header />
            <div className="row">
                {/* Menu bên trái */}
                <div className="menu-vertical col-sm-3">
                    <h4 className="text-center">Cài Đặt</h4>
                    <ul>
                        <li
                            onClick={() => setActiveContent("account")}
                            className={activeContent === "account" ? "active" : ""}
                        >
                            Tài khoản
                        </li>
                        <li
                            onClick={() => setActiveContent("language")}
                            className={activeContent === "language" ? "active" : ""}
                        >
                            Ngôn ngữ
                        </li>
                        <li
                            onClick={() => setActiveContent("theme")}
                            className={activeContent === "theme" ? "active" : ""}
                        >
                            Chủ đề
                        </li>
                        <li
                            onClick={() => setActiveContent("help")}
                            className={activeContent === "help" ? "active" : ""}
                        >
                            Trợ giúp
                        </li>
                        <li
                            onClick={() => setActiveContent("logout")}
                            className={activeContent === "logout" ? "active" : ""}
                        >
                            Đăng xuất
                        </li>
                    </ul>
                </div>

                {/* Nội dung bên dưới */}
                <div className="content-section col-sm-9">
                    {activeContent === "account" && (
                        <div>
                            <h3>Tài khoản</h3>
                            <p>Quản lý thông tin tài khoản của bạn tại đây.</p>
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">
                                        Tên người dùng
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="username"
                                        placeholder="Nhập tên người dùng"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="Nhập email"
                                    />
                                </div>
                                     <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        Password
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="Nhập email"
                                    />
                                </div>
                            </form>
                        </div>
                    )}

                    {activeContent === "language" && (
                        <div>
                            <h3>Ngôn ngữ</h3>
                            <p>Chọn ngôn ngữ hiển thị:</p>
                            <select className="form-select">
                                <option value="en">Tiếng Anh</option>
                                <option value="vi" selected>
                                    Tiếng Việt
                                </option>
                                <option value="fr">Tiếng Pháp</option>
                            </select>
                        </div>
                    )}

                    {activeContent === "theme" && (
                        <div>
                            <h3>Chủ đề</h3>
                            <p>Chọn chế độ hiển thị:</p>
                            <button className="btn btn-light" onClick={() => alert("Đổi chủ đề!")}>
                                Chế độ Sáng
                            </button>
                        </div>
                    )}

                    {activeContent === "help" && (
                        <div>
                            <h3>Trợ giúp</h3>
                            <p>Vui lòng liên hệ với chúng tôi qua email hoặc hotline:</p>
                            <ul>
                                <li>Email: support@example.com</li>
                                <li>Hotline: 1800-1234</li>
                            </ul>
                        </div>
                    )}

                    {activeContent === "logout" && (
                        <div>
                            <h3>Đăng xuất</h3>
                            <p>Bạn có chắc chắn muốn đăng xuất không?</p>
                            <button className="btn btn-danger" onClick={() => alert("Đăng xuất thành công!")}>
                                Đăng xuất
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
