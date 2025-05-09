import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function EmployerProfile() {
  // Navigation tabs for profile section
  const profileTabs = [
    { title: "Thông tin công ty", path: "/employer/profile" },
    { title: "Quản lý ứng tuyển", path: "/employer/profile/manage-application" },
    { title: "Ứng viên đã lưu", path: "/employer/profile/manage-saving-candidate" },
    { title: "Lời mời làm việc", path: "/employer/profile/manage-invitation" },
  ];

  return (
    <div className="employer-profile-container">
      <div className="profile-navigation mb-4">
        <ul className="nav nav-tabs">
          {profileTabs.map((tab, index) => (
            <li className="nav-item" key={index}>
              <NavLink 
                to={tab.path} 
                className={({isActive}) => 
                  isActive ? "nav-link active" : "nav-link"
                }
                end={tab.path === "/employer/profile"}
              >
                {tab.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="profile-content">
        <Outlet />
      </div>
    </div>
  );
}
