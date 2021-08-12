import { isRejectedWithValue } from "@reduxjs/toolkit";
import { addNotificationMessage } from "../notificationSlice";
import { handleApiError } from "../authSlice";

export const apiMiddleware = ({ dispatch }) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    dispatch(handleApiError(action.payload));
  }
  return next(action);
};
