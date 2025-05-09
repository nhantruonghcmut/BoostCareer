import React from "react"; //{ useEffect }

import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {     useGetJobsavingQuery, 
    useDeleteJobSavingMutation, } from "../../../redux_toolkit/jobseekerApi.js";
import formatDateToDDMMYYYY from "../../../utils/formatDate.js";
import JobCard from "../../../component/_component/ui/JobCard.js";
import { toast } from "react-toastify";
export default function SavedWork() {
  const formatNumberToTr = (number) => `${(number / 1e6).toFixed(0)} triệu vnđ`;
  const { user } = useSelector((state) => state.auth);
  const [deleteJobSaving] = useDeleteJobSavingMutation();
  const { data:listJobSave } = useGetJobsavingQuery( user?.id );
  console.log("List job save:", listJobSave);

  const handleRemoveSaveJob = async (job_id) => {
    try {
    if (user?.role === 3 && user?.id) {
      const response = await deleteJobSaving({
        profile_id: user?.id,
        job_id: job_id,
      });
      // console.log("response", response);
      if (response?.data?.success) {
        toast.success("Xóa công việc khỏi danh sách lưu thành công!");
      } else toast.error("Xóa công việc khỏi danh sách thất bại!");
    }
  }
  catch (error) {
    console.error("Error removing job from saved list:", error);
    toast.error("Đã xảy ra lỗi khi xóa công việc khỏi danh sách lưu.");
  }
};
  return (
    <>
      {listJobSave && listJobSave.length > 0 ? (
        // <div className="accordion accordion-flush" id="accordionFlushExample">
        <div className="col-lg-11 mt-4">
          {listJobSave.map((job, index) => (
            <>
              <JobCard job={job} key={index} handleRemoveSaveJob = {handleRemoveSaveJob} />
            </>
          ))}
        </div>
      ) : (
        "Bạn chưa lưu công việc nào"
      )}
    </>
  );
}
