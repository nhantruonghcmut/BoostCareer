import React, { useEffect, useState } from "react";
import {NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {useGetListInvitationQuery, useDeleteInvitationMutation, useRateCandidateMutation} from "../../../redux_toolkit/employerApi.js";
import { differenceInYears, format, parseISO } from 'date-fns';
import {toast} from 'react-toastify';
import { vi } from 'date-fns/locale';
import "./style.css";

export default function EmployerManageInvitation() {
  const { isLogin, user } = useSelector((state) => state.auth);
  const {data: candidatesData, isLoading} = useGetListInvitationQuery( {},{ skip: !user?.id } ) || [];
  console.log("candidatesData", candidatesData);
  const navigate = useNavigate();
  
  const [deleteInvitation] = useDeleteInvitationMutation();
  const [rateCandidate] = useRateCandidateMutation();
  const handleRemoveInvitation = async (invitation) => {
    try {
      const response = await deleteInvitation({ jobseeker_id:invitation.profile_id, job_id: invitation.job_id }).unwrap();
      if (response?.success)
      {
        toast.success("Xóa bỏ lời mời thành công!");
        // Cập nhật lại danh sách ứng viên sau khi từ chối
        const updatedCandidatesData = candidatesData.filter(item => item.profile_id !== invitation.profile_id);
        setFilteredData(updatedCandidatesData);
      } else {
        toast.error("Xóa bỏ lời mờithất bại!");
      }
    }
    catch (error) {
      console.error("Error rejecting application:", error);
      toast.error("Có lỗi xảy ra khi xóa bỏ lời mời!");
    }
  };
  // Thêm state để lưu trữ dữ liệu đã lọc
  const [filteredData, setFilteredData] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [ratings, setRatings] = useState({});

  // Cập nhật filteredData khi candidatesData thay đổi
  useEffect(() => {
    if (candidatesData && Array.isArray(candidatesData)) {
      setFilteredData(candidatesData);
      
      // Khởi tạo ratings từ candidatesData
      const initialRatings = {};
      candidatesData.forEach(item => {
        if (item && item.profile_id) {
          initialRatings[item.profile_id] = item.score || 0;
        }
      });
      setRatings(initialRatings);
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
      console.log("Rating updated for:", item, "with value:", value);
      const type = item?.content ? "update" : "insert";
        const response = await rateCandidate({
        type: type,
        application_id:item.profile_id, 
        rating:value, 
        content:item.content || ""}
      ).unwrap(); // Gọi API để đánh giá ứng viên
      if (!response.success) {
        toast.error("Đánh giá không thành công. Vui lòng thử lại sau.");
      } else {
        toast.success("Đánh giá thành công!");
      }

    } catch (error) {
      console.error("Error rating application:", error);
      toast.error("Có lỗi xảy ra khi đánh giá ứng viên!");
    }
  };

  // Xử lý filter khi chọn job
  const handleFilterChange = (e) => {
    const jobId = e.target.value ? parseInt(e.target.value) : "";
    setSelectedJobId(jobId);
    
    if (!candidatesData || !Array.isArray(candidatesData)) {
      setFilteredData([]);
      return;
    }
    
    if (jobId === "") {
      setFilteredData(candidatesData); // Hiển thị tất cả
    } else {
      const filtered = candidatesData.filter(item => item && item.job_id === jobId);
      setFilteredData(filtered);
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
        <div>
          <select 
            className="form-select form-select-sm w-auto"
            value={selectedJobId}
            onChange={handleFilterChange}
          >
            <option value="">Tất cả vị trí</option>
            {uniqueJobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-light rounded-2 me-2 my-2 p-2">
        <table className="table table-hover text-center">
          <thead>
            <tr>
              <th scope="col">Ảnh đại diện</th>
              <th scope="col" style={{"textAlign": "left"}}>Tên ứng viên</th>
              <th scope="col" style={{"textAlign": "left"}}>Vị trí mời ứng tuyển</th>
              <th scope="col">Tuổi</th>
              <th scope="col">Ngày mời</th>
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
                      onClick={() => handleRemoveInvitation(item)}
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
