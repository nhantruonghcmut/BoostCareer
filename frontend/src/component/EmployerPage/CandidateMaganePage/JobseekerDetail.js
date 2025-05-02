import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useGetItemProfileQuery } from "../../../redux_toolkit/jobseekerApi.js";
import TitleComponent from "../../_component/ui/TitleComponent.js";
import CandidateDetail from "../../_component/ui/DetailCandidateLayout.js";
import { useGetJobseekerDetailQuery } from "../../../redux_toolkit/employerApi.js";

export default function EmployeeDetail() {
  const navigate = useNavigate();

  const { id } = useParams();
  const { isLogin, user } = useSelector((state) => state.auth);
  const { data } = useGetJobseekerDetailQuery({
    jobseeker_id: id,
    employer_id: user?.id,
  });

  const {
    education_info = [],
    certification_info = [],
    experience_info = [],
    project_info = [],
    language_info = [],
    skill_info = [],
    cv_link,
    ratingData,
    isSaved,
    ...basic
  } = data || {};
  // console.log("data", data);

  useEffect(() => {
    if (!isLogin || user?.role !== 2) {
      navigate("/login");
    }
  }, [navigate, user, isLogin]);

  return (
    <>
      <TitleComponent
        title={"Thông Tin Ứng Viên"}
        description={
          "Tài năng phù hợp không chỉ đáp ứng nhu cầu – mà còn nâng tầm tổ chức của bạn."
        }
      />
      <CandidateDetail
        basic={basic}
        education_info={education_info}
        certification_info={certification_info}
        experience_info={experience_info}
        project_info={project_info}
        language_info={language_info}
        skill_info={skill_info}
        cv_link={cv_link}
        isSaved={isSaved}
        ratingData={ratingData}
      />
    </>
  );
}
