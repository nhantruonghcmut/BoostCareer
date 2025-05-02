import React from "react";
import { NavLink } from "react-router-dom";

export default function ResetPassword() {
  return (
    <div>
      <div className="container bg-light mt-5 mb-5 col-10 col-sm-5 rounded-3">
        <div className="row">
          <h2 className="fw-bold text-center mt-2">Quên mật khẩu</h2>
        </div>
        <form method="post" action>
          <p>Tên đăng nhập*</p>
          <input
            type="text"
            className="form-control mb-3"
            name="username"
            placeholder="Tên đăng nhập"
            // defaultValue
          />
          <p>Email*</p>
          <input
            type="text"
            className="form-control mb-3"
            name="email"
            placeholder="Email đăng ký"
            // defaultValue
          />
          <p>Số điện thoại*</p>
          <input
            type="text"
            className="form-control mb-3"
            name="phone"
            placeholder="Số điện thoại đăng ký"
            // defaultValue
          />
          <div className="row">
            <div className="col">
              <button
                type="submit"
                className="form-control btn btn-outline-danger mt-3 mb-3"
              >
                Lấy lại mật khẩu
              </button>
            </div>
          </div>
        </form>
        <div className="row d-flex justify-content-end">
          <div className="col-8 d-flex justify-content-end">
            <p className="me-2">Bạn chưa có tài khoản?</p>
            <NavLink to="/register" className="text-primary">
              Đăng ký
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
