import React from "react";
import { NavLink } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div className="container py-5">
      <div className="row justify-content-center align-items-center">
        <div className="col-md-8 text-center">
          <img
            alt="page not found"
            src="/img/pageNotFound/404-error.svg"
            className="img-fluid mb-4"
            style={{ maxHeight: "300px" }}
          />
          <h2 className="mb-3">Không tìm thấy trang</h2>
          <p className="text-muted mb-4">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
          </p>
          <NavLink className="btn btn-primary px-4 py-2" to="/">
            Quay về trang chủ
          </NavLink>
        </div>
      </div>
    </div>
  );
}