import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  useGetCitiesQuery,
  useGetLevelsQuery,
  useGetJobFunctionQuery,
  useGetNationsQuery,
  useGetEducationQuery,
} from "../../../redux_toolkit/CategoryApi.js";
import formatDate from "../../../utils/formatDate.js";
import {
  useGetItemProfileQuery,
  // useUpdateProfileMutation,
  useUpdateProfileImageMutation,
  // useUpdateExpectedJobMutation,
  useUpdateItemProfileMutation,
} from "../../../redux_toolkit/jobseekerApi.js";
import { toast } from "react-toastify";
import { validateField } from "../../../utils/validateField";

// Hàm chuyển đổi định dạng ngày tháng cho input date
const formatDateForInput = (dateString) => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; // Invalid date

    // Format as YYYY-MM-DD
    return date.toISOString().split("T")[0];
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

export default function JobSeekerProfile() {
  const navigate = useNavigate();

  const mary_dict = ["Độc thân", "Đã kết hôn"];
  const gender_dict = ["male", "female"];
  const { isLogin, user } = useSelector((state) => state.auth);
  const { data: edu } = useGetItemProfileQuery({
    type: "education"
  });
  const highestEducation = edu?.reduce((highest, current) => {
    return current.education_id > highest.education_id ? current : highest;
  }, edu[0]);

  const { data: level } = useGetLevelsQuery();
  const { data: city } = useGetCitiesQuery(84);

  const { data: job_function } = useGetJobFunctionQuery();
  const { data: nation } = useGetNationsQuery();
  console.log("job_function:", job_function);
  // Sử dụng refetchOnMountOrArgChange để đảm bảo dữ liệu luôn được refresh
  const {
    data: userInformation,
    isLoading,
    error,
    refetch,
  } = useGetItemProfileQuery(
    { type: "Basic"},
    {
      skip: !user?.id,
      refetchOnMountOrArgChange: true,
    }
  );

  // Debug API response
  console.log("UserInformation response:", userInformation);

  // const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [updateProfileImage, { isLoading: isUpdatingImage }] =
    useUpdateProfileImageMutation();
  // const [updateExpectedJobData, { isLoading: isUpdatingJob }] = useUpdateExpectedJobMutation();
  const [updateItemProfile, { isLoading: isUpdatingJob }] =
    useUpdateItemProfileMutation();

  // const [hideStatus, setHideStatus] = useState(false);

  const [expectedJob, setExpectedJob] = useState({
    city_id: "",
    salary_expect: "",
  });

  const [updateProfileData, setUpdateProfileData] = useState({
    full_name: "",
    title: "",
    year_exp: "",
    level_id: "1",
    phone_number: "",
    address: "",
    birthday: "",
    marital_status: "",
    nationality_id: "",
    job_function_id: "",
    gender: "",
  });

  const [image, setImage] = useState(null);

  //Validate form data
  const [validProfile, setValidProfile] = useState(false);
  const [errorsProfile, setErrorsProfile] = useState({
    name: "",
    title: "",
    address: "",
    expr: "",
  });
  const handleBlurProfile = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value); // Validate each field
    setErrorsProfile((prev) => ({ ...prev, [name]: error })); // Update error state
  };

  const [validExpectedJob, setValidExpectedJob] = useState(false);
  const [errorsExpectedJob, setErrorsExpectedJob] = useState({
    // city_id: "",
    expectedSalary: "",
  });
  const handleBlurExpectedJob = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value); // Validate each field
    setErrorsExpectedJob((prev) => ({ ...prev, [name]: error })); // Update error state
  };

  useEffect(() => {
    const noErrors = Object.values(errorsProfile).every((err) => err === "");
    setValidProfile(noErrors);
  }, [errorsProfile]);

  useEffect(() => {
    const noErrors = Object.values(errorsExpectedJob).every(
      (err) => err === ""
    );
    setValidExpectedJob(noErrors);
  }, [errorsExpectedJob]);

  // Kiểm tra đăng nhập
  useEffect(() => {
    if (!isLogin || user?.role !== 3) {
      navigate("/login");
    }
  }, [isLogin, user]);

  // Cập nhật form data khi có thông tin user - đảm bảo đưa cả birthday vào
  useEffect(() => {
    if (userInformation) {
      console.log("Setting form data from user information:", userInformation);

      setUpdateProfileData({
        full_name: userInformation.full_name || "",
        title: userInformation.title || "",
        year_exp: userInformation.year_exp || "",
        level_id: userInformation.level_id || "1",
        // phone_number: userInformation.phone_number || "",
        address: userInformation.address || "",
        birthday: formatDateForInput(userInformation.birthday) || "",
        gender: userInformation.gender || "",
        marital_status: userInformation.marital_status || "",
        nationality_id: userInformation.nationality_id || "",
        job_function_id: userInformation.job_function_id || "",
      });

      setExpectedJob({
        city_id: userInformation.city_id || "",
        salary_expect: userInformation.salary_expect || "",
      });
    }
  }, [userInformation]);

  // Khi cập nhật thành công, refetch data để hiển thị dữ liệu mới nhất
  const handleUpdateProfileSuccess = () => {
    refetch();
  };

  const handleUpdateExpectedJob = async () => {
    try {
      await updateItemProfile({
        type: "Basic",
        data: {
          ...expectedJob,
        },
      }).unwrap();
      toast.success("Cập nhật công việc mong muốn thành công!");
      handleUpdateProfileSuccess();
    } catch (error) {
      console.error("Update expected job error:", error);
      toast.error("Cập nhật công việc mong muốn thất bại!");
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await updateItemProfile({
        type: "Basic",
        data: {
          ...updateProfileData,
        },
      }).unwrap();
      toast.success("Cập nhật thông tin thành công!");
      handleUpdateProfileSuccess();
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error("Cập nhật thông tin thất bại!");
    }
  };

  const handleUpdateImage = async () => {
    if (!image) {
      toast.error("Vui lòng chọn ảnh!");
      return;
    }

    try {
      await updateProfileImage({
        image: image,
      }).unwrap();
      toast.success("Cập nhật ảnh đại diện thành công!");
      handleUpdateProfileSuccess();
    } catch (error) {
      console.error("Update image error:", error);
      toast.error("Cập nhật ảnh đại diện thất bại!");
    }
  };

  // Hiển thị loading state
  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "300px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Hiển thị error state
  if (error) {
    return (
      <div className="alert alert-danger">
        Lỗi khi tải dữ liệu: {error.status}{" "}
        {error.data?.message || "Unknown error"}
        <button
          className="btn btn-sm btn-outline-danger ms-2"
          onClick={refetch}
        >
          Thử lại
        </button>
      </div>
    );
  }

  // Hiển thị khi không có dữ liệu
  if (!userInformation) {
    return (
      <div className="alert alert-warning">
        Không tìm thấy thông tin người dùng!
        <button
          className="btn btn-sm btn-outline-warning ms-2"
          onClick={refetch}
        >
          Tải lại
        </button>
      </div>
    );
  }

  // Main render với dữ liệu đã có
  return (
    <div>
      {/* Modal cập nhật ảnh đại diện */}
      <div
        className="modal fade"
        id="updateImage"
        tabIndex={-1}
        aria-labelledby="modalTitle"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalTitle">
                Cập nhật ảnh đại diện
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3 d-flex justify-content-center">
                  <div className="col-md-6">
                    <label htmlFor="fileInput" className="form-label">
                      Chọn ảnh từ máy tính của bạn
                    </label>
                    <input
                      accept="image/jpeg, image/png, image/gif" // Chỉ cho phép chọn ảnh
                      id="fileInput"
                      type="file"
                      onChange={(e) => {
                        setImage(e.target.files[0]);
                      }}
                    />
                  </div>
                </div>
              </form>
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
                type="button"
                className="btn btn-primary"
                onClick={handleUpdateImage}
                disabled={isUpdatingImage} // bo sung the de khong bi click nhieu lan
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                {isUpdatingImage ? "Đang cập nhật..." : "Cập nhật"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* End */}

      <div
        className="modal fade"
        id="updateProfile"
        tabIndex={-1}
        aria-labelledby="modalTitle"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalTitle">
                Cập nhật thông tin
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <form>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="name" className="form-label">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Họ và tên"
                      className="form-control"
                      required
                      value={updateProfileData.full_name}
                      onChange={(e) => {
                        setUpdateProfileData({
                          ...updateProfileData,
                          full_name: e.target.value,
                        });
                      }}
                      onBlur={handleBlurProfile}
                    />
                    {errorsProfile.name && (
                      <div className="alert alert-danger mt-2">
                        {errorsProfile.name}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="title" className="form-label">
                      Chức danh hiện tại
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      placeholder="Chức vụ"
                      className="form-control"
                      value={updateProfileData.title}
                      onChange={(e) => {
                        setUpdateProfileData({
                          ...updateProfileData,
                          title: e.target.value,
                        });
                      }}
                      onBlur={handleBlurProfile}
                    />
                    {errorsProfile.title && (
                      <div className="alert alert-danger mt-2">
                        {errorsProfile.title}
                      </div>
                    )}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="expr" className="form-label">
                      Số năm kinh nghiệm
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      className="form-control"
                      id="expr"
                      name="expr"
                      placeholder="Nhập năm kinh nghiệm"
                      value={
                        updateProfileData.year_exp < 0
                          ? 0
                          : updateProfileData.year_exp
                      }
                      onChange={(e) =>
                        setUpdateProfileData({
                          ...updateProfileData,
                          year_exp: e.target.value,
                        })
                      }
                      onBlur={handleBlurProfile}
                    />
                    {errorsProfile.expr && (
                      <div className="alert alert-danger mt-2">
                        {errorsProfile.expr}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="field" className="form-label">
                      Cấp bậc hiện tại
                    </label>
                    <select
                      className="form-select"
                      id="field"
                      value={
                        updateProfileData.level_id
                          ? updateProfileData.level_id
                          : userInformation?.level_id
                      }
                      onChange={(e) =>
                        setUpdateProfileData({
                          ...updateProfileData,
                          level_id: e.target.value,
                        })
                      }
                    >
                      {level?.map((option) => (
                        <option value={option.level_id} key={option.level_id}>
                          {option.level_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="text"
                      id="email"
                      placeholder="Email"
                      className="form-control"
                      value={userInformation.email}
                      disabled
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="phoneNumber" className="form-label">
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      id="phoneNumber"
                      placeholder="Số điện thoại"
                      className="form-control"
                      value={
                        updateProfileData.phone_number
                          ? updateProfileData.phone_number
                          : userInformation?.phone_number
                      }
                      disabled
                    />
                  </div>
                </div>
                {/* bo sung them */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="birthday" className="form-label">
                      Ngày sinh
                    </label>
                    <input
                      value={updateProfileData.birthday || ""}
                      type="date"
                      className="form-control"
                      id="birthday"
                      placeholder="Nhập ngày tháng năm sinh"
                      min="1960-01-01"
                      onChange={(e) => {
                        console.log("Selected birthday:", e.target.value);
                        setUpdateProfileData({
                          ...updateProfileData,
                          birthday: e.target.value,
                        });
                      }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="field" className="form-label">
                      Giới tính
                    </label>
                    <select
                      className="form-select"
                      id="field"
                      value={
                        updateProfileData.gender
                          ? updateProfileData.gender
                          : userInformation?.gender
                      }
                      onChange={(e) =>
                        setUpdateProfileData({
                          ...updateProfileData,
                          gender: e.target.value,
                        })
                      }
                    >
                      {gender_dict?.map((option) => (
                        <option value={option} key={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="field" className="form-label">
                      Ngành nghề hiện tại
                    </label>
                    <select
                      className="form-select"
                      id="field_job_function"
                      value={
                        updateProfileData.job_function_id
                          ? updateProfileData.job_function_id
                          : userInformation?.job_function_id
                      }
                      onChange={(e) =>
                        setUpdateProfileData({
                          ...updateProfileData,
                          job_function_id: e.target.value,
                        })
                      }
                    >
                      {job_function?.map((option) => (
                        <option
                          value={option.job_function_id}
                          key={option.job_function_id}
                        >
                          {option.job_function_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="field" className="form-label">
                      Quốc tịch
                    </label>
                    <select
                      className="form-select"
                      id="field_nation"
                      value={
                        updateProfileData.nationality_id
                          ? updateProfileData.nationality_id
                          : userInformation?.nationality_id
                      }
                      onChange={(e) =>
                        setUpdateProfileData({
                          ...updateProfileData,
                          nationality_id: e.target.value,
                        })
                      }
                    >
                      {nation?.map((option) => (
                        <option value={option.nation_id} key={option.nation_id}>
                          {option.nation_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* ket thuc bo sung */}
                <div className="row mb-3">
                  <div className="col-md-8">
                    <label htmlFor="address" className="form-label">
                      Địa chỉ liên lạc
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      placeholder="Địa chỉ liên lạc"
                      className="form-control"
                      value={updateProfileData.address}
                      onChange={(e) => {
                        setUpdateProfileData({
                          ...updateProfileData,
                          address: e.target.value,
                        });
                      }}
                      onBlur={handleBlurProfile}
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="field" className="form-label">
                      Tình trạng hôn nhân
                    </label>
                    <select
                      className="form-select"
                      id="field_nation"
                      value={
                        updateProfileData?.marital_status
                          ? updateProfileData?.marital_status
                          : userInformation?.marital_status
                      }
                      onChange={(e) =>
                        setUpdateProfileData({
                          ...updateProfileData,
                          marital_status: e.target.value,
                        })
                      }
                    >
                      {mary_dict?.map((option) => (
                        <option value={option} key={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </form>
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
                type="button"
                className="btn btn-primary"
                onClick={handleUpdateProfile}
                disabled={isUpdatingJob || !validProfile}
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                {isUpdatingJob ? "Đang cập nhật..." : "Cập nhật"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="expectedJob"
        tabIndex={-1}
        aria-labelledby="modalTitle"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalTitle">
                Công việc mong muốn
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <form>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="city" className="form-label">
                      Nơi làm việc
                    </label>
                    <select
                      className="form-select"
                      id="city"
                      value={expectedJob.city_id}
                      onChange={(e) =>
                        setExpectedJob({
                          ...expectedJob,
                          city_id: e.target.value,
                        })
                      }
                    >
                      {city?.map((option) => (
                        <option value={option.city_id} key={option.city_id}>
                          {option.city_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="expectedSalary" className="form-label">
                    Mức lương mong muốn (VNĐ)
                  </label>
                  <input
                    type="number"
                    step="1000000"
                    min="1000000"
                    className="form-control"
                    id="expectedSalary"
                    name="expectedSalary"
                    placeholder="Nhập mức lương mong muốn"
                    value={
                      expectedJob.salary_expect < 0
                        ? 0
                        : expectedJob.salary_expect
                    }
                    onChange={(e) =>
                      setExpectedJob({
                        ...expectedJob,
                        salary_expect: e.target.value,
                      })
                    }
                    onBlur={handleBlurExpectedJob}
                  />
                  {errorsExpectedJob.expectedSalary && (
                    <div className="alert alert-danger mt-2">
                      {errorsExpectedJob.expectedSalary}
                    </div>
                  )}
                </div>
              </form>
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
                type="button"
                className="btn btn-primary"
                onClick={handleUpdateExpectedJob}
                disabled={isUpdatingJob || !validExpectedJob}
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                {isUpdatingJob ? "Đang cập nhật..." : "Cập nhật"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-light rounded-2 me-2 my-2 p-2">
        <div className="d-flex justify-content-start align-items-center mb-2">
          <h3 className="me-2">Hồ sơ của bạn</h3>
          {userInformation?.status_ === 1 ? (
            <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip>Tài khoản bạn đang hoạt động bình thường</Tooltip>
              }
            >
              <span className="text-success">
                <span
                  className="bg-success d-inline-block rounded-circle me-2"
                  style={{ width: "10px", height: "10px" }}
                ></span>
                Active
              </span>
            </OverlayTrigger>
          ) : (
            <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip>
                  Tài khoản bạn đang bị khóa, vui lòng liên hệ admin để được hỗ
                  trợ
                </Tooltip>
              }
            >
              <span className="text-danger">
                <span
                  className="bg-danger d-inline-block rounded-circle me-2"
                  style={{ width: "10px", height: "10px" }}
                ></span>
                Blocked
              </span>
            </OverlayTrigger>
          )}
        </div>
      </div>

      <div className="container">
        <div
          className="card shadow-sm"
          style={{ maxWidth: "90vw", margin: "0 auto" }}
        >
          <div className="row g-0">
            <div className="col-md-2 p-3 text-center">
              <img
                src={
                  userInformation?.avatar || "/img/default-user/user-avatar.png"
                }
                style={{ height: 120, width: 120 }}
                className="rounded-circle img-thumbnail"
                alt="ProfilePicture"
              />
              <div className="mt-2">
                <span
                  className="badge bg-success"
                  data-bs-toggle="modal"
                  data-bs-target="#updateImage"
                >
                  <i className="bi bi-camera"></i>
                </span>
              </div>
            </div>
            <div className="col-md-10">
              <div className="card-body">
                <h5 className="card-title d-flex justify-content-between align-items-center">
                  {userInformation?.full_name}
                  <button
                    className="btn btn-sm btn-outline-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#updateProfile"
                  >
                    <i className="bi bi-pencil-square" /> Edit
                  </button>
                </h5>
                <p className="card-text text-muted">
                  {/* <i className="fa fa-briefcase" /> */}
                  {userInformation?.title}
                </p>
                <div className="row">
                  <span className="col-md-6 col-sm-0">
                    <p className="lh-1 d-inline me-5">
                      {" "}
                      <strong>Lĩnh vực: </strong>
                      {userInformation?.job_function_name}
                    </p>
                  </span>

                  <span className="col-md-5 col-sm-0">
                    <p className="lh-1 d-inline">
                      {" "}
                      <strong>Cấp bậc hiện tại: </strong>
                      {userInformation?.level_name}
                    </p>
                  </span>
                </div>

                <div className="row">
                  <span className="col-md-6 col-sm-0">
                    <i className="bi bi-briefcase-fill me-2"></i>
                    {userInformation?.year_exp
                      ? `${userInformation.year_exp} năm kinh nghiệm`
                      : "Chưa có kinh nghiệm"}
                  </span>

                  <span className="col-md-5 col-sm-0">
                    <i className="bi bi-mortarboard-fill me-2"></i>
                    {highestEducation?.education_title
                      ? highestEducation.education_title
                      : "Chưa"}
                  </span>
                </div>
                <div className="row">
                  <span className="col-md-6 col-sm-0">
                    <i className="bi bi-envelope-fill me-2"></i>
                    {userInformation?.email || "Chưa cập nhật"}
                  </span>
                  <span className="col-md-5 col-sm-0">
                    <i className="bi bi-telephone-fill me-2"></i>
                    {userInformation?.phone_number
                      ? userInformation.phone_number
                      : "Chưa có số điện thoại liên lạc"}
                  </span>
                </div>
                <div className="row">
                  <span className="col-md-6 col-sm-0">
                    <i className="bi bi-house-door-fill me-2"></i>
                    {userInformation?.address
                      ? userInformation.address
                      : "Chưa có thông tin địa chỉ"}
                  </span>
                  <span className="col-md-5 col-sm-0">
                    <i className="bi bi-heart-fill me-2"></i>
                    {userInformation?.marital_status
                      ? userInformation?.marital_status
                      : "Chưa cập nhật"}
                  </span>
                </div>
                <div className="row">
                  <span className="col-md-6 col-sm-0">
                    <i className="bi bi-calendar2-date me-2"></i>
                    {userInformation?.birthday
                      ? formatDate(userInformation.birthday)
                      : "Chưa cập nhật"}
                  </span>
                  <span className="col-md-5 col-sm-0">
                    <i className="bi bi-globe me-2"></i>
                    {userInformation?.nation_name
                      ? userInformation?.nation_name
                      : "Chưa cập nhật"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-2">
        <div
          className="card shadow-sm"
          style={{ maxWidth: "90vw", margin: "0 auto" }}
        >
          <div className="card-body d-flex justify-content-between ">
            <h5 className="card-title d-flex justify-content-between align-items-center">
              Công việc mong muốn
            </h5>
            <button
              className="btn btn-sm btn-outline-primary"
              data-bs-toggle="modal"
              data-bs-target="#expectedJob"
            >
              <i className="bi bi-pencil-square " /> Edit
            </button>
          </div>

          <div className="row p-3">
            <span className="col-md-3  col-sm-0">Nơi làm việc</span>
            <span className="col-md-5 col-sm-0 fw-bold">
              {userInformation?.city_name || "Chưa xác định"}
            </span>
          </div>
          <div className="row p-3 pt-0">
            <span className="col-md-3 col-sm-0 ">
              Mức lương mong muốn (VNĐ/tháng)
            </span>
            <span className="col-md-5 col-sm-0 fw-bold">
              {userInformation.salary_expect || 0} (VNĐ/tháng)
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-2 me-2 my-2 p-2">
        <div className="container my-3">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <NavLink
                to="/jobseeker-profile"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <span className="me-3">Hồ sơ với Boost Career</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/jobseeker-profile/upload"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <span>Hồ sơ đính kèm</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
}
