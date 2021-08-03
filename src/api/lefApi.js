import {
  getCurrentUserId,
  getCurrentUserToken,
  handleApiError,
} from "../redux/authSlice";

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
  getUser: () => apiRequest("/user/get", {}, true),
  resetPassword(email) {
    return Promise.resolve({ data: { message: "Test" } });
    // TODO remove mockup
    return apiRequest("/password/reset", { email });
  },
  setNewPassword: (email, key, newPassword) =>
    apiRequest("/password/set", { email, key, password: newPassword }),

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
    apiRequest("/climatechart/get", {
      weatherStationName: "Münster",
      year,
      months,
    }),
  createClimateChart: () =>
    apiRequest("/weatherstationdata/create", { fromFile: true }, true),
  getAllClimateStations: () =>
    apiRequest("/weatherstationdata/get", { allData: true }, true),
  getWeatherStationDataById: (id) =>
    apiRequest("/weatherstationdata/get", { _id: id }, true),

  getVotingData: (votingId, districtId, districtName) =>
    apiRequest("/voting/get", { _id: votingId, districtId, districtName }),
  deleteAction: (actionId) =>
    apiRequest("/action/delete", { _id: actionId }, true),
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
    //if (!token) {
    //  return Promise.reject({ error: "tokenMissing" });
    //}
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
