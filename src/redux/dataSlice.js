import { createSlice } from "@reduxjs/toolkit";
import { lefApi } from "../api/lefApi";

const dataSlice = createSlice({
  name: "data",
  initialState: {
    data: {},
    regionData: {},
  },
  reducers: {
    setLocalData(state, action) {
      state.data = action.payload;
    },
    setRegionData(state, action) {
      state.regionData[action.payload.regionId] = action.payload.data;
    },
  },
});

export const { setLocalData, setRegionData } = dataSlice.actions;
export default dataSlice.reducer;
