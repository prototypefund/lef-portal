import {
  getCurrentUserId,
  getCurrentUserToken,
  handleApiError,
} from "../redux/authSlice";

const axios = require("axios");

export const lefApi = {
  // USER & AUTH
  resetPassword(email) {
    return apiRequest("/resetCode/create", { email });
  },
  setNewPassword: (email, key, newPassword) =>
    apiRequest("/password/reset", { email, key, password: newPassword }),
  changePassword: (email, oldPassword, newPassword) =>
    apiRequest("/password/change", { email, oldPassword, newPassword }, true),

  // REGIONS
  createRegion: (name, postalcodes = []) =>
    apiRequest(
      "/region/create",
      {
        postalcodes,
        name,
      },
      true
    ),

  // OBJECTIVES
  createObjective: (startDate, endDate, title, description, tags, regionId) =>
    apiRequest(
      "/objective/create",
      {
        startDate,
        endDate,
        title,
        description,
        tags,
        regionId,
      },
      true
    ),
  updateObjective: (updatedObjective) =>
    apiRequest("/objective/update", { objective: updatedObjective }, true),
  deleteObjective: (objectiveId) =>
    apiRequest("/objective/delete", { _id: objectiveId }, true),

  // ACTIONS
  createAction: (
    startDate,
    endDate,
    description,
    tags = [],
    budget,
    regionId,
    objectiveIds
  ) =>
    apiRequest(
      "/action/create",
      {
        startDate,
        endDate,
        description,
        tags,
        budget,
        regionId,
        objectiveIds,
      },
      true
    ),
  updateAction: (updatedAction) =>
    apiRequest("/action/update", { action: updatedAction }, true),
  deleteAction: (actionId) =>
    apiRequest("/action/delete", { _id: actionId }, true),

  // createClimateChart: () => apiRequest("/weatherstationdata/create", { fromFile: true }, true),
};

export const callApi = (func) => (dispatch) => {
  return func().then(
    (response) => response,
    (error) => {
      dispatch(handleApiError(error));
      return Promise.reject({ error });
    }
  );
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
