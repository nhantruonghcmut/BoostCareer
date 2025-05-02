import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useGetJobSearchQuery } from "../../../redux_toolkit/guestApi";
import { useSelector } from "react-redux";
import {
  useGetCitiesQuery,
  useGetIndustriesQuery,
  useGetJobFunctionQuery,
  useGetBenefitsQuery,
  useGetLevelsQuery,
  useGetTagsQuery,
} from "../../../redux_toolkit/CategoryApi";
import {
  useGetJobsavingQuery,
  useAddJobSavingMutation,
  useDeleteJobSavingMutation,
} from "../../../redux_toolkit/jobseekerApi.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import JobCard from "../../../component/_component/ui/JobCard.js";
import TitleComponent from "../../_component/ui/TitleComponent.js";
import { toast } from "react-toastify";

// Thêm các hàm tiện ích để chuyển đổi giữa giá trị thực và giá trị logarit
const minSalary = 5000000; // 10 triệu
const maxSalary = 200000000; // 50 triệu

// Hàm chuyển đổi từ giá trị thực sang giá trị logarit (0-100)
const salaryToSliderValue = (salary) => {
  if (salary <= minSalary) return 0;
  if (salary >= maxSalary) return 100;

  // Tính toán theo hàm logarit
  const minLog = Math.log(minSalary);
  const maxLog = Math.log(maxSalary);
  const scale = (maxLog - minLog) / 100;

  return Math.round((Math.log(salary) - minLog) / scale);
};

// Hàm chuyển đổi từ giá trị logarit (0-100) sang giá trị thực
const sliderValueToSalary = (value) => {
  if (value <= 0) return minSalary;
  if (value >= 100) return maxSalary;

  const minLog = Math.log(minSalary);
  const maxLog = Math.log(maxSalary);
  const scale = (maxLog - minLog) / 100;

  // Tính giá trị chính xác
  const exactSalary = Math.exp(minLog + scale * value);

  // Làm tròn theo bước 100.000 VNĐ (100000)
  return Math.round(exactSalary / 500000) * 500000;
};

