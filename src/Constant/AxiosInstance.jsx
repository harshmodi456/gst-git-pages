import axios from "axios";
export const api = "https://wa-gst-api.onrender.com/api/v1/";
// export const api = "http://localhost:5000/api/v1/";

const instance = axios.create({
  baseURL: "https://wa-gst-api.onrender.com/api/v1/",
  headers: {}
});


instance.interceptors.request.use(
  (config) => {
    const takeUserInfo = localStorage.getItem("userInfo");
    const multiImg = localStorage.getItem("multiImg");
    const getUserInfo = JSON.parse(takeUserInfo);

    const token = getUserInfo?.userInfo?.token;
    if (token) {
      config.headers["Authorization"] = token;
    }
    if (multiImg == 'true') {
      config.headers["Content-Type"] = 'multipart/form-data';
    } else {
      config.headers["Content-Type"] = 'application/json';
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
