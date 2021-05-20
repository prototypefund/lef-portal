import { createSlice } from "@reduxjs/toolkit";

const dataSlice = createSlice({
  name: "data",
  initialState: {
    data: {},
    regionData: [],
    objectiveData: {},
    objectivesForRegion: {},
    actionsForRegion: {},
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
    replaceAllRegionData(state, action) {
      state.regionData = action.payload;
    },
    setObjectivesForRegion(state, action) {
      state.objectivesForRegion[action.payload.regionId] =
        action.payload.objectives;
    },
    setActionsForRegion(state, action) {
      state.actionsForRegion[action.payload.regionId] = action.payload.actions;
    },
  },
});

export const {
  setLocalData,
  setRegionData,
  replaceAllRegionData,
  setObjectiveData,
  setObjectivesForRegion,
  setActionsForRegion,
} = dataSlice.actions;
export default dataSlice.reducer;
