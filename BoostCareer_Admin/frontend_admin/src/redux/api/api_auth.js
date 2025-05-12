import { baseApi } from "./api__base";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/api/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformErrorResponse: (response) => {
        return response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại tên đăng nhập và mật khẩu.";
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/api/auth/logout",
        method: "POST",
      }),
      transformErrorResponse: (response) => {
        return response?.data?.message || "Đăng xuất thất bại.";
      },
    }),
    getCurrentUser: builder.query({
      query: () => ({
        url: "/api/auth/me",
        method: "GET",
      }),
      transformErrorResponse: (response) => {
        return response?.data?.message || "Không thể lấy thông tin người dùng.";
      },
    }),
  }),
});

export const { 
  useLoginMutation, 
  useLogoutMutation,
  useGetCurrentUserQuery 
} = authApi;
