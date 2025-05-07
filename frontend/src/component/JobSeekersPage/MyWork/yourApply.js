import React, { useEffect } from "react";

import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { getJobApply } from "../../../redux/actions/jobseekerAction.js";
import {
    useGetJobApplyQuery,
    useAddJobApplyMutation,
} from "../../../redux_toolkit/jobseekerApi.js";

import formatDateToDDMMYYYY from "../../../utils/formatDate.js";
import JobCard from "../../../component/_component/ui/JobCard.js";

export default function YourApply() {
  const formatNumberToTr = (number) => `${(number / 1e6).toFixed(0)}tr`;
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { data: listJobApply } = useGetJobApplyQuery();
  console.log("List job apply:", listJobApply);
  return (
    <>
      {listJobApply && listJobApply.length > 0 ? (
        <div className="col-lg-11 mt-4">
          {listJobApply.map((job, index) => (
            <>    
              <JobCard job={job} key={index} is_hide_icon = {1}/>
            </>
          ))}
        </div>
      ) : (
        "Bạn chưa ứng tuyển công việc nào"
      )}
    </>
  );
}
