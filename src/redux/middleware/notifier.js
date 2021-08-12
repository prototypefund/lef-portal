import { addNotificationMessage } from "../notificationSlice";
import {
  addActionForRegion,
  addObjectiveForRegion,
  removeActionForRegion,
  removeObjectiveForRegion,
  requestUpdateObjective,
  updateActionForRegion,
} from "../dataSlice";
import { requestChangePassword } from "../authSlice";
import { lefReduxApi } from "../lefReduxApi";

export const notifier = ({ dispatch }) => (next) => (action) => {
  // console.debug("TYPE: ", action);
  const message_changesSaved = "Änderungen gespeichert";
  const { meta = {} } = action;
  const { arg = {} } = meta || {};
  const { endpointName } = arg;
  if (endpointName) console.debug(endpointName);

  if (lefReduxApi.endpoints.updateRegion.matchFulfilled(action)) {
    dispatch(
      addNotificationMessage(
        message_changesSaved,
        "Ihre Änderungen an dieser Region wurden übernommen."
      )
    );
  }

  switch (action.type) {
    case requestUpdateObjective.fulfilled.type:
      dispatch(
        addNotificationMessage(
          message_changesSaved,
          "Ihre Änderungen an diesem Ziel wurden übernommen."
        )
      );
      break;
    case addObjectiveForRegion().type:
      dispatch(
        addNotificationMessage(message_changesSaved, "Das Ziel wurde erstellt.")
      );
      break;
    case removeObjectiveForRegion().type:
      dispatch(
        addNotificationMessage(message_changesSaved, "Das Ziel wurde gelöscht.")
      );
      break;
    case updateActionForRegion().type:
      dispatch(
        addNotificationMessage(
          message_changesSaved,
          "Ihre Änderungen an dieser Maßnahme wurden übernommen."
        )
      );
      break;
    case addActionForRegion().type:
      dispatch(
        addNotificationMessage(
          message_changesSaved,
          "Die Maßnahme wurde erstellt."
        )
      );
      break;
    case removeActionForRegion().type:
      dispatch(
        addNotificationMessage(
          message_changesSaved,
          "Die Maßnahme wurde gelöscht."
        )
      );
      break;
    case requestChangePassword.fulfilled.type:
      dispatch(
        addNotificationMessage(
          message_changesSaved,
          "Ihr Passwort wurde erfolgreich geändert."
        )
      );
      break;
    case requestChangePassword.rejected.type:
      dispatch(
        addNotificationMessage(
          message_changesSaved,
          "Beim Ändern des Passworts ist ein Fehler aufgetreten. Bitte prüfen Sie, ob das bisherige Passwort korrekt ist.",
          "Warning"
        )
      );
      break;
    default:
      break;
  }
  return next(action);
};
