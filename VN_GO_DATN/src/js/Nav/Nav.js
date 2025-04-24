import React, {useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../js/contexts/AuthContext'; // Import hook useAuth để lấy trạng thái đăng nhập
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/Nav.css';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import HomeIcon from '@mui/icons-material/Home';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import { useParams } from 'react-router-dom';
import { NotificationContext } from "../contexts/NotificationContext";
import config from "../../config";

const { SERVER_API } = config;


// Hàm Nav với hook để sử dụng AuthContext
function Nav() {
    const { isLoggedIn , authFullName, authId, setAuthId, authAvatar } = useAuth(); // Lấy thông tin đăng nhập từ AuthContext
    const { id } = useParams;
    const { handleLogout } = useContext(NotificationContext);
    const fullName = authFullName;
    
    const logout = (e) => {
        e.preventDefault(); // Ngăn chặn hành động mặc định của Link (chuyển trang)
        handleLogout(); // Gọi hàm logout để đăng xuất
    };


     useEffect(() => {
        // Cập nhật authId từ tham số URL
        if (id) {
            setAuthId(id);
        }
    }, [id, setAuthId]);

    return (
        <nav className="col-sm-3 sidebar">
            <div className="sidebar-area">
            {isLoggedIn && (
                   <div className="user-profile-card">
                   <Link to={`/profile/${authId}`}>
                       <img src= {authAvatar} alt="Avatar" />
                   </Link>
                   <h2>{fullName}</h2> {/* Hiển thị full name từ AuthContext */}
               </div>
                )}
                {!isLoggedIn && (
                    <div className="user-profile-card">
                        <a  href="/login"
                        style={{
                            marginTop: "20px",
                            padding: "10px 20px",
                            fontSize: "16px",
                            fontWeight: "bold",
                            color: "white",
                            backgroundColor: "#4CAF50",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            textDecoration: "none",
                            textAlign: "center",
                            transition: "background-color 0.3s ease",
                        }}
                        >Đăng Nhập</a>
                        
                    </div>
                )}

                <ul className="menu-items">
                    <li>
                        <Link to="/" >
                            <HomeIcon style={{  marginLeft: "5px", marginRight: "5px", fontSize: "35px" }} /> Trang chủ
                        </Link>
                    </li>
                    <li>
                        <Link to="/follows" >
                            <PeopleAltOutlinedIcon style={{ marginLeft: "5px", marginRight: "5px", fontSize: "35px" }} /> Theo dõi
                        </Link>
                    </li>
                    <li>
                        <Link to="/explore" >
                            <ExploreOutlinedIcon style={{marginLeft: "5px", marginRight: "5px", fontSize: "35px" }} /> Khám phá
                        </Link>
                    </li>
                    <li>
                        <Link to="tours" >
                            <MapOutlinedIcon style={{marginLeft: "5px", marginRight: "5px", fontSize: "35px" }} /> Chuyến đi
                        </Link>
                    </li>
                    <li>
                        <Link to="/messages" >
                            <MailOutlinedIcon style={{marginLeft: "5px", marginRight: "5px", fontSize: "35px" }} /> Nhắn tin
                        </Link>
                    </li>
                    {/* Hiển thị nút đăng xuất chỉ khi người dùng đã đăng nhập */}
                    {isLoggedIn && (
                        <li>
                            <Link to="#" onClick={logout} >
                                <ExitToAppOutlinedIcon style={{marginLeft: "5px", marginRight: "5px", fontSize: "35px" }} /> Đăng xuất
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Nav;
