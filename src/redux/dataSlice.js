import { createSlice } from "@reduxjs/toolkit";
import { lefApi } from "../api/lefApi";

const dataSlice = createSlice({
  name: "data",
  initialState: {
    data: {},
    regionData: {},
    objectiveData: {},
  },
  reducers: {
    setLocalData(state, action) {
      state.data = action.payload;
    },
    setRegionData(state, action) {
      state.regionData[action.payload.regionId] = action.payload.data;
    },
    setObjectiveData(state, action) {
      state.objectiveData[action.payload.objectiveId] = action.payload.data;
    },
  },
});

export const {
  setLocalData,
  setRegionData,
  setObjectiveData,
} = dataSlice.actions;
export default dataSlice.reducer;