const JobListing = () => {
  const navigate = useNavigate();
  const [addJobSaving] = useAddJobSavingMutation();
  const [deleteJobSaving] = useDeleteJobSavingMutation();

  const { isLogin, user } = useSelector((state) => state.auth);
  const { data: listsaving } = useGetJobsavingQuery(user?.id, { skip: !user });
  const { data: cata_benefit } = useGetBenefitsQuery();
  const { data: cata_level } = useGetLevelsQuery();
  const { data: cata_tag } = useGetTagsQuery();
  const [searchParams, setSearchParams] = useSearchParams();
  const titleFromUrl = searchParams.get("title");

  const initialMaxSalary = 5000000; // 20 triệu là giá trị mặc định

  const [tempFilter, setTempFilter] = useState({
    title: titleFromUrl || "",
    industry_id: "",
    job_function_id: "",
    work_location: "",
    salary_expect: "",
    level_id: "",
    working_type: "",
    skills: [],
    require_experience: "",
    active_page: 1,
    paging_size: 10,
  });

  const [filter, setFilter] = useState({
    ...tempFilter,
  });

  const [skillInput, setSkillInput] = useState("");
  const [filteredSkills, setFilteredSkills] = useState([]);

  const [sliderValue, setSliderValue] = useState(
    salaryToSliderValue(initialMaxSalary)
  );
  const [displaySalary, setDisplaySalary] = useState(initialMaxSalary);

  const applyFilters = () => {
    // Khi áp dụng bộ lọc mới, luôn đặt lại trang về 1
    setFilter({ ...tempFilter, active_page: 1 });
  };

  // Cập nhật hàm handleSkillToggle để kiểm tra giới hạn
  const handleSkillToggle = (skillId) => {
    setTempFilter((prev) => {
      const skills = [...prev.skills];
      const index = skills.indexOf(skillId);

      // Nếu kỹ năng chưa được chọn và đã đạt giới hạn 3 kỹ năng
      if (index === -1 && skills.length >= 3) {
        toast.warning("Bạn chỉ có thể chọn tối đa 3 kỹ năng!");
        return prev; // Không thêm kỹ năng mới
      }

      // Thêm hoặc xóa kỹ năng như bình thường
      if (index === -1) {
        skills.push(skillId);
      } else {
        skills.splice(index, 1);
      }

      return { ...prev, skills };
    });
  };

  // Cập nhật hàm handleSkillInputChange để kiểm tra nếu đã đạt giới hạn
  const handleSkillInputChange = (e) => {
    const value = e.target.value;
    setSkillInput(value);

    // Nếu đã đạt giới hạn kỹ năng, hiển thị thông báo và không tiếp tục tìm kiếm
    if (tempFilter.skills.length >= 3 && value.trim() !== "") {
      toast.info(
        "Bạn đã chọn tối đa 3 kỹ năng. Vui lòng xóa bớt để thêm kỹ năng mới."
      );
      setFilteredSkills([]);
      return;
    }

    if (value.trim() === "") {
      setFilteredSkills([]);
    } else {
      const filtered =
        cata_tag?.filter((skill) =>
          skill.tags_content.toLowerCase().includes(value.toLowerCase())
        ) || [];
      setFilteredSkills(filtered.slice(0, 5));
    }
  };

  const handleSalaryChange = (e) => {
    const value = parseInt(e.target.value);
    const salary = sliderValueToSalary(value);

    setSliderValue(value);
    setDisplaySalary(salary);
    setTempFilter({ ...tempFilter, salary_expect: salary });
  };

  const { data: cata_city } = useGetCitiesQuery(84);
  const { data: cata_industry } = useGetIndustriesQuery();
  const { data: cata_jobFunction } = useGetJobFunctionQuery();
  const cata_jobtype = [
    { id: 1, name: "Toàn thời gian", value: "full-time" },
    { id: 2, name: "Bán thời gian", value: "part-time" },
  ];
  // const sort_by = [
  //   "Tin mới cập nhật",
  //   "Tin được quan tâm nhất",
  //   "Mức lương cao nhất",
  // ];
  const sort_by = [{name: "Tin mới cập nhật", value: "date_post"},
    {name: "Tin được quan tâm nhất", value: "views"},
    {name: "Mức lương cao nhất", value: "salary_max"}
  ];
    


  const year_exp_arr = [
    { id: 1, name: "Dưới 1 năm", value: 0 },
    { id: 2, name: "Từ 1 đến 3 năm", value: 1 },
    { id: 3, name: "Từ 3-5 năm", value: 2 },
    { id: 4, name: "Trên 5 năm", value: 3 },
    { id: 5, name: "Trên 10 năm", value: 4 },
  ];

  const { data = {}, isLoading, error, refetch } = useGetJobSearchQuery(filter);
  const { jobs = [], totalWorksPages = 1,total_count=0 } = data || {};

  // console.log("jobs", data);
  const [processedJobs, setProcessedJobs] = useState([]);
  useEffect(() => {
    if (jobs) {
      const listsavingids = listsaving?.map((item) => item.job_id) || [];      
      const updatedJobs = jobs.map((item) => ({
        ...item,
        is_saved: listsavingids.includes(item.job_id),
      }));
      setProcessedJobs(updatedJobs);
    }
  }, [listsaving, jobs]);

  const handleSaveJob = async (jobId) => {
    try {
      const response = await addJobSaving({
        profile_id: user?.id,
        job_id: jobId,
      });
      if (response?.data?.success) {
        toast.success("Lưu việc làm thành công!");
      } else {
        console.error("Lưu việc làm thất bại!");
      }
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };
  const handleRemoveSaveJob = async (jobId) => {
    try {
      const response = await deleteJobSaving({
        profile_id: user?.id,
        job_id: jobId,
      });
      if (response?.data?.success) {
        toast.success("Xóa việc làm khỏi danh sách lưu thành công!");
      } else {
        console.error("Xóa việc làm khỏi danh sách lưu thất bại!");
      }
    } catch (error) {
      console.error("Error removing saved job:", error);
    }
  };

  useEffect(() => {
    if (user?.role === 2) {
      toast.error("Vui lòng đăng nhập vai trò người tìm việc!");
      navigate("/");
    }
  }, [navigate, user]);

  useEffect(() => {
    if (titleFromUrl) {
      setFilter((prevFilter) => ({
        ...prevFilter,
        title: titleFromUrl,
        active_page: 1,
      }));
    }
  }, [titleFromUrl]);


  

  return (
    <>
      <TitleComponent
        title={"Danh Sách Việc Làm"}
        description={"Bắt đầu hành trình sự nghiệp của bạn ngay hôm nay!"}
      />
      <div className="container-fluid p-3 mt-3">
        <div className="row">
          <div className="col-lg-3 mb-4 ">
            <div className="p-3 border rounded shadow-sm bg-light">
              <h6 className="fw-bold mb-3">Tìm kiếm theo chức danh</h6>
              <div className="input-group mb-3">
                <input
                  className="form-control"
                  placeholder="Tên công việc bạn muốn tìm kiếm"
                  value={tempFilter.title}
                  onChange={(e) =>
                    setTempFilter({
                      ...tempFilter,
                      title: e.target.value,
                    })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setFilter({ ...tempFilter, active_page: 1 });
                    }
                  }}
                />
                <button
                  className="btn btn-outline-success"
                  type="button"
                  onClick={() => setFilter({ ...tempFilter, active_page: 1 })}
                >
                  <i className="bi bi-search"></i>
                </button>
              </div>
              <h6 className="fw-bold mb-2">Tìm kiếm theo địa điểm làm việc</h6>
              <select
                className="form-select mb-3"
                onChange={(e) =>
                  setTempFilter({
                    ...tempFilter,
                    work_location: e.target.value,
                  })
                }
                value={tempFilter.work_location}
              >
                <option value="">Chọn tỉnh thành</option>
                {cata_city?.map((c) => (
                  <option key={c.city_id} value={c.city_id}>
                    {c.city_name}
                  </option>
                ))}
              </select>
              <h6 className="fw-bold mb-2">Tìm kiếm theo lĩnh vực</h6>
              <select
                className="form-select mb-3"
                onChange={(e) =>
                  setTempFilter({
                    ...tempFilter,
                    industry_id: e.target.value,
                  })
                }
                value={tempFilter.industry_id}
              >
                <option value="">Chọn lĩnh vực bạn quan tâm</option>
                {cata_industry?.map((c) => (
                  <option key={c.industry_id} value={c.industry_id}>
                    {c.industry_name}
                  </option>
                ))}
              </select>
              <h6 className="fw-bold mb-2">Tìm kiếm theo ngành nghề</h6>
              <select
                className="form-select mb-3"
                onChange={(e) =>
                  setTempFilter({
                    ...tempFilter,
                    job_function_id: e.target.value,
                  })
                }
                value={tempFilter.job_function_id}
              >
                <option value="">Chọn ngành nghề bạn quan tâm</option>
                {cata_jobFunction?.map((c) => (
                  <option key={c.job_function_id} value={c.job_function_id}>
                    {c.job_function_name}
                  </option>
                ))}
              </select>
              <h6 className="fw-bold mb-2">
                Tìm kiếm mức độ yêu cầu kinh nghiệm
              </h6>
              <select
                className="form-select mb-3"
                onChange={(e) =>
                  setTempFilter({
                    ...tempFilter,
                    require_experience: e.target.value,
                  })
                }
                value={tempFilter.require_experience}
              >
                <option value="">Chọn mức kinh nghiệm phù hợp với bạn</option>
                {year_exp_arr?.map((c) => (
                  <option key={c.id} value={c.value}>
                    {c.name}
                  </option>
                ))}
              </select>

              <h6 className="fw-bold mt-3">Hình thức công việc</h6>
              {cata_jobtype.map((type) => (
                <div className="form-check mb-2" key={type.id}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`jobtype-${type.id}`}
                    checked={tempFilter.working_type === type.value}
                    onChange={(e) => {
                      setTempFilter({
                        ...tempFilter,
                        working_type: e.target.checked ? type.value : "",
                      });
                    }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`jobtype-${type.id}`}
                  >
                    {type.name}
                  </label>
                </div>
              ))}

              <h6 className="fw-bold mt-3">Cấp bậc công việc</h6>
              <select
                className="form-select mb-3"
                onChange={(e) =>
                  setTempFilter({
                    ...tempFilter,
                    level_id: e.target.value ? parseInt(e.target.value) : "",
                  })
                }
                value={tempFilter.level_id}
              >
                <option value="">Chọn cấp bậc công việc</option>
                {cata_level?.map((level) => (
                  <option key={level.level_id} value={level.level_id}>
                    {level.level_name}
                  </option>
                ))}
              </select>

              <h6 className="fw-bold mt-3">
                Kỹ năng công việc
                <span className="text-muted fs-6 ms-2">
                  ({tempFilter.skills.length}/3)
                </span>
              </h6>
              <div className="mb-3">
                <div className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Tìm kỹ năng..."
                    value={skillInput}
                    onChange={handleSkillInputChange}
                    disabled={tempFilter.skills.length >= 3} // Disable input khi đạt giới hạn
                  />
                </div>

                {filteredSkills.length > 0 && tempFilter.skills.length < 3 && (
                  <div
                    className="border rounded p-2 mb-3"
                    style={{ maxHeight: "150px", overflowY: "auto" }}
                  >
                    {filteredSkills.map((skill) => (
                      <div
                        key={skill.tag_id}
                        className="d-flex align-items-center py-1 border-bottom cursor-pointer"
                        onClick={() => {
                          handleSkillToggle(skill.tag_id);
                          setSkillInput("");
                          setFilteredSkills([]);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <span>{skill.tags_content}</span>
                      </div>
                    ))}
                  </div>
                )}

                {tempFilter.skills.length === 3 && skillInput === "" && (
                  <div className="alert alert-info py-1 small">
                    Bạn đã chọn tối đa 3 kỹ năng. Xóa bớt để thêm kỹ năng mới.
                  </div>
                )}

                {tempFilter.skills.length > 0 && (
                  <div className="d-flex flex-wrap gap-1 mt-2">
                    {tempFilter.skills.map((skillId) => {
                      const skill = cata_tag?.find((s) => s.tag_id === skillId);
                      return (
                        <span
                          key={skillId}
                          className="badge bg-success d-flex align-items-center"
                        >
                          {skill?.tags_content}
                          <i
                            className="bi bi-x-circle ms-1"
                            onClick={() => handleSkillToggle(skillId)}
                            style={{ cursor: "pointer" }}
                          ></i>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              <h6 className="fw-bold mt-3">Mức lương mong muốn</h6>
              <div className="mb-2 position-relative">
                <input
                  type="range"
                  className="form-range mb-2"
                  min="0"
                  max="100"
                  step="1"
                  value={sliderValue}
                  onChange={handleSalaryChange}
                />
                <div className="d-flex justify-content-between small text-muted">
                  <span>{(minSalary / 1000000).toFixed(1)} triệu</span>
                  <span>{(maxSalary / 1000000).toFixed(1)} triệu</span>
                </div>

                {/* Tooltip hiển thị giá trị khi di chuyển thanh trượt - với định dạng tiền tệ */}
                <div
                  className="position-absolute bg-primary text-white px-2 py-1 rounded small"
                  style={{
                    left: `${sliderValue}%`,
                    top: "-30px",
                    transform: "translateX(-50%)",
                    zIndex: 10,
                  }}
                >
                  {(displaySalary / 1000000).toFixed(1)} triệu
                </div>
              </div>

              <button
                className="btn btn-outline-success btn-sm mt-2 w-100"
                onClick={applyFilters}
              >
                Áp dụng bộ lọc
              </button>
            </div>
          </div>

          <div className="col-lg-9">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="text-muted small">Hiển thị {Math.min(filter?.paging_size,total_count)} trên tổng số {total_count} kết quả</div>
              <select
                className="form-select form-select-sm w-auto"
                onChange={(e) => {
                  // Áp dụng ngay lập tức cả tempFilter và filter
                  const sortBy = e.target.value;
                  setTempFilter((prev) => ({ ...prev, sort_by: sortBy }));
                  setFilter((prev) => ({ ...prev, sort_by: sortBy }));
                }}
                value={filter.sort_by || ""}
              >
                {/* <option value="">Sắp xếp theo</option> */}
                {sort_by.map((sort, index) => (
                  <option key={index} value={sort.value}>
                    {sort.name}
                  </option>
                ))}
              </select>
            </div>
            {processedJobs.map((job, index) => (
              <JobCard
                job={job}
                key={index}
                handleSaveJob={handleSaveJob}
                handleRemoveSaveJob={handleRemoveSaveJob}
              />
            ))}

            <nav className="d-flex justify-content-center mt-4">
              <ul className="pagination pagination-sm">
                {/* Nút Previous/Trước */}
                <li
                  className={`page-item ${
                    filter.active_page <= 1 ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => {
                      if (filter.active_page > 1) {
                        setFilter((prev) => ({
                          ...prev,
                          active_page: prev.active_page - 1,
                        }));
                      }
                    }}
                  >
                    <i className="bi bi-chevron-left small"></i> Trước
                  </button>
                </li>

                {/* Các nút số trang */}
                {[...Array(totalWorksPages)].map((_, index) => {
                  const pageNumber = index + 1;

                  // Hiển thị trang đầu, trang cuối và các trang xung quanh trang hiện tại
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalWorksPages ||
                    (pageNumber >= filter.active_page - 1 &&
                      pageNumber <= filter.active_page + 1)
                  ) {
                    return (
                      <li
                        key={pageNumber}
                        className={`page-item ${
                          filter.active_page === pageNumber ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => {
                            const newPage = pageNumber;
                            // Chỉ cập nhật filter, không cập nhật tempFilter
                            setFilter((prev) => ({
                              ...prev,
                              active_page: newPage,
                            }));
                          }}
                        >
                          {pageNumber}
                        </button>
                      </li>
                    );
                  }

                  // Hiển thị dấu "..." khi có khoảng cách giữa các trang
                  if (
                    (pageNumber === filter.active_page - 2 && pageNumber > 1) ||
                    (pageNumber === filter.active_page + 2 &&
                      pageNumber < totalWorksPages)
                  ) {
                    return (
                      <li
                        key={`ellipsis-${pageNumber}`}
                        className="page-item disabled"
                      >
                        <button className="page-link">...</button>
                      </li>
                    );
                  }

                  return null;
                })}

                {/* Nút Next/Tiếp */}
                <li
                  className={`page-item ${
                    filter.active_page >= totalWorksPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => {
                      if (filter.active_page < totalWorksPages) {
                        setFilter((prev) => ({
                          ...prev,
                          active_page: prev.active_page + 1,
                        }));
                      }
                    }}
                  >
                    Tiếp <i className="bi bi-chevron-right small"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobListing;
