const axios = require("axios");

export const lefApi = {
  signUp: (username, password) => {},
  signIn: (username, password) => {
    return apiRequest("/token/get", {
      email: username,
      password: password,
    });
  },
  getData: (token, body) => apiRequest("/methodtests", body, token),
  getRegionData: (regionId) => apiRequest("/region/get", { _id: regionId }),
  createRegion: (name, postalcodes = []) =>
    apiRequest("/region/create", {
      postalcodes,
      name,
    }),
  updateRegion: (updatedRegion) =>
    apiRequest("/region/update", { region: updatedRegion }),
  getObjective: (objectiveId) =>
    apiRequest("/objective/get", { _id: objectiveId }),
  createObjective: (
    startDate,
    endDate,
    title,
    description,
    tags = [],
    actions = []
  ) =>
    apiRequest("/objective/create", {
      startDate,
      endDate,
      title,
      description,
      tags,
      actions,
    }),
  updateObjective: (updatedObjective) =>
    apiRequest("/objective/update", { objective: updatedObjective }),
  createAction: (startDate, endDate, description, tags = [], budget) =>
    apiRequest("/action/create", {
      startDate,
      endDate,
      description,
      tags,
      budget,
    }),
  updateAction: (updatedAction) => apiRequest("/action/update", updatedAction),
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
