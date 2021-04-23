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
      const { authState, message, token } = action.payload;
      localStorage.setItem("token", token);
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
      dispatch(
        updateAuthState({ authState: "loggedIn", token: response.data })
      );
    })
    .catch(function (error) {
      dispatch(
        updateAuthState({
          authState: "loggedOut",
          message:
            error && error.message ? error.message : "Ungültige Anmeldedaten.",
        })
      );
    })
    .then(function () {
      // always executed
    });
};

export const requestGetData = () => (dispatch) => {
  lefApi
    .getData(userToken, {})
    .then((response) => dispatch(setLocalData(response.data)));
};
