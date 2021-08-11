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
    [requestChangePassword.rejected]: (state) => {
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
  console.debug("ERROR", error.response.data);
  if (error.response.data && error.response.data.name) {
    switch (error.response.data.name) {
      case "JsonWebTokenError": // token is completely wrong
      case "TokenExpiredError": // token expired, ask user to signIn again
        dispatch(updateAuthState({ authState: AUTH_STATES.logInRequest }));
        break;
      default:
        break;
    }
  } else if (["Unauthorized", "Forbidden"].includes(error.response.data)) {
    // user tried to access a resource that they have no access to
    dispatch(
      addNotificationMessage(
        "Zugriff nicht möglich",
        "Sie verfügen für diese Aktion nicht über die notwendigen Rechte. Bitte loggen Sie sich ggf. mit einem anderen Account ein, um diese Aktion durchzuführen."
      )
    );
  }
};

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

export const requestResetPassword = (email) => (dispatch) => {
  dispatch(setPasswordResetMessage(""));
  dispatch(callApi(() => lefApi.resetPassword(email))).then((response) => {
    dispatch(setPasswordResetMessage(response.data.message));
  });
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
