import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { format, subDays } from "date-fns";
import LineChartComponent from "../../../component/_component/ui/LineChart.js";
import { useGetOverviewMutation } from "../../../redux_toolkit/employerApi.js";
export default function EmployerOverview() {
  const { isLogin, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [getOverviewData] = useGetOverviewMutation();
  const [dataValue, setDataValue] = useState(null);
  const [labelTitle, setLabelTitle] = useState(null);
  const [overviewData, setOverviewData] = useState(null);
  const [rangeLabel, setRangeLabel] = useState(null);
  const [days, setDays] = useState(7);

  const handleChangeChartTime = () => {
    console.log(days);
    const endDate = new Date(); // Ngày hiện tại
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

    console.log(dateRange);
    setRangeLabel(dateRange);
  };
  const getDataOverview = async () => {
    try {
      if (rangeLabel !== null) {
        const response = await getOverviewData({
          days: rangeLabel,
        }).unwrap();
        console.log("Overview data:", response);
        setOverviewData(response);
      }
    } catch (error) {
      console.error("Error fetching overview data:", error);
    }
  };

  useEffect(() => {
    handleChangeChartTime();
  }, [days]);
  useEffect(() => {
    getDataOverview();
  }, [rangeLabel]);
  useEffect(() => {
    if (overviewData) {
      console.log("Received overview data:", overviewData, "của ", rangeLabel);

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

  return (
    <>
      <div className="bg-light rounded-2 me-2 my-2 p-2">
        <h3>Tổng quan </h3>
      </div>

      <div className="bg-light rounded-2 me-2 my-2 p-2">
        {/* Thẻ số liệu */}
        <div className="row mb-2">
          <div className="col">
            <div className="card text-center border-primary">
              <div className="card-body">
                <h6 className="card-title">Tất cả tin tuyển dụng</h6>
                <h4 className="card-text text-primary">
                  {overviewData?.TotalJob || 0}
                </h4>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card text-center border-warning">
              <div className="card-body">
                <h6 className="card-title">Tin đang hiển thị</h6>
                <h4 className="card-text text-warning">
                  {overviewData?.VisibleJob || 0}
                </h4>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card text-center border-danger">
              <div className="card-body">
                <h6 className="card-title">Tin sắp hết hạn</h6>
                <h4 className="card-text text-danger">
                  {overviewData?.NearlyExp || 0}
                </h4>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card text-center border-warning">
              <div className="card-body">
                <h6 className="card-title">Tổng số hồ sơ Ứng Tuyển</h6>
                <h4 className="card-text text-warning">
                  {overviewData?.TotalApply || 0}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-light rounded-2 me-2 my-2 p-2">
        <div className="row mb-2 d-flex justify-content-between">
          {/* Lịch sử hoạt động */}
          <div className="col-md-8 mb-4">
            <h6 className="fw-bold">Lịch sử hoạt động</h6>
          </div>
        </div>

        {overviewData?.chart ? (
          <div
            className="d-flex justify-content-center"
            style={{ height: "400px" }}
          >
            <LineChartComponent
              labelTitle={labelTitle}
              labelChoice={rangeLabel}
              dataValue={dataValue}
            />
            <div>
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
            </div>
          </div>
        ) : (
          <div className="text-center py-3">Đang tải dữ liệu...</div>
        )}
      </div>
    </>
  );
}
