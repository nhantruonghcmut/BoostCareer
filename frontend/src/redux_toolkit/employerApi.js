import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import domain from "../config/domain";
import { logout } from "./AuthSlice";
const baseQuery = fetchBaseQuery({
  baseUrl: domain, // URL của backend
  credentials: 'include', // Gửi cookie cùng với request
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Nếu nhận lỗi 401 (access token hết hạn hoặc không tồn tại)
  if (result.error && result.error.status === 401) {
    const errorCode = result.error.data?.errorCode;

    if (errorCode === 'TOKEN_EXPIRED') {
      // Gửi request đến /refresh để làm mới token
      const refreshResult = await baseQuery('auth/refresh', api, extraOptions);
      console.log("refreshResult", refreshResult);

      if (refreshResult.data) {
        // Nếu làm mới token thành công, gửi lại request ban đầu
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Nếu refresh token không hợp lệ, chuyển đến trang login
        await api.dispatch(logout());
      }    } else if (errorCode === 'TOKEN_MISSING' || errorCode === 'AUTH_REQUIRED' || result.error.data?.forceLogout === true) {
      // Nếu access token và refresh token đều không tồn tại hoặc không hợp lệ, chuyển đến trang login
      console.log('Phiên đăng nhập đã hết hạn hoặc không hợp lệ, đang đăng xuất...');
      await api.dispatch(logout());
    }
  }

  return result;
};

export const employerApi = createApi({
  reducerPath: "employerApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getOverview: builder.mutation({
      query: ({ days }) => ({
        url: "/employer/overview",
        method: "POST",
        body: { days },
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["Overview"],
    }),

    getCompanyInfor: builder.query({
      query: () => ({
        url: "/employer/profile",
      }),
      transformResponse: (response) => response.data,
      providesTags: ["CompanyInfor"],
    }),
    updateCompanyInfor: builder.mutation({
      query: (body) => ({
        url: "/employer/profile",
        method: "PUT",
        body,
      }),
      transformResponse: (response) => {
        //console.log("redux receive updateCompanyInfor", response);
        return response;
      },
      invalidatesTags: ["CompanyInfor"],
    }),
    addCompanyInfor: builder.mutation({
      query: (body) => ({
        url: "/employer/profile",
        method: "Post",
        body,
      }),
      transformResponse: (response) => {
        // //console.log("redux receive addCompanyInfor", response);
        return response;
      },
      invalidatesTags: ["CompanyInfor"],
    }),
    deleteCompanyInfor: builder.mutation({
      query: (data) => ({
        url: "/employer/profile",
        method: "DELETE",
        params: data,
      }),
      transformResponse: (response) => {
        // //console.log("redux receive deleteCompanyInfor", response);
        return response;
      },
      invalidatesTags: ["CompanyInfor"],
    }),

    getJobByUser: builder.query({
      query: () => ({
        url: "/employer/jobs",
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["JobOfCompany"],
    }),
    addJob: builder.mutation({
      query: (body) => ({
        url: "/employer/job",
        method: "post",
        body,
      }),
      transformResponse: (response) => {
        //console.log("redux receive addJob", response);
        return response;
      },
      invalidatesTags: ["JobOfCompany", "Overview"],
    }),
    updateJob: builder.mutation({
      query: (body) => ({
        url: "/employer/job",
        method: "PUT",
        body,
      }),
      transformResponse: (response) => {
        //console.log("redux receive updateJob", response);
        return response;
      },
      invalidatesTags: ["JobOfCompany"],
    }),
    deleteJob: builder.mutation({
      query: ({ job_id }) => ({
        url: `/employer/job`,
        method: "DELETE",
        body: { job_id },
      }),
      transformResponse: (response) => {
        //console.log("redux receive deleteJob", response);
        return response;
      },
      invalidatesTags: ["JobOfCompany", "Overview"],
    }),

    getlistJobseeker: builder.query({
      query: (searchData = { page_size: 10 }) => ({
        url: "/employer/jobseekers",
        params: searchData,
      }),
      transformResponse: (response) => {
        //console.log("redux receive getlistJobseeker", response);
        return response.data;
      },
      providesTags: ["Jobseekers"],
    }),
    getJobseekerDetail: builder.query({
      query: ({ jobseeker_id }) => ({
        url: "/employer/jobseeker-detail",
        params: { jobseeker_id },
      }),
      transformResponse: (response) => {
        //console.log("redux receive getJobseekerById", response);
        return response.data;
      },
      providesTags: ["Jobseeker"],
    }),

    getListCandidate: builder.query({
      query: () => ({
        url: "/employer/candidates",
        params: { },
      }),
      transformResponse: (response) => {
        //console.log("redux receive getListCandidate", response);
        return response.data;
      },
      providesTags: ["ListCandidate"],
    }),
    addCandidate: builder.mutation({
      query: ({ jobseeker_id }) => ({
        url: "/employer/candidate",
        method: "post",
        body: { jobseeker_id },
      }),
      transformResponse: (response) => {
        //console.log("redux receive addCandidate", response);
        return response;
      },
      invalidatesTags: [
        "ListCandidate",
        "Jobseekers",
        "Jobseeker",
        "Overview",
        "ListCandidate",
      ],
    }),
    deleteCandidate: builder.mutation({
      query: ({ jobseeker_id }) => ({
        url: "/employer/candidate",
        method: "DELETE",
        body: { jobseeker_id },
      }),
      transformResponse: (response) => {
        //console.log("redux receive deleteCandidate", response);
        return response;
      },
      invalidatesTags: [
        "ListCandidate",
        "Jobseekers",
        "Jobseeker",
        "ListCandidate",
      ],
    }),
    rateCandidate: builder.mutation({
      query: ({ type, application_id, rating, content }) => ({
        url: "/employer/candidate",
        method: "PUT",
        body: { type, application_id, rating, content },
      }),
      transformResponse: (response) => {
        //console.log("redux receive rateCandidate", response);
        return response;
      },
      invalidatesTags: [
        "ListCandidate",
        "Jobseekers",
        "Jobseeker",
        "ListInvitation",
        "JobseekerApplied",
      ],
    }),

    getJobApplication: builder.query({
      query: () => ({
        url: "/employer/job-applications",
      }),
      transformResponse: (response) => {
        // //console.log("redux receive getJobseekerApplied", response);
        return response.data;
      },
      providesTags: ["JobseekerApplied"],
    }),
    rejectJobApplication: builder.mutation({
      query: ({ job_id, jobseeker_id }) => ({
        url: "/employer/job-application",
        method: "DELETE",
        body: { job_id, jobseeker_id },
      }),
      transformResponse: (response) => {
        //console.log("redux receive deleteJobseekerApplied", response);
        return response;
      },
      invalidatesTags: ["JobseekerApplied"],
    }),

    getListJobForInvitation: builder.query({
      query: ({ jobseeker_id }) => ({
        url: "/employer/list-job-for-invitation",
        params: { jobseeker_id },
      }),
      transformResponse: (response) => {
        // //console.log("redux receive getListJobForInvitation", response);
        return response.data;
      },
      providesTags: ["JobForInvitation"],
    }),
    inviteCandidateApplyJob: builder.mutation({
      query: ({ jobseeker_id, job_ids }) => ({
        url: "/employer/job-invitation",
        method: "post",
        body: { jobseeker_id, job_ids },
      }),
      transformResponse: (response) => {
        // //console.log("redux receive inviteCandidate", response);
        return response;
      },
      invalidatesTags: [
        "Jobseeker",
        "Jobseekers",
        "Overview",
        "JobForInvitation",
        "ListInvitation",
      ],
    }),

    deleteInvitation: builder.mutation({
      query: ({ jobseeker_id, job_id }) => ({
        url: "/employer/job-invitation",
        method: "DELETE",
        body: { jobseeker_id, job_id },
      }),
      transformResponse: (response) => {
        //console.log("redux receive deleteInvitation", response);
        return response;
      },
      invalidatesTags: [
        "Jobseeker",
        "Jobseekers",
        "Overview",
        "ListInvitation",
      ],
    }),

    getListInvitation: builder.query({
      query: () => ({
        url: "/employer/invitation",
        params: { },
      }),
      transformResponse: (response) => {
        //console.log("redux receive inviteCandidate", response);
        return response.data;
      },
      providesTags: ["ListInvitation"],
    }),

    getNotification: builder.query({
      query: () => ({
        url: "/employer/notification",
        params: {  },
      }),
      transformResponse: (response) => {
        return response.data;
      },
      providesTags: ["Notification"],
    }),
    updateReadNotification: builder.mutation({
      query: ({ notification_id }) => ({
        url: "/employer/notification",
        method: "PUT",
        body: {  notification_id },
      }),
      transformResponse: (response) => {
        return response;
      },
      invalidatesTags: ["Notification"],
    }),
    changePassword: builder.mutation({
        query: ({  newPassword }) => ({
            url: '/employer/change-password',
            method: 'POST',
            body: {newPassword },
        }),
        transformResponse: (response) => {
            return response;
        },
    }),
  }),
});

export const {
  useGetOverviewMutation,
  useGetCompanyInforQuery,
  useUpdateCompanyInforMutation,
  useAddCompanyInforMutation,
  useDeleteCompanyInforMutation,

  useGetJobByUserQuery,
  useAddJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,

  useGetlistJobseekerQuery,
  useGetJobseekerDetailQuery,

  useGetListCandidateQuery,
  useAddCandidateMutation,
  useDeleteCandidateMutation,
  useRateCandidateMutation,

  useGetJobApplicationQuery,
  useRejectJobApplicationMutation,

  useInviteCandidateApplyJobMutation,
  useGetListJobForInvitationQuery,
  useGetListInvitationQuery,
  useDeleteInvitationMutation,

  useGetNotificationQuery,
  useUpdateReadNotificationMutation,
  useChangePasswordMutation,
} = employerApi;
