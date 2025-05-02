import { createSlice } from "@reduxjs/toolkit";
import { apiEmployers } from "../api/api_employers";

const initialState = {
    employers: [],
};
const EmployersSlice = createSlice({
  name: "Employers_slice",
  initialState,
  reducers: {
    setEmployers: (state, action) => {
      console.log("set employers action");
      state.employers = action.payload;
    },        
  },
   extraReducers: (builder) => {
    builder.addMatcher(
      apiEmployers.endpoints.fetchEmployers.matchFulfilled,
      (state, action) => {
        console.log("Fetched Employers data:", action);
        state.employers = action.payload.employers;
      }
    );
    }, 
});

export const { setEmployers} = EmployersSlice.actions;
export default EmployersSlice.reducer;
