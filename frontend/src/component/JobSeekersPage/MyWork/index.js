import React, { useEffect } from "react";

import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";

export default function JobSeekerWork() {
  const { isLogin, user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  return (
    <div>
      <div className="bg-light rounded-2 me-2 my-2 p-2">
        <h3>Việc làm của tôi</h3>
      </div>

      <div className="bg-light rounded-2 me-2 my-2 p-2">
        <div className="">          <NavLink to="/jobseeker/mywork" end className="text-decoration-none">
            <span className="me-3">Việc làm đã ứng tuyển</span>
          </NavLink>
          <NavLink to="/jobseeker/mywork/savedwork" className="text-decoration-none">
            <span className="me-3">Việc làm đã lưu</span>
          </NavLink>
        </div>
        <div
          className="background-opacity .bg-gradient rounded-2 me-2 my-2 p-2 d-flex justify-content-center"
          style={{ minHeight: "300px" }}
        >
          <div className="d-flex col mt-4 justify-content-center">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
