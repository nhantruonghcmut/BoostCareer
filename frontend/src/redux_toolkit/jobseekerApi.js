import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import domain from '../config/domain';

export const jobseekerApi = createApi({
    reducerPath: 'jobseekerApi',
    baseQuery: fetchBaseQuery({
        baseUrl: domain,
        // prepareHeaders: (headers) => {
        //     const token = localStorage.getItem('token');
        //     // if (token) {
        //     //     headers.set('Authorization', `Bearer ${token}`);
        //     // }
        //     headers.set('Authorization');
        //     return headers;
        // },
        credentials: 'include'
    }), 
    tagTypes: ['Basic', 'Experience', 'Education', 'Project', 'Skill', 'Language', 'Certification', 'Overview'],
    endpoints: (builder) => ({
        getOverview: builder.mutation({
            query: ({profile_id, days}) => ({
                url: '/jobseeker/overview',
                method: 'POST',
                body: { profile_id, days },
            }),
            transformResponse: (response) => {
                return response.data;
            },
            providesTags: ['Overview'],
        }),

        getJobsSuggestion: builder.query({
            query: ({profile_id}) => ({
                url: '/jobseeker/jobs-suggestion',
                params: { profile_id },
            }),
            transformResponse: (response) => {
                return response.data;
            },
            providesTags: ['JobSuggestion'],
        }),
        getItemProfile: builder.query({
            query: ({type,profile_id}) => ({
                url:`/jobseeker/profile`,
                params: { type, profile_id},
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
            query: ({ id, image }) => {
                // Tạo FormData để upload file
                const formData = new FormData();
                formData.append("id", id);
                formData.append("image", image);
                
                return {
                    url: '/jobseeker/avatar-imagine',
                    method: 'POST',
                    body: formData,
                    // Không cần set Content-Type vì fetchBaseQuery tự xử lý với FormData
                    formData: true // Đảm bảo xử lý đúng với FormData
                };
            },
            // Transform response để trả về dữ liệu như action cũ
            transformResponse: (response) => response.data,
            invalidatesTags: (result, error, { id }) => [
                { type: 'Basic', id }
            ]
        }),
        
        updateItemProfile: builder.mutation({
            query: ({ type, data }) => ({
                url: `/jobseeker/profile`,
                method: 'PUT',
                body: { type, data }, // Sửa lỗi cú pháp
            }),
            invalidatesTags: (result, error, { type }) => [{ type }],  
        }),
        
        addItemProfile: builder.mutation({
            query: ({ type, data }) => ({
                url: `/jobseeker/profile`,
                method: 'POST',
                body: { type, data }, // Sửa lỗi cú pháp
            }),
            invalidatesTags: (result, error, { type }) => [{ type }],  
        }),
        
        deleteItemProfile: builder.mutation({
            query: ({ type, data }) => ({
                url: `/jobseeker/profile`,
                method: 'DELETE',
                body: { type, data },
            }),
            invalidatesTags: (result, error, { type }) => [{ type }],  
        }),
        getJobsaving: builder.query({
            query: (profile_id) => ({
                url: '/jobseeker/job-saving',
                params: { profile_id },
            }),
            transformResponse: (response) => {
                console.log("getJobsaving APIIIIIIIIIII", response);
                return response.data?.jobs || [];
            },
            providesTags: ['JobSaving'],
        }),
        addJobSaving: builder.mutation({
            query: (data) => ({
                url: '/jobseeker/job-saving',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['JobSaving'],
        }),
        deleteJobSaving: builder.mutation({
            query: (data) => ({
                url: '/jobseeker/job-saving',
                method: 'DELETE',
                body: data,
            }),
            invalidatesTags: ['JobSaving'],
        }),
        getFollowingCompany: builder.query({
            query: (profile_id) => ({
                url: '/jobseeker/company-following',
                params: { profile_id },
            }),
            transformResponse: (response) => {
                console.log("getFollowingCompany APIIIIIIIIIII", response);
                return response.data;
            },
            providesTags: ['FollowingCompany'],
        }),
        addFollowingCompany: builder.mutation({
            query: ({company_id, profile_id}) => ({
                url: '/jobseeker/company-following',
                method: 'POST',
                body: {company_id, profile_id},
            }),
            transformResponse: (response) => {
                return response;
            },
            invalidatesTags: ['FollowingCompany'],
        }),
        deleteFollowingCompany: builder.mutation({
            query: (data) => ({
                url: '/jobseeker/company-following',
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
                url: '/jobseeker/company-rating',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['CompanyReview'],
        }),
        deleteCompanyReview: builder.mutation({
            query: (review_id) => ({
                url: '/jobseeker/company-rating',
                method: 'DELETE',
                body: { review_id },
            }),
            invalidatesTags: ['CompanyReview'],
        }),
        getCompanyReview: builder.query({
            query: (profile_id) => ({
                url: '/jobseeker/company-rating',
                params: { profile_id },
            }),
            transformResponse: (response) => {
                return response.data;
            },
            providesTags: ['CompanyReview'],
        }),
        getJobApply: builder.query({
            query: (profile_id) => ({
                url: '/jobseeker/job-applications',
                params: { profile_id },
            }),
            transformResponse: (response) => {
                return response.data?.jobs || [];
            },
            providesTags: ['JobApply'],
        }),
        addJobApply: builder.mutation({
            query: ({profile_id,job_id}) => ({
                url: '/jobseeker/job-application',
                method: 'POST',
                body: {profile_id,job_id},
            }),
            invalidatesTags: ['JobApply'],
        }),
        getProfileCV: builder.query({
            query: (profile_id) => ({
                url: '/jobseeker/profile-cv',
                params: { profile_id },
            }),
            transformResponse: (response) => {
                return response.data;
            },
            providesTags: ['CV'],
        }),
        addProfileCV: builder.mutation({
            query: ({ profile_id, file }) => {
                const formData = new FormData();
                formData.append('profile_id', profile_id);
                formData.append('file', file);
                
                return {
                    url: '/jobseeker/profile-cv',
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: ['CV'],
        }),
        deleteProfileCV: builder.mutation({
            query: ({profile_id,cv_id}) => ({
                url: '/jobseeker/profile-cv',
                method: 'DELETE',
                body: { profile_id, cv_id },
            }),
            invalidatesTags: ['CV'],
        }),

        getNotification: builder.query({
            query: (profile_id) => ({
                url: '/jobseeker/notification',
                params: { profile_id },
            }),
            transformResponse: (response) => {
                return response.data;
            },
            providesTags: ['Notification'],
        }),
        getNotification: builder.query({
            query: (profile_id) => ({
                url: '/jobseeker/notification',
                params: { profile_id },
            }),
            transformResponse: (response) => {
                return response.data;
            },
            providesTags: ['Notification'],
        }),
        updateReadNotification: builder.mutation({
            query: ({ profile_id, notification_id }) => ({
                url: '/jobseeker/notification',
                method: 'PUT',
                body: { profile_id, notification_id  },
            }),
            transformResponse: (response) => {
                return response;
            },
            invalidatesTags: ['Notification'],
        }),
    })   
});

// Export hooks for usage in components
export const {    
    useGetOverviewMutation,
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
    useDeleteCompanyReviewMutation,
    useGetCompanyReviewQuery,

    useGetJobApplyQuery,
    useAddJobApplyMutation,

    useGetProfileCVQuery,
    useAddProfileCVMutation,
    useDeleteProfileCVMutation,   
    
    useGetNotificationQuery,
    useUpdateReadNotificationMutation

} = jobseekerApi;
