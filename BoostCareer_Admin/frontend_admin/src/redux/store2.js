import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/api__base"; // Import đúng baseApi
import { apiCatalog } from "./api/api_catalog"; // Import API catalog
import { authApi } from "./api/api_auth"; // Import API auth
import catalogReducer from "./slices/catalogSlice";
import uiReducer from "./slices/uiSlice";
import authReducer from "./slices/authSlice";
import { apijob } from "./api/api_jobs";
import { apiEmployers } from "./api/api_employers";
import { apijobseekers } from "./api/api_jobseeker";

import jobReducer from "./slices/jobSlice";
import EmployersReducer from "./slices/employerSlice";
import JobseekerReducer from "./slices/jobseekerSlice";


export const store = configureStore({
  reducer: {
    Catalog_state: catalogReducer,
    Jobs_state: jobReducer,  // Thêm reducer cho job
    Employers_state: EmployersReducer,  // Thêm reducer cho employer
    Jobseekers_state: JobseekerReducer,  // Thêm reducer cho jobseeker
    auth: authReducer, // Add auth reducer
    ui: uiReducer,
    [baseApi.reducerPath]: baseApi.reducer, // Đăng ký baseApi vào store
    [apiCatalog.reducerPath]: apiCatalog.reducer, // Đăng ký apiCatalog vào store
    [authApi.reducerPath]: authApi.reducer, // Đăng ký authApi vào store
    [apijob.reducerPath]: apijob.reducer, // Đăng ký api job vào store
    [apiEmployers.reducerPath]: apiEmployers.reducer, // Đăng ký api employer vào store
    [apijobseekers.reducerPath]: apijobseekers.reducer, // Đăng ký api jobseeker vào store
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(baseApi.middleware)
      .concat(apiCatalog.middleware).concat(apijob.middleware)
      .concat(apiEmployers.middleware).concat(apijobseekers.middleware)
  
});
// setupListeners: (store.dispatch);
export default store;
