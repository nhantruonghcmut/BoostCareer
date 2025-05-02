import { baseApi } from "./api__base";

export const apiEmployers = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchEmployers: builder.query({
      query: (params = {}) => {
        const { searchData, paging } = params;
        if (!params.searchData || (Object.values(params.searchData).every(val => val === "")
        && Object.values(params.paging).every(val => val === null || val === "")))  {
          return {
            url: `/api/employer/get_all_employer`,
            method: 'GET'
          };
        } 
        return {
          url: `/api/employer/search_employer`,
          method: 'POST',
          body: { searchData, paging }
        };
      },
    }),
    delete_Employers: builder.mutation({
      query: (Employers_ids) => ({
        url: `/api/employer/delete_employers`,
        method: 'DELETE',
        body: Employers_ids,
      }),
    }),
    update_Employers: builder.mutation({
      query: (Employers) => ({
        url: `/api/employer/updateEmployers`,
        method: 'PUT',
        body: Employers,
      }),
    }),   
    update_status_Employers: builder.mutation({
      query: ({ status_, employer_ids }) =>  {
        console.log("update_status", status_, employer_ids);
        return {
        url: `/api/employer/update_status_`,
        method: 'POST',
        body: {status_,employer_ids}}},
    }),
    send_message_employer: builder.mutation({
      query: (message) => ({
        url: `/api/employer/send_message`,
        method: 'POST',
        body: message,  })         
    }),
    reset_Password_employer: builder.mutation({
      query: (employer_ids) => ({
        url: `/api/employer/reset_password`,
        method: 'POST',
        body: employer_ids,  })         
    }),
  }),
});

export const { 
  useFetchEmployersQuery,
  useDelete_EmployersMutation,
  useUpdate_EmployersMutation,
  useUpdate_status_EmployersMutation,
  useSend_message_employerMutation,
  useReset_Password_employerMutation
  } = apiEmployers;
