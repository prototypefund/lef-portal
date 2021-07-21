import { createSlice } from "@reduxjs/toolkit";
import { lefApi } from "../api/lefApi";

let localUserId = "";

export const getCurrentUserToken = () => localStorage.getItem("token");
export const getCurrentUserId = () => localUserId;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    authState: getCurrentUserToken() ? "loggedIn" : "loggedOut",
    message: "",
    user: {},
  },
  reducers: {
    updateAuthState: (state, action) => {
      const { authState, message } = action.payload;
      return { authState, message };
    },
    setUserData: (state, action) => {
      if (action.payload.user) state.user = action.payload.user;
    },
  },
});

export const { updateAuthState, setUserData } = authSlice.actions;
export default authSlice.reducer;

export const requestGetUser = () => (dispatch) => {
  lefApi.getUser(getCurrentUserToken()).then((response) => {
    localUserId = response.data._id;
    return dispatch(setUserData({ user: response.data }));
  });
};

export const requestSignIn = (username, password) => (dispatch) => {
  lefApi
    .signIn(username, password)
    .then((response) => {
      if (response.data) {
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
