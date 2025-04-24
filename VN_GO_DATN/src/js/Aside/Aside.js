import React, { Component } from 'react'
import '../../css/Aside.css';
import { useAuth } from '../../js/contexts/AuthContext'; // Import hook useAuth để lấy trạng thái đăng nhập
import FeaturedLocations from './FeaturedLocations';
import ListUnFollow from './ListUnFollow';

const Aside = () => {
    const { isLoggedIn, logout } = useAuth(); // Lấy thông tin đăng nhập từ AuthContext
    return (
        <>
            <aside className="col-sm-3 py-3">
                {/* Địa điểm nổi bật */}
                <FeaturedLocations />
                {/* Danh sách người liên hệ */}
                {isLoggedIn && (
                    <ListUnFollow />
                )}
            </aside>

        </>
    )
}

export default Aside