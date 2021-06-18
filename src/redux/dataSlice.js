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
    updateObjectiveForRegion(state, action) {
      const { payload } = action;
      const { regionId, objectiveId, objective } = payload;
      const { objectivesForRegion = {} } = state;
      const currentObjectives = objectivesForRegion[regionId] || [];
      const index = currentObjectives.findIndex(
        (objective) => objective._id === objectiveId
      );
      if (index > -1) {
        state.objectivesForRegion[regionId][index] = objective;
      } else {
        state.objectivesForRegion[regionId] = [objective];
      }
    },
    addObjectiveForRegion(state, action) {
      state.objectivesForRegion[action.payload.regionId].push(
        action.payload.objective
      );
    },
    addActionForRegion(state, action) {
      state.actionsForRegion[action.payload.regionId].push(
        action.payload.action
      );
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
    updateActionForRegion(state, action) {
      const { payload } = action;
      const { regionId, actionId, action: a } = payload;
      const { actionsForRegion = {} } = state;
      const currentActions = actionsForRegion[regionId] || [];
      const index = currentActions.findIndex(
        (action) => action._id === actionId
      );
      if (index > -1) {
        state.actionsForRegion[regionId][index] = a;
      } else {
        state.actionsForRegion[regionId] = [a];
      }
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
  updateActionForRegion,
  updateObjectiveForRegion,
  addObjectiveForRegion,
  addActionForRegion,
} = dataSlice.actions;
export default dataSlice.reducer;

export const getRegionDataFromState = (state, regionId) => {
  let regionDataArray = state.data.regionData;
  if (Array.isArray(regionDataArray)) {
    return regionDataArray.find((d) => d._id === regionId) || {};
  }
  return {};
};
