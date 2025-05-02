import { baseApi } from "./api__base";

export const apijobseekers = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchjobseekers: builder.query({
      query: (params = {}) => {
        const { searchData, paging } = params;
        console.log("params", params);
        if (!params.searchData || (Object.values(params.searchData).every(val => val === "")
            && Object.values(params.paging).every(val => val === null || val === "")))  {
            return {
                url: `/api/jobseeker/get_all_jobseeker`,
                method: 'GET'
            };
            } 
        return {
          url: `/api/jobseeker/search_jobseeker`,
          method: 'POST',
          body: { searchData, paging }
        };
      },    
    }),
    delete_jobseekers: builder.mutation({
      query: (jobseekers_ids) => ({
        url: `/api/jobseeker/delete_jobseekers`,
        method: 'DELETE',
        body: jobseekers_ids,
      }),
    }),
    update_jobseekers: builder.mutation({
      query: (jobseekers) => ({
        url: `/api/jobseeker/updatejobseekers`,
        method: 'PUT',
        body: jobseekers,
      }),
    }),   
    update_status_jobseekers: builder.mutation({
      query: ({ status_, jobseeker_ids }) =>  {
        console.log("update_status", status_, jobseeker_ids);
        return {
        url: `/api/jobseeker/update_status_`,
        method: 'POST',
        body: {status_,jobseeker_ids}}},
    }),
    send_message_jobseeker: builder.mutation({
      query: (message) => ({
        url: `/api/jobseeker/send_message`,
        method: 'POST',
        body: message,  })         
    }),
    reset_Password_jobseeker: builder.mutation({
      query: (jobseeker_ids) => ({
        url: `/api/jobseeker/reset_password`,
        method: 'POST',
        body: jobseeker_ids,  })         
    }),
  }),
});

export const { 
  useFetchjobseekersQuery,
  useDelete_jobseekersMutation,
  useUpdate_jobseekersMutation,
  useUpdate_status_jobseekersMutation,
  useSend_message_jobseekerMutation,
  useReset_Password_jobseekerMutation,
} = apijobseekers; 

