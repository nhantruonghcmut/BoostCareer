import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import domain from "../config/domain";

export const guestApi = createApi({
  reducerPath: "guestApi",
  baseQuery: fetchBaseQuery({ baseUrl: domain }),
  endpoints: (builder) => ({
    // Get company information by ID
    getCompanyInformation: builder.query({
      query: (id) => ({
        url: "guest/company-detail",
        params: {id} ,
      }),
      transformResponse: (response) => response.data,
      providesTags: ["Company_Information"],
    }),
    // Get all companies with pagination
    getCompanyBySearch: builder.query({
      query: (searchData={active_page:1,page_size:10}) => {
        console.log("Requesting getAllCompanies with page:", searchData);
        return {
          url: "/api/guest/companies",
          params: searchData,
        };    },
      transformResponse: (response) => { return response.data;},
    }),
    // Get company by ID
    getCompanyById: builder.query({
      query: (id) => ({
        url: `guest/company-detail`,
        params: { id },
      }),
      transformResponse: (response) => { return response.data;},
    }),
    // Get leading companies
    getLeadingCompanies: builder.query({
      query: (searchData={paging_size:10}) => ({
        url: "/api/guest/leading-company",
        params: searchData,
      }),
      transformResponse: (response) => {  return response.data;},
    }),
    // Get latest work/jobs
    getLatestWork: builder.query({
      query: (searchData = {paging_size:10}) => ({
        url: "/api/guest/jobs",
        params: searchData,
      }),    
      transformResponse: (response) => { 
        console.log("Requesting getLatestWork with searchData:", response);
        return response.data;},
    }),
    // Get all posts by search query
    getJobSearch: builder.query({
      query: (searchData = {paging_size:10}) => ({
        url: "/api/guest/jobs",
        params: searchData,
      }),
      transformResponse: (response) => { return response.data;},
    }),
    // Get post detail by ID
    getJobDetail: builder.query({
      query: (job_id) => ({
        url: "/api/guest/job-detail",
        params: { job_id },
      }),
      transformResponse: (response) => { return response.data;},
    }),
    // Get all posts by user ID
    getJobOfCompanyById: builder.query({
      query: (id) => ({
        url: "/api/guest/jobs-of-company",
        params: { id },
      }),
      transformResponse: (response) => { return response.data;},
    }),
    getGeneralInfo: builder.query({
      query: () => ({
        url: "/api/guest/general-info",
      }),
      transformResponse: (response) => { return response.data;},
    }),
    getRelatedJobs: builder.query({
      query: (job_id) => ({
        url: "/api/guest/related-jobs",
        params:  {job_id} ,
      }),
      transformResponse: (response) => { return response.data;},
    }),
})
});

export const {
 useGetCompanyInformationQuery,
 useGetCompanyBySearchQuery,
 useGetCompanyByIdQuery,
 useGetLeadingCompaniesQuery,
 useGetLatestWorkQuery,
 useGetJobSearchQuery,
 useGetJobDetailQuery,
 useGetJobOfCompanyByIdQuery,
 useGetGeneralInfoQuery,
 useGetRelatedJobsQuery
} = guestApi;
