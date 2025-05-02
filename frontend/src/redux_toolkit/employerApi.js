import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import domain from "../config/domain";
import { use } from "react";

export const employerApi = createApi({
  reducerPath: "employerApi",
  baseQuery: fetchBaseQuery({ baseUrl: domain }),
  endpoints: (builder) => ({
    getOverview: builder.mutation({
      query: ({employer_id, days}) => ({
          url: '/employer/overview',
          method: 'POST',
          body: { employer_id, days },
      }),
      transformResponse: (response) => {
          return response.data;
      },
      providesTags: ["Overview"],
  }),

    getCompanyInfor: builder.query({
      query: (employer_id) => ({
        url: "/employer/profile",
        params: { employer_id },
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
        console.log("redux receive updateCompanyInfor", response);
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
        console.log("redux receive addCompanyInfor", response);
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
        console.log("redux receive deleteCompanyInfor", response);
        return response;
      },
      invalidatesTags: ["CompanyInfor"],
    }),



    getJobByUser: builder.query({
      query: (employer_id) => ({
        url: "/employer/jobs",
        params: { employer_id },
      }),
      transformResponse: (response) => {
        console.log("redux receive getJobByUser", response);
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
        console.log("redux receive addJob", response);
        return response;
      },
      invalidatesTags: ["JobOfCompany","Overview"],
    }),
    updateJob: builder.mutation({
      query: (body) => ({
        url: "/employer/job",
        method: "PUT",
        body,
      }),
      transformResponse: (response) => {
        console.log("redux receive updateJob", response);
        return response;
      },
      invalidatesTags: ["JobOfCompany"],
    }),
    deleteJob: builder.mutation({
      query: ({ employer_id, job_id }) => ({
        url: `/employer/job`,
        method: "DELETE",
        body: { employer_id, job_id },
      }),
      transformResponse: (response) => {
        console.log("redux receive deleteJob", response);
        return response;
      },
      invalidatesTags: ["JobOfCompany","Overview"],
    }),




    getlistJobseeker: builder.query({
      query: (searchData={page_size:10}) => ({
        url: "/employer/jobseekers",
        params: searchData,
      }),
      transformResponse: (response) => {
        console.log("redux receive getlistJobseeker", response);
        return response.data;
      },
      providesTags: ["Jobseekers"],
    }),
    getJobseekerDetail: builder.query({
      query: ({jobseeker_id, employer_id}) => ({
        url: "/employer/jobseeker-detail",
        params: {jobseeker_id, employer_id},
      }),
      transformResponse: (response) => {
        console.log("redux receive getJobseekerById", response);
        return response.data;
      },
      providesTags: ["Jobseeker"],
  }),


    getListCandidate: builder.query({
      query: (employer_id) => ({
        url: "/employer/candidates",
        params: {employer_id},
      }),
      transformResponse: (response) => {
        console.log("redux receive getListCandidate", response);
        return response.data;
      },
      providesTags: ["ListCandidate"],
    }),
    addCandidate: builder.mutation({
      query: ( { employer_id, jobseeker_id } ) => ({
        url: "/employer/candidate",
        method: "post",
        body: { employer_id, jobseeker_id } ,
      }),
      transformResponse: (response) => {
        console.log("redux receive addCandidate", response);
        return response;
      },
      invalidatesTags: ["ListCandidate", "Jobseekers","Jobseeker","Overview","ListCandidate"],
    }),
    deleteCandidate: builder.mutation({
      query: ( { employer_id, jobseeker_id } ) => ({
        url: "/employer/candidate",
        method: "DELETE",
        body: { employer_id, jobseeker_id } ,
      }),
      transformResponse: (response) => {
        console.log("redux receive deleteCandidate", response);
        return response;
      },
      invalidatesTags: ["ListCandidate", "Jobseekers","Jobseeker","ListCandidate"],
    }),
    rateCandidate: builder.mutation({
      query: ( {type, application_id, employer_id, rating, content }) => ({
        url: "/employer/candidate",
        method: "PUT",
        body: {type, application_id, employer_id, rating, content },
      }),
      transformResponse: (response) => {
        console.log("redux receive rateCandidate", response);
        return response;
      },
      invalidatesTags: ["ListCandidate", "Jobseekers","Jobseeker","ListInvitation","JobseekerApplied",],
    }),




    getJobApplication: builder.query({
      query: ({ employer_id } ) => ({
        url: "/employer/job-applications",
        params: { employer_id } ,
      }),
      transformResponse: (response) => {
        // console.log("redux receive getJobseekerApplied", response);
        return response.data;
      },
      providesTags: ["JobseekerApplied"],
    }),
    rejectJobApplication: builder.mutation({
      query: ( { employer_id,job_id,jobseeker_id} ) => ({
        url: "/employer/job-application",
        method: "DELETE",
        body: { employer_id,job_id,jobseeker_id} ,
      }),
      transformResponse: (response) => {
        console.log("redux receive deleteJobseekerApplied", response);
        return response;
      },
      invalidatesTags: ["JobseekerApplied",],
    }),


    getListJobForInvitation: builder.query({
      query: ( { employer_id, jobseeker_id } ) => ({
        url: "/employer/list-job-for-invitation",
        params: { employer_id, jobseeker_id } ,
      }),
      transformResponse: (response) => {
        // console.log("redux receive getListJobForInvitation", response);
        return response.data;
      },
      providesTags: ["JobForInvitation"],
    }),
    inviteCandidateApplyJob: builder.mutation({
      query: ( { employer_id, jobseeker_id, job_ids } ) => ({
        url: "/employer/job-invitation",
        method: "post",
        body: { employer_id, jobseeker_id,job_ids } ,
      }),
      transformResponse: (response) => {
        // console.log("redux receive inviteCandidate", response);
        return response;
      },
      invalidatesTags: ["Jobseeker","Jobseekers","Overview","JobForInvitation","ListInvitation"],
    }),

    deleteInvitation: builder.mutation({
      query: ( { employer_id, jobseeker_id, job_id } ) => ({
        url: "/employer/job-invitation",
        method: "DELETE",
        body: { employer_id, jobseeker_id,job_id } ,
      }),
      transformResponse: (response) => {
        console.log("redux receive deleteInvitation", response);
        return response;
      },
      invalidatesTags: ["Jobseeker","Jobseekers","Overview","ListInvitation"],
    }),

    getListInvitation: builder.query({
      query: ( employer_id) => ({
        url: "/employer/invitation",
        params: { employer_id } ,
      }),
      transformResponse: (response) => {
        console.log("redux receive inviteCandidate", response);
        return response.data;
      },
      providesTags: ["ListInvitation"],
    }),

    getNotification: builder.query({
      query: (employer_id) => ({
          url: '/employer/notification',
          params: { employer_id },
      }),
      transformResponse: (response) => {
          return response.data;
      },
      providesTags: ['Notification'],
  }),
  updateReadNotification: builder.mutation({
      query: ({ employer_id, notification_id }) => ({
          url: '/employer/notification',
          method: 'PUT',
          body: { employer_id,        notification_id            },
      }),
      transformResponse: (response) => {
          return response;
      },
      invalidatesTags: ['Notification'],
  }),
})
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
  useUpdateReadNotificationMutation

} = employerApi;
