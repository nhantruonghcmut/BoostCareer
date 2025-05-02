// import { get } from "core-js/core/dict";
import { baseApi } from "./api__base";
  /////////////////// BỎ TAGS VÌ NẾU DÚNG NÓ SẼ LUÔN GỌI get_all_job KHI  jobs có sự thay đổi bất kỳ ==> ko giữ được kết quả search sau khi xóa / update

export const apijob = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchJobs: builder.query({
      query: (params = {}) => {
        const { searchData, paging } = params;
        if (!params.searchData || (Object.values(params.searchData).every(val => val === "")
        && Object.values(params.paging).every(val => val === null || val === "")))  {
          return {
            url: `/api/job/get_all_job`,
            method: 'GET'
          };
        }         
        return {
          url: `/api/job/search`,
          method: 'POST',
          body: { searchData, paging }
        };
      },
  }),
    delete_jobs: builder.mutation({
      query: (job_ids) => ({
        url: `/api/job/deletejobs`,
        method: 'DELETE',
        body: job_ids,
      }),
    }),
    update_job: builder.mutation({
      query: (job) => ({
        url: `/api/job/updatejob`,
        method: 'PUT',
        body: job,
      }),
    }),   
    update_status_: builder.mutation({
      query: ({ status_, job_ids }) =>  {
        return {
        url: `/api/job/update_status_`,
        method: 'POST',
        body: {status_,job_ids},}},
    }),         
  }),
});

export const { 
  useFetchJobsQuery,
  useDelete_jobsMutation,
  useUpdate_jobMutation, 
  useUpdate_status_Mutation} = apijob; // Đảm bảo export đúng tên
