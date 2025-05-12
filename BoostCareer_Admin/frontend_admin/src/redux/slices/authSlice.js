import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// Using RTK Query api directly instead of importing a non-existent module
import { authApi } from "../api/api_auth";

// Thunk xử lý đăng nhập
export const login = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    // Use fetch directly instead of non-existent API module
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    
    if (!response.ok) {
      return rejectWithValue(data);
    }
    
    localStorage.setItem("token", data.token);
    return data;  } catch (error) {
    return rejectWithValue({ message: error.message || "An error occurred during login" });
  }
});

// Slice quản lý trạng thái Auth
const authSlice = createSlice({
  name: "auth",  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
    authEnabled: false, // Temporarily disable authentication
  },reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("token");
    },
    clearErrors: (state) => {
      state.error = null;
    },
    setAuthEnabled: (state, action) => {
      // For development purposes to easily enable/disable auth
      state.authEnabled = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearErrors, setAuthEnabled } = authSlice.actions;
export default authSlice.reducer;
