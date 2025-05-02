import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apijob } from "../api/api_jobs";

const initialState = {
  jobs: []};
const jobSlice = createSlice({
  name: "Jobs_slice",
  initialState,
  reducers: {
    setjobs: (state, action) => {
      // console.log("seetjob action");
      state.jobs = action.payload;
    },    
  },
   extraReducers: (builder) => {
    builder.addMatcher(
      apijob.endpoints.fetchJobs.matchFulfilled,
      (state, action) => {
        // console.log("Fetched jobs data:", action);
        state.jobs = action.payload.jobs;
      }
    );
    },
});

export const { setjobs } = jobSlice.actions;
export default jobSlice.reducer;
