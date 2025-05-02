import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import domain from '../config/domain';
// import { toast } from 'react-toastify';



export const loginUser = createAsyncThunk('auth/login',
    async ({username, password},{ rejectWithValue }) => {
        try{
          console.log("bat dau chay loginUser chay api");
            const response = await axios.post(`${domain}/auth/login`, {params: {username, password}}, {withCredentials: true});
            if (response.data.data?.token) {
              localStorage.setItem('token', response.data.data.token);
          }
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Đăng nhập thất bại!');
        }
    }
);

export const checkLoginStatus = createAsyncThunk('auth/check',
    async (_,{rejectWithValue}) => {
      console.log("checkLoginStatus chay");
        try {
            const token = localStorage.getItem('token');
            if (!token) {
              console.log("Not logged in");
                return rejectWithValue('Not logged in');
            }
            const response = await axios.get(`${domain}/auth/check`, 
                {   withCredentials: true, 
                    // headers: {Authorization: `Bearer ${token}`}
                  } );
            return response.data;
        }        
        catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Lỗi xác thực!');
        }
    }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${domain}/auth/logout`, { 
        withCredentials: true 
      });
      
      // Always remove token regardless of response to ensure user is logged out locally
      localStorage.removeItem('token');
      
      return response.data;
    } catch (error) {
      // Still remove token even if API call fails
      localStorage.removeItem('token');
      return rejectWithValue(error.response?.data?.message || 'Đăng xuất thất bại');
    }
  }
);
  
  export const registerUser = createAsyncThunk(
    'auth/register',
    async (dataRegister, { rejectWithValue }) => {
      try {
        const response = await axios.post(
          `${domain}/auth/register`,
          { params:  dataRegister  },
          { withCredentials: true }
        );        
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Đăng ký thất bại!');
      }
    }
  );

  const authSlice = createSlice({
    name: 'auth',
    initialState: {
      isLogin: false,
      user: null,
      loading: false,
      error: null
    },
    reducers: {
      // Any additional synchronous reducers can go here
    },
    extraReducers: (builder) => {
      builder
        // Login
        .addCase(loginUser.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
          console.log("dang chay reducer loginUser", action);
          state.loading = false;
          state.isLogin = true;
          state.user = action.payload.data.user;
        })
        .addCase(loginUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        
        // Check login status
        .addCase(checkLoginStatus.fulfilled, (state, action) => {
          state.isLogin = true;
          console.log("checkLoginStatus chay reducer", action);
          state.user = action.payload.data.user;
        })
        .addCase(checkLoginStatus.rejected, (state) => {
          state.isLogin = false;
          state.user = null;
        })
        
        // Logout
        .addCase(logout.fulfilled, (state) => {
          console.log('Logout success');
          state.isLogin = false;
          state.user = null;
        })
        
        // Register
        .addCase(registerUser.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
          state.loading = false;
          state.isLogin = false;
          // state.user = action.payload;
          state.user= null;
        })
        .addCase(registerUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    }
  });
  
  export default authSlice.reducer;