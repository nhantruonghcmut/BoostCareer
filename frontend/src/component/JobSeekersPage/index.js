import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetItemProfileQuery } from "../../redux_toolkit/jobseekerApi";
import SidebarLayout from "../../component/_component/sidebar";

export default function JobSeekerPage() {
  // Lấy thông tin user từ Redux store
  const { isLogin, user } = useSelector((state) => state.auth);
  console.log("User tại JobSeekerPage:", user);
  const navigate = useNavigate();

  const data = [
    {
      title: "Tổng quan",
      path: "/jobseeker-overview",
      icon: "bi bi-nut",
    },
    {
      title: "Hồ sơ cá nhân",
      path: "/jobseeker-profile",
      icon: "bi bi-person-video3",
    },
    {
      title: "Nhà tuyển dụng của tôi",
      path: "/jobseeker-company-follow",
      icon: "bi bi-buildings",
    },
    {
      title: "Quản lý việc làm",
      path: "/jobseeker-mywork",
      icon: "bi bi-briefcase",
    },
    {
      title: "Thông báo",
      path: "/jobseeker-notification",
      icon: "bi bi-bell",
    },
    {
      title: "Quản lý tài khoản",
      path: "/jobseeker-account",
      icon: "bi bi-person-gear",
    },
  ];

  // Sử dụng skip để tránh gọi API khi chưa có user.id
  const {
    data: userInformation,
    isLoading,
    error,
  } = useGetItemProfileQuery(
    { type: "Basic"},
    {
      skip: !user?.id,
    }
  );
  console.log("data tại JobSeekerPage:", userInformation);
  useEffect(() => {
    if (!isLogin || user?.role !== 3) {
      navigate("/login");
    }
  }, [isLogin, navigate, user]);

  // Hiển thị loading khi đang tải dữ liệu
  if (isLoading) {
    return (
      <div className="container-fluid">
        <div className="d-flex justify-content-center mt-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <SidebarLayout data={data} />
    </div>
  );
}
