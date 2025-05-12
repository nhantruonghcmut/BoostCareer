import React, { useState, useRef } from "react";
import {
  useGetProfileCVQuery,
  useShowHideProfileCVMutation,
  useDeleteProfileCVMutation,
  useAddProfileCVMutation,
} from "../../../redux_toolkit/jobseekerApi.js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify"; // Import toast nếu cần thông báo
export default function YourCV() {
  const { user } = useSelector((state) => state.auth);
  const { data: dataCV } = useGetProfileCVQuery({
    profile_id: user?.id,
  });
  const [showHideProfileCV] = useShowHideProfileCVMutation();
  const [deleteProfileCV] = useDeleteProfileCVMutation();
  const [addProfileCV] = useAddProfileCVMutation();
  const handleShowHideCV = async (profile_id, cv_id, type) => {
    try {
      const response = await showHideProfileCV({
        profile_id: profile_id,
        cv_id: cv_id,
        type: type,
      }).unwrap();
      if (response.success) {
        // setSaveStatus(true);
        toast.success(
          `Đã ${type === "show" ? "hiện CV" : "ẩn CV"} thành công!`
        );
      } else {
        toast.error(`Đã ${type === "show" ? "hiện CV" : "ẩn CV"} thất bại!`);
      }
    } catch (error) {
      console.error("Error show hide cv:", error);
    }
  };

  //Xóa cv
  const [cvItem, setCvItem] = useState({
    profile_id: "",
    cv_id: "",
  });
  const handleDeleteCVItem = async () => {
    console.log(cvItem.profile_id);
    try {
      const response = await deleteProfileCV({
        profile_id: cvItem.profile_id,
        cv_id: cvItem.cv_id,
      }).unwrap();
      if (response.success) {
        // setSaveStatus(true);
        toast.success(`Đã xóa CV thành công!`);
      } else {
        toast.error(`Đã xóa CV thất bại!`);
      }
    } catch (error) {
      console.error("Error delete cv:", error);
    }
  };

  //Upload cv
  const cvInputRef = useRef(null);
  const handleButtonUploadCVClick = () => {
    if (cvInputRef) {
      cvInputRef.current.click();
    }
  };
  const handleCVChange = async (event) => {
    const cv = event.target.files[0];
    console.log("assadsaxasx", cv);
    if (cv) {
      console.log("Cần gửi cv này lên server: ", cv);
      try {
        await addProfileCV({
          file: cv,
        }).unwrap();
        toast.success("Upload cv thành công!");
      } catch (error) {
        console.error("Upload cv error:", error);
        toast.error("Upload cv thất bại!");
      }
    }
  };

  return (
    <div>
      {/* Thẻ input cv */}
      <input
        type="file"
        className="form-control-file"
        id="cvInput"
        style={{ display: "none" }}
        ref={cvInputRef}
        onChange={handleCVChange}
        accept=".pdf,.doc,.docx"
      />
      {/* End thẻ input cv */}

      {/* Modal delete */}
      <div
        className="modal fade"
        id="confirmDeleteCVModal"
        tabIndex={-1}
        // aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-sm">
          {" "}
          {/* Căn giữa và nhỏ lại */}
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalTitle">
                Xác nhận xóa
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className=" modal-body justify-content-center align-items-center modal-dialog-centered">
              {/* Căn giữa hai nút */}
              <button
                type="button"
                className="btn btn-secondary me-3"
                data-bs-dismiss="modal"
              >
                Hủy
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteCVItem}
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* End modal delete */}
      <div className="container rounded-2 me-2 my-2 p-2 card shadow-sm">
        <h5 className="fw-bold">Hồ sơ đính kèm của bạn</h5>
        {dataCV && dataCV.length > 0 ? (
          dataCV.map((item, index) => (
            <div
              key={index}
              className="card rounded-2 p-2 d-flex flex-row justify-content-between m-1 shadow-sm"
            >
       <div className="d-flex flex-row align-items-center ">
                <div className="d-flex flex-column">
                  <span>
                    <i className="bi bi-paperclip"></i>{" "}
                    {item.cv_name || "Tên CV"}
                  </span>
                  <span>Tải lên: {item.create_at || "Chưa có ngày"}</span>
                </div>
                {item?.isactive === 1 && (
                  <div className="">
                    <i
                      className="fa fa-check fa-lg ms-3 text-success"
                      aria-hidden="true"
                    ></i>
                  </div>
                )}
              </div>
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-success"
                  disabled={item?.isactive === 1 && true}
                  onClick={() =>
                    handleShowHideCV(item.profile_id, item.cv_id, "show")
                  }
                >
                  Hiện
                </button>
                <button
                  className="btn btn-secondary"
                  disabled={item?.isactive === 0 && true}
                  onClick={() =>
                    handleShowHideCV(item.profile_id, item.cv_id, "hide")
                  }
                >
                  Ẩn
                </button>
                <button
                  className="btn btn-danger"
                  data-bs-toggle="modal"
                  data-bs-target="#confirmDeleteCVModal"
                  onClick={() =>
                    setCvItem({
                      profile_id: item.profile_id,
                      cv_id: item.cv_id,
                    })
                  }
                >
                  Xóa
                </button>
              </div>
            </div>
          ))
        ) : (
          <div>Hãy upload CV của bạn!</div>
        )}
      </div>

      <div className="container rounded-2 me-2 my-2 p-2 card shadow-sm">
        <h5 className="fw-bold">Thêm đính kèm hồ sơ</h5>
        <div className=" p-2 d-flex flex-column align-items-center justify-content-center text-center">
          <div
            className="card shadow-sm col-3 "
            onClick={handleButtonUploadCVClick}
          >
            <i className=" rounded-2 bi bi-upload lh-lg"></i>
            <p>Upload CV</p>
          </div>
          <p>Vui lòng chọn file .doc, .docx, .pdf</p>
        </div>
      </div>
    </div>
  );
}
