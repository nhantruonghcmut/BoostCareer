import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { forceLogout } from '../redux_toolkit/AuthSlice';
import domain from '../config/domain';

export const baseQueryWithReauth = fetchBaseQuery({ 
  baseUrl: domain,
  credentials: 'include', // Để gửi cookies với mỗi request
});

// Tạo một custom base query để xử lý token hết hạn
export const customBaseQuery = async (args, api, extraOptions) => {
  // Thực hiện request ban đầu
  const result = await baseQueryWithReauth(args, api, extraOptions);
  
  // Nếu nhận được lỗi 401 (Unauthorized)
  if (result.error && result.error.status === 401) {
    const { data } = result.error;
    
    // Kiểm tra xem có phải token đã hết hạn hoặc không hợp lệ
    if (
      data?.forceLogout === true || 
      data?.errorCode === "AUTH_REQUIRED" ||
      data?.errorCode === "TOKEN_INVALID" ||
      data?.errorCode === "REFRESH_TOKEN_INVALID"
    ) {
      console.log('Token đã hết hạn hoặc không hợp lệ, tự động đăng xuất');
      // Dispatch action để đăng xuất
      api.dispatch(forceLogout());
    }
  }
  
  return result;
};
