import { baseApi } from "./api__base";

export const apiDashboard = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchDashboardStats: builder.query({
      query: () => ({
        url: `/api/dashboard/stats`,
        method: 'GET'
      }),
    }),
    fetchProfileCompletionRate: builder.query({
      query: () => ({
        url: `/api/dashboard/profile-completion-rate`,
        method: 'GET'
      }),
    }),
    fetchEmployersWithJobsRate: builder.query({
      query: () => ({
        url: `/api/dashboard/employers-with-jobs-rate`,
        method: 'GET'
      }),
    }),
    fetchTotalReviews: builder.query({
      query: () => ({
        url: `/api/dashboard/total-reviews`,
        method: 'GET'
      }),
    }),
    fetchGrowthStats: builder.query({
      query: (params) => {
        const { period, startDate, endDate } = params;
        return {
          url: `/api/dashboard/growth-stats`,
          method: 'POST',
          body: { period, startDate, endDate }
        };
      },
    }),
  }),
});

export const { 
  useFetchDashboardStatsQuery,
  useFetchProfileCompletionRateQuery,
  useFetchEmployersWithJobsRateQuery,
  useFetchTotalReviewsQuery,
  useFetchGrowthStatsQuery
} = apiDashboard;
