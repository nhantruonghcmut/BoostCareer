import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../../../redux/actions/authAction.js";
import { logout } from "../../../redux_toolkit/AuthSlice.js";

export default function JobSeekerAccountSetting() {
  const dispatch = useDispatch();
  const { isLogin, user } = useSelector((state) => state.auth);

  console.log("check", isLogin);
  console.log("check", user);

  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
  };

  const [data, setData] = useState({
    password: "",
    rePassword: "",
  });

  const handleChangePassword = () => {
    console.log("user: ", user?.id, " passwordchange: ", data.password);
  };

  useEffect(() => {
    if (!isLogin || user?.role !== 3) {
      navigate("/login");
    }
  }, [navigate, user, isLogin]);

  return (
    <div>
      {/* Modal đổi mật khẩu */}
      <div
        className="modal fade"
        id="changePassword1"
        tabIndex={-1}
        aria-labelledby="modalTitle"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-lg card shadow-lg w-100"
          style={{ maxWidth: 480 }}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title card-title h3" id="modalTitle">
                Đổi mật khẩu
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-4">
                  <label htmlFor="email" className="form-label text-muted">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="email"
                    placeholder="Mật khẩu mới"
                    required
                    onChange={(e) => {
                      setData({
                        ...data,
                        password: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="form-label text-muted">
                    Nhập lại mật khẩu
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Nhập lại mật khẩu"
                    required
                    onChange={(e) => {
                      setData({
                        ...data,
                        rePassword: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="d-grid">
                  <button
                    type="button"
                    data-bs-dismiss="modal"
                    className="btn btn-dark btn-lg"
                    disabled={
                      !(
                        data.password === data.rePassword &&
                        data.password !== ""
                      )
                    }
                    onClick={handleChangePassword}
                  >
                    Thay đổi
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* End modal đổi mật khẩu */}

      <div className="bg-light rounded-2 me-2 my-2 p-2">
        <h3>Quản lý tài khoản</h3>
      </div>

      <div className="bg-light rounded-2 me-2 my-2 p-2">
        <h4>Tài khoản và mật khẩu</h4>
        <div
          className="d-flex justify-content-between align-items-center p-3 rounded border"
          style={{ backgroundColor: "#e9ecef" }}
        >
          <div>
            <p className="mb-1 fw-bold">
              Tên đăng nhập: <span className="fw-normal">{user?.username}</span>
            </p>
            <p className="mb-0 fw-bold">
              Mật khẩu: <span className="fw-normal">******</span>
            </p>
          </div>
          <div>
            <p className="mb-0 text-muted">Ngày tạo: {user?.create_date}</p>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-end me-2 my-2 p-2">
        <p
          onClick={handleLogout}
          className="text-primary text-decoration-primary d-block mt-2 pe-3 border-end border-primary"
        >
          Đăng xuất
        </p>

        <span
          className="text-primary text-decoration-underline text-decoration-primary d-block mt-2 me-4 ms-3 custom-hover-2"
          data-bs-toggle="modal"
          data-bs-target="#changePassword1"
        >
          Đổi mật khẩu
        </span>
      </div>

      <div className="d-flex justify-content-start me-2 my-2 p-2">
        <p className="text-danger text-decoration-none d-block mt-2 ms-3">
          <i className="bi bi-dash-circle-fill me-2"></i>Xóa tài khoản
        </p>
      </div>
    </div>
  );
}
