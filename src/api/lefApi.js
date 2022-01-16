import { getCurrentUserId, getCurrentUserToken } from "../redux/authSlice";

const axios = require("axios");

export const lefApi = {
  // USER & AUTH
  setNewPassword: (email, key, newPassword) =>
    apiRequest("/password/reset", { email, key, password: newPassword }),
};

const apiRequest = (path, body, secure = false, method = "post") => {
  let token = null;
  if (secure) {
    token = getCurrentUserToken();
  }
  console.debug("ApiRequest:", path, body, token);
  const config = {
    method,
    url: `https://us-central1-lef-backend.cloudfunctions.net/app${path}`,
    headers: {
      "Access-Control-Allow-Origin": "*",
      ...(secure &&
        token && {
          Authorization: `Bearer ${token}`,
        }),
    },
    data: { ...body, ...(secure && { userId: getCurrentUserId() }) },
  };
  return axios(config);
};
