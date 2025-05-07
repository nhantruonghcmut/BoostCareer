import React, { useEffect, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ColorBar from "../../_component/ui/colorbar.js";
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
} from "../../../redux_toolkit/jobseekerApi.js";

import formatDateToDDMMYYYY from "../../../utils/formatDate.js";
import calculateDaysRemaining from "../../../utils/calculateDaysRemaining.js";
import CompanyHeader from "../../../component/_component/ui/CompanyHeader.js";
import TitleComponent from "../../_component/ui/TitleComponent.js";
import { toast } from "react-toastify";
import LoginModal from "../../_component/ui/LoginModal.js";
import { format } from "date-fns";
import { get } from "jquery";
import { use } from "react";
import { ca } from "date-fns/locale";

export default function WorkDetail() {
  const [value, setValue] = useState(90);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { id } = useParams();
  const [addJobApply] = useAddJobApplyMutation();
  const [addJobSaving] = useAddJobSavingMutation();
  const [deleteJobSaving] = useDeleteJobSavingMutation();
  const formatNumberToTr = (number) => `${(number / 1e6).toFixed(0)}tr`;
  const [saved, setSaved] = React.useState(false);
  const [applied, setApplied] = React.useState(false);

  const { data: postDetail, isLoading } = useGetJobDetailQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  const { data: jobApply } =
    useGetJobApplyQuery({
      skip: !user?.id,
    }) || [];
  const { data: jobSaving } =
    useGetJobsavingQuery(user?.id, {
      skip: !user?.id,
    }) || [];
  console.log("jobApply", jobApply);
  console.log("jobSaving", jobSaving);
  const { data: relatedJobs, isLoading: isLoadingRelatedJobs } =
    useGetRelatedJobsQuery(id, { skip: !id });

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

  useEffect(() => {
    if (user?.role === 3) {
      // Check if jobSaving is an array before using .some()
      setSaved(
        Array.isArray(jobSaving) &&
          jobSaving.some((item) => item.job_id === postDetail?.job_id)
      );

      // Check if jobApply is an array before using .some()
      setApplied(
        Array.isArray(jobApply) &&
          jobApply.some((item) => item.job_id === postDetail?.job_id)
      );
    }
  }, [user, jobSaving, jobApply, postDetail]);

  // useEffect( () => {
  //   if (user?.role === 2) {
  //     toast.error("Vui lòng đăng nhập vai trò người tìm việc!");
  //     navigate("/");
  //   }
  // }, [navigate, user]);

  return (
    <>
      <LoginModal />
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
                        )} đ/tháng`}
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
                    <div className="d-flex justify-content-between align-items-end mb-3">
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
                           <ColorBar value={value} />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="d-flex justify-content-between align-items-end mb-3">
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
                  <i class="fa fa-map-marker fa-lg text-primary me-3 mt-1 ms-2"></i>
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
                  {/* <li>
                    <strong>Ngày đăng:</strong>{" "}
                    {formatDateToDDMMYYYY(postDetail?.date_post)}
                  </li> */}
                  <li>
                    <strong>Lĩnh vực:</strong> {postDetail?.industry_name}
                  </li>
                  <li>
                    <strong>Ngành nghề:</strong> {postDetail?.job_function_name}
                  </li>
                  {/* <li>
                    <strong>Kỹ năng:</strong>{" "}
                    {postDetail?.job_skills
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
                  </li> */}
                  {/* <li>
                    <strong>Giờ làm việc:</strong>{" "}
                    {postDetail?.working_time
                      ? postDetail?.working_time
                      : "Chưa có thông tin"}
                  </li> */}

                  <li>
                    <strong>Địa chỉ:</strong> {postDetail?.address}
                  </li>
                </ul>
              </div>
            </div>

            {/* cụm Related job*/}
            {/* <div className="card">
              <div className="card-body">
                <h5>Việc làm tương tự</h5>
                <ul className="list-unstyled">
                  <li>
                    <a href="#a" className="text-decoration-none">
                      Junior AI Engineer - Navigos Search
                    </a>
                  </li>
                  <li>
                    <a href="#a" className="text-decoration-none">
                      AI Engineer - Samsung Electronics Vietnam
                    </a>
                  </li>
                  <li>
                    <a href="#a" className="text-decoration-none">
                      Data Engineer - Công ty TNHH FPT Smart Cloud
                    </a>
                  </li>
                </ul>
              </div>
            </div> */}
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
                                )} đ/tháng`}
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
