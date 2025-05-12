import axios from 'axios';
import store from '../redux_toolkit/store';
import { logout, forceLogout } from '../redux_toolkit/AuthSlice';

// Thiết lập interceptor để xử lý trường hợp token hết hạn hoặc không hợp lệ
const setupAxiosInterceptors = () => {
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Kiểm tra lỗi từ backend
      const errorResponse = error.response;
      
      // Xử lý trường hợp token không hợp lệ hoặc hết hạn
      if (errorResponse && errorResponse.status === 401) {
        // Kiểm tra nếu có mã lỗi yêu cầu đăng xuất
        if (
          errorResponse.data.forceLogout === true || 
          errorResponse.data.errorCode === "AUTH_REQUIRED" ||
          errorResponse.data.errorCode === "TOKEN_INVALID" ||
          errorResponse.data.errorCode === "REFRESH_TOKEN_INVALID"
        ) {
          console.log("Phát hiện lỗi xác thực, tiến hành đăng xuất tự động");          
          // Dispatch action forceLogout để cập nhật Redux store ngay lập tức 
          // thay vì gọi API logout mà có thể thất bại do token không hợp lệ
          store.dispatch(forceLogout());
        }
      }
      
      return Promise.reject(error);
    }
  );
};

export default setupAxiosInterceptors;
