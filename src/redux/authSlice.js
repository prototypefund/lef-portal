import { createSlice } from "@reduxjs/toolkit";
import { lefApi } from "../api/lefApi";
import { setLocalData, setObjectiveData, setRegionData } from "./dataSlice";

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
  localStorage.clear();
  dispatch(updateAuthState({ authState: "loggedOut" }));
};

export const requestGetData = () => (dispatch) => {
  lefApi
    .getData(userToken, {})
    .then((response) => dispatch(setLocalData(response.data)));
};

export const requestGetRegion = (regionId) => (dispatch) => {
  lefApi
    .getRegionData(regionId)
    .then((response) =>
      dispatch(setRegionData({ regionId, data: response.data }))
    );
};

export const requestGetObjective = (objectiveId) => (dispatch) => {
  lefApi
    .getObjective(objectiveId)
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
  tagsString,
  actions = [],
  regionData
) => (dispatch) => {
  const tagsArray =
    tagsString && tagsString !== "" ? tagsString.split(" ") : [];
  lefApi
    .createObjective(
      startDate,
      endDate,
      title,
      description,
      tagsArray,
      actions,
      regionData
    )
    .then((objectiveResponse) => {
      const objectiveId = objectiveResponse.data._id;
      lefApi
        .updateRegion({
          ...regionData,
          objectives: [...regionData.objectives, objectiveId],
        })
        .then((regionResponse) =>
          dispatch(
            setRegionData({
              regionId: regionData._id,
              data: regionResponse.data,
            })
          )
        );
    });
};
