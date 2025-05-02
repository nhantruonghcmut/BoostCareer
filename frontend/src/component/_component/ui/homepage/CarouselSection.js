import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

const HeroSection = ({ generalInfo }) => {
  const navigate = useNavigate();
  const { leadingcompany, job_count, company_count, jobseeker_count } =
    generalInfo || {
      leadingcompany: [],
      job_count: 0,
      company_count: 0,
      jobseeker_count: 0,
    };

  const { user } = useSelector((state) => state.auth);

  const [searchInput, setSearchInput] = useState("");
  const [inputError, setInputError] = useState("");
  // Hàm xử lý khi thay đổi input
  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
    // Xóa thông báo lỗi khi người dùng bắt đầu nhập
    if (e.target.value.trim() !== "") {
      setInputError("");
    }
  };

  // Hàm xử lý khi click nút tìm kiếm
  const handleSearch = () => {
    // Kiểm tra nếu input rỗng
    if (searchInput.trim() === "") {
      setInputError("Vui lòng nhập từ khóa tìm kiếm");
      return;
    }
    // Chuyển hướng đến trang /post với param title
    navigate(`/post?title=${encodeURIComponent(searchInput.trim())}`);
  };

  // Hàm xử lý khi nhấn Enter trong input
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <div
      className="text-white text-center py-5"
      style={{
        // background:
        //   "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/img/hero-bg.jpg') no-repeat center center",
        backgroundSize: "cover",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        opacity: "0.8",
        // background: "#614c4c",
        background:
          "radial-gradient(circle, rgba(97, 76, 76, 1) 0%, rgba(9, 9, 121, 1) 38%, rgba(1, 11, 13, 1) 89%)",
      }}
    >
      {/* Heading */}
      <div className="container">
        <h1 className="display-4 fw-bold mb-3">
          Tìm Công Việc Mơ Ước Của Bạn Ngay Hôm Nay!
        </h1>
        <p className="lead text-white-50 mb-4">
          Gắn kết đam mê với cơ hội – Cùng bạn vươn tới đỉnh cao sự nghiệp
        </p>

        <div className="d-flex justify-content-center">
          {/* Search Bar */}
          <div
            className="bg-white rounded shadow d-flex flex-nowrap align-items-stretch justify-content-between mb-5 w-100"
            style={{ maxWidth: "900px", overflowX: "auto" }}
          >
            {/* Input (mobile & desktop cùng lúc, chỉ 1 cái cần thiết thôi) */}
            {/*      Input với validation  - VANNHAN_04_24 */}
            <input
              type="text"
              className="form-control border-0 rounded-0 rounded-start"
              placeholder={
                inputError
                  ? inputError
                  : "Tìm kiếm công việc cho sự nghiệp của bạn"
              }
              style={{ maxWidth: "80%", flexShrink: 1, minWidth: 0 }}
              value={searchInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            {inputError && (
              <div className="invalid-feedback text-start position-absolute">
                {inputError}
              </div>
            )}

            {/* Location */}
            {/* tạm thời tắt search location - VANNHAN_04_24 */}
            {/* <select
              className="form-select border-0 rounded-0 d-none d-md-block"
              style={{ maxWidth: "200px", flexShrink: 1, minWidth: 0 }}
            >
              <option>Select Location</option>
            </select> */}

            {/* Category */}
            {/* tạm thời tắt search Category - VANNHAN_04_24 */}
            {/* <select
              className="form-select border-0 rounded-0 d-none d-md-block"
              style={{ maxWidth: "200px", flexShrink: 1, minWidth: 0 }}
            >
              <option>Select Category</option>
            </select> */}

            {/* Button lớn */}
            <button
              className="btn btn-success rounded-0 rounded-end px-4 d-none d-md-flex align-items-center"
              onClick={handleSearch}
            >
              <i className="bi bi-search me-2"></i> Tìm kiếm
            </button>

            {/* Button nhỏ */}
            <button
              className="btn btn-success d-flex d-md-none align-items-center px-3"
              onClick={handleSearch}
            >
              <i className="bi bi-search"></i>
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="row justify-content-center text-white-50">
          <div className="col-6 col-md-3 mb-4">
            <div className="d-flex flex-column align-items-center">
              <NavLink
                to="/post"
                className="text-decoration-none text-white-50"
              >
                <div className="bg-success rounded p-3 mb-2">
                  <i className="bi bi-briefcase-fill fs-4 text-white"></i>
                </div>
                <h5 className="text-white mb-0">{job_count}</h5>
                <small>Công việc</small>
              </NavLink>
            </div>
          </div>
          <div className="col-6 col-md-3 mb-4">
            {user?.role !== 2 ? (
              <div className="d-flex flex-column align-items-center">
                <div
                  onClick={() => {
                    toast.error("Bạn cần đăng nhập Nhà tuyển dụng!");
                  }}
                >
                  <div className="bg-success rounded p-3 mb-2">
                    <i className="bi bi-people-fill fs-4 text-white"></i>
                  </div>
                  <h5 className="text-white mb-0">{jobseeker_count}</h5>
                  <small>Ứng viên</small>
                </div>
              </div>
            ) : (
              <div className="d-flex flex-column align-items-center">
                <NavLink
                  to="/candidates"
                  className="text-decoration-none text-white-50"
                >
                  <div className="bg-success rounded p-3 mb-2">
                    <i className="bi bi-people-fill fs-4 text-white"></i>
                  </div>
                  <h5 className="text-white mb-0">{jobseeker_count}</h5>
                  <small>Ứng viên</small>
                </NavLink>
              </div>
            )}
          </div>
          <div className="col-6 col-md-3 mb-4">
            <div className="d-flex flex-column align-items-center">
              <NavLink
                to="/list-company"
                className="text-decoration-none text-white-50"
              >
                <div className="bg-success rounded p-3 mb-2">
                  <i className="bi bi-buildings-fill fs-4 text-white"></i>
                </div>
                <h5 className="text-white mb-0">{company_count}</h5>
                <small>Công ty</small>
              </NavLink>
            </div>
          </div>
        </div>

        {/* leadingcompanys section */}
        <div className="d-flex flex-wrap justify-content-center gap-5 mt-4">
          {leadingcompany?.map((item, index) => {
            return (
              <NavLink to={`/company-detail/${item.company_id}`} key={index}>
                <img
                  src={item.logo}
                  alt="Slack"
                  height="40"
                  className="custom-hover-2"
                />
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
