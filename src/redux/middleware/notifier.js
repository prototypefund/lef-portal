import { addNotificationMessage } from "../notificationSlice";
import { AUTH_STATES, updateAuthState } from "../authSlice";
import { lefReduxApi } from "../lefReduxApi";
import { isRejected, isRejectedWithValue } from "@reduxjs/toolkit";

const message_changesSaved = "Änderungen gespeichert";
const message_changesPending = "Änderungen werden gespeichert";
const message_thatDidntWentWell = "Das hat leider nicht geklappt..";
const message_technicalError = "Technischer Fehler";

export const notifier = ({ dispatch }) => (next) => (action) => {
  // console.debug("TYPE: ", action);
  const notify = (title, message, type = "success") => {
    dispatch(addNotificationMessage(title, message, type));
  };

  if (isRejectedWithValue(action) || isRejected(action)) {
    const { payload = {} } = action;
    const { data = {} } = payload;
    const { code, message } = data;
    console.error("API ERROR", action, code, message);
    if (code) {
      switch (code) {
        case "JsonWebTokenError": // deprecated
        case "TokenExpiredError": // deprecated
        case "TOKEN_INVALID_ERROR": // invalid token, ask user to signIn again
          dispatch(updateAuthState({ authState: AUTH_STATES.logInRequest }));
          break;

        // ERRORS CAUSED BY HUMANS
        case "LOGIN_ERROR":
        case "EMAIL_ERROR":
        case "RESET_CODE_ERROR":
        case "RESET_CODE_EXPIRED_ERROR":
          notify(message_thatDidntWentWell, message, "warning");
          break;
        case "NO_RIGHTS_FOR_REGION_ERROR":
          notify(
            "Zugriff nicht möglich",
            "Sie verfügen für diese Aktion nicht über die notwendigen Rechte. Bitte loggen Sie sich ggf. mit einem anderen Account ein, um diese Aktion durchzuführen.",
            "warning"
          );
          break;

        // TECHNICAL ERRORS
        case "NO_API_FOR_THIS_CALL_ERROR":
        case "NO_OBJECT_FOR_ID_ERROR":
        case "NO_OBJECT_FOR_ATTRIBUTE_ERROR":
        case "INTERNAL_SERVER_ERROR":
        case "NO_VALID_SIGNATURE_FOR_API_CALL_ERROR":
        case "NO_OBJECTID_OR_INVALID_ERROR":
        case "NO_REGION_IN_OBJECT_ERROR":
        case "USER_NOT_MATCHING_TOKEN_ERROR":
          notify(
            message_technicalError,
            `Es gab einen technischen Fehler. Probieren Sie es später noch einmal oder nehmen Sie mit uns Kontakt auf. (Fehlerdetails: ${message})`,
            "warning"
          );
          break;

        default:
          notify(
            "Unbekannter Fehler",
            "Ein unbekannter Fehler ist aufgetreten.",
            "warning"
          );
          break;
      }
    }
  } else {
    const { code, message } = action;
    if (code) {
      switch (code) {
        // SUCCESS MESSAGES TO DISPLAY
        case "EMAIL_SUCCESS":
        case "RESET_PASSWORD_SUCCESS":
        case "CREATE_SUCCESS":
        case "UPDATE_SUCCESS":
        case "DELETE_SUCCESS":
        case "USER_RIGHTS_SUCCESS":
          notify("Aktion erfolgreich", message, "success");
          break;

        // SUCCESS MESSAGES NOT TO DISPLAY
        case "GET_SUCCESS":
        default:
          break;
      }
    }
  }

  const localNotifications = [
    [
      lefReduxApi.endpoints.updateRegion.matchPending(action),
      message_changesPending,
      "Ihre Änderungen an dieser Region werden gespeichert..",
      "info",
    ],
    [
      lefReduxApi.endpoints.updateObjective.matchPending(action),
      message_changesPending,
      "Ihre Änderungen an diesem Ziel werden gespeichert..",
      "info",
    ],
    [
      lefReduxApi.endpoints.updateAction.matchPending(action),
      message_changesPending,
      "Ihre Änderungen an dieser Maßnahme werden gespeichert..",
      "info",
    ],
    [
      lefReduxApi.endpoints.updateRegion.matchFulfilled(action),
      message_changesSaved,
      "Ihre Änderungen an dieser Region wurden übernommen.",
    ],
    [
      lefReduxApi.endpoints.updateObjective.matchFulfilled(action),
      message_changesSaved,
      "Ihre Änderungen an diesem Ziel wurden übernommen.",
    ],
    [
      lefReduxApi.endpoints.updateAction.matchFulfilled(action),
      message_changesSaved,
      "Ihre Änderungen an dieser Maßnahme wurden übernommen.",
    ],
    [
      lefReduxApi.endpoints.createAction.matchFulfilled(action),
      message_changesSaved,
      "Ihre Maßnahme wurde erstellt.",
    ],
    [
      lefReduxApi.endpoints.createObjective.matchFulfilled(action),
      message_changesSaved,
      "Ihr Ziel wurde erstellt.",
    ],
    [
      lefReduxApi.endpoints.createAction.matchPending(action),
      message_changesPending,
      "Ihre Maßnahme wird erstellt..",
      "info",
    ],
    [
      lefReduxApi.endpoints.createObjective.matchPending(action),
      message_changesPending,
      "Ihr Ziel wird erstellt..",
      "info",
    ],
    [
      lefReduxApi.endpoints.deleteAction.matchFulfilled(action),
      message_changesSaved,
      "Die Maßnahme wurde gelöscht.",
    ],
    [
      lefReduxApi.endpoints.deleteAction.matchPending(action),
      message_changesPending,
      "Die Maßnahme wird gelöscht..",
      "info",
    ],
    [
      lefReduxApi.endpoints.deleteObjective.matchFulfilled(action),
      message_changesSaved,
      "Das Ziel wurde gelöscht.",
    ],
    [
      lefReduxApi.endpoints.deleteObjective.matchPending(action),
      message_changesPending,
      "Das Ziel wird gelöscht..",
      "info",
    ],
    [
      lefReduxApi.endpoints.changePassword.matchFulfilled(action),
      message_changesSaved,
      "Ihr Passwort wurde erfoglreich geändert.",
    ],
    [
      lefReduxApi.endpoints.changePassword.matchPending(action),
      message_changesPending,
      "Passwort wird geändert..",
      "info",
    ],
  ];

  localNotifications.forEach((rule) => {
    const [condition, title, message, type] = rule;
    if (condition) {
      notify(title, message, type);
    }
  });

  return next(action);
};
