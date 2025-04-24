/* eslint-disable no-unused-vars */
import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./js/contexts/AuthContext"; // Import AuthProvider
import { NotificationProvider } from "./js/contexts/NotificationContext";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import Header from "./js/Header/Header";
import Nav from "./js/Nav/Nav";
import Main from "./js/Main/Main";
import Aside from "./js/Aside/Aside";
import MainAside from "./js/MainAside/MainAside";
import Follows from "./js/Follows/Follows";
import Home from "./js/Home/Home";
import SignIn from "./js/SignIn/SignIn";
import SignUp from "./js/SignUp/SignUp";
import Profile from "./js/Profile/Profile";
import TourDetails from "./js/TourDetails/TourDetails";
import Tours from "./js/Tours/Tours";
import Explore from "./js/Explore/Explore";
import Notification from "./js/Notification/Notification";
import Settings from "./js/Setting/Setting";
import GuestHome from "./js/GuestHome/GuestHome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee } from "@fortawesome/free-solid-svg-icons"; // biểu tượng từ bộ solid
import ChatPage from "./js/ChatPages/ChatPage";
import Hobby from "./js/SignUp/Hobby";
import UpdateHobby from "./js/Profile/UpdateHobby";
import ImgModal from "./js/Profile/UpAvatar";
import Infomation from "./js/SignUp/Infomation";
import Forgotpassword from "./js/SignIn/Forgotpassword";
import Section from "./js/Home/Sections";


function App() {
  return (
    <>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              {/* Route chính / */}
              <Route path="/" element={<Home />}>
                <Route path="/" element={<Section />}>
                  {/* MainAside là route con của / */}
                  <Route element={<MainAside />}>
                    {/* Các route con bên trong MainAside */}
                    <Route path="/" element={<Main />} /> {/* Mặc định khi vào / */}
                    <Route path="tours" element={<Tours />} />
                    <Route path="notification" element={<Notification />} />
                  </Route>
                  {/* Các route ngoài MainAside */}
                  <Route path="follows" element={<Follows />} />
                  <Route path="tourdetails/:id" element={<TourDetails />} />
                  <Route path="explore" element={<Explore />} />
                </Route>
              </Route>

              {/* Các route khác */}
              <Route path="messages" element={<ChatPage />} />
              <Route path="login" element={<SignIn />} />
              <Route path="forgot-password" element={<Forgotpassword />} />

              {/* Route đăng ký */}
              <Route path="signup" element={<SignUp />}>
                <Route index element={<Infomation />} /> {/* Infomation là mặc định trong /signup */}
                <Route path="hobby" element={<Hobby />} />
              </Route>

              {/* Các route profile và setting */}
              <Route path="profile/:id" element={<Profile />} />
              <Route path="setting" element={<Settings />} />
              <Route path="updatehobby" element={<UpdateHobby />} />
              <Route path="upavatar" element={<ImgModal />} />
            </Routes>
          </Router>
        </NotificationProvider>
      </AuthProvider>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      />
    </>
  );
}

export default App;
