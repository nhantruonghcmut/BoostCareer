import { createSlice } from "@reduxjs/toolkit";
import { apijobseekers } from "../api/api_jobseeker";

const initialState = {
    jobseekers: [],
};
const JobseekersSlice = createSlice({
  name: "jobseekers_slice",
  initialState,
reducers: {
    setJobseekers: (state, action) => {
    //   console.log("set jobseekers action");
      state.jobseekers = action.payload;    },
    },
   extraReducers: (builder) => {
    builder.addMatcher(
        apijobseekers.endpoints.fetchjobseekers.matchFulfilled,
        (state, action) => {
            // console.log("Fetched Jobseekers data:", action);
            state.jobseekers = action.payload.jobseekers;
        }
    );
    }, 
});

export const { setJobseekers } = JobseekersSlice.actions;
export default JobseekersSlice.reducer;
