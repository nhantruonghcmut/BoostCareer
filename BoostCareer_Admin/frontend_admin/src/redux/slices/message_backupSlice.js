import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api_message_backup } from "../api/api_message_backup";

const initialState = {
  messages: [],
  backups: [],};
const message_backupSlice = createSlice({
  name: "message_backup_slice",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      // console.log("set messages action");
      state.messages = action.payload;
    },
    setBackups: (state, action) => {
      // console.log("set backups action");
      state.backups = action.payload;
    }
  },
   extraReducers: (builder) => {
    builder.addMatcher(
        api_message_backup.endpoints.fetch_messages.matchFulfilled,
      (state, action) => {
        // console.log("Fetched jobs data:", action);
        state.jobs = action.payload.jobs;
      }
    );
    builder.addMatcher(
      api_message_backup.endpoints.fetch_backup.matchFulfilled,
      (state, action) => {
        state.backups = action.payload.backups;
      });
    },
});

export const {setMessages,setBackups  } = message_backupSlice.actions;
export default message_backupSlice.reducer;
