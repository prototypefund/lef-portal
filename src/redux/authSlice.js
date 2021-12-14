import { createSlice } from "@reduxjs/toolkit";
import { addNotificationMessage } from "./notificationSlice";
import { REQUEST_STATES } from "./consts";

let localUserId = "";

export const getCurrentUserToken = () =>
  sessionStorage.getItem("token") || null;
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
      console.debug("---------------------------");
      console.debug({
        authState: state.authState,
        message: state.message,
        token: state.token,
        userId: state.userId,
      });
      console.debug({ authState, message, token, userId });
      state.authState = authState || state.authState;
      state.message = message;
      state.token =
        state.authState === AUTH_STATES.loggedOut
          ? null
          : token
          ? token
          : state.token;
      localUserId = userId || null;
      state.userId = userId || state.userId;
      if (token) {
        sessionStorage.setItem("token", token);
      }
      console.debug({
        authState: state.authState,
        message: state.message,
        token: state.token,
        userId: state.userId,
      });
    },
  },
  extraReducers: {},
});

export const { updateAuthState } = authSlice.actions;
export default authSlice.reducer;

export const requestSignOut = () => (dispatch) => {
  sessionStorage.clear();
  dispatch(updateAuthState({ authState: AUTH_STATES.loggedOut, token: null }));
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
