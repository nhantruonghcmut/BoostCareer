import React, { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function EmployerProfile() {
  const navigate = useNavigate();
  const { isLogin, user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!isLogin || user?.role !== 2) {
      navigate("/login");
    }
  }, [user, isLogin]);

  return (
    <div className="container my-3">
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <NavLink
            to="/employer-profile"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Hồ sơ công ty
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/employer-manage-application"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Hồ sơ ứng tuyển
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/employer-manage-saving-candidate"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Hồ sơ đã lưu
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/employer-manage-invitation"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Thư mời đã gửi
          </NavLink>
        </li>
      </ul>

      {/* Nội dung sẽ được thay đổi theo route */}
      <div className="container mt-3">
        <Outlet />
      </div>
    </div>
  );
}
