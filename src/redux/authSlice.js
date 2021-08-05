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

export const requestChangePassword = createAsyncThunk(
  "password/change",
  async ({ email, oldPassword, newPassword }, thunkAPI) => {
    const { dispatch } = thunkAPI;
    const response = await dispatch(
      callApi(() => lefApi.changePassword(email, oldPassword, newPassword))
    );
    return response;
  }
);

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
  },
  reducers: {
    updateAuthState: (state, action) => {
      const { authState, message } = action.payload;
      if (authState) state.authState = authState;
      if (message) state.message = message;
    },
    setUserData: (state, action) => {
      if (action.payload.user) state.user = action.payload.user;
    },
    setPasswordResetMessage: (state, action) => {
      state.passwordResetMessage = action.payload;
    },
    resetChangePasswordState: (state) => {
      state.passwordResetMessage = REQUEST_STATES.IDLE;
    },
  },
  extraReducers: {
    [requestChangePassword.pending]: (state) => {
      state.changePasswordState = REQUEST_STATES.PENDING;
    },
    [requestChangePassword.fulfilled]: (state) => {
      state.changePasswordState = REQUEST_STATES.FULFILLED;
    },
    [requestChangePassword.rejected]: (state, action) => {
      state.changePasswordState = REQUEST_STATES.REJECTED;
    },
  },
});

export const {
  updateAuthState,
  setUserData,
  setPasswordResetMessage,
  resetChangePasswordState,
} = authSlice.actions;
export default authSlice.reducer;

export const handleApiError = (error) => (dispatch) => {
  console.debug("ERROR", { error });
  if (["Unauthorized", "Forbidden"].includes(error.response.data))
    dispatch(updateAuthState({ authState: AUTH_STATES.logInRequest }));
};

export const requestGetUser = () => (dispatch) => {
  dispatch(callApi(() => lefApi.getUser())).then(
    (response) => {
      localUserId = response.data._id;
      return dispatch(setUserData({ user: response.data }));
    },
    (error) => {
      console.debug(error);
    }
  );
};

export const requestSignIn = (username, password) => (dispatch) => {
  lefApi
    .signIn(username, password)
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

export const requestSignOut = () => (dispatch) => {
  localStorage.removeItem("token");
  localStorage.clear();
  dispatch(updateAuthState({ authState: AUTH_STATES.loggedOut }));
};

export const requestResetPassword = (email) => (dispatch) => {
  dispatch(setPasswordResetMessage(""));
  dispatch(callApi(() => lefApi.resetPassword(email))).then((response) => {
    dispatch(setPasswordResetMessage(response.data.message));
  });
};

export const setNewPassword = (email, code, newPassword) => (dispatch) => {
  dispatch(
    callApi(() => lefApi.setNewPassword(email, code, newPassword))
  ).then((response) => {});
};

export const requestAddRegionToAccount = (regionId, message) => (dispatch) => {
  // TODO send request to LEF team, then
  dispatch(
    addNotificationMessage(
      "Antrag wurde weitergeleitet.",
      "Ihr Antrag auf Hinzufügen einer Region wurde dem LEF-Team übermittelt. " +
        "Nach Prüfung wird die Region Ihrem Account hinzugefügt. Dies kann einige Tage dauern."
    )
  );
};
