import React, { useEffect, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { useParams, NavLink } from "react-router-dom";
import { useSelector  } from "react-redux";
import ColorBar from "../../_component/ui/colorbar.js";
import AIAnalysisModal from "../../_component/ui/AIAnalysisModal";
import {
  useGetJobDetailQuery,
  useGetRelatedJobsQuery,
} from "../../../redux_toolkit/guestApi.js";
import {
  useAddJobApplyMutation,
  useDeleteJobSavingMutation,
  useAddJobSavingMutation,
  useGetJobApplyQuery,
  useGetJobsavingQuery,
  useGetAI_scoreQuery,
} from "../../../redux_toolkit/jobseekerApi.js";


import calculateDaysRemaining from "../../../utils/calculateDaysRemaining.js";
import CompanyHeader from "../../../component/_component/ui/CompanyHeader.js";
import TitleComponent from "../../_component/ui/TitleComponent.js";
import { toast } from "react-toastify";
import LoginModal from "../../_component/ui/LoginModal.js";
import { format } from "date-fns";

export default function WorkDetail() {
  const { user } = useSelector((state) => state.auth);
  const { id } = useParams();
  const [addJobApply] = useAddJobApplyMutation();
  const [addJobSaving] = useAddJobSavingMutation();
  const [deleteJobSaving] = useDeleteJobSavingMutation();
  const formatNumberToTr = (number) => `${(number / 1e6).toFixed(0)} triệu vnđ`;


/////// KHU VỰC LẤY DATA
// Public data - always fetch
const { data: postDetail, isLoading: isLoadingJobdetail } = useGetJobDetailQuery(id, {
  refetchOnMountOrArgChange: true
});
console.log("Post detail:", postDetail);
// User-specific data - only fetch when user exists
const skipUserQueries = !user?.id;

// Get result objects
const jobApplyResult = useGetJobApplyQuery(undefined, { 
  skip: skipUserQueries 
});
const jobSavingResult = useGetJobsavingQuery(undefined, { 
  skip: skipUserQueries 
});
const aiScoreResult = useGetAI_scoreQuery({job_id: id}, { 
  skip: skipUserQueries 
});
const relatedJobsResult = useGetRelatedJobsQuery(id, { 
  skip: skipUserQueries 
});

// Extract data with fallbacks
const jobApply = jobApplyResult.data || [];
const jobSaving = jobSavingResult.data || [];
const ai_score = aiScoreResult.data || 0;
const relatedJobs = relatedJobsResult.data || [];
const isLoadingRelatedJobs = relatedJobsResult.isLoading;

// Debug logs
console.log("User-specific queries skipped:", skipUserQueries);

  console.log("jobApply", jobApply);
  console.log("jobSaving", jobSaving);
  console.log("ai_score", ai_score);
  

  /////// KHU VỰC STATE
  const [value, setValue] = useState(90);

  // Add state for modal visibility
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  // Add sample analysis data (replace with real data in production)


  const [saved, setSaved] = React.useState(false);
  const [applied, setApplied] = React.useState(false);
  // Handle modal open/close
  const handleOpenAnalysisModal = () => setShowAnalysisModal(true);
  const handleCloseAnalysisModal = () => {
    console.log("Closing modal...");
    setShowAnalysisModal(false);
  };



  //##
  
// Log to verify API calls are skipped
// console.log("Job apply query skipped:", skipJobApplyQuery);
// console.log("Job saving query skipped:", skipJobSavingQuery);
// const { data: ai_analyze,isLoading:isLoadinganalyze } = useGetAI_AnalyzeQuery({job_id:id}, { skip: !id }) ||{};
// const ai_score =0;
// const ai_analyze = {
//   "strengths": [
//       "Số năm kinh nghiệm: 3 năm",
//       "Học vấn: Thạc sỹ Quản lý an toàn thông tin và Đại học Computer Science",
//       "Kỹ năng: Java Programming",
//       "Ngôn ngữ: ENGLISH (TOEIC 700-900)"
//   ],
//   "weaknesses": [
//       "Thiếu kinh nghiệm với ERP development (D365FO)",
//       "Không có kỹ năng X++ và SQL Server",
//       "Không có kinh nghiệm với Power BI report development",
//       "Thiếu hiểu biết về OOP (Object-Oriented Programming) và clean code practices",
//       "Không có kinh nghiệm với .NET (C#/ASP.NET, ASP.NET Core) development",
//   ],
//   "suggestions": [
//       "Học và nắm vững OOP (Object-Oriented Programming) và clean code practices",
//       "Học và nắm vững X++ và SQL Server",
//       "Học và nắm vững Power BI report development",
//       "Học và nắm vững .NET (C#/ASP.NET, ASP.NET Core) development",
//   ]
// };
const ai_analyze = {};
const [analysisData, setAnalysisData] = useState(ai_analyze);

/////// KHU VỰC HANDLE

  const handleSaveJob = async () => {
    try {
      if (user?.role === 3) {
        // Check if jobSaving is an array before using .some()
        if (
          Array.isArray(jobSaving) &&
          jobSaving.some((item) => item.job_id === postDetail?.job_id)
        ) {
          toast.error("Bạn đã lưu công việc này rồi!");
          return;
        }
        const response = await addJobSaving({
          job_id: postDetail?.job_id,
        }).unwrap();
        if (response?.success) {
          toast.success("Lưu công việc thành công!");
        } else {
          toast.error("Lưu công việc thất bại!");
        }
      } else {
        toast.error("Vui lòng đăng nhập để lưu công việc!");
      }
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error("Đã xảy ra lỗi khi lưu việc làm!");
    }
  };

  const handleDeleteJobSaving = async () => {
    try {
      if (user?.role === 3) {
        // Check if jobSaving is an array before using .some()
        if (
          !Array.isArray(jobSaving) ||
          !jobSaving.some((item) => item.job_id === postDetail?.job_id)
        ) {
          toast.error("Bạn chưa lưu công việc này!");
          return;
        }
        const response = await deleteJobSaving({
          job_id: postDetail?.job_id,
        }).unwrap();
        if (response?.success) {
          toast.success("Xóa công việc thành công!");
        } else {
          toast.error("Xóa công việc thất bại!");
        }
      } else {
        toast.error("Vui lòng đăng nhập để xóa công việc!");
      }
    } catch (error) {
      console.error("Error deleting job saving:", error);
      toast.error("Đã xảy ra lỗi khi xóa việc làm!");
    }
  };

  const handleApplyJob = async () => {
    try {
      if (user?.role === 3) {
        if (
          !Array.isArray(jobApply) ||
          jobApply?.some((item) => item.job_id === postDetail?.job_id)
        ) {
          toast.error("Bạn đã ứng tuyển công việc này rồi!");
          return;
        }
        const response = await addJobApply({
          job_id: postDetail?.job_id,
        }).unwrap();
        if (response?.success) {
          toast.success("Ứng tuyển thành công!");
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


  /////// KHU VỰC USEEFFECT
  useEffect(() => {
    if (user?.role === 3 && postDetail) {
      const isSaved = Array.isArray(jobSaving) &&
        jobSaving.some((item) => item.job_id === postDetail?.job_id);
      if (saved !== isSaved) setSaved(isSaved);
  
      const isApplied = Array.isArray(jobApply) &&
        jobApply.some((item) => item.job_id === postDetail?.job_id);
      if (applied !== isApplied) setApplied(isApplied);
    }
  }, [user, jobSaving, jobApply, postDetail]);

  // useEffect(() => {
  //   if (ai_analyze && (analysisData !== ai_analyze)) {
  //     setAnalysisData(ai_analyze);
  //   }
  // }, [ai_analyze]);

  return (
    <>
      <LoginModal />
      <AIAnalysisModal 
  show={showAnalysisModal} // Use the correct state here
  handleClose={handleCloseAnalysisModal} // This function will update the state
  analyze={analysisData}
  score = {ai_score}
  
/>
      <TitleComponent title={"Chi Tiết Việc Làm"} description={""} />
      <div className="container my-5">
        <nav aria-label="breadcrumb mt-3">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <NavLink to="/">Trang chủ</NavLink>
            </li>
            <li className="breadcrumb-item">
              <NavLink to="/post">Danh sách việc làm</NavLink>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Thông tin việc làm
            </li>
          </ol>
        </nav>

        <div className="row">
          {/* Left Column */}
          <div className="col-lg-8 mb-4">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">{postDetail?.title}</h4>
                <p className="text-muted">
                  <strong>
                    {postDetail?.salary_min === 0 &&
                    postDetail?.salary_max === 0
                      ? "Thỏa thuận"
                      : `${formatNumberToTr(
                          postDetail?.salary_min
                        )} - ${formatNumberToTr(
                          postDetail?.salary_max
                        )} /tháng`}
                  </strong>{" "}
                  • <i className="bi bi-stopwatch-fill me-1"></i>
                  {calculateDaysRemaining(postDetail?.date_expi)
                    ? `Hết hạn trong ${calculateDaysRemaining(
                        postDetail?.date_expi
                      )} ngày`
                    : "Hết hạn"}{" "}
                  •<i className="bi bi-people-fill me-1"></i>
                  {postDetail?.views} lượt xem •{" "}
                  {postDetail?.work_location_name}
                </p>
                {user?.role === 3 ? (
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div style={{ width: "48%" }} className="d-flex">
                        {applied ? (
                          <button className="btn btn-danger flex-fill me-2" disabled>
                            Đã ứng tuyển
                          </button>
                        ) : (
                          <button
                            className="btn btn-danger flex-fill me-2"
                            onClick={handleApplyJob}
                          >
                            Ứng tuyển
                          </button>
                        )}

                        {saved ? (
                          <button
                            className="btn btn-outline-danger flex-fill"
                            onClick={handleDeleteJobSaving}
                          >
                            Bỏ Lưu
                          </button>
                        ) : (
                          <button
                            className="btn btn-outline-secondary flex-fill"
                            onClick={handleSaveJob}
                          >
                            Lưu
                          </button>
                        )}
                      </div>
                      <div style={{ width: "48%", textAlign: "right" }}>
                           <ColorBar value={ai_score} handleOpenModal={handleOpenAnalysisModal} />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div style={{ width: "48%" }} className="d-flex">
                        <button
                          className="btn btn-danger flex-fill me-2"
                          data-bs-toggle="modal"
                          data-bs-target="#LoginModal"
                        >
                          Ứng tuyển
                        </button>
                        <button
                          className="btn btn-outline-secondary flex-fill"
                          data-bs-toggle="modal"
                          data-bs-target="#LoginModal"
                        >
                          Lưu
                        </button>
                        </div>
                      <div style={{ width: "48%", textAlign: "right" }}>
                           <ColorBar value={ai_score} handleOpenModal={handleOpenAnalysisModal} />
                      </div>
                    </div>
                  </>
                )}

                       <hr />

                <h5 className="mt-3">Mô tả công việc</h5>
                <ul>
                  {postDetail?.describle
                    ?.split("%00endl")
                    .map((item, index) => item && <li key={index}>{item}</li>)}
                </ul>

                <h5 className="mt-3">Thông tin việc làm</h5>
                <div className="row row-cols-1 row-cols-md-3 g-3">
                  <div className="d-flex align-items-center mb-2">
                    <i
                      className={`fa fa-calendar fa-lg text-primary me-3 mt-1 ms-2`}
                      style={{ width: 21.33 }}
                    ></i>
                    <div>
                      <p className="mb-1 fw-bold">Ngày đăng</p>
                      <p className="mb-0 text-muted">
                        {postDetail?.date_post
                          ? format(postDetail?.date_post, "dd/MM/yyyy")
                          : "Chưa có thông tin"}
                      </p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-2">
                    <i
                      className={`fa fa-sitemap fa-lg text-primary me-3 mt-1 ms-2`}
                      style={{ width: 21.33 }}
                    ></i>
                    <div>
                      <p className="mb-1 fw-bold">Ngành nghề</p>
                      <p className="mb-0 text-muted">
                        {postDetail?.job_function_name || "Chưa có thông tin"}
                      </p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-2">
                    <i
                      className={`fa fa-briefcase fa-lg text-primary me-3 mt-1 ms-2`}
                      style={{ width: 21.33 }}
                    ></i>
                    <div>
                      <p className="mb-1 fw-bold">Lĩnh vực</p>
                      <p className="mb-0 text-muted">
                        {postDetail?.industry_name || "Chưa có thông tin"}
                      </p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-2">
                    <i
                      className={`fa fa-users fa-lg text-primary me-3 mt-1 ms-2`}
                      style={{ width: 21.33 }}
                    ></i>
                    <div>
                      <p className="mb-1 fw-bold">Số lượng</p>
                      <p className="mb-0 text-muted">
                        {postDetail?.quantity > 0
                          ? postDetail?.quantity
                          : "Chưa có thông tin"}
                      </p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-2">
                    <i
                      className={`fa fa-handshake-o fa-lg text-primary me-3 mt-1 ms-2`}
                      style={{ width: 21.33 }}
                    ></i>
                    <div>
                      <p className="mb-1 fw-bold">Kinh nghiệm</p>
                      <p className="mb-0 text-muted">
                        {postDetail?.require_experience > 0
                          ? postDetail?.require_experience
                          : "Không yêu cầu"}
                      </p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-2">
                    <i
                      className={`fa fa-graduation-cap fa-lg text-primary me-3 mt-1 ms-2`}
                      style={{ width: 21.33 }}
                    ></i>
                    <div>
                      <p className="mb-1 fw-bold">Trình độ học vấn</p>
                      <p className="mb-0 text-muted">
                        {postDetail?.education_title || "Không yêu cầu"}
                      </p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-2">
                    <i
                      className={`fa fa-hourglass fa-lg text-primary me-3 mt-1 ms-2`}
                      style={{ width: 21.33 }}
                    ></i>
                    <div>
                      <p className="mb-1 fw-bold">Giờ làm việc</p>
                      <p className="mb-0 text-muted">
                        {postDetail?.working_time || "Chưa có thông tin"}
                      </p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-2">
                    <i
                      className={`fa fa-user fa-lg text-primary me-3 mt-1 ms-2`}
                      style={{ width: 21.33 }}
                    ></i>
                    <div>
                      <p className="mb-1 fw-bold">Cấp bậc</p>
                      <p className="mb-0 text-muted">
                        {postDetail?.job_level_name || "Không yêu cầu"}
                      </p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-2">
                    <i
                      className={`fa fa-language fa-lg text-primary me-3 mt-1 ms-2`}
                      style={{ width: 21.33 }}
                    ></i>
                    <div>
                      <p className="mb-1 fw-bold">Ngôn ngữ</p>
                      <p className="mb-0 text-muted">
                        {postDetail?.languages.length > 0
                          ? postDetail?.languages.map((item) => (
                              <span key={item.language_id}>
                                {item.language_name}{" "}
                              </span>
                            ))
                          : "Không yêu cầu"}
                      </p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-2">
                    <i
                      className={`fa fa-venus-mars fa-lg text-primary me-3 mt-1 ms-2`}
                      style={{ width: 21.33 }}
                    ></i>
                    <div>
                      <p className="mb-1 fw-bold">Giới tính</p>
                      <p className="mb-0 text-muted">
                        {postDetail?.require_gender || "Không yêu cầu"}
                      </p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-2">
                    <i
                      className={`fa fa-heart fa-lg text-primary me-3 mt-1 ms-2`}
                      style={{ width: 21.33 }}
                    ></i>
                    <div>
                      <p className="mb-1 fw-bold">Tình trạng hôn nhân</p>
                      <p className="mb-0 text-muted">
                        {postDetail?.require_marital_status || "Không yêu cầu"}
                      </p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-2">
                    <i
                      className={`fa fa-clock-o fa-lg text-primary me-3 mt-1 ms-2`}
                      style={{ width: 21.33 }}
                    ></i>
                    <div>
                      <p className="mb-1 fw-bold">Loại hình làm việc</p>
                      <p className="mb-0 text-muted">
                        {postDetail?.working_type || "Chưa có thông tin"}
                      </p>
                    </div>
                  </div>
                </div>

                {postDetail?.more_requirements && (
                  <>
                    <h5 className="mt-3">Yêu cầu ứng viên</h5>
                    <ul>
                      {postDetail.more_requirements
                        .split("%00endl")
                        .map(
                          (item, index) => item && <li key={index}>{item}</li>
                        )}
                    </ul>
                  </>
                )}

                <h5 className="mt-3">Các phúc lợi dành cho bạn</h5>
                <div className="d-flex flex-column gap-3">
                  {postDetail?.company_benefits?.map(
                    (item, index) =>
                      item && (
                        <div
                          key={index}
                          className="card p-3 d-flex flex-row align-items-center gap-3"
                        >
                          <i
                            className={`fa ${item.benefit_icon} fa-lg text-primary me-3 mt-1`}
                            style={{ minWidth: "24px" }}
                          ></i>
                          <div>
                            <p className="fw-bold mb-1">{item.benefit_name}</p>
                            <p className="text-muted mb-0">
                              {item.benefit_value}
                            </p>
                          </div>
                        </div>
                      )
                  )}
                </div>

                <h5 className="mt-3">Địa điểm làm việc</h5>
                <p>
                  <i className="fa fa-map-marker fa-lg text-primary me-3 mt-1 ms-2"></i>
                  {postDetail?.address}
                </p>

                <h5 className="mt-3">Chứng chỉ: </h5>
                <div className="d-flex flex-column gap-3">
                  {postDetail?.certification.length > 0
                    ? postDetail.certification
                        ?.slice() // Create a copy of the array to avoid mutating the original
                        .sort(
                          (a, b) =>
                            a.certification.length - b.certification.length
                        ) // Sort by name length (shortest first)
                        .map((item, index) => (
                          <div
                            key={index}
                            className="card p-3 d-flex flex-row align-items-center gap-3"
                          >
                            {" "}
                            <i
                              className={`fa fa-book fa-lg text-primary me-3 mt-1`}
                              style={{ minWidth: "24px" }}
                            ></i>
                            <p className=" mb-1">{item.certification}</p>
                          </div>
                        ))
                    : "Chưa có thông tin"}
                </div>

                <h5 className="mt-3">Từ khóa:</h5>
                <div>
                  {postDetail?.job_skills.length > 0
                    ? postDetail.job_skills
                        ?.slice() // Create a copy of the array to avoid mutating the original
                        .sort(
                          (a, b) => a.skill_name.length - b.skill_name.length
                        ) // Sort by name length (shortest first)
                        .map((item) => (
                          <NavLink
                            key={item.skill_id}
                            to={`/post?skill_id=${item.skill_id}`}
                            className="badge bg-secondary me-2 mb-2 text-decoration-none skill-badge"
                          >
                            {item.skill_name}
                          </NavLink>
                        ))
                    : "Chưa có thông tin"}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-lg-4">
            <div className="card mb-4">
              <div className="card-body">
                <CompanyHeader
                  companyInformation={postDetail}
                  heightBg={"150px"}
                  logoSize={"30px"}
                  showFollowButton={false}
                />
                <h5>Thông tin công ty</h5>
                <ul className="list-unstyled">
                  <li>
                    <strong>Lĩnh vực:</strong> {postDetail?.industry_name}
                  </li>
                  <li>
                    <strong>Ngành nghề:</strong> {postDetail?.job_function_name}
                  </li>
                     <li>
                    <strong>Địa chỉ:</strong> {postDetail?.address}
                  </li>
                </ul>
              </div>
            </div>

           
            {isLoadingRelatedJobs || relatedJobs?.length === 0 ? (
              <div>
                {" "}
                Rất tiếc, hiện chúng tôi không tìm thấy công việc tương tự.
              </div>
            ) : (
              <Card>
                <Card.Body>
                  <Card.Title className="mb-3">
                    CÁC CÔNG VIỆC TƯƠNG TỰ
                  </Card.Title>
                  <ListGroup variant="flush">
                    {relatedJobs?.map((job, index) => (
                      <ListGroup.Item
                        key={index}
                        className="d-flex align-items-start"
                      >
                        <img
                          src={job.company_logo}
                          alt={job.company_name}
                          width="100"
                          height="100"
                          className="me-3"
                        />
                        <div>
                          <h6 className="mb-1">{job.title}</h6>
                          <div>{job.company_name}</div>
                          <div>
                            <strong>Lương:</strong>{" "}
                            {job.salary_max === 0 && job.salary_min === 0
                              ? "Thỏa thuận"
                              : `${formatNumberToTr(
                                  job.salary_min
                                )} - ${formatNumberToTr(
                                  job.salary_max
                                )} /tháng`}
                          </div>
                          <div>
                            <i className="bi bi-geo-alt"></i>{" "}
                            {job.work_location_name}
                          </div>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            )}

            {/* kết thúc cụm Related job*/}
          </div>
        </div>
      </div>
    </>
  );
}
