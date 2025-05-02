import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGetItemProfileQuery } from "../../../redux_toolkit/jobseekerApi.js";
import SkillsContainer from "../../../component/_component/ui/jobseeker/PercentContainer.js";
import LineChartComponent from "../../../component/_component/ui/LineChart.js";
import {
  useGetOverviewMutation,
  useGetJobsSuggestionQuery,
} from "../../../redux_toolkit/jobseekerApi.js";
import { format } from "date-fns";

export default function JobSeekerOverview() {
  // const dispatch = useDispatch();
  const { isLogin, user } = useSelector((state) => state.auth);
  const [days, setDays] = useState(7);
  const [endDate] = useState(new Date());
  const [getOverviewData] = useGetOverviewMutation();
  //****** * tạm thời chưa gợi ý job cho jobseeker (vì trước đó cũng chưa có làm)
  const navigate = useNavigate();

  // Khởi tạo states cho dữ liệu biểu đồ
  const [rangeLabel, setRangeLabel] = useState(null);
  const [labelTitle, setLabelTitle] = useState([]); //["Việc làm đã ứng tuyển", "Lượt xem hồ sơ", "Lượt lưu hồ sơ"];
  const [overviewData, setOverviewData] = useState(null);
  const [dataValue, setDataValue] = useState(null);

  const renderSuitableWork = () => {
    if (!Array.isArray(suitablePosts)) {
      console.error("suitablePosts không phải là mảng:", suitablePosts);
      return (
        <div className="alert alert-warning w-100">
          Có lỗi khi hiển thị dữ liệu
        </div>
      );
    }

    return suitablePosts.map((work, index) => {
      if (!work) return null; // Bỏ qua các phần tử null/undefined

      return (
        <div
          key={work.job_id || index}
          className="card mb-3 col-lg-3 col-sm-10 m-2"
          style={{ maxWidth: 540 }}
        >
          <div className="row g-0">
            <div className="col-md-4 align-self-center">
              <img
                src={work.company_logo || "https://via.placeholder.com/150"}
                className="img-fluid rounded-2"
                alt="Company logo"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/150";
                }}
              />
            </div>
            <div className="col-md-8">
              <div className="card-body">
                <NavLink
                  to={`/post-detail/${work.job_id}`}
                  className="text-decoration-none"
                >
                  <h5 className="card-title text-truncate">
                    {work.title || "Không có tiêu đề"}
                  </h5>
                </NavLink>
                <div
                  className="card-text"
                  style={{ padding: "0px !important" }}
                >
                  <p className="text-truncate">
                    {work.company_name || "Không có tên công ty"}
                  </p>
                  <p className="text-truncate text-danger">
                    {work.salary_min && work.salary_max
                      ? `${formatNumberToTr(
                          work.salary_min
                        )}-${formatNumberToTr(work.salary_max)} đ/tháng`
                      : "Thương lượng"}
                  </p>
                  <p className="card-text text-truncate">
                    {work.work_location_name || "Không có địa điểm"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  // Hàm xử lý khoảng thời gian cho biểu đồ
  const handleChangeChartTime = () => {
    console.log("handleChangeChartTime with days:", days);
    const dateRange = [];

    // Xác định bước nhảy theo số ngày đã chọn
    let step;
    if (days === 7) {
      step = 1;
    } else if (days === 14 || days === 30) {
      step = Math.floor(days / 5);
    } else {
      step = Math.floor(days / 5); // fallback
    }

    // Lấy 5 mốc thời gian, từ hiện tại lùi về trước
    for (let i = 4; i >= 0; i--) {
      const date = new Date(endDate);
      date.setDate(endDate.getDate() - i * step);
      dateRange.push(format(date, "dd/MM/yyyy"));
    }

    setRangeLabel(dateRange);
  };

  const getDataOverview = async () => {
    try {
      if (rangeLabel) {
        const response = await getOverviewData({
          profile_id: user?.id,
          days: rangeLabel,
        }).unwrap();
        console.log("Overview data:", response);
        setOverviewData(response);
      }
    } catch (error) {
      console.error("Error fetching overview data:", error);
    }
  };

  const { data: listjob, isLoading: isLoadingSuitable } =
    useGetJobsSuggestionQuery(
      { profile_id: user?.id },
      {
        skip: !user?.id,
      }
    );
  const suitablePosts = listjob?.jobs || []; // Giả sử data.data chứa danh sách công việc phù hợp

  const formatNumberToTr = (number) => `${(number / 1e6).toFixed(0)}tr`;

  // Xử lý dữ liệu overviewData khi có
  useEffect(() => {
    if (overviewData) {
      console.log("Received overview data:", overviewData);
      // Cập nhật các state với dữ liệu từ API
      if (overviewData.chart) {
        setLabelTitle(Object.keys(overviewData.chart).slice(0, 3));
        const tempdata = [];
        Object.keys(overviewData.chart).forEach((key, index) => {
          tempdata.push(overviewData.chart[key]);
        });
        setDataValue(tempdata);
      }
    }
  }, [overviewData]);

  // Effect xử lý khi mount component và khi days thay đổi
  useEffect(() => {
    handleChangeChartTime();
  }, [days, endDate]);

  useEffect(() => {
    getDataOverview();
  }, [rangeLabel]);

  // Kiểm tra authentication
  useEffect(() => {
    if (!isLogin || user?.role !== 3) {
      navigate("/login");
    }
  }, [isLogin, navigate, user]);

  return (
    <>
      <div className="bg-light rounded-2 me-2 my-2 p-2">
        <h5 className="fw-bold">Tổng quan</h5>
        <SkillsContainer percent={overviewData?.percent_complete || 0} />
      </div>

      <div className="bg-light rounded-2 me-2 my-2 p-2">
        <h5 className="fw-bold">Hoạt động của bạn</h5>
        <div className="row justify-content-md-around ">
          <div className="col-md-8">
            {/* {isLoadingOverview ? (
              <div className="text-center py-3">Đang tải dữ liệu...</div>
            ) : ( */}
            <>
              <LineChartComponent
                labelTitle={labelTitle}
                labelChoice={rangeLabel}
                dataValue={dataValue}
                // data1={overviewData?.chart?.labelTitle[0]}
                // data2={overviewData?.chart?.labelTitle[1]}
                // data3={overviewData?.chart?.labelTitle[2]}
              />
              <select
                className="form-select form-select-sm w-auto"
                value={days}
                onChange={(e) => {
                  setDays(parseInt(e.target.value));
                }}
              >
                <option value={7}>7 ngày</option>
                <option value={14}>14 ngày</option>
                <option value={30}>30 ngày</option>
              </select>
            </>
            {/* )} */}
          </div>
          <div className="col-md-4 d-flex justify-content-md-around justify-content-sm-center text-center flex-column">
            <div className="col-sm-11 border border-primary p-2 d-flex justify-content-center align-items-center flex-column">
              <h4 className="text-primary">
                {overviewData?.totalApplied || 0}
              </h4>
              Việc làm đã ứng tuyển
            </div>
            <div className="col-sm-11 border border-primary p-2 d-flex justify-content-center align-items-center flex-column">
              <h4 className="text-warning">{overviewData?.totalViews || 0}</h4>
              Lượt xem hồ sơ
            </div>
            <div className="col-sm-11 border border-primary p-2 d-flex justify-content-center align-items-center flex-column">
              <h4 className="text-danger">{overviewData?.totalSaved || 0}</h4>
              Lượt lưu hồ sơ
            </div>
          </div>
        </div>
      </div>

      <div className="bg-light rounded-2 me-2 my-2 p-2">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="fw-bold">Công việc phù hợp</h5>
          <NavLink to="/post" className="text-primary">
            Xem tất cả
          </NavLink>
        </div>

        <div className="row rounded-2 p-2 d-flex ">
          {isLoadingSuitable ? (
            <div className="text-center py-3">
              Đang tải công việc phù hợp...
            </div>
          ) : suitablePosts?.length > 0 ? (
            renderSuitableWork()
          ) : (
            <div className="alert alert-info w-100">
              Hiện chúng tôi chưa tìm thấy công việc nào phù hợp cho bạn
            </div>
          )}
        </div>
      </div>
    </>
  );
}
