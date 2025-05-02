import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useGetCompanyInformationQuery } from "../../redux_toolkit/guestApi";
import SidebarLayout from "../../component/_component/sidebar";

export default function EmployerPage() {
  const dispatch = useDispatch();
  const { isLogin, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { data: companyInformation } = useGetCompanyInformationQuery(
    user?.id
  );

  const sidebar = [
    {
      title: "Tổng quan",
      path: "/employer-overview",
      icon: "bi bi-nut",
    },
    {
      title: "Quản lý hồ sơ",
      path: "/employer-profile",
      icon: "bi bi-person-video3",
    },
    {
      title: "Quản lý tin tuyển dụng",
      path: "/employer-post",
      icon: "bi bi-postcard",
    },
    {
      title: "Thông báo",
      path: "/employer-notification",
      icon: "bi bi-bell",
    },
    {
      title: "Quản lý tài khoản",
      path: "/employer-account",
      icon: "bi bi-person-gear",
    },
  ];

  return (
    <div className="container-fluid">
      <SidebarLayout data={sidebar} />
    </div>
  );
}
