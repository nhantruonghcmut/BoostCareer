import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/api__base"; // Import đúng baseApi
import { apiCatalog } from "./api/api_catalog"; // Import API catalog
import catalogReducer from "./slices/catalogSlice";
import uiReducer from "./slices/uiSlice";
import { apijob } from "./api/api_jobs";
import { apiEmployers } from "./api/api_employers";
import { apijobseekers } from "./api/api_jobseeker";
import {api_message_backup} from "./api/api_message_backup";
import jobReducer from "./slices/jobSlice";
import EmployersReducer from "./slices/employerSlice";
import JobseekerReducer from "./slices/jobseekerSlice";
import message_backupSliceReducer from "./slices/message_backupSlice";

export const store = configureStore({
  reducer: {
    Catalog_state: catalogReducer,
    Jobs_state: jobReducer,  // Thêm reducer cho job
    Employers_state: EmployersReducer,  // Thêm reducer cho employer
    Jobseekers_state: JobseekerReducer,  // Thêm reducer cho jobseeker
    Message_backup_state: message_backupSliceReducer,  // Thêm reducer cho message_backup
    ui: uiReducer,
    [baseApi.reducerPath]: baseApi.reducer, // Đăng ký baseApi vào store
    [apiCatalog.reducerPath]: apiCatalog.reducer, // Đăng ký apiCatalog vào store
    [apijob.reducerPath]: apijob.reducer, // Đăng ký api job vào store
    [apiEmployers.reducerPath]: apiEmployers.reducer, // Đăng ký api employer vào store
    [apijobseekers.reducerPath]: apijobseekers.reducer, // Đăng ký api jobseeker vào store
    [api_message_backup.reducerPath]: api_message_backup.reducer, // Đăng ký api message
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(baseApi.middleware)
      .concat(apiCatalog.middleware).concat(apijob.middleware)
      .concat(apiEmployers.middleware).concat(apijobseekers.middleware)
      .concat(api_message_backup.middleware), // Thêm middleware cho api job,
  
});
// setupListeners: (store.dispatch);
export default store;
