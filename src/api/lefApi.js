const axios = require("axios");

export const lefApi = {
  signUp: (username, password) => {},
  signIn: (username, password) => {
    return Promise.resolve({ data: { token: "myToken" } });
    /* return apiRequest("/token/get", {
                  email: username,
                  password: password,
                });*/
  },

  // REGIONS
  getRegionData: (regionId) => apiRequest("/region/get", { _id: regionId }),
  getAllRegions: () => apiRequest("/region/get", { allRegions: true }),
  createRegion: (name, postalcodes = []) =>
    apiRequest("/region/create", {
      postalcodes,
      name,
    }),
  updateRegion: (updatedRegion) =>
    apiRequest("/region/update", { region: updatedRegion }),

  // OBJECTIVES
  getObjectiveById: (objectiveId) =>
    apiRequest("/objective/get", { _id: objectiveId }),
  getAllObjectivesForRegion: (regionId) =>
    apiRequest("/objective/get", { regionId }),
  createObjective: (startDate, endDate, title, description, tags, regionId) =>
    apiRequest("/objective/create", {
      startDate,
      endDate,
      title,
      description,
      tags,
      regionId,
    }),
  updateObjective: (updatedObjective) =>
    apiRequest("/objective/update", { objective: updatedObjective }),
  deleteObjective: (objectiveId) =>
    apiRequest("/objective/delete", { _id: objectiveId }),

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
    apiRequest("/action/create", {
      startDate,
      endDate,
      description,
      tags,
      budget,
      regionId,
      objectiveIds,
    }),
  updateAction: (updatedAction) =>
    apiRequest("/action/update", { action: updatedAction }),

  getClimateChart: (weatherStationId, year, months) =>
    apiRequest("/climatechart/get", { weatherStationId, year, months }),

  getVotingData: (votingId, districtId, districtName) =>
    apiRequest("/voting/get", { _id: votingId, districtId, districtName }),
  deleteAction: (actionId) => apiRequest("/action/delete", { _id: actionId }),
};

const apiRequest = (path, body, token, method = "post") => {
  console.debug("ApiRequest:", path, body);
  const config = {
    method,
    url: `https://us-central1-lef-backend.cloudfunctions.net/app ${path}`,
    headers: {
      //
      ...(token && {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      }),
    },
    data: body,
  };
  return axios(config);
};
