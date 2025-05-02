import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { NavLink } from "react-router-dom";
import LoginModal from "./LoginModal.js";
import { useDispatch, useSelector } from "react-redux";

const JobCard = ({
  job,
  handleSaveJob,
  handleRemoveSaveJob,
  icon = { added: "bi bi-bookmark-fill", noneadd: "bi bi-bookmark" },
  is_hide_icon,
}) => {
  const { user } = useSelector((state) => state.auth);
  const getRelativeTimeString = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: vi });
    } catch (error) {
      console.error("Invalid date format:", error);
      return dateString; // Trả về date_post gốc nếu có lỗi
    }
  };
  const handleSaveClick = (id) => {
    if (handleSaveJob) {
      return () => handleSaveJob(id);
    }
    return () => {}; // Empty function if not provided
  };

  const handleRemoveClick = (id) => {
    if (handleRemoveSaveJob) {
      return () => handleRemoveSaveJob(id);
    }
    return () => {}; // Empty function if not provided
  };
  return (
    <div className="card mb-3 shadow-sm job-card">
      <LoginModal title="Bạn cần đăng nhập" />
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <span className="text-success small fw-semibold">
            {" "}
            {getRelativeTimeString(job?.date_post)}
          </span>
          {is_hide_icon ? (
            <i></i>
          ) : user?.role === 3 ? (
            job?.is_saved ? (
              <i
                className={icon.added}
                onClick={handleRemoveClick(job.job_id)}
              ></i>
            ) : (
              <i
                className="bi bi-bookmark"
                onClick={handleSaveClick(job.job_id)}
              ></i>
            )
          ) : (
            <i
              className="bi bi-bookmark"
              data-bs-toggle="modal"
              data-bs-target="#LoginModal"
            ></i>
          )}
        </div>
        <div className="d-flex justify-content-start">
          <div>
            <img
              src={job?.company_logo || job?.logo}
              alt="Logo"
              className="img-fluid me-2 rounded-1 me-3"
              style={{ width: 80, height: 80 }}
            />
          </div>
          <div>
            <h5 className="card-title fw-bold">
              <NavLink to={`/post-detail/${job?.job_id}`}>{job?.title}</NavLink>
            </h5>
            <p className="card-text mb-2">
              <NavLink
                to={`/company-detail/${job?.company_id || job?.employer_id}`}
                className="text-decoration-none custom-hover-3"
              >
                {job?.company_name}
              </NavLink>
            </p>
            <div className="d-flex flex-wrap gap-3 mb-2">
              <span className="badge bg-light text-dark">
                {job?.job_function_name}
              </span>
              <span className="badge bg-light text-dark">
                {job?.working_type}
              </span>
              <span className="badge bg-light text-dark">
                {job?.salary_min} - {job?.salary_max}
              </span>
              <span className="badge bg-light text-dark">
                <i className="bi bi-geo-alt-fill me-1"></i>
                {job?.work_location_name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
