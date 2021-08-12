import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { callApi, lefApi } from "../api/lefApi";

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

/*export const requestUpdateObjective = (updatedObjective) => (dispatch) => {
  dispatch(callApi(() => lefApi.updateObjective(updatedObjective))).then(
    (response) => {
      const { data = {} } = response;
      const { regionId, _id } = data;
      return dispatch(
        updateObjectiveForRegion({
          regionId: regionId,
          objectiveId: _id,
          objective: data,
        })
      );
    }
  );
};*/

export const requestUpdateObjective = createAsyncThunk(
  "objective/update",
  async (updatedObjective, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const response = await dispatch(
      callApi(() => lefApi.updateObjective(updatedObjective))
    );
    const { data = {} } = response;
    const { regionId, _id } = data;
    const returnValue = {
      regionId: regionId,
      objectiveId: _id,
      objective: data,
    };
    return returnValue;
  }
);

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
  extraReducers: {
    [requestUpdateObjective.pending]: (state) => {
      state.isUpdatingObjective = true;
    },
    [requestUpdateObjective.fulfilled]: (state, action) => {
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
      state.isUpdatingObjective = false;
    },
  },
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

export const getRegionDataFromState = (state, regionId) => {
  let regionDataArray = state.data.regionData;
  if (Array.isArray(regionDataArray)) {
    return regionDataArray.find((d) => d._id === regionId) || {};
  }
  return {};
};

// REGIONS

export const requestCreateRegion = (name, postalcodes) => (dispatch) => {
  lefApi
    .createRegion(name, postalcodes)
    .then((response) => console.debug(response));
};

// OBJECTIVES
export const requestCreateObjectiveForRegion = (
  startDate,
  endDate,
  title,
  description,
  tags,
  regionId
) => (dispatch) => {
  lefApi
    .createObjective(startDate, endDate, title, description, tags, regionId)
    .then((response) => {
      dispatch(
        addObjectiveForRegion({
          regionId: response.data.regionId,
          objective: response.data,
        })
      );
    });
};

export const requestDeleteObjective = (objective) => (dispatch) => {
  lefApi.deleteObjective(objective._id).then((response) => {
    return dispatch(removeObjectiveForRegion({ objective }));
  });
};

// ACTIONS
export const requestUpdateAction = (updatedAction) => (dispatch) => {
  lefApi.updateAction(updatedAction).then((response) => {
    const { data = {} } = response;
    const { regionId, _id } = data;
    return dispatch(
      updateActionForRegion({
        regionId: regionId,
        actionId: _id,
        action: data,
      })
    );
  });
};

export const requestCreateActionForRegion = (
  startDate,
  endDate,
  name,
  description,
  budget,
  tags,
  regionId,
  objectiveIds
) => (dispatch) => {
  lefApi
    .createAction(
      startDate,
      endDate,
      description,
      tags,
      budget,
      regionId,
      objectiveIds
    )
    .then((response) => {
      dispatch(
        addActionForRegion({
          regionId: response.data.regionId,
          action: response.data,
        })
      );
    });
};

export const requestDeleteAction = (action) => (dispatch) => {
  lefApi.deleteAction(action._id).then(() => {
    return dispatch(removeActionForRegion({ action }));
  });
};
