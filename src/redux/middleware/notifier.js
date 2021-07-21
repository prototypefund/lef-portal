import { addNotificationMessage } from "../notificationSlice";
import {
  addActionForRegion,
  addObjectiveForRegion,
  removeActionForRegion,
  removeObjectiveForRegion,
  requestUpdateRegion,
  setRegionData,
  updateActionForRegion,
  updateObjectiveForRegion,
  updateRegionData,
} from "../dataSlice";

export const notifier = ({ dispatch }) => (next) => (action) => {
  console.debug("TYPE: ", action.type);
  const message_changesSaved = "Änderungen gespeichert";
  switch (action.type) {
    case updateObjectiveForRegion().type:
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
    case updateRegionData().type:
      dispatch(
        addNotificationMessage(
          message_changesSaved,
          "Ihre Änderungen an dieser Region wurden übernommen."
        )
      );
      break;
    default:
      break;
  }
  return next(action);
};
