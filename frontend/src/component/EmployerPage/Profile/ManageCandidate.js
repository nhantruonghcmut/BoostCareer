import React, { useEffect, useState } from "react";
import {NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {useGetListCandidateQuery, useDeleteCandidateMutation, useRateCandidateMutation} from "../../../redux_toolkit/employerApi.js";
import { differenceInYears, format, parseISO } from 'date-fns';
import {toast} from 'react-toastify';
import { vi } from 'date-fns/locale';
import "./style.css";

export default function EmployerManageCandidate() {
  const { isLogin, user } = useSelector((state) => state.auth);
  const {data: candidatesData, isLoading} = useGetListCandidateQuery() || [];
  const navigate = useNavigate();
  
  const [deleteCandidate] = useDeleteCandidateMutation();
  const [rateCandidate] = useRateCandidateMutation();
  
  // Thêm state để lưu trữ dữ liệu đã lọc
  const [filteredData, setFilteredData] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [sortOption, setSortOption] = useState("newest"); // Thêm state cho tùy chọn sắp xếp
  const [ratings, setRatings] = useState({});

  const handleRemoveCandidate = async (profile_id) => {
    try {
      const response = await deleteCandidate({jobseeker_id:profile_id }).unwrap();
      if (response?.success)
      {
        toast.success("Bỏ lưu ứng viên thành công!");
        // Cập nhật lại danh sách ứng viên sau khi từ chối
        const updatedCandidatesData = candidatesData.filter(item => item.profile_id !== profile_id);
        setFilteredData(updatedCandidatesData);
      } else {
        toast.error("Bỏ lưu ứng viên thất bại!");
      }
    }
    catch (error) {
      console.error("Error rejecting application:", error);
      toast.error("Có lỗi xảy ra khi bỏ lưu ứng viên!");
    }
  };

  // Cập nhật filteredData khi candidatesData thay đổi
  useEffect(() => {
    if (candidatesData && Array.isArray(candidatesData)) {
      // Khởi tạo ratings từ candidatesData
      const initialRatings = {};
      candidatesData.forEach(item => {
        if (item && item.profile_id) {
          initialRatings[item.profile_id] = item.score || 0;
        }
      });
      setRatings(initialRatings);
      
      // Áp dụng filter và sort
      applyFilterAndSort(candidatesData, selectedJobId, sortOption);
    }
  }, [candidatesData]);

  // Lấy danh sách các job duy nhất để hiển thị trong dropdown
  const uniqueJobs = candidatesData && Array.isArray(candidatesData)
    ? Array.from(
        new Map(
          candidatesData.map(item => item && [
            item.job_id, 
            { id: item.job_id, title: item.title }
          ])
        ).values()
      )
    : [];

  const handleRatingChange = (id, value) => {
    if (!id) return;
    
    setRatings((prev) => ({ ...prev, [id]: value }));
    
    // Tìm item dựa vào profile_id
    if (candidatesData && Array.isArray(candidatesData)) {
      const ratedItem = candidatesData.find(item => item && item.profile_id === id);
      if (ratedItem) handleRating(ratedItem, value);
    }
  };

  const handleRating = async (item, value) => {
    try {
      const type = item?.content ? "update" : "insert";
      const response = await rateCandidate({
        type: type,
        application_id: item.profile_id, 
        rating: value, 
        content: item.content || ""
      }).unwrap();
      
      if (!response.success) {
        toast.error("Đánh giá không thành công. Vui lòng thử lại sau.");
      } else {
        toast.success("Đánh giá thành công!");
        
        // Cập nhật lại danh sách sau khi đánh giá thành công
        if (candidatesData && Array.isArray(candidatesData)) {
          const updatedData = candidatesData.map(candidate => {
            if (candidate.profile_id === item.profile_id) {
              return { ...candidate, score: value };
            }
            return candidate;
          });
          
          // Áp dụng lại bộ lọc và sắp xếp
          applyFilterAndSort(updatedData, selectedJobId, sortOption);
        }
      }
    } catch (error) {
      console.error("Error rating application:", error);
      toast.error("Có lỗi xảy ra khi đánh giá ứng viên!");
    }
  };

  // Hàm áp dụng filter và sort
  const applyFilterAndSort = (data, jobId, sort) => {
    if (!data || !Array.isArray(data)) {
      setFilteredData([]);
      return;
    }

    // Áp dụng filter theo jobId
    let filtered = data;
    if (jobId) {
      filtered = data.filter(item => item && item.job_id === jobId);
    }

    // Tạo một bản sao của mảng để tránh thay đổi mảng gốc
    // Đây là cách giải quyết lỗi "Cannot assign to read only property"
    let sorted = [...filtered];
    
    // Áp dụng sort trên bản sao
    switch (sort) {
      case "newest":
        // Sử dụng cách viết không thay đổi mảng gốc
        sorted = [...sorted].sort((a, b) => {
          if (!a || !b) return 0;
          try {
            const dateA = a.create_at ? new Date(a.create_at) : new Date(0);
            const dateB = b.create_at ? new Date(b.create_at) : new Date(0);
            return dateB - dateA; // Mới nhất trước (giảm dần)
          } catch (error) {
            console.error("Error sorting dates:", error);
            return 0;
          }
        });
        break;
      case "oldest":
        sorted = [...sorted].sort((a, b) => {
          if (!a || !b) return 0;
          try {
            const dateA = a.create_at ? new Date(a.create_at) : new Date(0);
            const dateB = b.create_at ? new Date(b.create_at) : new Date(0);
            return dateA - dateB; // Cũ nhất trước (tăng dần)
          } catch (error) {
            console.error("Error sorting dates:", error);
            return 0;
          }
        });
        break;
      case "rating-high":
        sorted = [...sorted].sort((a, b) => {
          if (!a || !b) return 0;
          return (b.score || 0) - (a.score || 0);
        });
        break;
      case "rating-low":
        sorted = [...sorted].sort((a, b) => {
          if (!a || !b) return 0;
          return (a.score || 0) - (b.score || 0);
        });
        break;
      default:
        // Không cần sort
        break;
    }

    // Cập nhật state với mảng đã được lọc và sắp xếp
    setFilteredData(sorted);
  };

  // Xử lý filter khi chọn job
  const handleFilterChange = (e) => {
    const jobId = e.target.value ? parseInt(e.target.value) : "";
    setSelectedJobId(jobId);
    
    if (candidatesData && Array.isArray(candidatesData)) {
      applyFilterAndSort(candidatesData, jobId, sortOption);
    }
  };

  // Xử lý sort khi chọn tùy chọn sắp xếp
  const handleSortChange = (e) => {
    const sort = e.target.value;
    setSortOption(sort);
    
    if (candidatesData && Array.isArray(candidatesData)) {
      applyFilterAndSort(candidatesData, selectedJobId, sort);
    }
  };

  useEffect(() => {
    if (!isLogin && !(user?.role === 2)) {
      navigate("/login");
    }
  }, [isLogin, navigate, user]);

  // Hiển thị trạng thái loading
  if (isLoading) {
    return (
      <div className="bg-light rounded-2 me-2 my-2 p-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
        <p className="mt-2">Đang tải danh sách ứng viên...</p>
      </div>
    );
  }

  // Hiển thị thông báo khi không có dữ liệu
  if (!filteredData || !Array.isArray(filteredData) || filteredData.length === 0) {
    return (
      <div>
        <div className="bg-light rounded-2 me-2 my-2 p-2 d-flex justify-content-between">
          <h5 className="fw-bold">Quản lý hồ sơ ứng viên</h5>
        </div>
        <div className="bg-light rounded-2 me-2 my-2 p-4 text-center">
          <div className="alert alert-info">
            Không tìm thấy hồ sơ ứng viên nào. Vui lòng kiểm tra lại sau.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-light rounded-2 me-2 my-2 p-2 d-flex justify-content-between">
        <h5 className="fw-bold">Quản lý hồ sơ ứng viên</h5>
        <div className="d-flex gap-2">        
          {/* Filter theo ngày/score */}
          <select 
            className="form-select form-select-sm"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="newest">Lưu gần đây nhất</option>
            <option value="oldest">Lưu cũ nhất</option>
            <option value="rating-high">Đánh giá cao nhất</option>
            <option value="rating-low">Đánh giá thấp nhất</option>
          </select>
        </div>
      </div>

      <div className="bg-light rounded-2 me-2 my-2 p-2">
        <table className="table table-hover text-center">
          <thead>
            <tr>
              <th scope="col">Ảnh đại diện</th>
              <th scope="col" style={{"textAlign": "left"}}>Tên ứng viên</th>
              <th scope="col" style={{"textAlign": "left"}}>Vị trí mong muốn của ứng viên</th>
              <th scope="col">Tuổi</th>
              <th scope="col">Ngày lưu</th>
              <th scope="col">Đánh giá</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody className="align-items-center align-middle">
            {filteredData.map((item) => {
              if (!item) return null;
              
              // Tính toán tuổi một cách an toàn
              let age = '';
              if (item.birthday) {
                try {
                  age = differenceInYears(new Date(), new Date(item.birthday));
                } catch (error) {
                  console.error("Invalid date format for birthday:", item.birthday);
                  age = 'N/A';
                }
              }
              
              // Format ngày ứng tuyển một cách an toàn
              let formattedDate = '';
              if (item.create_at) {
                try {
                  formattedDate = format(parseISO(item.create_at), 'dd/MM/yyyy', { locale: vi });
                } catch (error) {
                  console.error("Invalid date format for create_at:", item.create_at);
                  formattedDate = 'N/A';
                }
              }
              
              return (
                <tr key={`${item.job_id}-${item.profile_id}`} className="align-items-center">
                  <td>
                    <img
                      src={item.avatar || "https://via.placeholder.com/80"}
                      alt="avatar"
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        objectFit: "cover"
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/80";
                      }}
                    />
                  </td>
                  <td className="text-start">
                    <NavLink to={`/candidate-detail/${item.profile_id}`}>
                      {item.full_name || "Không có tên"}
                    </NavLink>
                  </td>
                  <td className="text-start">
                    <NavLink to={`/post-detail/${item.job_id}`} style={{"textDecoration": "none", "color": "#ed8211"}}>
                      {item.title || "Không có tiêu đề"}
                    </NavLink>                  
                  </td>
                  <td>{age}</td>
                  <td>{formattedDate}</td>
                  <td>
                    <div className="star-rating animated-stars">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <React.Fragment key={star}>
                          <input
                            type="radio"
                            id={`star${star}-user${item.profile_id}`}
                            name={`rating-user${item.profile_id}`}
                            value={star}
                            checked={ratings[item.profile_id] === star}
                            onChange={() => handleRatingChange(item.profile_id, star)}
                          />
                          <label
                            htmlFor={`star${star}-user${item.profile_id}`}
                            className={`bi bi-star-fill ${
                              ratings[item.profile_id] >= star ? "active" : ""
                            }`}
                            onClick={() => handleRatingChange(item.profile_id, star)}
                          ></label>
                        </React.Fragment>
                      ))}
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleRemoveCandidate(item.profile_id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
