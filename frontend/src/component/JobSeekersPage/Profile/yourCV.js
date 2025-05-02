import React from "react";

export default function yourCV() {
  return (
    <div>
      <div className="container rounded-2 me-2 my-2 p-2 card shadow-sm">
        <h5 className="fw-bold">Hồ sơ đính kèm của bạn</h5>
        <div className="border border-primary rounded-2 p-2 d-flex justify-content-between m-1">
          <span>
            <i className="bi bi-paperclip"></i>ThanhHangDang_Intern_CV.pdf
          </span>
          <span>Tải lên: 9/11/2024</span>
        </div>

        <div className="border border-primary rounded-2 p-2 d-flex justify-content-between m-1">
          <span>
            <i className="bi bi-paperclip"></i>ThanhHangDang_Intern_CV.pdf
          </span>
          <span>Tải lên: 9/11/2024</span>
        </div>
      </div>

      <div className="container rounded-2 me-2 my-2 p-2 card shadow-sm">
        <h5 className="fw-bold">Thêm đính kèm hồ sơ</h5>
        <div className=" p-2 d-flex justify-content-center text-center">
          <div className="col-3 border border-primary">
            <i className=" rounded-2 bi bi-upload lh-lg"></i>
            <p>Upload CV</p>
          </div>
        </div>
      </div>
    </div>
  );
}
