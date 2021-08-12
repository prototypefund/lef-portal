import { createSlice } from "@reduxjs/toolkit";
import { lefApi } from "../api/lefApi";

const updateRegionInArray = (state, action) => {
  const currentRegionIndex = state.regionData.findIndex(
    (r) => r._id === action.payload.regionId
  );
  if (currentRegionIndex > -1) {
    state.regionData[currentRegionIndex] = { ...action.payload.data };
  } else {
    state.regionData.push({ ...action.payload.data });
  }
};

const dataSlice = createSlice({
  name: "data",
  initialState: {
    regionData: [],
    objectivesForRegion: {},
    actionsForRegion: {},
    isFetchingAllRegions: false,
    isFetchingObjectivesForRegion: false,
    isFetchingActionsForRegion: false,
    isUpdatingObjective: false,
  },
  reducers: {
    setRegionData(state, action) {
      updateRegionInArray(state, action);
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
    removeObjectiveForRegion(state, action) {
      const { payload } = action;
      const { objective = {} } = payload;
      const { regionId, _id: objectiveId } = objective;
      const { objectivesForRegion = {} } = state;
      const currentObjectives = objectivesForRegion[regionId] || [];
      const index = currentObjectives.findIndex(
        (objective) => objective._id === objectiveId
      );
      if (index > -1) {
        delete state.objectivesForRegion[regionId][index];
      }
    },
    removeActionForRegion(state, action) {
      const { payload } = action;
      const { action: myAction = {} } = payload;
      const { regionId, _id: actionId } = myAction;
      const { actionsForRegion = {} } = state;
      const currentActions = actionsForRegion[regionId] || [];
      const index = currentActions.findIndex((a) => a._id === actionId);
      if (index > -1) {
        delete state.actionsForRegion[regionId][index];
      }
    },
  },
  extraReducers: {},
});

export const {
  setRegionData,
  replaceAllRegionData,
  updateActionForRegion,
  addObjectiveForRegion,
  addActionForRegion,
  removeObjectiveForRegion,
  removeActionForRegion,
} = dataSlice.actions;
export default dataSlice.reducer;

// REGIONS
export const requestCreateRegion = (name, postalcodes) => () => {
  lefApi
    .createRegion(name, postalcodes)
    .then((response) => console.debug(response));
};
