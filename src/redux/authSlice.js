import { createSlice } from "@reduxjs/toolkit";
import { lefApi } from "../api/lefApi";
import { addNotificationMessage } from "./notificationSlice";

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
      const { response = {} } = error;
      const { data = {} } = response;
      const { error: errorText } = data;
      dispatch(
        updateAuthState({
          authState: "loggedOut",
          message:
            errorText ||
            "Es konnte keine Verbindung hergestellt werden. Bitte prüfen Sie Ihre Internetverbindung.",
        })
      );
    });
};

export const requestSignOut = () => (dispatch) => {
  localStorage.setItem("token", null);
  localStorage.clear();
  dispatch(updateAuthState({ authState: "loggedOut" }));
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
