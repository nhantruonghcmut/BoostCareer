import React, { useState, useEffect } from 'react';
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CButtonGroup,
  CButton,
  CFormSelect,
  CForm,
  CFormInput,
} from '@coreui/react';
import { CChart } from '@coreui/react-chartjs';
// import { useFetchGrowthStatsQuery } from '../../redux/api/api_dashboard';

const GrowthChart = () => {
  const [periodType, setPeriodType] = useState('month');
  const [selectedDate, setSelectedDate] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 6, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  // Dữ liệu mẫu thay thế cho API fetch
  const growthStats = {
    labels: ['2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06'],
    newJobseekers: [120, 170, 210, 190, 240, 280],
    newEmployers: [15, 22, 19, 25, 30, 35],
    newJobs: [45, 62, 58, 75, 90, 105]
  };
  const isLoading = false;
  
  // Comment phần fetch API
  /*
  const { data: growthStats, isLoading, refetch } = useFetchGrowthStatsQuery({
    period: periodType,
    startDate: selectedDate.startDate,
    endDate: selectedDate.endDate,
  });

  // Refetch data when period type or dates change
  useEffect(() => {
    refetch();
  }, [periodType, selectedDate, refetch]);
  */

  // Format chart data
  const formatChartData = () => {
    if (!growthStats) {
      return {
        labels: [],
        datasets: []
      };
    }

    return {
      labels: growthStats.labels || [],
      datasets: [
        {
          label: 'New Jobseekers',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgb(75, 192, 192)',
          pointBackgroundColor: 'rgb(75, 192, 192)',
          pointBorderColor: '#fff',
          tension: 0.4,
          data: growthStats.newJobseekers || [],
        },
        {
          label: 'New Employers',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgb(54, 162, 235)',
          pointBackgroundColor: 'rgb(54, 162, 235)',
          pointBorderColor: '#fff',
          tension: 0.4,
          data: growthStats.newEmployers || [],
        },
        {
          label: 'New Job Posts',
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          borderColor: 'rgb(255, 159, 64)',
          pointBackgroundColor: 'rgb(255, 159, 64)',
          pointBorderColor: '#fff',
          tension: 0.4,
          data: growthStats.newJobs || [],
        },
      ],
    };
  };

  const handlePeriodChange = (value) => {
    setPeriodType(value);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setSelectedDate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <CCard className="mb-4">
      <CCardHeader>
        <CRow>
          <CCol sm={5}>
            <h4 id="growth" className="card-title mb-0">
              Growth Statistics
            </h4>
            <div className="small text-body-secondary">
              {selectedDate.startDate} - {selectedDate.endDate}
            </div>
          </CCol>
          <CCol sm={7} className="d-flex justify-content-end align-items-center">
            <CForm className="d-flex align-items-center me-3">
              <CFormInput
                type="date"
                name="startDate"
                value={selectedDate.startDate}
                onChange={handleDateChange}
                className="me-2"
              />
              <span className="me-2">to</span>
              <CFormInput
                type="date"
                name="endDate"
                value={selectedDate.endDate}
                onChange={handleDateChange}
                className="me-2"
              />
            </CForm>
            <CButtonGroup>
              {['day', 'month', 'year'].map((value) => (
                <CButton
                  color="outline-secondary"
                  key={value}
                  className="mx-0"
                  active={value === periodType}
                  onClick={() => handlePeriodChange(value)}
                >
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </CButton>
              ))}
            </CButtonGroup>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        {isLoading ? (
          <div className="text-center p-5">Loading...</div>
        ) : (
          <CChart
            type="line"
            data={formatChartData()}
            options={{
              maintainAspectRatio: false,
              responsive: true,
              plugins: {
                tooltip: {
                  mode: 'index',
                  intersect: false,
                },
              },
              scales: {
                x: {
                  grid: {
                    drawOnChartArea: false,
                  },
                },
                y: {
                  beginAtZero: true,
                  ticks: {
                    maxTicksLimit: 5,
                    stepSize: Math.ceil(
                      Math.max(
                        ...(growthStats?.newJobseekers || []),
                        ...(growthStats?.newEmployers || []),
                        ...(growthStats?.newJobs || [])
                      ) / 5
                    ),
                  },
                },
              },
              elements: {
                line: {
                  tension: 0.4,
                },
                point: {
                  radius: 3,
                  hitRadius: 10,
                  hoverRadius: 4,
                },
              },
            }}
            style={{ height: '400px' }}
          />
        )}
      </CCardBody>
    </CCard>
  );
};

export default GrowthChart;
