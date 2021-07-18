import { createSlice } from "@reduxjs/toolkit";
import { lefApi } from "../api/lefApi";

export const getCurrentUserToken = () => localStorage.getItem("token");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    authState: getCurrentUserToken() ? "loggedIn" : "loggedOut",
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
      if (response.data) {
        console.debug("Saving token", response.data);
        localStorage.setItem("token", response.data);
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
  localStorage.setItem("token", null);
  localStorage.clear();
  dispatch(updateAuthState({ authState: "loggedOut" }));
};

export const requestGetObjective = (objectiveId) => (dispatch) => {
  lefApi.getObjectiveById(objectiveId);
  /*.then((response) =>
      dispatch(setObjectiveData({ objectiveId, data: response.data }))
    );*/
};
