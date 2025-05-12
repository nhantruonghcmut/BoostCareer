import React from 'react';
import {
  CRow,
  CCol,
  CWidgetStatsA,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBriefcase, cilBuilding, cilPeople } from '@coreui/icons';
// import { useFetchDashboardStatsQuery } from '../../redux/api/api_dashboard';

const StatsWidget = () => {
  // Dữ liệu mẫu thay thế cho API fetch
  const stats = {
    totalJobseekers: 12850,
    totalEmployers: 1456,
    totalJobs: 5678
  };

  // Comment phần fetch API
  /*
  const { data: stats, isLoading, error } = useFetchDashboardStatsQuery();

  if (isLoading) {
    return (
      <CRow className="mb-4">
        <CCol sm={12} className="text-center">
          <p>Loading statistics...</p>
        </CCol>
      </CRow>
    );
  }

  if (error) {
    return (
      <CRow className="mb-4">
        <CCol sm={12} className="text-center">
          <p>Error loading statistics. Please try again later.</p>
        </CCol>
      </CRow>
    );
  }
  */

  return (
    <CRow className="mb-4" xs={{ gutter: 4 }}>
      {/* Jobseekers Total */}
      <CCol sm={12} md={4}>
        <CWidgetStatsA
          color="primary"
          value={stats?.totalJobseekers || 0}
          title="Total Jobseekers"
          icon={<CIcon icon={cilPeople} height={36} />}
        />
      </CCol>

      {/* Employers Total */}
      <CCol sm={12} md={4}>
        <CWidgetStatsA
          color="info"
          value={stats?.totalEmployers || 0}
          title="Total Employers"
          icon={<CIcon icon={cilBuilding} height={36} />}
        />
      </CCol>

      {/* Job Posts Total */}
      <CCol sm={12} md={4}>
        <CWidgetStatsA
          color="warning"
          value={stats?.totalJobs || 0}
          title="Total Job Posts"
          icon={<CIcon icon={cilBriefcase} height={36} />}
        />
      </CCol>
    </CRow>
  );
};

export default StatsWidget;
