import React, { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/Header.css';
import Chat from './Chat';
import { useAuth } from '../../js/contexts/AuthContext';
import { NotificationContext } from "../contexts/NotificationContext";
import { Link } from 'react-router-dom';
import MessageApi from "../../Api/MessageApi";


const Header = () => {
    const { isLoggedIn } = useAuth();

    const users = [
        { id: 1, name: 'Trần Minh Tâm', avatar: 'img/post1.jpg' },
        { id: 2, name: 'Nguyễn Đức Tân', avatar: 'img/post1.jpg' },
        { id: 3, name: 'Hoàng Ngọc Phúc', avatar: 'img/logo.png' },
        { id: 4, name: 'Văn Tiều', avatar: 'img/avt.jpg' },
        { id: 5, name: 'Đặng Thành Đạt', avatar: 'img/avt.jpg' }
    ];

    const messagess = [
        { id: 1, room_id: 101, user_id: 1, message: "Xin chào! Ai có ở đây không?", created_at: "2024-10-25 08:00:00" },
        { id: 2, room_id: 101, user_id: 2, message: "Chào! Mình ở đây nè!", created_at: "2024-10-25 08:05:00" },
        { id: 3, room_id: 101, user_id: 1, message: "Bạn có xem bộ phim mới không?", created_at: "2024-10-25 09:00:00" },
        { id: 4, room_id: 101, user_id: 2, message: "Có, mình thấy nó rất hay!", created_at: "2024-10-25 09:15:00" },
        { id: 5, room_id: 101, user_id: 1, message: "Chúng ta nên đi xem phim cùng nhau lần sau.", created_at: "2024-10-25 09:30:00" },
        { id: 6, room_id: 102, user_id: 1, message: "Mình đang ở đâu vậy?", created_at: "2024-10-25 08:30:00" },
        { id: 7, room_id: 102, user_id: 3, message: "Chúng ta đang ở quán cà phê nhé!", created_at: "2024-10-25 08:35:00" },
        { id: 8, room_id: 102, user_id: 1, message: "Ôi, mình quên mất! Hẹn gặp nhau ở đó nhé!", created_at: "2024-10-25 08:40:00" },
        { id: 9, room_id: 103, user_id: 1, message: "Tối nay đi ăn không?", created_at: "2024-10-25 19:00:00" },
        { id: 10, room_id: 103, user_id: 4, message: "Có chứ! Mình cũng muốn ăn món gì đó ngon.", created_at: "2024-10-25 19:05:00" },
        { id: 11, room_id: 103, user_id: 1, message: "Mình nghe nói có quán mới mở, thử đi không?", created_at: "2024-10-25 19:10:00" },
        { id: 12, room_id: 103, user_id: 4, message: "Nghe hay đấy! Gặp nhau lúc mấy giờ?", created_at: "2024-10-25 19:15:00" },
        { id: 13, room_id: 104, user_id: 1, message: "Cafe đi", created_at: "2024-10-25 19:00:00" },
        { id: 14, room_id: 104, user_id: 5, message: "Đợi một Tý", created_at: "2024-10-25 19:05:00" },
        { id: 15, room_id: 104, user_id: 1, message: "Ra quán rùi nè", created_at: "2024-10-25 19:10:00" },
        { id: 16, room_id: 104, user_id: 5, message: "Oke luôn", created_at: "2024-10-25 19:15:00" },
        { id: 17, room_id: 104, user_id: 5, message: "Mà thôi làm biến quá không ra đâu", created_at: "2024-10-25 19:15:00" },
        { id: 18, room_id: 104, user_id: 1, message: "Cc cút", created_at: "2024-10-25 19:10:00" }
    ];

    const chatItems = [
        { id: 'chatWindow1', userId: 2, idRoom: '101' },
        { id: 'chatWindow2', userId: 3, idRoom: '102' },
        { id: 'chatWindow3', userId: 4, idRoom: '103' },
        { id: 'chatWindow4', userId: 5, idRoom: '104' },
        { id: 'chatWindow5', userId: 1, idRoom: '105' },
        { id: 'chatWindow6', userId: 3, idRoom: '106' },
        { id: 'chatWindow7', userId: 4, idRoom: '107' },
        { id: 'chatWindow8', userId: 2, idRoom: '108' },
    ];

    const [othernotificationCount, setOthernotificationCount] = useState(-2);
    const { notification } = useContext(NotificationContext);
 
    
    useEffect(() => {
        if (notification) {
            setOthernotificationCount((prevCount) => prevCount + 1);
        }
    }, [notification]);



    // Hàm xử lý khi click vào thông báo khác
    const handleOtherNotificationClick = () => {
        setOthernotificationCount(0); // Đặt về 0 khi click
    };


    return (
        <header className="container-fluid">
            <Link to="/"> <img src="/img/logoVNGO.png" alt="Logo" className="logo" /></Link>
            <div className="search-container">
                <i className="fas fa-search search-icon" />
                <input type="text" className="search-input" placeholder="Tìm kiếm..." />
            </div>
            <div className="icons-container">
                {isLoggedIn && (
                    <>
                        <Link to="/notification" onClick={handleOtherNotificationClick} >
                            <i className="fas fa-bell icon" id="toggleBell" />
                            {othernotificationCount > 0 && (<span className="notification-badge other-notifcaton">{othernotificationCount}</span>)}
                        </Link>
                        <Chat />
                        <Link to='/setting'><i className="fas fa-cog icon" /></Link>
                    </>
                )}
                <a href="/login">
                    <i className="fas fa-user icon" />
                </a>
            </div>
        </header>
    );
};

export default Header;
