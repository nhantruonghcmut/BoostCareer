import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  useGetIndustriesQuery,
  useGetScalesQuery,
  useGetCitiesQuery,
  useGetBenefitsQuery,
} from "../../../redux_toolkit/CategoryApi.js";
import {
  useGetCompanyInforQuery,
  useUpdateCompanyInforMutation,
  useAddCompanyInforMutation,
  useDeleteCompanyInforMutation,
} from "../../../redux_toolkit/employerApi.js";
import CompanyBackground from "../../../component/_component/ui/employer/CompanyBackground.js";
import { toast } from "react-toastify";

export default function CompanyProfile() {
  const { isLogin, user } = useSelector((state) => state.auth);
  const id = user?.id;
  const { data: industry } = useGetIndustriesQuery();
  const { data: scale } = useGetScalesQuery();
  const { data: cities } = useGetCitiesQuery(84); // 84 for Vietnam
  const { data: benefits } = useGetBenefitsQuery();

  const { data, isLoading, refetch } = useGetCompanyInforQuery(id, {
    skip: !id // Skip query if id is undefined
  })|| {};
  
  // RTK Query mutations
  const [addCompanyInfo, { isLoading: isAdding }] =
    useAddCompanyInforMutation();
  const [updateCompanyInfo, { isLoading: isUpdating }] =
    useUpdateCompanyInforMutation();
  const [deleteCompanyInfo, { isLoading: isDeleting }] =
    useDeleteCompanyInforMutation();

  const [isAddingBenefit, setIsAddingBenefit] = useState(false);
  const [isUpdatingBenefit, setIsUpdatingBenefit] = useState(false);
  const [isDeletingBenefit, setIsDeletingBenefit] = useState(false);
  const [updateCompany, setUpdateCompany] = useState({
    company_name: "",
    phone_number: "",
    scale_id: "",
    industry_id: "",
    describle: "",
    company_location: [],
    company_benefits: [],
  });

  // New location state
  const [newLocation, setNewLocation] = useState({
    address: "",
    city_id: "",
  });

  // Edit location state
  const [editLocation, setEditLocation] = useState(null);

  // New benefit state
  const [newBenefit, setNewBenefit] = useState({
    benefit_id: "",
    benefit_value: "",
  });

  // Edit benefit state
  const [editBenefit, setEditBenefit] = useState(null);

  // Update state when company data changes
  useEffect(() => {
    if (data) {
      console.log("Company data:", data);
      setUpdateCompany({
        company_name: data.company_name || "",
        scale_id: data.scale_id || "",
        industry_id: data.industry_id || "",
        describle: data.describle || "",
        company_location: data.company_location || [],
        company_benefits: data.company_benefits || [],
      });
    }
  }, [data]);

  // Handle company profile update
  const handleupdateCompanyInfo = async () => {
    try {
      // Validate required fields
      if (
        !updateCompany.company_name ||
        !updateCompany.industry_id
      ) {
        toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
        return;
      }

      if (!data?.company_id) {
        toast.error("Không tìm thấy thông tin công ty");
        return;
      }

      const result = await updateCompanyInfo({
        type: "Basic",
        data: {
          company_id: data.company_id,
          company_name: updateCompany.company_name,
          scale_id: updateCompany.scale_id,
          industry_id: updateCompany.industry_id,
          describle: updateCompany.describle
        }
      }).unwrap();
      
      if (result?.success) {
        toast.success("Cập nhật thông tin công ty thành công");
        refetch(); // Refresh company data
      } else {
        toast.error("Cập nhật thông tin công ty thất bại");
      }
    } catch (error) {
      console.error("Failed to update company profile:", error);
      toast.error("Cập nhật thông tin công ty thất bại");
    }
  };

  // Handle adding a new location
  const handleAddLocation = async () => {
    try {
      if (!newLocation.address || !newLocation.city_id) {
        toast.error("Vui lòng nhập đầy đủ thông tin địa chỉ");
        return;
      }

      if (!data?.company_id) {
        toast.error("Không tìm thấy thông tin công ty");
        return;
      }

      const response = await addCompanyInfo({
        type: "company_location",
        data: {
          company_id: data.company_id,
          address: newLocation.address,
          city_id: newLocation.city_id,
        },
      }).unwrap();
      if (response.success) {
        setNewLocation({ address: "", city_id: "" }); // Reset form
        toast.success("Thêm địa chỉ công ty thành công");
        refetch(); // Refresh locations list
      } else {
        toast.error("Thêm địa chỉ công ty thất bại");
      }
    } catch (error) {
      console.error("Failed to add location:", error);
      toast.error("Thêm địa chỉ công ty thất bại");
    }
  };

  // Handle updating a location
  const handleUpdateLocation = async () => {
    try {
      if (!editLocation || !editLocation.address || !editLocation.city_id) {
        toast.error("Vui lòng nhập đầy đủ thông tin địa chỉ");
        return;
      }

      if (!data?.company_id) {
        toast.error("Không tìm thấy thông tin công ty");
        return;
      }

      const result = await updateCompanyInfo({
        type: "company_location",
        data: {
          company_id: data.company_id,
          location_id: editLocation.location_id,
          address: editLocation.address,
          city_id: editLocation.city_id,
        },
      }).unwrap();

      if (result.success) {
        setEditLocation(null); // Exit edit mode
        toast.success("Cập nhật địa chỉ công ty thành công");
        refetch(); // Refresh locations list
      } else {
        toast.error("Cập nhật địa chỉ công ty thất bại");
      }
    } catch (error) {
      console.error("Failed to update location:", error);
      toast.error("Cập nhật địa chỉ công ty thất bại");
    }
  };

  // Handle deleting a location
  const handleDeleteLocation = async (locationId) => {
    try {
      if (!data?.company_id) {
        toast.error("Không tìm thấy thông tin công ty");
        return;
      }

      if (window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này không?")) {
        const response = await deleteCompanyInfo({          
             id: locationId,
            type: "company_location",
            company_id: data.company_id 
        }).unwrap();
        if (response.success) {
          toast.success("Xóa địa chỉ công ty thành công");
          refetch(); // Refresh locations list
        } else {
          toast.error("Xóa địa chỉ công ty thất bại");
        }
      }
    } catch (error) {
      console.error("Failed to delete location:", error);
      toast.error("Xóa địa chỉ công ty thất bại");
    }
  };

  // Handle adding a new benefit
  const handleAddBenefit = async () => {
    try {
      if (!newBenefit.benefit_id || !newBenefit.benefit_value) {
        toast.error("Vui lòng chọn loại phúc lợi và nhập mô tả chi tiết");
        return;
      }

      if (!data?.company_id) {
        toast.error("Không tìm thấy thông tin công ty");
        return;
      }

      setIsAddingBenefit(true);
      const response = await addCompanyInfo({
        type: "company_benefit",
        data: {
          company_id: data.company_id,
          benefit_id: newBenefit.benefit_id,
          benefit_value: newBenefit.benefit_value,
        },
      }).unwrap();
      setIsAddingBenefit(false);
      if (response.success) {
        setNewBenefit({
          benefit_id: "",
          benefit_value: "",
        });
        toast.success("Thêm phúc lợi thành công");
        refetch(); // Refresh benefits list
      } else {
        toast.error("Thêm phúc lợi thất bại");
      }
    } catch (error) {
      console.error("Failed to add benefit:", error);
      toast.error("Thêm phúc lợi thất bại");
    }
  };

  // Handle updating a benefit
  const handleUpdateBenefit = async () => {
    try {
      if (!editBenefit || !editBenefit.benefit_value) {
        toast.error("Vui lòng nhập mô tả chi tiết");
        return;
      }

      if (!data?.company_id) {
        toast.error("Không tìm thấy thông tin công ty");
        return;
      }

      setIsUpdatingBenefit(true);
      const result = await updateCompanyInfo({
        type: "company_benefit",
        data: {
          company_id: data.company_id,
          benefit_id: editBenefit.benefit_id,
          benefit_value: editBenefit.benefit_value,
        },
      }).unwrap();
      setIsUpdatingBenefit(false);
      if (result.success) {
        setEditBenefit(null);
        toast.success("Cập nhật phúc lợi thành công");
        refetch(); // Refresh benefits list
      } else {
        toast.error("Cập nhật phúc lợi thất bại");
      }
    } catch (error) {
      console.error("Failed to update benefit:", error);
      toast.error("Cập nhật phúc lợi thất bại");
    }
  };

  // Handle deleting a benefit
  const handleDeleteBenefit = async (benefitId) => {
    try {
      if (!data?.company_id) {
        toast.error("Không tìm thấy thông tin công ty");
        return;
      }

      setIsDeletingBenefit(true);
      if (window.confirm("Bạn có chắc chắn muốn xóa phúc lợi này không?")) {
        const response = await deleteCompanyInfo({
          id: benefitId,
          type: "company_benefit",
          company_id: data.company_id,
        }).unwrap();
        setIsDeletingBenefit(false);
        if (response.success) {
          toast.success("Xóa phúc lợi thành công");
          refetch(); // Refresh benefits list
        } else {
          toast.error("Xóa phúc lợi thất bại");
        }
      }
    } catch (error) {
      console.error("Failed to delete benefit:", error);
      toast.error("Xóa phúc lợi thất bại");
    }
  };

  // Hiển thị trạng thái loading khi đang tải dữ liệu
  if (isLoading) {
    return (
      <div className="card shadow-sm p-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
        <p className="mt-2">Đang tải thông tin công ty...</p>
      </div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="rounded-2 me-2 my-2 p-2">
        <CompanyBackground company={data} />
      </div>

      <div className="rounded-2 me-2 my-2 p-2">
        <h5 className="mb-3 border-bottom pb-2">Thông tin công ty</h5>

        <div className="row mb-3">
          {/* Tên công ty */}
          <div className="col-md-6">
            <label className="form-label fw-bold">
              Tên công ty <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Ví dụ: Công ty TNHH HDN Teams"
              value={updateCompany.company_name}
              onChange={(e) =>
                setUpdateCompany({
                  ...updateCompany,
                  company_name: e.target.value,
                })
              }
            />
            {updateCompany.company_name === "" && (
              <div className="alert alert-danger mt-2">
                <p>Tên công ty không được để trống</p>
              </div>
            )}
          </div>

          {/* Điện thoại */}
          <div className="col-md-6">
            <label className="form-label fw-bold">
              Điện thoại <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="Ví dụ: 0981868099"
              value={updateCompany.phone_number}
              disabled={true}
              // onChange={(e) =>
              //   setUpdateCompany({
              //     ...updateCompany,
              //     phone_number: e.target.value,
              //   })
              // }
            />
            {updateCompany.phone_number === "" && (
              <div className="alert alert-danger mt-2">
                <p>Số điện thoại không được để trống</p>
              </div>
            )}
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label fw-bold">
              Lĩnh vực công ty <span className="text-danger">*</span>
            </label>
            <select
              className="form-select"
              value={updateCompany.industry_id}
              onChange={(e) => {
                setUpdateCompany({
                  ...updateCompany,
                  industry_id: e.target.value,
                });
              }}
            >
              <option value="">Chọn lĩnh vực</option>
              {industry?.map((option) => (
                <option value={option.industry_id} key={option.industry_id}>
                  {option.industry_name}
                </option>
              ))}
            </select>
            {updateCompany.industry_id === "" && (
              <div className="alert alert-danger mt-2">
                <p>Hãy chọn lĩnh vực công ty.</p>
              </div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">
              Quy mô công ty{" "}
              <span className="text-muted">(Không bắt buộc)</span>
            </label>
            <select
              className="form-select"
              value={updateCompany.scale_id}
              onChange={(e) => {
                setUpdateCompany({
                  ...updateCompany,
                  scale_id: e.target.value,
                });
              }}
            >
              <option value="">Chọn quy mô công ty</option>
              {scale?.map((option) => (
                <option value={option.scale_id} key={option.scale_id}>
                  {option.scale_min} - {option.scale_max} nhân viên
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sơ lược về công ty */}
        <div className="mb-4">
          <label className="form-label">Sơ lược về công ty</label>
          <textarea
            className="form-control"
            rows="8"
            placeholder="Sơ lược về công ty của bạn..."
            value={updateCompany.describle}
            onChange={(e) => {
              setUpdateCompany({ ...updateCompany, describle: e.target.value });
            }}
          ></textarea>
        </div>

        <div className="mb-4">
          <button
            className="btn btn-primary"
            onClick={handleupdateCompanyInfo}
            disabled={
              updateCompany.company_name !== "" &&
              updateCompany.phone_number !== "" &&
              updateCompany.industry_id !== ""
                ? false
                : true
            }
          >
            {isUpdating ? "Đang cập nhật..." : "Cập nhật thông tin công ty"}
          </button>
        </div>

        {/* Địa chỉ công ty - Managed separately */}
        <h5 className="mt-4 mb-3 border-bottom pb-2">Địa chỉ công ty</h5>

        {/* List existing locations */}
        {Array.isArray(data?.company_location) &&
        data?.company_location.length > 0 ? (
          <div className="list-group mb-3">
            {data.company_location.map((location) => (
              <div
                key={location.location_id}
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{location.address}</strong>
                  <span className="ms-2 badge bg-light text-dark">
                    {location.city_name}
                  </span>
                </div>
                <div>
                  {editLocation?.location_id === location.location_id ? (
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={handleUpdateLocation}
                        disabled={isUpdating}
                      >
                        <i className="bi bi-check-lg"></i> Lưu
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEditLocation(null)}
                      >
                        <i className="bi bi-x-lg"></i> Hủy
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => {
                          setEditLocation(location);
                        }}
                      >
                        <i className="bi bi-pencil"></i> Sửa
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => {
                          handleDeleteLocation(location.location_id);
                        }}
                        disabled={isDeleting}
                      >
                        <i className="bi bi-trash"></i> Xóa
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info">Chưa có địa chỉ nào được thêm</div>
        )}

        {/* Edit location form */}
        {editLocation && (
          <div className="card p-3 mb-3 bg-light">
            <h6>Sửa địa chỉ</h6>
            <div className="row">
              <div className="col-md-8 mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập địa chỉ chi tiết"
                  value={editLocation.address || ""}
                  onChange={(e) =>
                    setEditLocation({
                      ...editLocation,
                      address: e.target.value,
                    })
                  }
                />
              </div>
              <div className="col-md-4 mb-2">
                <select
                  className="form-select"
                  value={editLocation.city_id || ""}
                  onChange={(e) =>
                    setEditLocation({
                      ...editLocation,
                      city_id: e.target.value,
                    })
                  }
                >
                  <option value="">Chọn Tỉnh/Thành phố</option>
                  {cities?.map((city) => (
                    <option key={city.city_id} value={city.city_id}>
                      {city.city_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Add new location form */}
        <div className="card p-3 bg-light">
          <h6>Thêm địa chỉ mới</h6>
          <div className="row">
            <div className="col-md-8 mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Nhập địa chỉ chi tiết (ví dụ: 130 Sương Nguyệt Ánh, Phường Bến Thành)"
                value={newLocation?.address || ""}
                onChange={(e) =>
                  setNewLocation({ ...newLocation, address: e.target.value })
                }
              />
            </div>
            <div className="col-md-4 mb-2">
              <select
                className="form-select"
                value={newLocation?.city_id || ""}
                onChange={(e) =>
                  setNewLocation({ ...newLocation, city_id: e.target.value })
                }
              >
                <option value="">Chọn Tỉnh/Thành phố</option>
                {cities?.map((city) => (
                  <option key={city.city_id} value={city.city_id}>
                    {city.city_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <button
              className="btn btn-primary btn-sm mt-2"
              onClick={handleAddLocation}
              disabled={isAdding}
            >
              <i className="bi bi-plus-circle"></i>{" "}
              {isAdding ? "Đang thêm..." : "Thêm địa chỉ"}
            </button>
          </div>
        </div>

        {/* Company Benefits Section */}
        <h5 className="mt-4 mb-3 border-bottom pb-2">Phúc lợi công ty</h5>

        {/* List existing benefits */}
        <div className="row mb-3">
          {Array.isArray(data?.company_benefits) && 
          data?.company_benefits.length > 0 ? (
            data.company_benefits.map((benefit) => (
              <div className="col-md-4 mb-3" key={benefit.benefit_id}>
                <div className="card h-100 border">
                  <div className="card-body d-flex flex-column align-items-center text-center">
                    <div className="benefit-icon mb-2">
                      <i className={`fa ${benefit.benefit_icon} fa-lg text-primary me-3 mt-1`}
                            style={{ minWidth: "24px" }} ></i>
                    </div>
                    <h6 className="card-title">{benefit.benefit_name}</h6>
                    <p className="card-text small text-muted">
                      {benefit.benefit_value}
                    </p>
                    <div className="mt-auto d-flex gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => setEditBenefit(benefit)}
                      >
                        <i className="bi bi-pencil"></i> Sửa
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeleteBenefit(benefit.benefit_id)}
                        disabled={isDeletingBenefit}
                      >
                        <i className="bi bi-trash"></i> Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="alert alert-info">
              Chưa có phúc lợi nào được thêm
            </div>
          )}
        </div>

        {/* Edit benefit form */}
        {editBenefit && (
          <div className="card p-3 mb-3 bg-light">
            <h6>Sửa phúc lợi</h6>
            <div className="row">
              <div className="col-md-6 mb-2">
                <label className="form-label">Loại phúc lợi</label>
                <input
                  type="text"
                  className="form-control"
                  value={editBenefit.benefit_name || ""}
                  disabled={true}
                />
              </div>
              <div className="col-md-6 mb-2">
                <label className="form-label">Mô tả chi tiết</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Mô tả chi tiết"
                  value={editBenefit.benefit_value || ""}
                  onChange={(e) =>
                    setEditBenefit({
                      ...editBenefit,
                      benefit_value: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="d-flex gap-2 mt-2">
              <button
                className="btn btn-success btn-sm"
                onClick={handleUpdateBenefit}
                disabled={isUpdatingBenefit || !editBenefit.benefit_value}
              >
                <i className="bi bi-check-lg"></i> Lưu
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setEditBenefit(null)}
              >
                <i className="bi bi-x-lg"></i> Hủy
              </button>
            </div>
          </div>
        )}

        {/* Add new benefit form */}
        <div className="card p-3 bg-light">
          <h6>Thêm phúc lợi mới</h6>
          <div className="row">
            <div className="col-md-6 mb-2">
              <label className="form-label">Loại phúc lợi</label>
              <select
                className="form-select"
                value={newBenefit?.benefit_id || ""}
                onChange={(e) => {
                  const selectedBenefit = benefits?.find(
                    (b) => b.benefit_id.toString() === e.target.value
                  );
                  if (selectedBenefit) {
                    setNewBenefit({
                      benefit_id: selectedBenefit.benefit_id,
                    });
                  }
                }}
              >
                <option value="">Chọn loại phúc lợi</option>
                {benefits
                ?.filter(benefit => 
                  // Lọc các benefit chưa được thêm vào công ty
                  !data?.company_benefits?.some(
                    existingBenefit => existingBenefit.benefit_id === benefit.benefit_id
                  )
                )
                .map((benefit) => (
                  <option key={benefit.benefit_id} value={benefit.benefit_id}>
                    {benefit.benefit_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mb-2">
              <label className="form-label">Mô tả chi tiết</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ví dụ: Bảo hiểm sức khỏe toàn diện"
                value={newBenefit?.benefit_value || ""}
                onChange={(e) =>
                  setNewBenefit({
                    ...newBenefit,
                    benefit_value: e.target.value,
                  })
                }
                disabled={!newBenefit?.benefit_id}
              />
            </div>
          </div>
          <div>
            <button
              className="btn btn-primary btn-sm mt-2"
              onClick={handleAddBenefit}
              disabled={
                isAddingBenefit ||
                !newBenefit?.benefit_id ||
                !newBenefit?.benefit_value
              }
            >
              <i className="bi bi-plus-circle"></i>{" "}
              {isAddingBenefit ? "Đang thêm..." : "Thêm phúc lợi"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
