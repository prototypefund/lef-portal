import { combineReducers } from "redux";
import authSlice from "./authSlice";
import dataSlice from "./dataSlice";

export default combineReducers({
  auth: authSlice,
  data: dataSlice,
});
