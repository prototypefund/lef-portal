const axios = require("axios");

export const lefApi = {
  signUp: (username, password) => {},
  signIn: (username, password) => {
    return apiRequest("token/get", {
      userName: username,
      password: password,
    });
  },
  getData: (token, body) => apiRequest("methodtests", body, token),
};

const apiRequest = (path, body, token, method = "post") => {
  console.debug("ApiRequest:", path, body);
  const config = {
    method,
    url: `http://localhost:8080/${path}`,
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
