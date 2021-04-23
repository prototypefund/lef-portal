import { createSlice } from "@reduxjs/toolkit";
import { lefApi } from "../api/lefApi";

const dataSlice = createSlice({
  name: "data",
  initialState: {},
  reducers: {
    setLocalData: (state, action) => action.payload,
  },
});

export const { setLocalData } = dataSlice.actions;
export default dataSlice.reducer;
