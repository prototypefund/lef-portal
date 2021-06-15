import { createSlice } from "@reduxjs/toolkit";
import { lefApi } from "../api/lefApi";
import {
  replaceAllRegionData,
  setActionsForRegion,
  setObjectiveData,
  setObjectivesForRegion,
  setRegionData,
} from "./dataSlice";

let userToken = localStorage.getItem("token");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    authState: userToken ? "loggedIn" : "loggedOut",
    message: "",
  },
  reducers: {
    updateAuthState: (state, action) => {
      const { authState, message } = action.payload;
      return { authState, message };
    },
  },
});

export const { updateAuthState } = authSlice.actions;
export default authSlice.reducer;

export const requestSignIn = (username, password) => (dispatch) => {
  lefApi
    .signIn(username, password)
    .then((response) => {
      if (response.data.token) {
        console.debug("Saving token", response.data.token);
        localStorage.setItem("token", response.data.token);
      }
      dispatch(updateAuthState({ authState: "loggedIn" }));
    })
    .catch(function (error) {
      dispatch(
        updateAuthState({
          authState: "loggedOut",
          message:
            error && error.message ? error.message : "Ungültige Anmeldedaten.",
        })
      );
    });
};

export const requestSignOut = () => (dispatch) => {
  userToken = null;
  localStorage.setItem("token", null);
  localStorage.clear();
  dispatch(updateAuthState({ authState: "loggedOut" }));
};

export const requestGetRegion = (regionId) => (dispatch) => {
  lefApi
    .getRegionData(regionId)
    .then((response) =>
      dispatch(setRegionData({ regionId, data: response.data }))
    );
};

export const requestGetAllRegions = () => (dispatch) => {
  lefApi
    .getAllRegions()
    .then((response) => dispatch(replaceAllRegionData(response.data)));
};

export const requestGetAllObjectivesForRegion = (regionId) => (dispatch) => {
  lefApi.getAllObjectivesForRegion(regionId).then((response) => {
    dispatch(setObjectivesForRegion({ regionId, objectives: response.data }));
  });
};

export const requestGetAllActionsForRegion = (regionId) => (dispatch) => {
  lefApi
    .getAllActionsForRegion(regionId)
    .then((response) =>
      dispatch(setActionsForRegion({ regionId, actions: response.data }))
    );
};

export const requestGetObjective = (objectiveId) => (dispatch) => {
  lefApi
    .getObjectiveById(objectiveId)
    .then((response) =>
      dispatch(setObjectiveData({ objectiveId, data: response.data }))
    );
};

export const requestCreateRegion = (name, postalcodes) => (dispatch) => {
  lefApi
    .createRegion(name, postalcodes)
    .then((response) => console.debug(response));
};

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
    .then(() => dispatch(requestGetRegion(regionId)));
};

export const requestUpdateObjective = (updatedObjective) => (dispatch) => {
  lefApi.updateObjective(updatedObjective).then((response) => {
    dispatch(
      setObjectiveData({
        objectiveId: updatedObjective._id,
        data: response.data,
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
) => () => {
  lefApi.createAction(
    startDate,
    endDate,
    description,
    tags,
    budget,
    regionId,
    objectiveIds
  );
};

export const requestUpdateAction = (updatedAction) => () => {
  lefApi.updateAction(updatedAction);
};
