import { createSlice } from "@reduxjs/toolkit";
import { lefApi } from "../api/lefApi";
import { setLocalData } from "./dataSlice";

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
