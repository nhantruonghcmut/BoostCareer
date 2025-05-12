import React from 'react';
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
} from '@coreui/react';
import { CChart } from '@coreui/react-chartjs';
import CIcon from '@coreui/icons-react';
import { cilStar, cilBuilding } from '@coreui/icons';
import { 
  useFetchProfileCompletionRateQuery, 
  useFetchEmployersWithJobsRateQuery,
  useFetchTotalReviewsQuery 
} from '../../redux/api/api_dashboard';

const SecondRowStats = () => {  // Sử dụng API fetch thay vì dữ liệu mẫu
  const { data: profileCompletionData, isLoading: isLoadingProfile } = useFetchProfileCompletionRateQuery();
  const { data: employersWithJobsData, isLoading: isLoadingEmployers } = useFetchEmployersWithJobsRateQuery();  const { data: reviewsData, isLoading: isLoadingReviews } = useFetchTotalReviewsQuery();

  // Calculate the completion percentage
  const profileCompletionRate = profileCompletionData?.completionRate || 0;
  const remainingProfileRate = 100 - profileCompletionRate;

  // Calculate employers with active jobs percentage
  const employersWithJobsRate = employersWithJobsData?.rate || 0;
  const remainingEmployersRate = 100 - employersWithJobsRate;

  return (
    <CRow className="mb-4">
      {/* Profile Completion Rate Pie Chart */}
      <CCol sm={12} md={6} xl={3}>
        <CCard className="mb-4">
          <CCardHeader>Jobseeker Profile Completion</CCardHeader>
          <CCardBody>
            {isLoadingProfile ? (
              <div className="text-center">Loading...</div>
            ) : (
              <div className="chart-container" style={{ height: '150px', position: 'relative', margin: '0 auto', maxWidth: '150px' }}>
                <CChart
                  type="doughnut"
                  data={{
                    labels: ['Completed', 'Incomplete'],
                    datasets: [
                      {
                        backgroundColor: ['#4BB543', '#e2e2e2'],
                        data: [profileCompletionRate, remainingProfileRate],
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          color: '#333',
                          boxWidth: 10,
                          padding: 10,
                          font: {
                            size: 11
                          }
                        },
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                          }
                        }
                      }
                    },
                    cutout: '70%',
                    maintainAspectRatio: false
                  }}
                />
              </div>
            )}
            <div className="text-center mt-3">
              <div className="h4">{profileCompletionRate}%</div>
              <div className="small text-body-secondary">Average profile completion rate</div>
            </div>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Employers with Job Posts Pie Chart */}
      <CCol sm={12} md={6} xl={3}>
        <CCard className="mb-4">
          <CCardHeader>Employers with Active Jobs</CCardHeader>
          <CCardBody>
            {isLoadingEmployers ? (
              <div className="text-center">Loading...</div>
            ) : (
              <div className="chart-container" style={{ height: '150px', position: 'relative', margin: '0 auto', maxWidth: '150px' }}>
                <CChart
                  type="doughnut"
                  data={{
                    labels: ['With Active Jobs', 'Without Active Jobs'],
                    datasets: [
                      {
                        backgroundColor: ['#2F95DC', '#e2e2e2'],
                        data: [employersWithJobsRate, remainingEmployersRate],
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          color: '#333',
                          boxWidth: 10,
                          padding: 10,
                          font: {
                            size: 11
                          }
                        },
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                          }
                        }
                      }
                    },
                    cutout: '70%',
                    maintainAspectRatio: false
                  }}
                />
              </div>
            )}
            <div className="text-center mt-3">
              <div className="h4">{employersWithJobsRate}%</div>
              <div className="small text-body-secondary">Employers with active job postings</div>
            </div>
          </CCardBody>
        </CCard>
      </CCol>      {/* Company Reviews Rating Chart */}
      <CCol sm={12} md={6} xl={3}>
        <CCard className="mb-4">
          <CCardHeader>Company Reviews</CCardHeader>
          <CCardBody>
            {isLoadingReviews ? (
              <div className="text-center">Loading...</div>
            ) : (
              <div className="chart-container" style={{ height: '150px', position: 'relative', margin: '0 auto', maxWidth: '150px' }}>
                <CChart
                  type="doughnut"
                  data={{
                    labels: ['Rating', 'Remaining'],
                    datasets: [
                      {
                        backgroundColor: ['#4BB543', '#e2e2e2'],
                        data: [reviewsData?.companyAvgRating || 0, 5 - (reviewsData?.companyAvgRating || 0)],
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            if (context.dataIndex === 0) {
                              return `Rating: ${reviewsData?.companyAvgRating || 0}/5`;
                            }
                            return '';
                          }
                        }
                      }
                    },
                    cutout: '75%',
                    maintainAspectRatio: false,
                    rotation: -90,
                    circumference: 180,
                  }}
                />
              </div>
            )}
            <div className="text-center mt-3">
              <div className="h3">{reviewsData?.companyAvgRating || 0}<span className="small">/5</span></div>
              <div className="small text-body-secondary">Based on {reviewsData?.companyReviews || 0} reviews</div>
            </div>
          </CCardBody>
        </CCard>
      </CCol>      {/* Candidate Ratings Chart */}
      <CCol sm={12} md={6} xl={3}>
        <CCard className="mb-4">
          <CCardHeader>Candidate Ratings</CCardHeader>
          <CCardBody>
            {isLoadingReviews ? (
              <div className="text-center">Loading...</div>
            ) : (
              <div className="chart-container" style={{ height: '150px', position: 'relative', margin: '0 auto', maxWidth: '150px' }}>
                <CChart
                  type="doughnut"
                  data={{
                    labels: ['Rating', 'Remaining'],
                    datasets: [
                      {
                        backgroundColor: ['#FFD700', '#e2e2e2'],
                        data: [reviewsData?.candidateAvgRating || 0, 5 - (reviewsData?.candidateAvgRating || 0)],
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            if (context.dataIndex === 0) {
                              return `Rating: ${reviewsData?.candidateAvgRating || 0}/5`;
                            }
                            return '';
                          }
                        }
                      }
                    },
                    cutout: '75%',
                    maintainAspectRatio: false,
                    rotation: -90,
                    circumference: 180,
                  }}
                />
              </div>
            )}
            <div className="text-center mt-3">
              <div className="h3">{reviewsData?.candidateAvgRating || 0}<span className="small">/5</span></div>
              <div className="small text-body-secondary">Based on {reviewsData?.candidateRatings || 0} ratings</div>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default SecondRowStats;
