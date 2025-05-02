import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import Rating from "./RatingSection.js";
import {
  useInviteCandidateApplyJobMutation,
  useAddCandidateMutation,
  useDeleteCandidateMutation,
  useGetListJobForInvitationQuery,
} from "../../../redux_toolkit/employerApi.js";

import formatSafeDate from "../../../utils/formatSafeDate.js";
import InviteJobModal from "./InviteJobModal"; // Import modal component
import { toast } from "react-toastify"; // Import toast nếu cần thông báo
import { use } from "react";

const CandidateDetail = ({
  basic,
  certification_info,
  education_info,
  experience_info,
  language_info,
  project_info,
  skill_info,
  ratingData,
  isSaved,
}) => {
  const { isLogin, user } = useSelector((state) => state.auth);
  console.log("basic", isSaved);
  const [inviteCandidateApplyJob] = useInviteCandidateApplyJobMutation();
  const [addCandidate] = useAddCandidateMutation();
  const [deleteCandidate] = useDeleteCandidateMutation();
  const [saveStatus, setSaveStatus] = useState(isSaved);
  // Lấy danh sách job cho employer hiện tại và jobseeker cụ thể
  const { data: jobData, isLoading: isLoadingJobs } =
    useGetListJobForInvitationQuery(
      { employer_id: user?.id, jobseeker_id: basic?.profile_id },
      { skip: !user?.id || !basic?.profile_id }
    );
  console.log("jobData", jobData);
  // State quản lý modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [invitedJobs, setInvitedJobs] = useState([]);

  // Hàm xử lý khi người dùng nhấn "Gửi thư mời"
  const handleSendInviteJob = () => {
    setShowInviteModal(true);
  };

  // Hàm xử lý khi người dùng chọn job và submit từ modal
  const handleInviteSubmit = async (selectedJobIds) => {
    if (selectedJobIds.length > 0) {
      try {
        // Gọi API để gửi thư mời
        const response = await inviteCandidateApplyJob({
          employer_id: user?.id,
          jobseeker_id: basic?.profile_id,
          job_ids: selectedJobIds,
        }).unwrap();

        // Lưu danh sách job đã gửi thư mời
        setInvitedJobs(selectedJobIds);
        if (response.success) {
          // Hiển thị thông báo thành công
          toast.success(
            `Đã gửi ${selectedJobIds.length} thư mời đến ứng viên!`
          );
        } else {
          toast.error("Gửi thư mời thất bại, vui lòng thử lại");
        }
      } catch (error) {
        // Hiển thị thông báo lỗi
        toast.error(
          "Gửi thư mời thất bại: " +
            (error.data?.message || "Vui lòng thử lại sau")
        );
      }
    }
  };

  const handleSaveCandidate = async () => {
    // console.log("Follow candidate clicked!");
    // Add your follow candidate logic here
    try {
      const response = await addCandidate({
        employer_id: user?.id,
        jobseeker_id: basic?.profile_id,
      }).unwrap();
      if (response.success) {
        // setSaveStatus(true);
        toast.success("Đã lưu hồ sơ ứng viên thành công!");
      } else {
        toast.error("Lưu hồ sơ ứng viên thất bại, vui lòng thử lại");
      }
    } catch (error) {
      toast.error(
        "Lưu hồ sơ ứng viên thất bại: " +
          (error.data?.message || "Vui lòng thử lại sau")
      );
    }
  };
  const handleUnSaveCandidate = async () => {
    try {
      const response = await deleteCandidate({
        employer_id: user?.id,
        jobseeker_id: basic?.profile_id,
      }).unwrap();
      if (response.success) {
        // setSaveStatus(false);
        toast.success("Đã xóa hồ sơ ứng viên thành công!");
      } else {
        toast.error("Xóa hồ sơ ứng viên thất bại, vui lòng thử lại");
      }
    } catch (error) {
      toast.error(
        "Xóa hồ sơ ứng viên thất bại: " +
          (error.data?.message || "Vui lòng thử lại sau")
      );
    }
  };
  console.log("skilliform", education_info);

  useEffect(() => {
    if (isSaved) {
      setSaveStatus(true);
    } else {
      setSaveStatus(false);
    }
  }, [isSaved]);
  return (
    <div className="container my-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center mb-4">
        <img
          src={basic?.avatar}
          alt="avatar"
          className="rounded-circle me-md-4 mb-3 mb-md-0"
          style={{ width: "100px", height: "100px", objectFit: "cover" }}
        />
        <div>
          <h4 className="mb-1">{basic?.full_name || "Tên Hidden"}</h4>
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-warning text-dark">
              ⭐ {basic?.score ? parseFloat(basic.score).toFixed(1) : "0"}
            </span>
            <span
              className={`badge ${
                basic?.is_open_for_job === 0 ? "bg-danger" : "bg-success"
              }`}
            >
              {basic?.is_open_for_job === 0 ? "Hoạt động" : "Đang tìm việc"}
            </span>
          </div>
          <div className="text-muted small mt-2">
            <div>Chức danh hiện tại: {basic?.title || "Hidden"}</div>
            <div>Cấp bậc hiện tại: {basic?.level_name || "Hidden"}</div>
            <div>
              Ngày tham gia:{" "}
              {formatSafeDate(basic?.create_at, "dd/MM/yyyy") || "Hidden"}
            </div>
          </div>
        </div>
        <div className="ms-auto">
          <button
            className="btn btn-primary me-2"
            onClick={handleSendInviteJob}
            disabled={!jobData || jobData.length === 0 || isLoadingJobs}
          >
            {isLoadingJobs ? (
              <span className="spinner-border spinner-border-sm me-1"></span>
            ) : null}
            Gửi thư mời
          </button>
          {saveStatus ? (
            <button
              className="btn btn-outline-danger me-2"
              onClick={saveStatus ? handleUnSaveCandidate : handleSaveCandidate}
            >
              Bỏ lưu hồ sơ
            </button>
          ) : (
            <button
              className="btn btn-outline-primary me-2"
              onClick={saveStatus ? handleUnSaveCandidate : handleSaveCandidate}
            >
              Lưu hồ sơ
            </button>
          )}
        </div>
      </div>

      <div className="row">
        {/* Left Side */}
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-body">
              <h6>Công việc mong muốn</h6>
              <div className="row small text-muted">
                <div>
                  <p>
                    Mục tiêu sự nghiệp:{" "}
                    {/* <strong>{basic?.career_target || "Hidden"}</strong> */}
                    <ul>
                      {basic?.career_target?.split("%00endl").map(
                        (item, index) =>
                          item && (
                            <li key={index}>
                              <strong>{item}</strong>
                            </li>
                          )
                      )}
                    </ul>
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    Mức lương mong muốn:{" "}
                    <strong>{basic?.salary_expect || "Hidden"}</strong>
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    Địa chỉ làm việc:{" "}
                    <strong>{basic?.work_expected_place || "Hidden"}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Experience*/}
          <div className="card mb-4">
            <div className="card-body">
              <h6>Kinh nghiệm làm việc</h6>

              <div className="row small text-muted">
                {experience_info?.map((item, index) => {
                  return (
                    <div key={index} className="m-2">
                      <p className="fw-bold mb-1">{item.exp_title}</p>

                      <p className="mb-1">
                        Công ty: <strong>{item.exp_company}</strong>
                      </p>
                      <p className="mb-1">
                        Mô tả: <strong>{item.exp_description}</strong>
                      </p>
                      <p>
                        Từ:{" "}
                        <strong>
                          {formatSafeDate(item.exp_from, "MM/yyyy")}
                        </strong>{" "}
                        Đến:{" "}
                        <strong>
                          {" "}
                          {formatSafeDate(item.exp_to, "MM/yyyy")}
                        </strong>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <h6>Học vấn</h6>

              <div className="row small text-muted">
                {education_info?.map((item, index) => {
                  return (
                    <div key={index} className="m-2">
                      <p className="mb-1">
                        <strong>Trường:</strong> {item.school}
                      </p>
                      <p className="mb-1">
                        <strong>Chuyên ngành:</strong> {item.major}
                      </p>
                      <p className="mb-1">
                        Từ:{" "}
                        <strong>{formatSafeDate(item.from_, "MM/yyyy")}</strong>{" "}
                        Đến:{" "}
                        <strong> {formatSafeDate(item.to_, "MM/yyyy")}</strong>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <h6>Dự án</h6>

              <div className="row small text-muted">
                {project_info?.map((item, index) => {
                  return (
                    <div key={index} className="m-2">
                      <p className="fw-bold mb-1">{item.project_name}</p>
                      <div className="">
                        <p className=" mb-1">
                          Mô tả: <strong>{item.project_description}</strong>
                        </p>
                        <p>
                          Từ:{" "}
                          <strong>
                            {formatSafeDate(item.project_from, "MM/yyyy")}
                          </strong>{" "}
                          Đến:{" "}
                          <strong>
                            {formatSafeDate(item.project_to, "MM/yyyy")}
                          </strong>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <h6>Kỹ năng</h6>

              <div className="small text-muted">
                {skill_info.map((item) => (
                  <NavLink
                    key={item.skill_id}
                    to={`/post?skill_id=${item.skill_id}`}
                    className="badge bg-secondary me-2 mb-2 text-decoration-none skill-badge"
                  >
                    {item.skill_name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <h6>Ngoại ngữ</h6>

              <div className="small text-muted">
                {language_info.map((item) => (
                  <NavLink
                    key={item.language_id}
                    to={`/post?skill_id=${item.language_id}`}
                    className="badge bg-secondary me-2 mb-2 text-decoration-none skill-badge"
                  >
                    {`${item.language_name} - ${item.metric_display} `}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <h6>Chứng chỉ</h6>

              <div className="row small text-muted">
                {certification_info?.map((item, index) => {
                  return (
                    <div key={index} className="m-2">
                      <p className="mb-1">
                        <strong>Chứng chỉ:</strong> {item.certification}
                      </p>
                      <p className="mb-1">
                        <strong>Ngày cấp:</strong>{" "}
                        {formatSafeDate(item.month, "MM/yyyy")}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="col-lg-4">
          {/* Personal Info */}
          <div className="card mb-4">
            <div className="card-body">
              <h6>Thông tin cá nhân</h6>
              <p className="mb-1">
                <strong>Email:</strong>{" "}
                <a>{basic?.email || "kristisipes@gmail.com"}</a>
              </p>
              <p className="mb-1">
                <strong>Số điện thoại liên hệ:</strong>{" "}
                {basic?.phone_number || "+62 - 921 - 019 - 112"}
              </p>
              <p className="mb-1">
                <strong>Giới tính:</strong>{" "}
                {basic?.gender
                  ? basic.gender === "female"
                    ? "Nữ"
                    : "Nam"
                  : "Hidden"}
              </p>
              <p className="mb-1">
                <strong>Tình trạng hôn nhân: </strong>{" "}
                {basic?.marital_status || "Hidden"}
              </p>
              <p className="mb-1">
                <strong>Ngày sinh:</strong>{" "}
                {formatSafeDate(basic.birthday, "dd/MM/yyyy") || "Hidden"}
              </p>
              <p className="mb-1">
                <strong>Địa chỉ:</strong> {basic?.address || "Hidden"}
              </p>
            </div>
          </div>

          {/* Notes */}

          <div className="card">
            {ratingData ? (
              <Rating ratingData={ratingData} profile_id={basic?.profile_id} />
            ) : (
              <div className="card-body text-center text-muted">
                Không có dữ liệu đánh giá
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal component */}
      <InviteJobModal
        show={showInviteModal}
        onHide={() => setShowInviteModal(false)}
        onSubmit={handleInviteSubmit}
        jobList={Array.isArray(jobData) ? jobData : []}
      />
    </div>
  );
};

export default CandidateDetail;
