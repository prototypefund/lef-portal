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

  getRegionData: (regionId) => apiRequest("/region/get", { _id: regionId }),
  getAllRegions: () => apiRequest("/region/get", { allRegions: true }),
  createRegion: (name, postalcodes = []) =>
    apiRequest("/region/create", {
      postalcodes,
      name,
    }),
  updateRegion: (updatedRegion) =>
    apiRequest("/region/update", { region: updatedRegion }),

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
};

const apiRequest = (path, body, token, method = "post") => {
  console.debug("ApiRequest:", path, body);
  const config = {
    method,
    url: `http://localhost:8080${path}`,
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
