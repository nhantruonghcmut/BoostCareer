import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import domain from '../config/domain';

export const loginUser = createAsyncThunk('auth/login',
    async ({username, password},{ rejectWithValue }) => {
        try{
          console.log("bat dau chay loginUser chay api");
            const response = await axios.post(`${domain}/auth/login`, {params: {username, password}}, {withCredentials: true});
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Đăng nhập thất bại!');
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
   
      
      return response.data;
    } catch (error) {
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
        })

        .addCase(logout.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(logout.fulfilled, (state, action) => {
          state.loading = false;
          state.isLogin = false;
          state.user = null;
        });




    }
  });
  
  export default authSlice.reducer;