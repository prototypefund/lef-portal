import { createSlice } from "@reduxjs/toolkit";
import { lefApi } from "../api/lefApi";
import { getRandomId } from "../utils/utils";
import { add } from "husky";

let userToken = localStorage.getItem("token");

const notificationSlice = createSlice({
  name: "notification",
  initialState: [],
  reducers: {
    addNotification: (state, action) => {
      const { title, message, type, id } = action.payload;
      state.push({ title, message, type, id, timestamp: new Date().getTime() });
    },
    removeNotification: (state, action) => {
      return state.filter(
        (notification) => notification.id !== action.payload.id
      );
    },
  },
});

export const {
  addNotification,
  removeNotification,
} = notificationSlice.actions;
export default notificationSlice.reducer;

export const addNotificationMessage = (title, message, type) => (dispatch) => {
  const id = getRandomId();
  dispatch(addNotification({ title, message, type, id }));
  setTimeout(() => {
    dispatch(removeNotification({ id }));
  }, 5000);
};
