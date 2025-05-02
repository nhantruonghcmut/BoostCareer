import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetLatestWorkQuery,
  useGetGeneralInfoQuery
} from "../../redux_toolkit/guestApi.js";
import { useGetJobsavingQuery} from "../../redux_toolkit/jobseekerApi.js";
// import { useGetTimeQuery } from "../../redux_toolkit/CategoryApi.js";

import HeroSection from "../../component/_component/ui/homepage/CarouselSection.js";
import RecentJobSection from "../../component/_component/ui/homepage/RecentJobSection.js";
import MainCategorySection from "../../component/_component/ui/homepage/MainCategorySection.js";
import BeOurEmployer from "../../component/_component/ui/homepage/BeOurEmployer.js";
import FounderSection from "../../component/_component/ui/homepage/OurFounder.js";

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLogin, user } = useSelector((state) => state.auth);
  const {data: generalInfo} = useGetGeneralInfoQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const { data: latestWorkResponse, isLoading, isError, error } = useGetLatestWorkQuery({paging_size:8});
  const JobCountByIndustry = generalInfo?.JobCountByIndustry || [] ;
  const {data: listsaving} = useGetJobsavingQuery( user?.id,{skip:!user  });   // const leadingCompany = generalInfo?.leadingcompany || [];
  const latestWork = latestWorkResponse?.jobs || [];
  const [processedJobs, setProcessedJobs] = useState([]);

  useEffect(() => {
    if (latestWork && latestWork.length > 0) {
      const listsavingids = listsaving?.map((item) => item.job_id) || [];
      
      // Tạo mảng mới với thuộc tính is_saved
      const updatedJobs = latestWork.map((item) => ({
        ...item,  // Sao chép tất cả thuộc tính hiện có
        is_saved: listsavingids.includes(item.job_id)
      }));
      
      setProcessedJobs(updatedJobs);
    }
  }, [latestWork, listsaving]);

  useEffect(() => {
    if (isLogin && user?.role === 2) {
      navigate("/employer-overview");
    }
  }, [dispatch]);


  if (isLoading) {
    return <div className="text-center py-4">Đang tải dữ liệu...</div>;
  }

  if (isError) {
    console.error("Error fetching latest jobs:", error);
    return <div className="text-center py-4">Không thể tải dữ liệu. Vui lòng thử lại sau.</div>;
  }

  return (
    <>
      <HeroSection generalInfo={generalInfo} />
      <RecentJobSection job={processedJobs} />
      <MainCategorySection JobCountByIndustry= {JobCountByIndustry} />
      <BeOurEmployer />
      <FounderSection />
    </>
  );
}
