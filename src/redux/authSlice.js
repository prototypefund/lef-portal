import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { callApi, lefApi } from "../api/lefApi";
import { addNotificationMessage } from "./notificationSlice";
import { REQUEST_STATES } from "./consts";

let localUserId = "";

export const getCurrentUserToken = () => localStorage.getItem("token") || null;
export const getCurrentUserId = () => localUserId;

export const AUTH_STATES = {
  loggedIn: "loggedIn",
  loggedOut: "loggedOut",
  logInRequest: "logInRequest",
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    authState: getCurrentUserToken()
      ? AUTH_STATES.loggedIn
      : AUTH_STATES.loggedOut,
    message: "",
    passwordResetMessage: "",
    changePasswordState: REQUEST_STATES.IDLE,
    user: {},
    token: getCurrentUserToken(),
  },
  reducers: {
    updateAuthState: (state, action) => {
      const { authState, message, token, userId } = action.payload;
      if (authState) state.authState = authState;
      if (message) state.message = message;
      if (token) {
        state.token = token;
        localStorage.setItem("token", token);
      }
      if (userId) {
        localUserId = userId;
      }
    },
    setUserData: (state, action) => {
      if (action.payload.user) state.user = action.payload.user;
    },
    setPasswordResetMessage: (state, action) => {
      state.passwordResetMessage = action.payload;
    },
  },
  extraReducers: {},
});

export const {
  updateAuthState,
  setUserData,
  setPasswordResetMessage,
} = authSlice.actions;
export default authSlice.reducer;

/*
export const requestSignIn = (username, password) => (dispatch) => {
  lefApi
    .getToken(username, password)
    .then((response) => {
      if (response.data) {
        localStorage.setItem("token", response.data);
        dispatch(updateAuthState({ authState: AUTH_STATES.loggedIn }));
      }
    })
    .catch(function (error) {
      const { response = {} } = error;
      const { data = {} } = response;
      const { error: errorText } = data;
      dispatch(
        updateAuthState({
          // authState: AUTH_STATES.loggedOut,
          message:
            errorText ||
            "Es konnte keine Verbindung hergestellt werden. Bitte prüfen Sie Ihre Internetverbindung.",
        })
      );
    });
};
*/

export const requestSignOut = () => (dispatch) => {
  localStorage.removeItem("token");
  localStorage.clear();
  dispatch(updateAuthState({ authState: AUTH_STATES.loggedOut }));
};

export const setNewPassword = (email, code, newPassword) => (dispatch) => {
  dispatch(
    callApi(() => lefApi.setNewPassword(email, code, newPassword))
  ).then(() => {});
};

export const requestAddRegionToAccount = () =>
  // regionId, message
  (dispatch) => {
    // TODO send request to LEF team, then
    dispatch(
      addNotificationMessage(
        "Antrag wurde weitergeleitet.",
        "Ihr Antrag auf Hinzufügen einer Region wurde dem LEF-Team übermittelt. " +
          "Nach Prüfung wird die Region Ihrem Account hinzugefügt. Dies kann einige Tage dauern."
      )
    );
  };
