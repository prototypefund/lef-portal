import { createSlice } from "@reduxjs/toolkit";
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
  },
  extraReducers: {},
});

export const { updateAuthState } = authSlice.actions;
export default authSlice.reducer;

export const requestSignOut = () => (dispatch) => {
  localStorage.removeItem("token");
  localStorage.clear();
  dispatch(updateAuthState({ authState: AUTH_STATES.loggedOut }));
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
