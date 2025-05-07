import { NavLink } from "react-router-dom";
import JobCard from "../JobCard.js";
import "./MainCategorySection.css";
import { useAddJobSavingMutation,useDeleteJobSavingMutation } from "../../../../redux_toolkit/jobseekerApi.js";
import {toast} from "react-toastify";
const RecentJobSection = ({ job }) => {
  const [addJobSaving] = useAddJobSavingMutation();
  const [deleteJobSaving] = useDeleteJobSavingMutation();
  const handleSaveJob = async (jobId) => {
    try {
      const response = await addJobSaving({job_id: jobId });
      if (response?.data?.success) {
        toast.success("Lưu việc làm thành công!");
      } else {
        console.error("Lưu việc làm thất bại!");
      }
    } catch (error) {
      console.error("Error saving job:", error);
    }
  }

  const handleRemoveSaveJob = async (jobId) => {
    try {
      const response = await deleteJobSaving({job_id: jobId });
      if (response?.data?.success) {
        toast.success("Xóa việc làm khỏi danh sách lưu thành công!");        
      } else {
        console.error("Xóa việc làm khỏi danh sách lưu thất bại!");
      }
    } catch (error) {
      console.error("Error removing saved job:", error);
    }
  }


  return (
    <div className="container my-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
        <div>
          <h3 className="fw-bold mb-2">Việc làm tốt nhất vừa cập nhật</h3>
          <p className="text-muted mb-0">
            {/* At eu lobortis pretium tincidunt amet lacus ut aenean aliquet... */}
            Bấm vào xem thêm để khám phá tất cả tin tuyển dụng 
          </p>
        </div>
        <div className="mt-3 mt-md-0">
          <NavLink
            to="/post"
            className="text-success text-decoration-underline fw-semibold"
          >
            Xem thêm
          </NavLink>
        </div>
      </div>

      <div>
        {job?.map((item, index) => {
          return <JobCard key={index} job={item} handleSaveJob = {handleSaveJob} handleRemoveSaveJob = {handleRemoveSaveJob}/>;
        })}
      </div>
    </div>
  );
};

export default RecentJobSection;
