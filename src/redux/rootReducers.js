import { combineReducers } from "redux";
import authSlice from "./authSlice";
import dataSlice from "./dataSlice";
import climateSlice from "./climateSlice";
import notificationSlice from "./notificationSlice";
import { lefReduxApi } from "./lefReduxApi";

export default combineReducers({
  auth: authSlice,
  data: dataSlice,
  climate: climateSlice,
  notifications: notificationSlice,
  [lefReduxApi.reducerPath]: lefReduxApi.reducer,
});
