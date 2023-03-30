import axios from "axios";
export const api = "https://wa-gst-api.onrender.com/api/v1/";
// export const api = "http://localhost:5000/api/v1/";

const instance = axios.create({
  baseURL: "https://wa-gst-api.onrender.com/api/v1/",
  headers: {
    "Content-Type": "application/json"
  }
});

instance.interceptors.request.use(
  (config) => {
    const takeUserInfo = localStorage.getItem("userInfo");
    const getUserInfo = JSON.parse(takeUserInfo);

    const token = getUserInfo?.userInfo?.token;
    if (token) {
      config.headers["Authorization"] = token;
      // config.headers["Authorization"] = "Bearer " + token; // for Spring Boot back-end
      // config.headers["x-access-token"] = token; // for Node.js Express back-end
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use((res) => {
  return res;
});

export default instance;
