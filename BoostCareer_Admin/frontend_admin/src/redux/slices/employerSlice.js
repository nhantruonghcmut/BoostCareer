import { createSlice } from "@reduxjs/toolkit";
import { apiEmployers } from "../api/api_employers";

const initialState = {
  employers: [],
  loading: false,
  error: null,
  totalPages: 1
};

const EmployersSlice = createSlice({
  name: "Employers_slice",
  initialState,
  reducers: {
    setEmployers: (state, action) => {
      state.employers = action.payload;
    },
    clearEmployerErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch employers
    builder.addMatcher(
      apiEmployers.endpoints.fetchEmployers.matchPending,
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );
    builder.addMatcher(
      apiEmployers.endpoints.fetchEmployers.matchFulfilled,
      (state, action) => {
        state.loading = false;
        state.employers = action.payload.employers || [];
        state.totalPages = action.payload.totalPages || 1;
      }
    );
    builder.addMatcher(
      apiEmployers.endpoints.fetchEmployers.matchRejected,
      (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch employers";
      }
    );
    
    // Handle delete, update status, etc. operations
    const mutations = [
      'delete_Employers', 
      'update_Employers', 
      'update_status_Employers', 
      'send_message_employer', 
      'reset_Password_employer'
    ];
    
    mutations.forEach(mutation => {
      builder
        .addMatcher(
          apiEmployers.endpoints[mutation].matchRejected,
          (state, action) => {
            state.error = action.payload || `Failed to perform ${mutation}`;
          }
        );
    });
  }, 
});

export const { setEmployers, clearEmployerErrors } = EmployersSlice.actions;
export default EmployersSlice.reducer;
