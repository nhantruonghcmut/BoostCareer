import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { useGetlistJobseekerQuery } from "../../../redux_toolkit/employerApi.js";
import {
  useGetJobFunctionQuery,
  useGetEducationQuery,
  useGetLevelsQuery,
  useGetLanguagesQuery,
  useGetTagsQuery,
} from "../../../redux_toolkit/CategoryApi.js";
import TitleComponent from "../../_component/ui/TitleComponent.js";
import { Range } from "react-range";

export default function CandidatesMaganePage() {
  const navigate = useNavigate();
  const { isLogin, user } = useSelector((state) => state.auth);

  // Constants for filters
  const sor_by_arr = [
    { id: 1, name: "Cập nhật gần đây nhất", value: "latest" },
    { id: 2, name: "Mức độ hoàn thiện hồ sơ", value: "complete" },
    { id: 6, name: "Điểm đánh giá", value: "rating" },
  ];

  const year_exp_arr = [
    { id: 1, name: "Dưới 1 năm", value: 0 },
    { id: 2, name: "Từ 1 đến 3 năm", value: 1 },
    { id: 3, name: "Từ 3-5 năm", value: 2 },
    { id: 4, name: "Trên 5 năm", value: 3 },
    { id: 5, name: "Trên 10 năm", value: 4 },
  ];

  // Age slider state
  const [MIN, MAX, STEP] = [18, 65, 1];
  const [values, setValues] = useState([20, 60]);

  // Filter state (doesn't trigger API calls)
  const [filterValues, setFilterValues] = useState({
    job_function_id: "",
    level_id: "",
    year_exp: "",
    age_min: values[0],
    age_max: values[1],
    gender: "",
    education_id: "",
    language_id: "",
    skill_id: "",
    sort_by: "latest",
  });

  // Query state (triggers API calls when changed)
  const [queryParams, setQueryParams] = useState({
    job_function_id: "",
    level_id: "",
    year_exp: "",
    age_min: "",
    age_max: "",
    gender: "",
    education_id: "",
    language_id: "",
    skill_id: "",
    sort_by: "latest",
    paging_size: 10,
    active_page: 1,
  });

  // Refs to track latest values
  const filterValuesRef = useRef();
  const queryParamsRef = useRef();

  // Update refs when state changes
  useEffect(() => {
    filterValuesRef.current = filterValues;
  }, [filterValues]);

  useEffect(() => {
    queryParamsRef.current = queryParams;
    console.log("queryParams đã cập nhật:", queryParams);
  }, [queryParams]);

  // Get filter data
  const { data: jobFunctions } = useGetJobFunctionQuery();
  const { data: educations } = useGetEducationQuery();
  const { data: levels } = useGetLevelsQuery();
  const { data: languages } = useGetLanguagesQuery();
  const { data: tags } = useGetTagsQuery();

  // Fetch candidates with RTK Query
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetlistJobseekerQuery(queryParams);

  const jobseekers = data?.jobseekers || [];
  const total_count = data?.total_count || 0;
  const totalPages = data?.totalPages || 0;

  useEffect(() => {
    if (!isLogin || user?.role !== 2) {
      navigate("/login");
    }
  }, [navigate, user, isLogin]);

  // Apply filters - updated to handle async
  const handleApplyFilters = () => {
    const currentFilterValues = filterValuesRef.current;

    const updatedQueryParams = {
      ...queryParamsRef.current,
      job_function_id: currentFilterValues.job_function_id || "",
      level_id: currentFilterValues.level_id || "",
      year_exp: currentFilterValues.year_exp || "",
      age_min: currentFilterValues.age_min
        ? Number(currentFilterValues.age_min)
        : "",
      age_max: currentFilterValues.age_max
        ? Number(currentFilterValues.age_max)
        : "",
      gender: currentFilterValues.gender || "",
      education_id: currentFilterValues.education_id || "",
      language_id: currentFilterValues.language_id || "",
      skill_id: currentFilterValues.skill_id || "",
      sort_by: currentFilterValues.sort_by || "latest",
      active_page: 1,
    };

    setQueryParams(updatedQueryParams);
    console.log("Đang áp dụng bộ lọc:", updatedQueryParams);
  };

  // Reset filters - updated to handle async
  const handleResetFilters = () => {
    const defaultFilters = {
      job_function_id: "",
      level_id: "",
      year_exp: "",
      age_min: MIN,
      age_max: MAX,
      gender: "",
      education_id: "",
      language_id: "",
      skill_id: "",
      sort_by: "latest",
    };

    setFilterValues(defaultFilters);
    setValues([MIN, MAX]);

    const updatedQueryParams = {
      ...defaultFilters,
      paging_size: 10,
      active_page: 1,
    };

    setQueryParams(updatedQueryParams);
    console.log("Đã reset bộ lọc:", updatedQueryParams);
  };

  // Handle sort change - updated to handle async
  const handleSortChange = (sortValue) => {
    const currentFilterValues = filterValuesRef.current;
    const currentQueryParams = queryParamsRef.current;

    // Update filter values
    setFilterValues({
      ...currentFilterValues,
      sort_by: sortValue,
    });

    // Update query params
    const updatedQueryParams = {
      ...currentQueryParams,
      sort_by: sortValue,
      active_page: 1,
    };

    setQueryParams(updatedQueryParams);
    console.log("Thay đổi sắp xếp:", updatedQueryParams);
  };

  const renderCandidates = () => {
    return (
      <div className="container">
        <div className="row">
          {jobseekers?.map((candidate, index) => (
            <div className="col-md-6 mb-4" key={index}>
              <div className="card d-flex">
                <div className="card-body">
                  <div className="me-3 d-flex">
                    <img
                      src={candidate.avatar}
                      alt={candidate.full_name}
                      className="img-fluid me-2 rounded-circle"
                      style={{ width: 150, height: 150 }}
                    />
                    <div>
                      <h5
                        className="text-truncate card-title"
                        style={{ maxWidth: "200px" }}
                      >
                        <NavLink
                          to={`/candidate-detail/${candidate.profile_id}`}
                        >
                          {candidate.full_name}
                        </NavLink>
                      </h5>
                      <p className="card-text">{candidate.title}</p>
                      <p className="text-muted">
                        {candidate.year_exp
                          ? `${candidate.year_exp} năm kinh nghiệm`
                          : "Chưa có kinh nghiệm"}
                      </p>
                      <NavLink
                        to={`/candidate-detail/${candidate.jobseeker_id}`}
                        className="btn btn-primary"
                      >
                        Chi tiết
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPagination = () => {
    if (!totalPages || totalPages <= 1) return null;

    // Calculate which page numbers to show
    let pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // If we have 5 or fewer pages, show all pages
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      // Always include first page, last page, current page and one page before and after current
      const currentPage = queryParams.active_page;

      if (currentPage <= 3) {
        // Near the start, show first 5 pages
        pages = [1, 2, 3, 4, 5, "...", totalPages];
      } else if (currentPage >= totalPages - 2) {
        // Near the end, show last 5 pages
        pages = [
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        ];
      } else {
        // In the middle, show current and surrounding pages
        pages = [
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        ];
      }
    }

    // Handle page change - updated to handle async
    const handlePageChange = (page) => {
      if (page < 1 || page > totalPages || page === "...") return;

      const currentQueryParams = queryParamsRef.current;

      const updatedQueryParams = {
        ...currentQueryParams,
        active_page: page,
      };

      setQueryParams(updatedQueryParams);

      // Scroll to top of results
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
      <nav aria-label="Page navigation" className="mt-4">
        <ul className="pagination justify-content-center">
          {/* Previous button */}
          <li
            className={`page-item ${
              queryParams.active_page <= 1 ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(queryParams.active_page - 1)}
              disabled={queryParams.active_page <= 1}
              aria-label="Previous"
            >
              <span aria-hidden="true">&laquo;</span>
            </button>
          </li>

          {/* Page numbers */}
          {pages.map((page, index) => (
            <li
              key={`page-${index}`}
              className={`page-item ${page === "..." ? "disabled" : ""} ${
                queryParams.active_page === page ? "active" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            </li>
          ))}

          {/* Next button */}
          <li
            className={`page-item ${
              queryParams.active_page >= totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(queryParams.active_page + 1)}
              disabled={queryParams.active_page >= totalPages}
              aria-label="Next"
            >
              <span aria-hidden="true">&raquo;</span>
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <>
      <TitleComponent
        title={"Danh Sách Ứng Viên"}
        description={
          "Tài năng phù hợp là tài sản quý giá nhất của mỗi doanh nghiệp."
        }
      />
      <div>
        <div className="container-fluid p-3 mt-3">
          <div className="row">
            {/* Filters sidebar */}
            <div className="col-lg-3 mb-4">
              <div className="p-3 border rounded shadow-sm bg-light">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0">Bộ lọc tìm kiếm</h6>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={handleResetFilters}
                  >
                    Đặt lại
                  </button>
                </div>

                {/* Job Function filter */}
                <h6 className="fw-bold mb-2">Ngành nghề</h6>
                <select
                  className="form-select mb-3"
                  value={filterValues.job_function_id}
                  onChange={(e) =>
                    setFilterValues({
                      ...filterValues,
                      job_function_id: e.target.value,
                    })
                  }
                >
                  <option value="">Chọn ngành nghề ứng viên</option>
                  {jobFunctions?.map((jobFunction) => (
                    <option
                      key={jobFunction.job_function_id}
                      value={jobFunction.job_function_id}
                    >
                      {jobFunction.job_function_name}
                    </option>
                  ))}
                </select>

                {/* Education filter */}
                <h6 className="fw-bold mb-2">Trình độ học vấn</h6>
                <select
                  className="form-select mb-3"
                  value={filterValues.education_id}
                  onChange={(e) =>
                    setFilterValues({
                      ...filterValues,
                      education_id: e.target.value,
                    })
                  }
                >
                  <option value="">Chọn trình độ học vấn</option>
                  {educations
                    ?.filter((option) => option.education_id > 1)
                    .map((edu) => (
                      <option key={edu.education_id} value={edu.education_id}>
                        Tối thiểu {edu.education_title}
                      </option>
                    ))}
                </select>

                {/* Years of experience filter */}
                <h6 className="fw-bold mb-2">Số năm kinh nghiệm</h6>
                <select
                  className="form-select mb-3"
                  value={filterValues.year_exp}
                  onChange={(e) =>
                    setFilterValues({
                      ...filterValues,
                      year_exp: e.target.value,
                    })
                  }
                >
                  <option value="">Tất cả kinh nghiệm</option>
                  {year_exp_arr.map((exp) => (
                    <option key={exp.id} value={exp.value}>
                      {exp.name}
                    </option>
                  ))}
                </select>
                {/* level filter */}
                <h6 className="fw-bold mb-2">Cấp bậc hiện tại</h6>
                <select
                  className="form-select mb-3"
                  value={filterValues.level_id}
                  onChange={(e) =>
                    setFilterValues({
                      ...filterValues,
                      level_id: e.target.value,
                    })
                  }
                >
                  <option value="">Tất cả cấp bậc</option>
                  {levels?.map((option) => (
                    <option value={option.level_id} key={option.level_id}>
                      {option.level_name}
                    </option>
                  ))}
                </select>
                {/* Age range filter */}
                <h6 className="fw-bold mt-3">Giới hạn khoảng tuổi</h6>
                <Range
                  step={STEP}
                  min={MIN}
                  max={MAX}
                  values={values}
                  onChange={(newValues) => {
                    setValues(newValues);
                    setFilterValues({
                      ...filterValues,
                      age_min: newValues[0],
                      age_max: newValues[1],
                    });
                  }}
                  renderTrack={({ props, children }) => (
                    <div {...props} className="custom-track">
                      <div
                        className="custom-track-filled"
                        style={{
                          left: `${((values[0] - MIN) / (MAX - MIN)) * 100}%`,
                          width: `${
                            ((values[1] - values[0]) / (MAX - MIN)) * 100
                          }%`,
                        }}
                      />
                      {children}
                    </div>
                  )}
                  renderThumb={({ props, index }) => (
                    <div {...props} className="custom-thumb">
                      <div className="thumb-tooltip">{values[index]}</div>
                    </div>
                  )}
                />

                <div className="d-flex justify-content-between mt-1 px-1 text-muted">
                  <small>
                    Từ: <strong>{values[0]}</strong> tuổi
                  </small>
                  <small>
                    Đến: <strong>{values[1]}</strong> tuổi
                  </small>
                </div>

                {/* Gender filter */}
                <h6 className="fw-bold mt-3">Giới tính</h6>
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id="gender_all"
                      value=""
                      checked={filterValues.gender === ""}
                      onChange={() =>
                        setFilterValues({ ...filterValues, gender: "" })
                      }
                    />
                    <label className="form-check-label" htmlFor="gender_all">
                      Tất cả
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id="gender_male"
                      value="male"
                      checked={filterValues.gender === "male"}
                      onChange={() =>
                        setFilterValues({ ...filterValues, gender: "male" })
                      }
                    />
                    <label className="form-check-label" htmlFor="gender_male">
                      Nam
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      id="gender_female"
                      value="female"
                      checked={filterValues.gender === "female"}
                      onChange={() =>
                        setFilterValues({ ...filterValues, gender: "female" })
                      }
                    />
                    <label className="form-check-label" htmlFor="gender_female">
                      Nữ
                    </label>
                  </div>
                </div>

                {/* Apply filters button */}
                <button
                  className="btn btn-success w-100 mt-3"
                  onClick={handleApplyFilters}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Đang tìm kiếm...
                    </>
                  ) : (
                    "Áp dụng bộ lọc"
                  )}
                </button>
              </div>
            </div>

            {/* Results column */}
            <div className="col-lg-9">
              <div>
                <h5>Danh sách ứng viên</h5>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="text-muted small">
                    {isLoading ? (
                      <span>Loading...</span>
                    ) : (
                      <>
                        Showing{" "}
                        {(queryParams.active_page - 1) *
                          queryParams.paging_size +
                          1}
                        -
                        {Math.min(
                          queryParams.active_page * queryParams.paging_size,
                          total_count
                        )}{" "}
                        of {total_count} results
                      </>
                    )}
                  </div>
                  <select
                    className="form-select form-select-sm w-auto"
                    value={queryParams.sort_by}
                    onChange={(e) => handleSortChange(e.target.value)}
                  >
                    {sor_by_arr.map((item) => (
                      <option key={item.id} value={item.value}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Candidates display */}
                {jobseekers.length === 0 ? (
                  <div className="alert alert-warning" role="alert">
                    Không có ứng viên nào phù hợp với tiêu chí tìm kiếm
                  </div>
                ) : (
                  <>
                    {/* Show loading overlay during data fetching */}
                    {isFetching && (
                      <div className="position-relative">
                        <div
                          className="position-absolute top-0 start-0 end-0 bottom-0 bg-white bg-opacity-75 d-flex justify-content-center align-items-center"
                          style={{ zIndex: 1 }}
                        >
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {renderCandidates()}

                    {/* Show pagination */}
                    {renderPagination()}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
