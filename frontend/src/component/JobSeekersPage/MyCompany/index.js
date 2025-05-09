import React, { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function JobSeekerCompany() {
  const { isLogin, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();


  return (
    <div>
      <div className="bg-light rounded-2 me-2 my-2 p-2">
        <h3>Công ty của tôi</h3>
      </div>

      <div className="bg-light rounded-2 me-2 my-2 p-2">
        <div className="">
          <NavLink
            to="/jobseeker/company-follow"
            className="text-decoration-none"
          >
            <span>Công ty đã theo dõi</span>
          </NavLink>
        </div>

        <div
          className="background-opacity .bg-gradient rounded-2 me-2 my-2 p-2 d-flex justify-content-center"
          style={{ minHeight: "300px" }}
        >
          <div className="col-lg-11 mt-4">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
