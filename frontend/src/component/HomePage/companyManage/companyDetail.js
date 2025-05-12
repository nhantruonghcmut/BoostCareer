import React, { useEffect, useState, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import calculateDaysRemaining from "../../../utils/calculateDaysRemaining.js";
import {
  useGetCompanyInformationQuery,
  useGetJobOfCompanyByIdQuery,
} from "../../../redux_toolkit/guestApi.js";
import Rating from "../../_component/ui/RatingSection.js";
import {
  useGetCompanyReviewQuery,
  useAddFollowingCompanyMutation,
  useDeleteFollowingCompanyMutation,
  useGetJobApplyQuery,
  useAddJobApplyMutation,
  useAddCompanyReviewMutation,
  useDeleteCompanyReviewMutation,
} from "../../../redux_toolkit/jobseekerApi.js";
import CompanyRating from "../../_component/ui/CompanyRatingSection.js";
import { useGetCitiesQuery } from "../../../redux_toolkit/CategoryApi.js";
import CompanyHeader from "../../_component/ui/CompanyHeader.js";
import TitleComponent from "../../_component/ui/TitleComponent.js";
import { toast } from "react-toastify";

export default function CompanyDetail() {
  const navigate = useNavigate();
  const { isLogin, user } = useSelector((state) => state.auth);
  const [applyJob] = useAddJobApplyMutation();
  // const [addFollowingCompany] = useAddFollowingCompanyMutation();
  // const [deleteFollowingCompany] = useDeleteFollowingCompanyMutation();
  // const [addReviewCompany] = useAddCompanyReviewMutation();
  // const [deleteReviewCompany] = useDeleteCompanyReviewMutation();
  const { data: jobApply, refetch: refetchJobApply } = useGetJobApplyQuery({},
    { skip: !isLogin }
  ); // Add refetch function
  const formatNumberToTr = (number) => {
    // Format số theo định dạng Việt Nam
    const formattedNumber = Math.floor(number / 1e6).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${formattedNumber} triệu vnđ`;
  };
  const { companyId } = useParams();
  const { data: city } = useGetCitiesQuery(84); // 84 là mã quốc gia Việt Nam
  const { data: companyInformation } = useGetCompanyInformationQuery(companyId);
  const { data } = useGetJobOfCompanyByIdQuery(companyId);
  const postsByUser = data?.jobs || [];

  // Filter
  const [keyword, setKeyWord] = useState("");
  const [keyLocation, setKeyLocation] = useState("");

  // Client Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const appliedJobIds = jobApply?.map((item) => item.job_id) || [];

  const handleApplyJob = async (id) => {
    try {
      if (user?.role === 3) {
        const response = await applyJob({
          job_id: id,
        }).unwrap();

        if (response?.success) {
          toast.success("Ứng tuyển thành công!");

          // No need to modify a local copy since we're using useMemo
          // Simply refetch the data to update the appliedJobIds
          refetchJobApply();
        } else {
          toast.error("Ứng tuyển thất bại!");
        }
      } else {
        toast.error("Vui lòng đăng nhập để ứng tuyển!");
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      toast.error("Đã xảy ra lỗi khi ứng tuyển!");
    }
  };

  const processedJobs = useMemo(() => {
    return postsByUser.map((job) => ({
      ...job,
      is_apply: appliedJobIds.includes(job.job_id),
    }));
  }, [postsByUser, appliedJobIds]);

  const filteredJobs = useMemo(() => {
    return processedJobs.filter((post) => {
      const matchKeyword = String(post.title || "")
        .toUpperCase()
        .includes((keyword || "").toUpperCase());

      const matchLocation =
        keyLocation === "" || String(post.city_id) === String(keyLocation);

      return matchKeyword && matchLocation;
    });
  }, [processedJobs, keyword, keyLocation]);

  const currentJobs = filteredJobs.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredJobs.length / postsPerPage);
  const ratingData = {};
  useEffect(() => {
    if (user?.role === 2) {
      toast.error("Vui lòng đăng nhập vai trò người tìm việc!");
      navigate("/");
    }
  }, [navigate, user]);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, keyLocation]);

  return (
    <>
      <TitleComponent title={"Chi Tiết Công Ty"} description={""} />
      <div className="container my-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mt-3">
            <li className="breadcrumb-item">
              <NavLink to="/">Home</NavLink>
            </li>
            <li className="breadcrumb-item">
              <NavLink to="/list-company">Danh sách công ty</NavLink>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Thông tin công ty
            </li>
          </ol>
        </nav>
        {/* Header */}
        <CompanyHeader companyInformation={companyInformation} />

        {/* Main Content */}
        <div className="row mt-4">
          {/* Left Column */}
          <div className="col-lg-8">
            {/* Company Introduction */}
            <div className="card mb-4">
              <div className="card-body">
                <h6 className="fw-bold">Giới thiệu công ty</h6>
                <p>{companyInformation?.describle}</p>
              </div>
            </div>

            {/* Job Listings */}
            <div className="card">
              <div className="card-body">
                <h6 className="fw-bold">Tuyển dụng</h6>
                <div className="input-group mb-3 ">
                  <input
                    type="text"
                    className="form-control "
                    placeholder="Tên công việc, vị trí ứng tuyển..."
                    onChange={(e) => {
                      setKeyWord(e.target.value);
                    }}
                  />
                  <select
                    className="form-select"
                    onChange={(e) => {
                      console.log(e.target.value);
                      setKeyLocation(e.target.value);
                    }}
                  >
                    <option value="" selected>
                      Tất cả tỉnh/thành phố
                    </option>
                    {city?.map((option) => (
                      <option value={option.city_id} key={option.city_id}>
                        {option.city_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="list-group">
                  {processedJobs.length > 0 ? (
                    currentJobs.map((option) => (
                      <div
                        className="list-group-item d-flex justify-content-between align-items-center"
                        key={option.job_id}
                      >
                        <div>
                          <h6 className="mb-0">
                            <NavLink to={`/post-detail/${option?.job_id}`}>
                              {option.title}
                            </NavLink>
                          </h6>
                          <p className="text-muted mb-0">
                            {option.work_location_name} |{" "}
                            {calculateDaysRemaining(option.date_expi) > 0
                              ? `Còn ${calculateDaysRemaining(
                                  option.date_expi
                                )} ngày để ứng tuyển`
                              : "Hết hạn"}
                          </p>
                        </div>
                        <div className="text-end">
                          <span className="badge bg-success">
                            {option.salary_min === 0 && option.salary_max === 0
                              ? "Thỏa thuận"
                              : `${formatNumberToTr(
                                  option.salary_min
                                )} - ${formatNumberToTr(
                                  option.salary_max
                                )}/tháng`}
                          </span>
                          {user?.role === 3 ? (
                            option.is_apply ? (
                              <button className="btn btn-outline-danger btn-sm ms-3">
                                Đã Ứng tuyển
                              </button>
                            ) : (
                              <button
                                className="btn btn-outline-success btn-sm ms-3"
                                onClick={() => handleApplyJob(option.job_id)}
                              >
                                Ứng tuyển
                              </button>
                            )
                          ) : (
                            <button
                              className="btn btn-outline-success btn-sm ms-3"
                              data-bs-toggle="modal"
                              data-bs-target="#LoginModal"
                            >
                              Ứng tuyển
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Chưa có bài đăng nào</p>
                  )}
                  {totalPages > 1 && (
                    <nav className="mt-4">
                      <ul className="pagination justify-content-center">
                        {[...Array(totalPages)].map((_, index) => (
                          <li
                            key={index}
                            className={`page-item ${
                              currentPage === index + 1 ? "active" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(index + 1)}
                            >
                              {index + 1}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  )}
                </div>
              </div>
            </div>

            <div className="card mt-2">
<CompanyRating
                reviewDetail={companyInformation?.review_details}
                averageScore={companyInformation?.average_score}
                profile_id={companyInformation?.company_id}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="col-lg-4">
            {/* Contact Information */}
            <div className="card mb-4">
              <div className="card-body">
                <h6 className="fw-bold">Thông tin liên hệ</h6>
                <p className="mb-1">
                  <strong>Địa chỉ công ty:</strong>
                </p>

                <p>
                  {companyInformation?.company_location
                    ? companyInformation.company_location.map(
                        (location, index) => (
                          <p key={index}>
                            {location.address} - {location.city_name}
                          </p>
                        )
                      )
                    : "Chưa có thông tin"}
                </p>                
                <h6 className="fw-bold">Chia sẻ công ty tới bạn bè</h6>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => {
                      const url = encodeURIComponent(window.location.href);
                      const title = encodeURIComponent(companyInformation?.company_name || "Công ty");
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&t=${title}`, '_blank');
                    }}
                  >
                    <i className="bi bi-facebook"></i> Facebook
                  </button>
                  <button 
                    className="btn btn-outline-info btn-sm"
                    onClick={() => {
                      const url = encodeURIComponent(window.location.href);
                      const title = encodeURIComponent(companyInformation?.company_name || "Công ty");
                      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank');
                    }}
                  >
                    <i className="bi bi-twitter"></i> Twitter
                  </button>
                  <button 
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => {
                      const url = encodeURIComponent(window.location.href);
                      const title = encodeURIComponent(companyInformation?.company_name || "Công ty");
                      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
                    }}
                  >
                    <i className="bi bi-linkedin"></i> LinkedIn
                  </button>
                </div>
              </div>
            </div>
            {companyInformation?.company_benefits && (
              <div className="card mt-4">
                <div className="card-body text-center">
                  <h6 className="fw-bold text-start">
                    Các phúc lợi dành cho bạn
                  </h6>
                  <div className="list-group ">
                    {companyInformation?.company_benefits &&
                      companyInformation?.company_benefits.map(
                        (item, index) =>
                          item && (
                            <div
                              key={index}
                              className="card d-flex text-center align-items-center mb-1"
                            >
                              <div className="card-body d-flex flex-column  align-items-center">
                                <i
                                  className={`fa ${item.benefit_icon} me-2`}
                                  style={{ color: "#2DA5F6" }}
                                ></i>
                                <p className="card-text fw-bold m-0">
                                  {item.benefit_name}
                                </p>
                                <p className="card-text text-muted text-break">
                                  {item.benefit_value}
                                </p>
                              </div>
                            </div>
                          )
                      )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
