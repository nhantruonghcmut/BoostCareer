import React, { useRef } from "react";
import "./CompanyBackground.css";
import {
    useUpdateLogoImageMutation,
  useUpdateCoverImageMutation,
} from "../../../../redux_toolkit/employerApi.js";
const CompanyBackground = ({ company }) => {
  const [updateLogoImage] = useUpdateLogoImageMutation();
  const [updateCoverImage] = useUpdateCoverImageMutation();
  //   const [logo, setLogo] = useState("");
  const fileInputRef = useRef(null);
  const backgroundInputRef = useRef(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // đảm bảo ref đã tồn tại
    }
  };

  const handleButtonBackgoundClick = () => {
    if (backgroundInputRef.current) {
      backgroundInputRef.current.click(); // đảm bảo ref đã tồn tại
    }
  };

  const handleFileChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("logoCompany", file);
        await updateLogoImage(formData).unwrap();
      }
    } catch (error) {
      console.error("Error updating logo:", error);
    }
  };

  const handleFileChangeBackground = async (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("background", file);
        await updateCoverImage(formData).unwrap();
      }
    } catch (error) {
      console.error("Error updating background:", error);
    }
  };

  return (
    <>
      <input
        type="file"
        className="form-control-file"
        accept="image/jpeg, image/png, image/gif" // Chỉ cho phép chọn ảnh
        id="fileInput"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <input
        type="file"
        className="form-control-file"
        accept="image/jpeg, image/png, image/gif" // Chỉ cho phép chọn ảnh
        id="fileInput"
        style={{ display: "none" }}
        ref={backgroundInputRef}
        onChange={handleFileChangeBackground}
      />

      <div className="col-12 mb-4">
        <div
          className="profile-header position-relative mb-4 shadow-sm"
          style={
            company?.background
              ? { backgroundImage: `url(${company?.background})` }
              : {}
          }
        >
          <div className="position-absolute top-0 end-0 p-3 ">
            <button
              className="btn btn-light"
              onClick={handleButtonBackgoundClick}
            >
              <i className="bi bi-pencil-square"></i>
              Edit Cover
            </button>
          </div>
        </div>

        <div className="text-center">
          <div className="position-relative d-inline-block">
            <img
              src={company?.logo}
              className="rounded-circle profile-pic"
              alt="ProfilePicture"
            />
            <button
              className="btn btn-primary btn-sm position-absolute bottom-0 end-0 rounded-circle"
              onClick={handleButtonClick}
            >
              <i className="bi bi-camera"></i>
            </button>
          </div>
          <h3 className="mt-3 mb-1">{company?.company_name}</h3>
          <p className="text-muted mb-3">{company?.industry_name}</p>
        </div>
      </div>
    </>
  );
};

export default CompanyBackground;
