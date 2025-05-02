import React, { useState, useEffect } from "react"; //useEffect
import { NavLink, useNavigate } from "react-router-dom"; //Outlet
import { useSelector, useDispatch } from "react-redux";
import {
  useGetIndustriesQuery,
  useGetJobFunctionQuery,
  useGetCitiesQuery,
  useGetLanguagesQuery,
  useGetTagsQuery,
  useGetEducationQuery,
} from "../../../redux_toolkit/CategoryApi.js"; //useGetBenefitsQuery, useGetNationsQuery,useGetLevelsQuery,  useGetScalesQuery,useGetDistrictsQuery,
import { toast } from "react-toastify";
import { validateField } from "../../../utils/validateField";

import {
  useGetJobByUserQuery,
  useAddJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
} from "../../../redux_toolkit/employerApi.js";
import { is } from "date-fns/locale";

export default function EmployerPost() {
  const dispatch = useDispatch();

  const [deletePostByUser] = useDeleteJobMutation();
  const [postNewWork] = useAddJobMutation();
  const [editPostByUser] = useUpdateJobMutation();
  const { isLogin, user } = useSelector((state) => state.auth);
  const employer_id = user?.id;
  const { data: tags } = useGetTagsQuery();
  const { data: jobFunction } = useGetJobFunctionQuery();
  const { data: industry } = useGetIndustriesQuery();
  const { data: city } = useGetCitiesQuery(84);
  const { data: edu } = useGetEducationQuery();
  const { data: lang } = useGetLanguagesQuery();
  const { data } = useGetJobByUserQuery(employer_id);
  console.log("data: ", data);
  const postsByUser = data?.jobs || [];
  const [isAddPost, setIsAddPost] = useState(true);

  const [newPost, setNewPost] = useState({
    job_id: "0",
    employer_id: user?.id,
    title: "",
    date_post: new Date().toISOString(),
    industry_id: 20,
    job_function_id: 1,
    status_: 1,
    level_id: 1,
    quantity: 1,
    salary_min: 500000,
    salary_max: 1000000,
    working_type: "full-time",
    working_time: "",
    work_location: "",
    address: "",
    describle: "",
    more_requirement: "",
    require_experience: 0,
    require_age_min: 18,
    require_age_max: 18,
    require_gender: "Không yêu cầu",
    require_marital_status: "Không yêu cầu",
    require_education: 1,
    require_skill: [],
    require_language: [],
    require_certification: [],
  });

  const [skillInput, setSkillInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");

  const skillOptions = ["React", "React Native", "NodeJS", "Java", "Python"];
  const languageOptions = [
    "Tiếng Anh",
    "Tiếng Nhật",
    "Tiếng Hàn",
    "Tiếng Trung",
  ];

  const martialStatusOptions = ["Không yêu cầu", "Đã kết hôn", "Độc thân"];
  const workingTypeOptions = ["full-time", "part-time", "flexible"];

  const navigate = useNavigate();

  const handleSkillInputChange = (e) => {
    setSkillInput(e.target.value);
  };

  const handleLanguageInputChange = (e) => {
    setLanguageInput(e.target.value);
  };

  const handleAddSkill = (skill) => {
    if (!newPost.require_skill.includes(skill)) {
      setNewPost((prev) => ({
        ...prev,
        require_skill: [...prev.require_skill, skill],
      }));
    }
    setSkillInput("");
  };

  const handleAddLanguage = (language) => {
    if (!newPost.require_language.includes(language)) {
      setNewPost((prev) => ({
        ...prev,
        require_language: [...prev.require_language, language],
      }));
    }
    setLanguageInput("");
  };

  const handleRemoveSkill = (skill) => {
    setNewPost((prev) => ({
      ...prev,
      require_skill: prev.require_skill.filter((s) => s !== skill),
    }));
  };

  const handleRemoveLanguage = (language) => {
    setNewPost((prev) => ({
      ...prev,
      require_language: prev.require_language.filter((l) => l !== language),
    }));
  };

  const handleAddPost = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form

    try {
      console.log("newPost: ", newPost);
      const processedData = {
        ...newPost,
        require_skill: newPost.require_skill.map((skill) =>
          typeof skill === "object" ? skill.tag_id : skill
        ),
        require_language: newPost.require_language.map((lang) =>
          typeof lang === "object" ? lang.language_id : lang
        ),
        require_certification: newPost.require_certification || [],
      };

      console.log("Dữ liệu đã xử lý:", processedData);
      if (isAddPost) {
        const response = await postNewWork(processedData);
        if (response?.data?.success) {
          toast.success("Thêm bài đăng thành công!");
          setNewPost({
            ...newPost,
            job_id: 0,
            employer_id: user?.id,
            title: "",
            date_post: new Date().toISOString(),
            industry_id: 20,
            job_function_id: 1,
            quantity: 1,
            salary_min: 500000,
            salary_max: 1000000,
            describle: "",
            require_experience: 0,
            require_skill: [],
            require_language: [],
            require_age_min: 18,
            require_age_max: 18,
            address: "",
            work_location: 1,
            require_gender: "Không yêu cầu",
            require_marital_status: "Không yêu cầu",
            require_education: 1,
            level_id: 1,
            working_type: "full-time",
            working_time: "",
            more_requirement: "",
            require_certification: [],
          });
        } else {
          toast.error("Thêm bài đăng thất bại!");
        }
      } else {
        const response = await editPostByUser(processedData);
        if (response?.data?.success) {
          toast.success("Cập nhật  bài đăng thành công!");
          setNewPost({
            ...newPost,
            job_id: 0,
            employer_id: user?.id,
            title: "",
            date_post: new Date().toISOString(),
            industry_id: 20,
            job_function_id: 1,
            quantity: 1,
            salary_min: 500000,
            salary_max: 1000000,
            describle: "",
            require_experience: 0,
            require_skill: [],
            require_language: [],
            require_age_min: 18,
            require_age_max: 18,
            address: "",
            work_location: 1,
            require_gender: "Không yêu cầu",
            require_marital_status: "Không yêu cầu",
            require_education: 1,
            level_id: 1,
            working_type: "full-time",
            working_time: "",
            more_requirement: "",
            require_certification: [],
          });
        } else {
          toast.error("Cập nhật bài đăng thất bại!");
        }
      }
    } catch (error) {
      console.error("Error adding/updating post:", error);
      if (isAddPost) {
        toast.error("Thêm bài đăng thất bại!");
      } else {
        toast.error("Cập nhật bài đăng thất bại!");
      }
    }
  };

  const [postID, setPostID] = useState(0);

  const handleDeletePost = async () => {
    try {
      // Kiểm tra postID hợp lệ
      if (!postID) {
        toast.error("Không xác định được bài đăng cần xóa!");
        return;
      }

      console.log("Đang xóa bài đăng:", postID);

      // Gửi request xóa với tham số đúng
      const response = await deletePostByUser({
        employer_id: employer_id,
        job_id: postID, // Đảm bảo tên field khớp với API
      });

      if (response?.data?.success) {
        toast.success("Xóa bài đăng thành công!");

        // Đặt lại postID sau khi xóa thành công
        setPostID(0);
      } else {
        toast.error(`Xóa bài đăng thất bại! ${response?.data?.message || ""}`);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error(
        "Xóa bài đăng thất bại: " + (error.message || "Lỗi không xác định")
      );
    }
  };

  const handleExtendDays = async (job_id, date_expi, days) => {
    try {
      const exp_date = new Date(date_expi);
      const newExpDate = new Date(exp_date);
      newExpDate.setDate(exp_date.getDate() + days);
      const formattedDate =
        newExpDate.getFullYear() +
        "-" +
        String(newExpDate.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(newExpDate.getDate()).padStart(2, "0") +
        " " +
        String(newExpDate.getHours()).padStart(2, "0") +
        ":" +
        String(newExpDate.getMinutes()).padStart(2, "0") +
        ":" +
        String(newExpDate.getSeconds()).padStart(2, "0");
      const response = await editPostByUser({
        employer_id: employer_id,
        job_id: job_id,
        date_expi: formattedDate,
      });
      if (response?.data?.success) {
        toast.success("Cập nhật trạng thái bài đăng thành công!");
      } else {
        toast.error("Cập nhật trạng thái bài đăng thất bại!");
      }
    } catch (error) {
      console.error("Error updating post status:", error);
      toast.error("Cập nhật trạng thái bài đăng thất bại!");
    }
  };

  const handleShowHide = async (job_id, status) => {
    try {
      const response = await editPostByUser({
        employer_id: employer_id,
        job_id: job_id,
        status_: status,
      });
      if (response?.data?.success) {
        toast.success("Cập nhật trạng thái bài đăng thành công!");
      } else {
        toast.error("Cập nhật trạng thái bài đăng thất bại!");
      }
    } catch (error) {
      console.error("Error updating post status:", error);
      toast.error("Cập nhật trạng thái bài đăng thất bại!");
    }
  };

  //Validate post
  const [validPost, setValidPost] = useState(false);
  const [errorsPost, setErrorsPost] = useState({
    title: "",
    working_time: "",
    work_location: "",
    address: "",
    describle: "",
  });
  const handleBlurPost = (e) => {
    const { name, value } = e.target;
    const errorMessage = validateField(name, value);
    setErrorsPost((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };
  useEffect(() => {
    const requiredFields = [
      "title",
      "working_time",
      "work_location",
      "address",
      "describle",
    ];

    const allFieldsFilled = requiredFields.every(
      (field) => newPost[field] && newPost[field].trim() !== ""
    );

    const noErrors = Object.values(errorsPost).every((err) => err === "");

    setValidPost(allFieldsFilled && noErrors);
  }, [newPost, errorsPost]);

  useEffect(() => {
    if (!isLogin || user?.role !== 2) {
      navigate("/login");
    }
  }, [navigate, user, isLogin]);

  return (
    <>
      {/* Modal thêm bài đăng */}
      <div
        className="modal fade"
        id="addPostModal"
        tabIndex={-1}
        aria-labelledby="modalTitle"
        // aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <form onSubmit={handleAddPost}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="modalTitle">
                  Thêm Bài Đăng
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="">
                    <label htmlFor="title" className="form-label">
                      Tiêu đề bài đăng
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      name="title"
                      placeholder="Nhập tiêu đề bài đăng"
                      value={newPost.title}
                      onChange={(e) =>
                        setNewPost({ ...newPost, title: e.target.value })
                      }
                      onBlur={handleBlurPost}
                    />
                    {errorsPost.title && (
                      <div className="alert alert-danger mt-2">
                        {errorsPost.title}
                      </div>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="startYear" className="form-label">
                      Lĩnh vực*
                    </label>
                    <select
                      className="form-select"
                      id="field"
                      value={newPost.industry_id}
                      onChange={(e) =>
                        setNewPost({ ...newPost, industry_id: e.target.value })
                      }
                    >
                      {industry?.map((option) => (
                        <option
                          value={option.industry_id}
                          key={option.industry_id}
                        >
                          {option.industry_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="endYear" className="form-label">
                      Ngành nghề*
                    </label>
                    <select
                      className="form-select"
                      id="field"
                      value={newPost.job_function_id}
                      onChange={(e) =>
                        setNewPost({
                          ...newPost,
                          job_function_id: e.target.value,
                        })
                      }
                    >
                      {jobFunction?.map((option) => (
                        <option
                          value={option.job_function_id}
                          key={option.job_function_id}
                        >
                          {option.job_function_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-3">
                    <label htmlFor="endYear" className="form-label">
                      Số lượng*
                    </label>
                    <input
                      type="number"
                      className="form-control me-2"
                      placeholder="1"
                      min={1}
                      value={newPost.quantity}
                      onChange={(e) =>
                        setNewPost({ ...newPost, quantity: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-9 row">
                    <label className="form-label">Mức lương</label>
                    <div className="d-flex">
                      <input
                        type="number"
                        className="form-control me-2"
                        placeholder="Từ"
                        step={1000000}
                        min={1000000}
                        value={newPost.salary_min}
                        onChange={(e) =>
                          setNewPost({ ...newPost, salary_min: e.target.value })
                        }
                      />
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Đến"
                        step={1000000}
                        min={1000000}
                        value={newPost.salary_max}
                        onChange={(e) =>
                          setNewPost({ ...newPost, salary_max: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="describle" className="form-label">
                    Mô tả công việc
                  </label>
                  <textarea
                    className="form-control"
                    id="describle"
                    name="describle"
                    rows={3}
                    placeholder="Nhập mô tả công việc"
                    value={newPost.describle.replace(/%00endl/g, "\n")}
                    onChange={(e) =>
                      setNewPost({
                        ...newPost,
                        describle: e.target.value.replace(/\n/g, "%00endl"),
                      })
                    }
                    onBlur={handleBlurPost}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault(); // Ngăn textarea xuống dòng

                        const textarea = e.target;
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;

                        setNewPost((prev) => {
                          const currentValue = prev.describle || "";
                          const newValue =
                            currentValue.slice(0, start) +
                            "%00endl" +
                            currentValue.slice(end);

                          // Cập nhật lại vị trí con trỏ sau render
                          setTimeout(() => {
                            textarea.selectionStart = textarea.selectionEnd =
                              start + "%00endl".length;
                          }, 0);

                          return {
                            ...prev,
                            describle: newValue,
                          };
                        });
                      }
                    }}
                  />
                  {errorsPost.describle && (
                    <div className="alert alert-danger mt-2">
                      {errorsPost.describle}
                    </div>
                  )}
                </div>

                <div className="row">
                  <label htmlFor="benefits" className="form-label">
                    Yêu cầu công việc
                  </label>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="startYear" className="form-label">
                      Kinh nghiệm*
                    </label>
                    <input
                      type="number"
                      className="form-control me-2"
                      placeholder="Năm kinh nghiệm"
                      step={1}
                      min={0}
                      value={newPost.require_experience}
                      onChange={(e) =>
                        setNewPost({
                          ...newPost,
                          require_experience: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="endYear" className="form-label">
                      Trình độ học vấn*
                    </label>
                    <select
                      className="form-select"
                      id="field"
                      value={newPost.require_education}
                      onChange={(e) =>
                        setNewPost({
                          ...newPost,
                          require_education: e.target.value,
                        })
                      }
                    >
                      {edu?.map((option) => (
                        <option
                          value={option.education_id}
                          key={option.education_id}
                        >
                          {option.education_title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="">
                    <label htmlFor="postTitle" className="form-label">
                      Kỹ năng
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="postTitle"
                      placeholder="Nhập kỹ năng"
                      value={skillInput}
                      onChange={handleSkillInputChange}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          skillOptions.includes(skillInput)
                        ) {
                          e.preventDefault();
                          handleAddSkill(skillInput);
                        }
                      }}
                    />
                  </div>
                  <ul className="list-group">
                    {tags
                      ?.filter((skill) =>
                        skill.tags_content
                          .toLowerCase()
                          .includes(skillInput.toLowerCase())
                      )
                      .map((skill) => (
                        <>
                          {skillInput !== "" && (
                            <li
                              key={skill.tag_id}
                              className="list-group-item list-group-item-action ms-2 mr-2"
                              onClick={() => handleAddSkill(skill)}
                            >
                              {skill.tags_content}
                            </li>
                          )}
                        </>
                      ))}
                  </ul>
                  <div className="mt-2">
                    {newPost.require_skill.map((skill) => (
                      <span
                        key={skill.tag_id}
                        className="badge bg-primary me-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        {skill.tags_content}{" "}
                        <span className="ms-1">&times;</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="">
                    <label htmlFor="postTitle" className="form-label">
                      Ngôn ngữ
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="postTitle"
                      placeholder="Nhập yêu cầu khác"
                      value={languageInput}
                      onChange={handleLanguageInputChange}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          languageOptions.includes(languageInput)
                        ) {
                          e.preventDefault();
                          handleAddLanguage(languageInput);
                        }
                      }}
                    />
                  </div>
                  <ul className="list-group">
                    {lang
                      ?.filter((language) =>
                        language.metric_display
                          .toLowerCase()
                          .includes(languageInput.toLowerCase())
                      )
                      .map((language) => (
                        <>
                          {languageInput !== "" && (
                            <li
                              key={language.language_id}
                              className="list-group-item list-group-item-action ms-2 mr-2"
                              onClick={() => handleAddLanguage(language)}
                            >
                              {language.metric_display}
                            </li>
                          )}
                        </>
                      ))}
                  </ul>
                  <div className="mt-2">
                    {newPost.require_language.map((language) => (
                      <span
                        key={language.language_id}
                        className="badge bg-primary me-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleRemoveLanguage(language)}
                      >
                        {language.metric_display}{" "}
                        <span className="ms-1">&times;</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="startYear" className="form-label">
                      Độ tuổi
                    </label>
                    <div className="d-flex">
                      <input
                        type="number"
                        className="form-control me-2"
                        placeholder="Từ"
                        min={18}
                        value={newPost?.require_age_min}
                        onChange={(e) =>
                          setNewPost({
                            ...newPost,
                            require_age_min: e.target.value,
                          })
                        }
                      />
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Đến"
                        min={18}
                        value={newPost?.require_age_max}
                        onChange={(e) =>
                          setNewPost({
                            ...newPost,
                            require_age_max: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="endYear" className="form-label">
                      Giới tính
                    </label>
                    <select
                      className="form-select"
                      id="field"
                      selected={newPost?.require_gender}
                      onChange={(e) =>
                        setNewPost({
                          ...newPost,
                          require_gender: e.target.value,
                        })
                      }
                    >
                      <option value="Không yêu cầu" selected>
                        Không yêu cầu
                      </option>
                      <option value="nam">Nam</option>
                      <option value="nữ">Nữ</option>
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="startYear" className="form-label">
                      Tình trạng hôn nhân
                    </label>
                    <select
                      className="form-select"
                      id="field"
                      selected={newPost?.require_marital_status}
                      onChange={(e) =>
                        setNewPost({
                          ...newPost,
                          require_marital_status: e.target.value,
                        })
                      }
                    >
                      {martialStatusOptions.map((option) => (
                        <option value={option} key={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="endYear" className="form-label">
                      Loại hình làm việc
                    </label>
                    <select
                      className="form-select"
                      id="field"
                      selected={newPost?.working_type}
                      onChange={(e) =>
                        setNewPost({ ...newPost, working_type: e.target.value })
                      }
                    >
                      {workingTypeOptions.map((option) => (
                        <option value={option} key={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="">
                    <label htmlFor="working_time" className="form-label">
                      Thời gian làm việc
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="working_time"
                      name="working_time"
                      placeholder="Nhập thời gian làm việc"
                      value={newPost?.working_time}
                      onChange={(e) =>
                        setNewPost({ ...newPost, working_time: e.target.value })
                      }
                      onBlur={handleBlurPost}
                    />
                    {errorsPost.working_time && (
                      <div className="alert alert-danger mt-2">
                        {errorsPost.working_time}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="work_location" className="form-label">
                    Khu vực làm việc*
                  </label>
                  <select
                    className="form-select"
                    id="work_location"
                    name="work_location"
                    value={newPost.work_location || ""}
                    selected={newPost?.work_location}
                    onChange={(e) => {
                      setNewPost({ ...newPost, work_location: e.target.value });
                      handleBlurPost(e);
                    }}
                    required
                  >
                    <option value="" disabled>
                      Chọn địa điểm
                    </option>
                    {city?.map((option) => (
                      <option value={option.city_id} key={option.city_id}>
                        {option.city_name}
                      </option>
                    ))}
                  </select>
                  {newPost.work_location === "" && (
                    <div className="alert alert-danger mt-2">
                      <p>Vui lòng chọn khu vực làm việc.</p>
                    </div>
                  )}
                </div>

                <div className="row mb-3">
                  <div className="">
                    <label htmlFor="address" className="form-label">
                      Địa điểm làm việc
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      name="address"
                      placeholder="Nhập Địa điểm làm việc"
                      value={newPost.address}
                      onChange={(e) =>
                        setNewPost({ ...newPost, address: e.target.value })
                      }
                      onBlur={handleBlurPost}
                    />
                    {errorsPost.address && (
                      <div className="alert alert-danger mt-2">
                        {errorsPost.address}
                      </div>
                    )}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="">
                    <label htmlFor="more_requirement" className="form-label">
                      Yêu cầu khác
                    </label>
                    <textarea
                      rows={3}
                      type="text"
                      className="form-control"
                      id="more_requirement"
                      name="more_requirement"
                      placeholder="Nhập yêu cầu khác nếu có"
                      value={newPost.more_requirement.replace(/%00endl/g, "\n")}
                      onChange={(e) =>
                        setNewPost({
                          ...newPost,
                          more_requirement: e.target.value.replace(
                            /\n/g,
                            "%00endl"
                          ),
                        })
                      }
                      // onBlur={handleBlurPost}
                      // onKeyDown={(e) => {
                      //   if (e.key === "Enter") {
                      //     e.preventDefault(); // Ngăn không cho xuống dòng (đối với textarea) hoặc submit form
                      //     setNewPost((prev) => ({
                      //       ...prev,
                      //       more_requirement: prev.more_requirement + "%00endl",
                      //     }));
                      //   }
                      // }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault(); // Ngăn không cho xuống dòng

                          const textarea = e.target;
                          const start = textarea.selectionStart;
                          const end = textarea.selectionEnd;

                          setNewPost((prev) => {
                            const currentValue = prev.more_requirement || "";
                            const newValue =
                              currentValue.slice(0, start) +
                              "%00endl" +
                              currentValue.slice(end);

                            // Cập nhật lại vị trí con trỏ sau khi render
                            setTimeout(() => {
                              textarea.selectionStart = textarea.selectionEnd =
                                start + "%00endl".length;
                            }, 0);

                            return {
                              ...prev,
                              more_requirement: newValue,
                            };
                          });
                        }
                      }}
                    />
                    {/* {errorsPost.more_requirement && (
                      <div className="alert alert-danger mt-2">
                        {errorsPost.more_requirement}
                      </div>
                    )} */}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  // onClick={handleAddPost}
                  disabled={!validPost}
                >
                  {isAddPost === true ? "Đăng bài" : "Cập nhật bài đăng"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* End modal thêm bài đăng */}

      {/* Modal delete */}
      <div
        className="modal fade"
        id="confirmDeletePostModal"
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
                onClick={handleDeletePost}
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

      <div>
        <div className="bg-light rounded-2 me-2 my-2 p-2">
          <h3>Quản lý tin tuyển dụng</h3>
        </div>

        <button
          className="btn btn-success float-end me-3 my-2"
          data-bs-toggle="modal"
          data-bs-target="#addPostModal"
          onClick={() => {
            setIsAddPost(true);
            setNewPost({
              job_id: "0",
              employer_id: user?.id,
              title: "",
              date_post: new Date().toISOString(),
              industry_id: 20,
              job_function_id: 1,
              status_: 1,
              level_id: 1,
              quantity: 1,
              salary_min: 500000,
              salary_max: 1000000,
              working_type: "full-time",
              working_time: "",
              work_location: "",
              address: "",
              describle: "",
              more_requirement: "",
              require_experience: 0,
              require_age_min: 18,
              require_age_max: 18,
              require_gender: "Không yêu cầu",
              require_marital_status: "Không yêu cầu",
              require_education: 1,
              require_skill: [],
              require_language: [],
              require_certification: [],
            });
          }}
        >
          + Đăng tin tuyển dụng
        </button>

        <div className="bg-light rounded-2 me-2 my-2 p-2">
          <table className="table table-hover text-center">
            <thead>
              <tr>
                <th scope="col">Bài đăng</th>
                <th scope="col">Hình thức</th>
                <th scope="col">Số lượng</th>
                <th scope="col">Ngày đăng</th>
                <th scope="col">Ngày hết hạn</th>
                <th scope="col"></th>
                <th scope="col"></th>
                <th scope="col"></th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {postsByUser?.map((post) => (
                <tr key={post.job_id}>
                  <td className="text-start">
                    <NavLink to={`/post-detail/${post.job_id}`}>
                      {post.title}
                    </NavLink>
                  </td>
                  <td>{post.working_type}</td>
                  <td>{post.quantity}</td>
                  <td>{new Date(post.date_post).toLocaleDateString()}</td>
                  <td>{new Date(post.date_expi).toLocaleDateString()}</td>
                  <td
                    data-bs-toggle="modal"
                    data-bs-target="#addPostModal"
                    onClick={() => {
                      setNewPost({
                        ...newPost,
                        job_id: post.job_id,
                        title: post.title,
                        industry_id: post.industry_id,
                        job_function_id: post.job_function_id,
                        quantity: post.quantity,
                        salary_min: post.salary_min,
                        salary_max: post.salary_max,
                        describle: post.describle,
                        require_experience: post.require_experience,
                        // require_skill: post.require_skill,
                        // require_language: post.require_language,
                        require_age_min: post.require_age_min,
                        require_age_max: post.require_age_max,
                        address: post.address,
                        work_location: post.city_id,
                      });
                      setIsAddPost(false);
                    }}
                  >
                    <p className="text-primary custom-hover-3">Sửa</p>
                  </td>
                  <td>
                    {/* <p className="text-primary">Gia hạn</p> */}
                    <div className="dropdown">
                      <div
                        className="text-primary custom-hover-3"
                        role="button"
                        id="dropdownMenuLink"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Gia hạn
                      </div>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuLink"
                      >
                        <li>
                          <p
                            className="dropdown-item"
                            onClick={() =>
                              handleExtendDays(post.job_id, post.date_expi, 7)
                            }
                          >
                            7 ngày
                          </p>
                        </li>
                        <li>
                          <p
                            className="dropdown-item"
                            onClick={() =>
                              handleExtendDays(post.job_id, post.date_expi, 14)
                            }
                          >
                            14 ngày
                          </p>
                        </li>
                        <li>
                          <p
                            className="dropdown-item"
                            onClick={() =>
                              handleExtendDays(post.job_id, post.date_expi, 30)
                            }
                          >
                            30 ngày
                          </p>
                        </li>
                      </ul>
                    </div>
                  </td>
                  <td>
                    <p className="text-secondary custom-hover-3">
                      {post?.status_ === 1 ? (
                        <span
                          onClick={() => handleShowHide(post.job_id, false)}
                        >
                          <i className="bi bi-eye-fill"></i> Hiện
                        </span>
                      ) : (
                        <span onClick={() => handleShowHide(post.job_id, true)}>
                          <i className="bi bi-eye-slash-fill"></i> Ẩn
                        </span>
                      )}
                    </p>
                  </td>
                  <td>
                    <p
                      className="text-danger custom-hover-3"
                      data-bs-toggle="modal"
                      data-bs-target="#confirmDeletePostModal"
                      onClick={() => {
                        // console.log("postID", post.job_id);
                        setPostID(post.job_id);
                      }}
                    >
                      Xóa
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
