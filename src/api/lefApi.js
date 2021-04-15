const axios = require("axios");

export const lefApi = {
  signUp: (username, password) => {},
  signIn: (username, password) => {
    apiRequest("token/get", {
      userName: username,
      password: password,
    });
  },
};

const apiRequest = (path, body) => {
  console.debug("ApiRequest:", path, body);
  axios
    .post(`http://localhost:8080/${path}`, body)
    .then(function (response) {
      console.debug("ApiResponse:", response.data);
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      // always executed
    });
};
