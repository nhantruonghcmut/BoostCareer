import React, { useState, useLayoutEffect } from "react";
import "./SidebarLayout.css"; // tạo file CSS riêng nếu bạn muốn tách style ra
import { NavLink, Outlet } from "react-router-dom";

const SidebarLayout = ({ data = [] }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  useLayoutEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1150) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    handleResize(); // gọi lần đầu

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <nav
        className={`sidebar d-flex flex-column flex-shrink-0 position-relative ${
          collapsed ? "collapsed" : ""
        }`}
      >
        <button className="toggle-btn" onClick={toggleSidebar}>
          <i
            className={`bi ${
              collapsed ? "bi-chevron-right" : "bi-chevron-left"
            }`}
          ></i>
        </button>

        <div className="p-4">
          <h4 className="logo-text fw-bold mb-0">Boost Career</h4>
          {/* <p className="text-muted small hide-on-collapse">Dashboard</p> */}
        </div>

        <div className="nav flex-column">
          {data?.map((item, index) => (
            <NavLink
              to={item.path}
              key={index}
              className={`${
                collapsed ? "sidebar-link-collapsed" : "sidebar-link"
              }  text-decoration-none p-3`}
              activeclassname="active"
            >
              <i className={`${item.icon} me-3`}>{""}</i>
              <span className="hide-on-collapse">{item.title}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default SidebarLayout;
