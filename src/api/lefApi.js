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
  getRegionData: (regionId) =>
    apiRequest("/region/get", { _id: regionId }, null),
  createRegion: () =>
    apiRequest("/region/create", {
      postalcodes: ["22567", "22568"],
      name: "Dresden",
    }),
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
