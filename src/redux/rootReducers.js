import { combineReducers } from "redux";
import authSlice from "./authSlice";
import dataSlice from "./dataSlice";
import climateSlice from "./climateSlice";
import votingSlice from "./votingSlice";
import notificationSlice from "./notificationSlice";

export default combineReducers({
  auth: authSlice,
  data: dataSlice,
  climate: climateSlice,
  voting: votingSlice,
  notifications: notificationSlice,
});
