import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import domain from '../config/domain';
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
      // Sử dụng action logout vì nó xóa state và cookie
      await api.dispatch(logout());
    }
  }

  return result;
};

export const jobseekerApi = createApi({
    reducerPath: 'jobseekerApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Basic', 'Experience', 'Education', 'Project', 'Skill', 'Language', 'Certification', 'Overview'],
    endpoints: (builder) => ({
        getOverviewJobseeker: builder.mutation({
            query: ({days}) => ({
                url: '/api/jobseeker/overview',
                method: 'POST',
                body: { days },
            }),
            transformResponse: (response) => {
                return response.data;
            },
            providesTags: ['Overview'],
        }),

        getJobsSuggestion: builder.query({
            query: () => ({
                url: '/api/jobseeker/jobs-suggestion',
            }),
            transformResponse: (response) => {
                return response.data;
            },
            providesTags: ['JobSuggestion'],
        }),
        getItemProfile: builder.query({
            query: ({type}) => ({
                url:`/api/jobseeker/profile`,
                params: { type },
            }),
            transformResponse: (response) => {
                return response.data;
            },
            providesTags: (result, error, { type }) => {
                return result ? [{ type }] : [];
            }
        }),
        
        // Thêm endpoint updateProfileImage
        updateProfileImage: builder.mutation({
            query: ({ image }) => {
                // Tạo FormData để upload file
                const formData = new FormData();
                formData.append("image", image);
                
                return {
                    url: '/api/jobseeker/avatar-imagine',
                    method: 'POST',
                    body: formData,
                    // Không cần set Content-Type vì fetchBaseQuery tự xử lý với FormData
                    formData: true // Đảm bảo xử lý đúng với FormData
                };
            },
            // Transform response để trả về dữ liệu như action cũ
            transformResponse: (response) => response.data,
            invalidatesTags: (result, error) => [
                { type: 'Basic'}
            ]
        }),
        
        updateItemProfile: builder.mutation({
            query: ({ type, data }) => ({
                url: `/api/jobseeker/profile`,
                method: 'PUT',
                body: { type, data }, // Sửa lỗi cú pháp
            }),
            invalidatesTags: (result, error, { type }) => [{ type }],  
        }),
        
        addItemProfile: builder.mutation({
            query: ({ type, data }) => ({
                url: `/api/jobseeker/profile`,
                method: 'POST',
                body: { type, data }, // Sửa lỗi cú pháp
            }),
            invalidatesTags: (result, error, { type }) => [{ type }],  
        }),
        
        deleteItemProfile: builder.mutation({
            query: ({ type, data }) => ({
                url: `/api/jobseeker/profile`,
                method: 'DELETE',
                body: { type, data },
            }),
            invalidatesTags: (result, error, { type }) => [{ type }],  
        }),
        getJobsaving: builder.query({
            query: (profile_id) => ({
                url: '/api/jobseeker/job-saving',
            }),
            transformResponse: (response) => {
                console.log("getJobsaving APIIIIIIIIIII", response);
                return response.data?.jobs || [];
            },
            providesTags: ['JobSaving'],
        }),
        addJobSaving: builder.mutation({
            query: (data) => ({
                url: '/api/jobseeker/job-saving',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['JobSaving'],
        }),
        deleteJobSaving: builder.mutation({
            query: (data) => ({
                url: '/api/jobseeker/job-saving',
                method: 'DELETE',
                body: data,
            }),
            invalidatesTags: ['JobSaving'],
        }),
        getFollowingCompany: builder.query({
            query: () => ({
                url: '/api/jobseeker/company-following',
            }),
            transformResponse: (response) => {
                console.log("getFollowingCompany APIIIIIIIIIII", response);
                return response.data;
            },
            providesTags: ['FollowingCompany'],
        }),
        addFollowingCompany: builder.mutation({
            query: ({company_id}) => ({
                url: '/api/jobseeker/company-following',
                method: 'POST',
                body: {company_id },
            }),
            transformResponse: (response) => {
                return response;
            },
            invalidatesTags: ['FollowingCompany'],
        }),
        deleteFollowingCompany: builder.mutation({
            query: (data) => ({
                url: '/api/jobseeker/company-following',
                method: 'DELETE',
                body: data,
            }),
            transformResponse: (response) => {
                return response;
            },
            invalidatesTags: ['FollowingCompany'],
        }),
        addCompanyReview: builder.mutation({
            query: (data) => ({
                url: '/api/jobseeker/company-rating',
                method: 'POST',
                body: data,
            }),
            invalidatesTags:  ["Company_Information","Company_Review"],
        }),
        updateCompanyReview: builder.mutation({
            query: (data) => ({
                url: '/api/jobseeker/company-rating',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ["Company_Information","Company_Review"],
        }),
        getCompanyReview: builder.query({
            query: (company_id) => ({
                url: '/api/jobseeker/company-rating',
                params: { company_id },
            }),
            transformResponse: (response) => {
                return response.data;
            },
            providesTags: ['Company_Review'],
        }),
        getJobApply: builder.query({
            query: () => ({
                url: '/api/jobseeker/job-applications',
            }),
            transformResponse: (response) => {
                return response.data?.jobs || [];
            },
            providesTags: ['JobApply'],
        }),
        addJobApply: builder.mutation({
            query: ({job_id}) => ({
                url: '/api/jobseeker/job-application',
                method: 'POST',
                body: {job_id},
            }),
            invalidatesTags: ['JobApply'],
        }),
        getProfileCV: builder.query({
            query: () => ({
                url: '/api/jobseeker/profile-cv',
                params: { },
            }),
            transformResponse: (response) => {
                return response.data;
            },
            providesTags: ['CV'],
        }),        addProfileCV: builder.mutation({
            query: ({ resume }) => {
                const formData = new FormData();
                formData.append('resume', resume); // Using 'resume' to match backend expectation
                
                return {
                    url: '/api/jobseeker/profile-cv',
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: ['CV'],
        }),
        deleteProfileCV: builder.mutation({
            query: ({cv_id}) => ({
                url: '/api/jobseeker/profile-cv',
                method: 'DELETE',
                body: {  cv_id },
            }),
            invalidatesTags: ['CV'],
        }),
        ShowHideProfileCV: builder.mutation({
            query: ({ profile_id, cv_id, type }) => ({
                url: "/api/jobseeker/show-hide-profile-cv",
                method: "POST",
                body: { profile_id, cv_id, type },
              }),
              invalidatesTags: ["CV"],
            }),            
        getNotification: builder.query({
            query: () => ({
                url: '/api/jobseeker/notification',
            }),
            transformResponse: (response) => {
                return response.data;
            },
            providesTags: ['Notification'],
        }),
        updateReadNotification: builder.mutation({
            query: ({ notification_id }) => ({
                url: '/api/jobseeker/notification',
                method: 'PUT',
                body: { notification_id  },
            }),
            transformResponse: (response) => {
                return response;
            },
            invalidatesTags: ['Notification'],
        }),

        changePassword: builder.mutation({
            query: ({  newPassword }) => ({
                url: '/api/jobseeker/change-password',
                method: 'POST',
                body: {newPassword },
            }),
            transformResponse: (response) => {
                return response;
            },
        }),

        getAI_score: builder.query({
            query: ({ job_id }) => ({
                url: '/AIservice/score-matching',
                params: {job_id},
            }),
            transformResponse: (response) => {
                return response.data;
            },
        }),        getAI_Analyze: builder.query({
            query: ({ job_id }) => ({
                url: '/AIservice/analyze',    
                params: {job_id},
                // Tăng thời gian timeout lên 30 giây (mặc định là 10 giây)
                responseHandler: (response) => response.json(),
                timeout: 30000, // 30 giây
            }),
            transformResponse: (response) => {
                return response.data;
            },
            // Cấu hình cách xử lý lỗi và thử lại
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                } catch (error) {
                    console.log("Lỗi khi gọi AI_Analyze API:", error);
                }
            },
        }),

    })   
});

// Export hooks for usage in components
export const {    
    useGetOverviewJobseekerMutation,
    useGetJobsSuggestionQuery,
    useGetItemProfileQuery,
    useUpdateProfileImageMutation,
    useUpdateItemProfileMutation,
    useAddItemProfileMutation,
    useDeleteItemProfileMutation,

    useGetJobsavingQuery,
    useAddJobSavingMutation,
    useDeleteJobSavingMutation,

    useGetFollowingCompanyQuery,
    useAddFollowingCompanyMutation,
    useDeleteFollowingCompanyMutation,

    useAddCompanyReviewMutation,
    useUpdateCompanyReviewMutation,
    useGetCompanyReviewQuery,

    useGetJobApplyQuery,
    useAddJobApplyMutation,

    useGetProfileCVQuery,
    useAddProfileCVMutation,
    useDeleteProfileCVMutation,   
    useShowHideProfileCVMutation,

    useGetNotificationQuery,
    useUpdateReadNotificationMutation,
    useChangePasswordMutation,

    useGetAI_scoreQuery,
    useGetAI_AnalyzeQuery,

} = jobseekerApi;
