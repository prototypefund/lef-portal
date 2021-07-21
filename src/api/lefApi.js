import { getCurrentUserId, getCurrentUserToken } from "../redux/authSlice";

const axios = require("axios");

export const lefApi = {
  // USER & AUTH
  signUp: (username, password) => {},
  signIn: (username, password) => {
    // return Promise.resolve({ data: { token: "myToken" } });
    return apiRequest("/token/get", {
      email: username,
      password: password,
    });
  },
  getUser: (token) => apiRequest("/user/get", {}, true),

  // REGIONS
  getRegionData: (regionId) => apiRequest("/region/get", { _id: regionId }),
  getAllRegions: () => apiRequest("/region/get", { allRegions: true }),
  createRegion: (name, postalcodes = []) =>
    apiRequest(
      "/region/create",
      {
        postalcodes,
        name,
      },
      true
    ),
  updateRegion: (updatedRegion) =>
    apiRequest("/region/update", { region: updatedRegion }, true),

  // OBJECTIVES
  getObjectiveById: (objectiveId) =>
    apiRequest("/objective/get", { _id: objectiveId }),
  getAllObjectivesForRegion: (regionId) =>
    apiRequest("/objective/get", { regionId }),
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
  getAllActionsForRegion: (regionId) => apiRequest("/action/get", { regionId }),
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

  getClimateChart: (weatherStationId, year, months) =>
    apiRequest("/climatechart/get", { weatherStationId, year, months }),

  getVotingData: (votingId, districtId, districtName) =>
    apiRequest("/voting/get", { _id: votingId, districtId, districtName }),
  deleteAction: (actionId) =>
    apiRequest("/action/delete", { _id: actionId }, true),
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
      // "Content-Type": "application/x-www-form-urlencoded",
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
