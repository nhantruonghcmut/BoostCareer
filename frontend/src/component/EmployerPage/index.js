import React from "react";
import { useSelector } from "react-redux";
import SidebarLayout from "../../component/_component/sidebar";

export default function EmployerPage() {
  const { isLogin, user } = useSelector((state) => state.auth);
  console.log("User at EmployerPage:", user);

  const data = [
    {
      title: "Tổng quan",
      path: "/employer/overview",
      icon: "bi bi-bar-chart-line",
    },
    {
      title: "Hồ sơ công ty",
      path: "/employer/profile",
      icon: "bi bi-building",
    },
    {
      title: "Quản lý tin tuyển dụng",
      path: "/employer/post",
      icon: "bi bi-briefcase",
    },
    {
      title: "Thông báo",
      path: "/employer/notification",
      icon: "bi bi-bell",
    },
    {
      title: "Cài đặt tài khoản",
      path: "/employer/account",
      icon: "bi bi-gear",
    },
  ];

  // You might want to fetch employer data here

  return (
    <div className="container-fluid">
      <SidebarLayout data={data} />
    </div>
  );
}
