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
      transformErrorResponse: (response) => {
        return response?.data?.message || "Error fetching employers";
      },
    }),
    delete_Employers: builder.mutation({
      query: (params) => ({
        url: `/api/employer/delete_employers`,
        method: 'DELETE',
        body: params,
      }),
      transformErrorResponse: (response) => {
        return response?.data?.message || "Error deleting employers";
      },
    }),
    update_Employers: builder.mutation({
      query: (params) => ({
        url: `/api/employer/updateEmployers`,
        method: 'PUT',
        body: params,
      }),
      transformErrorResponse: (response) => {
        return response?.data?.message || "Error updating employers";
      },
    }),   
    update_status_Employers: builder.mutation({
      query: ({ status_, employer_ids }) =>  {
        return {
          url: `/api/employer/update_status_`,
          method: 'POST',
          body: {status_, employer_ids}
        };
      },
      transformErrorResponse: (response) => {
        return response?.data?.message || "Error updating employer status";
      },
    }),
    send_message_employer: builder.mutation({
      query: (params) => ({
        url: `/api/employer/send_message`,
        method: 'POST',
        body: params,
      }),
      transformErrorResponse: (response) => {
        return response?.data?.message || "Error sending message";
      },
    }),
    reset_Password_employer: builder.mutation({
      query: (params) => ({
        url: `/api/employer/reset_password`,
        method: 'POST',
        body: params,
      }),
      transformErrorResponse: (response) => {
        return response?.data?.message || "Error resetting password";
      },
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
